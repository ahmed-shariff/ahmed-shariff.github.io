---
layout: post
comments: true
title: Profiling file loading times for org mode
tags: ["emacs", "org"]
tagline: The loading times of files was starting to become an issue as I started switching to the 'one file per note` approach in my org-roam database. Documenting some profiling I did to see what I can do about it.
---

This is an extension of the discussion started in [`org-ql`s issues](https://github.com/alphapapa/org-ql/issues/303).

Recently I had broken up some of my very large org files that hosted alot of my notes, specially the org file accompanying the bibliography database. It was getting a bit wild to manage a file that had more that 40k lines and performance also was taking a hit. 
I loved `org-roam` using the sqlite back-end to speedup working with a large database of org files, while also giving the end-users access to this back-end.
Before `org-roam` I was heavily using `org-brain`. I really liked how the relationships were tucked into property drawers. Since `org-roam` started track links in the property drawers, I had started completely relying on `org-roam`.

After breaking apart my large files, all was good and well except for it breaking my `org-ql` setup.
I was using `org-ql` alot to quickly query across my database. It's a very cool package that uses the `org-agenda` buffers to display queries. 
While `org-roam`s `org-roam-buffer` did some very interesting things, it didn't have the flexibility that `org-ql` afforded when I wanted to try and search the database based on the links between nodes.
See, `org-ql` is build on top of the `org-element` API and `org-agenda`. They depend on the corresponding org files being open. Whereas `org-roam` caches all the necessary data in the sqlite database and open the org files only when needed, which is what allows it to be fast when searching through large number of files.
Whereas when trying to run an `org-ql` query on the same database with a large number of files, it has to open all the files in the database. So I started writing a simple front-end for `org-roam` with `org-ql`, where the agenda buffer entries are built from the result of a query to `org-roam`s database, then `org-ql` would do it's thing. This way, all files are not being opened. Instead, only the files pertaining the query are being opened, cutting down the number of files that needs to be opened by a very large margin. 

While this provides an interface that's usable, the performance was still an issue as it take atleast a few seconds even if the result only had a few dozen nodes. The bottleneck turned out to being opening the files and getting the markers which are needed for `org-agenda` to work. Following the comments on the `org-ql` [issue](https://github.com/alphapapa/org-ql/issues/303), I profiled a few different options and see what happens. This post is simply a documentation of this.

All test run on emacs version:
```sh
GNU Emacs 28.1 (build 2, x86_64-w64-mingw32) of 2022-04-21
```

## Testing the with roam-nodes
I had three different approaches to opening a file I am testing:
- The simplest solution using `with-current-buffer` and `find-file-noselect`. 
- Using `org-roam-with-file`
- A slightly modified version of `org-roam-with-file` where `org-mode` is not loaded. This was for reference more than anything else.
```lisp
(defmacro with-plain-file (file keep-buf-p &rest body)
  "Same as `org-roam-with-file', but doesn't start `org-roam'."
  (declare (indent 2) (debug t))
  `(let* (new-buf
          (auto-mode-alist nil)
          (find-file-hook nil)
          (buf (or
                (and (not ,file)
                     (current-buffer)) ;If FILE is nil, use current buffer
                (find-buffer-visiting ,file) ; If FILE is already visited, find buffer
                (progn
                  (setq new-buf t)
                  (find-file-noselect ,file)))) ; Else, visit FILE and return buffer
          res)
     (with-current-buffer buf
       (setq res (progn ,@body))
       (unless (and new-buf (not ,keep-buf-p))
         (save-buffer)))
     (if (and new-buf (not ,keep-buf-p))
         (when (find-buffer-visiting ,file)
           (kill-buffer (find-buffer-visiting ,file))))
     res))
```


I started with loading a bunch of random nodes from different files and profile using `elp` and 55 random nodes (same nodes used on all tests):
```lisp
(defun run-elp (func sources)
  "Instrument org and FUNC and iterate on SOURCES with FUNC.
FUNC is a sumbol representing a function that takes one parameter.
SOURCES is a list of element that will be processed by FUNC"
  (elp-instrument-package "org")
  (elp-instrument-function func)
  (elp-reset-all)
  (mapcar func sources)
  (elp-results))
```

### Test with `with-current-buffer`

```lisp
(defun org-roam-ql--get-file-marker (node)
  (with-current-buffer (find-file-noselect (org-roam-node-file node))
    (goto-char (org-roam-node-point node))
    (point-marker)))

(let ((nodes (--map (org-roam-node-from-id it) radom-node-ids)))
  (--map (when-let (buf (find-buffer-visiting (org-roam-node-file it))) (kill-buffer buf)) nodes)
  (run-elp 'org-roam-ql--get-file-marker nodes))
```

Results: 

```csv
  Function Name                                                    Call Count  Elapsed Time  Average Time
org-roam-ql--get-file-marker                                       55          49.118194999  0.8930580909
org-mode                                                           55          1.94798       0.0354178181
org-display-inline-images                                          55          0.169515      0.0030820909
org-fold-core-fontify-region                                       55          0.1608879999  0.0029252363
org-activate-links                                                 525         0.1235360000  0.0002353066
org-activate-links--text-properties                                525         0.1225479999  0.0002334247
org-ref-cite-activate                                              111         0.0980770000  0.0008835765
org-ref-valid-keys                                                 111         0.09223       0.0008309009
org-install-agenda-files-menu                                      55          0.0870710000  0.0015831090
org-agenda-files                                                   55          0.071968      0.0013085090
org-element-cache-reset                                            55          0.0703109999  0.0012783818
org-cycle-set-startup-visibility                                   55          0.064626      0.0011750181
org-fold--hide-drawers                                             110         0.0564499999  0.0005131818
org-cycle-hide-drawers                                             55          0.0563539999  0.0010246181
org-fold--hide-drawers--text-properties                            110         0.0561990000  0.0005109000
org-fold-initialize                                                55          0.0515590000  0.0009374363
org-element-at-point                                               102         0.0514149999  0.0005040686
org-fold-core-initialize                                           55          0.051243      0.0009316909
org-element--parse-to                                              104         0.0491009999  0.0004721249
org-element--cache-setup-change-functions                          55          0.035294      0.0006417090
org-persist-register                                               110         0.0338739999  0.0003079454
org-element--current-element                                       296         0.0335950000  0.0001134966
org-persist-load                                                   55          0.0232400000  0.0004225454
org-fold-core-add-folding-spec                                     275         0.0232329999  8.448...e-05
org-persist-read                                                   55          0.0230699999  0.0004194545
org-persist--get-collection                                        165         0.019464      0.0001179636
org-persist--normalize-associated                                  220         0.0168399999  7.654...e-05
org-macro-initialize-templates                                     55          0.016255      0.0002955454
org-fold-core--property-symbol-get-create                          3559        0.0161759999  4.545...e-06
org-get-limited-outline-regexp                                     393         0.0124609999  3.170...e-05
org-element-headline-parser                                        96          0.0120459999  0.0001254791
org-set-regexps-and-options                                        55          0.010741      0.0001952909
org-element--cache-persist-before-read                             110         0.0098299999  8.936...e-05
org-collect-keywords                                               110         0.0061729999  5.611...e-05
org-element--cache-put                                             351         0.005797      1.651...e-05
org-element--get-node-properties                                   151         0.0057880000  3.833...e-05
org-macro--collect-macros                                          55          0.0056149999  0.0001020909
org-fold-core-region                                               378         0.0054469999  1.441...e-05
org--collect-keywords-1                                            110         0.0053270000  4.842...e-05
org-cycle-content                                                  55          0.0047950000  8.718...e-05
org-cycle-content--text-properties                                 55          0.0046260000  8.410...e-05
org-fold-core-set-folding-spec-property                            2805        0.0042610000  1.519...e-06
org-element-org-data-parser                                        55          0.0034479999  6.269...e-05
org-link-get-parameter                                             2821        0.0033830000  1.199...e-06
org-element-link-parser                                            471         0.0031629999  6.715...e-06
org-macro--find-keyword-value                                      220         0.0030170000  1.371...e-05
org-do-emphasis-faces                                              55          0.0029490000  5.361...e-05
org-fold-core-get-folding-spec-from-alias                          7009        0.0029420000  4.197...e-07
org-fold-hide-drawer-toggle                                        101         0.0029130000  2.884...e-05
org-fold--hide-wrapper-toggle                                      101         0.0026870000  2.660...e-05
org-set-font-lock-defaults                                         55          0.002522      4.585...e-05
org-make-options-regexp                                            110         0.0025150000  2.286...e-05
org-setup-filling                                                  55          0.002482      4.512...e-05
org-element--cache-persist-after-read                              110         0.0022579999  2.052...e-05
org-fontify-drawers                                                338         0.0020610000  6.097...e-06
org-element-section-parser                                         95          0.00198       2.084...e-05
org-fold-core-get-folding-spec                                     211         0.0019749999  9.360...e-06
org-element--cache-compare                                         1626        0.0016389999  1.007...e-06
org-unfontify-region                                               55          0.001597      2.903...e-05
org-element-property-drawer-parser                                 94          0.0015959999  1.697...e-05
org-persist-load:elisp                                             110         0.0015889999  1.444...e-05
org-fontify-meta-lines-and-blocks                                  55          0.0014579999  2.650...e-05
org-persist--find-index                                            220         0.0014290000  6.495...e-06
org-ref-find-bibliography                                          111         0.0013189999  1.188...e-05
org-fontify-meta-lines-and-blocks-1                                55          0.0013110000  2.383...e-05
org-ref-org-menu                                                   6           0.001288      0.0002146666
org-cycle-hide-archived-subtrees                                   55          0.001217      2.212...e-05
org-fold-folded-p                                                  101         0.0012159999  1.203...e-05
org-cite-activate                                                  55          0.0011830000  2.150...e-05
org--set-faces-extend                                              110         0.0011719999  1.065...e-05
org-element--cache-verify-element                                  102         0.001169      1.146...e-05
org-cite-get-processor                                             165         0.0010949999  6.636...e-06
org-macro--find-date                                               55          0.0010780000  1.960...e-05
org-fold-hide-archived-subtrees                                    55          0.001039      1.889...e-05
org-fold-show-all--text-properties                                 55          0.0009819999  1.785...e-05
org-element-context                                                1           0.000954      0.000954
org-fold-core-folded-p                                             101         0.0009459999  9.366...e-06
org-transclusion-fontify-meta-lines-and-blocks                     55          0.0009400000  1.709...e-05
org-cycle-show-empty-lines                                         55          0.0008979999  1.632...e-05
org-fontify-inline-src-blocks                                      55          0.0007900000  1.436...e-05
org-element--cache-active-p                                        1318        0.0007860000  5.963...e-07
org-persist--normalize-container                                   660         0.0007540000  1.142...e-06
org-cycle-set-visibility-according-to-property                     55          0.0007300000  1.327...e-05
org-cite-try-load-processor                                        55          0.0006920000  1.258...e-05
org-extract-log-state-settings                                     495         0.0006870000  1.387...e-06
org-element--cache-find                                            102         0.0006750000  6.617...e-06
org-fontify-inline-src-blocks-1                                    55          0.0006400000  1.163...e-05
org-activate-tags                                                  55          0.000629      1.143...e-05
org-activate-footnote-links                                        55          0.0005870000  1.067...e-05
org-cite-processor-has-capability-p                                55          0.0005860000  1.065...e-05
org-font-lock-add-priority-faces                                   55          0.0005580000  1.014...e-05
org-element--cache-sync                                            102         0.0005279999  5.176...e-06
org-fold-core-next-folding-state-change                            55          0.000523      9.509...e-06
org-element-property                                               1716        0.0004930000  2.872...e-07
org-find-invisible-foreground                                      55          0.0004899999  8.909...e-06
org-update-radio-target-regexp                                     55          0.0004709999  8.563...e-06
org-activate-dates                                                 74          0.0004420000  5.972...e-06
org-element--get-global-node-properties                            55          0.0004289999  7.8e-06
org-footnote-next-reference-or-definition                          55          0.0004269999  7.763...e-06
org-fold-hide-drawer-all                                           55          0.0004190000  7.618...e-06
org-file-menu-entry                                                1045        0.0003530000  3.377...e-07
org-at-comment-p                                                   110         0.0003450000  3.136...e-06
org-remove-flyspell-overlays-in                                    772         0.0003380000  4.378...e-07
org-activate-code                                                  55          0.0003290000  5.981...e-06
org-babel-hide-all-hashes                                          6           0.000317      5.283...e-05
org-delete-all                                                     110         0.0003099999  2.818...e-06
org-do-latex-and-related                                           55          0.0002539999  4.618...e-06
org-element--get-time-properties                                   96          0.0002169999  2.260...e-06
org-get-level-face                                                 318         0.0002029999  6.383...e-07
org-remove-keyword-keys                                            110         0.0001999999  1.818...e-06
org-ref-cite-version                                               111         0.0001989999  1.792...e-06
org-bullets-mode                                                   6           0.0001970000  3.283...e-05
org-skip-whitespace                                                353         0.0001879999  5.325...e-07
org-setup-comments-handling                                        55          0.0001849999  3.363...e-06
org-transclusion-font-lock-set                                     55          0.0001769999  3.218...e-06
org-macro--counter-initialize                                      55          0.0001759999  3.199...e-06
org-element--collect-affiliated-keywords                           10          0.00017       1.7e-05
org-fold-core--isearch-setup                                       55          0.0001629999  2.963...e-06
org-knuth-hash                                                     102         0.0001439999  1.411...e-06
org-element-drawer-parser                                          9           0.000141      1.566...e-05
org-re-property                                                    55          0.0001389999  2.527...e-06
org-fontify-macros                                                 55          0.0001319999  2.399...e-06
org-element-timestamp-parser                                       6           0.0001300000  2.166...e-05
org-compute-latex-and-related-regexp                               55          0.0001139999  2.072...e-06
org-macro--set-templates                                           55          0.0001139999  2.072...e-06
org-element-planning-parser                                        3           0.000112      3.733...e-05
org-assign-fast-keys                                               55          0.0001119999  2.036...e-06
org-load-modules-maybe                                             55          0.0001049999  1.909...e-06
org-string-nw-p                                                    55          0.0001029999  1.872...e-06
org-element-restriction                                            55          9.899...e-05  1.799...e-06
org-fold-core--check-spec                                          55          9.799...e-05  1.781...e-06
org-tag-alist-to-groups                                            55          8.899...e-05  1.618...e-06
org-remove-inline-images                                           55          7.899...e-05  1.436...e-06
org-reduced-level                                                  96          7.299...e-05  7.604...e-07
org-get-todo-face                                                  18          7.2e-05       4e-06
org-remove-font-lock-display-properties                            55          7.199...e-05  1.309...e-06
org-element-type                                                   202         6.399...e-05  3.168...e-07
org-file-name-concat                                               55          5.899...e-05  1.072...e-06
org-element--object-lex                                            1           5.7e-05       5.7e-05
org-element-parse-secondary-string                                 55          5.499...e-05  9.999...e-07
org-font-lock-hook                                                 55          5.199...e-05  9.454...e-07
org-activate-target-links                                          55          4.499...e-05  8.181...e-07
org-fontify-entities                                               55          3.899...e-05  7.090...e-07
org--tag-add-to-alist                                              55          3.5e-05       6.363...e-07
org-raise-scripts                                                  55          3.000...e-05  5.454...e-07
org-parse-time-string                                              6           2.7e-05       4.5e-06
org-fold-core-update-optimisation                                  55          2.500...e-05  4.545...e-07
org-font-lock-add-tag-faces                                        55          2.300...e-05  4.181...e-07
org-eldoc-load                                                     6           1.9e-05       3.166...e-06
org-element-paragraph-parser                                       1           1.3e-05       1.3e-05
org-babel-result-hide-spec                                         6           1.099...e-05  1.833...e-06
org-bullets--fontify-buffer                                        6           9.999...e-06  1.666...e-06
org-link-expand-abbrev                                             2           8e-06         4e-06
org-face-from-face-or-color                                        19          4.999...e-06  2.631...e-07
org-link-unescape                                                  2           4e-06         2e-06
org-get-priority-face                                              1           3e-06         3e-06
org-item-re                                                        1           2e-06         2e-06
org-element-lineage                                                1           1e-06         1e-06
```

### Test with `org-roam-with-file`

```lisp
(defun org-roam-ql--get-file-marker (node)
  (org-roam-with-file (org-roam-node-file node) t
    (goto-char (org-roam-node-point node))
    (point-marker)))

(let ((nodes (--map (org-roam-node-from-id it) radom-node-ids)))
  (--map (when-let (buf (find-buffer-visiting (org-roam-node-file it))) (kill-buffer buf)) nodes)
  (run-elp 'org-roam-ql--get-file-marker nodes))
```

Results: 

```csv
  Function Name                                                    Call Count  Elapsed Time  Average Time
org-roam-ql--get-file-marker                                       55          43.752767999  0.7955048727
org-mode                                                           55          0.272921      0.0049622000
org-element-cache-reset                                            55          0.0759590000  0.0013810727
org-fold-initialize                                                55          0.0505179999  0.0009185090
org-fold-core-initialize                                           55          0.050176      0.0009122909
org-persist-register                                               110         0.0381199999  0.0003465454
org-element--cache-setup-change-functions                          55          0.0366800000  0.0006669090
org-persist-load                                                   55          0.0242390000  0.0004407090
org-persist-read                                                   55          0.0240559999  0.0004373818
org-fold-core-add-folding-spec                                     275         0.0226350000  8.230...e-05
org-persist--get-collection                                        165         0.0225730000  0.0001368060
org-persist--normalize-associated                                  220         0.0197909999  8.995...e-05
org-macro-initialize-templates                                     55          0.015801      0.0002872909
org-fold-core--property-symbol-get-create                          2475        0.0150779999  6.092...e-06
org-install-agenda-files-menu                                      55          0.0127110000  0.0002311090
org-set-regexps-and-options                                        55          0.0121209999  0.0002203818
org-element--cache-persist-before-read                             110         0.0099919999  9.083...e-05
org-collect-keywords                                               110         0.007386      6.714...e-05
org--collect-keywords-1                                            110         0.006386      5.805...e-05
org-macro--collect-macros                                          55          0.00541       9.836...e-05
org-fold-core-set-folding-spec-property                            2805        0.0042220000  1.505...e-06
org-macro--find-keyword-value                                      220         0.0028549999  1.297...e-05
org-set-font-lock-defaults                                         55          0.0025840000  4.698...e-05
org-make-options-regexp                                            110         0.0025690000  2.335...e-05
org-setup-filling                                                  55          0.00232       4.218...e-05
org-element--cache-persist-after-read                              110         0.0021390000  1.944...e-05
org-fold-core-get-folding-spec-from-alias                          4950        0.0021289999  4.301...e-07
org-persist-load:elisp                                             110         0.0015319999  1.392...e-05
org-persist--find-index                                            220         0.0014970000  6.804...e-06
org--set-faces-extend                                              110         0.0012109999  1.100...e-05
org-macro--find-date                                               55          0.0010879999  1.978...e-05
org-persist--normalize-container                                   660         0.0008620000  1.306...e-06
org-cite-try-load-processor                                        55          0.0007179999  1.305...e-05
org-extract-log-state-settings                                     495         0.0006690000  1.351...e-06
org-cite-get-processor                                             55          0.0005470000  9.945...e-06
org-find-invisible-foreground                                      55          0.0005280000  9.600...e-06
org-update-radio-target-regexp                                     55          0.000456      8.290...e-06
org-delete-all                                                     110         0.0002979999  2.709...e-06
org-remove-keyword-keys                                            110         0.0002189999  1.990...e-06
org-transclusion-font-lock-set                                     55          0.0001929999  3.509...e-06
org-fold-core--isearch-setup                                       55          0.0001829999  3.327...e-06
org-setup-comments-handling                                        55          0.0001739999  3.163...e-06
org-macro--counter-initialize                                      55          0.0001449999  2.636...e-06
org-macro--set-templates                                           55          0.0001159999  2.109...e-06
org-compute-latex-and-related-regexp                               55          0.0001149999  2.090...e-06
org-assign-fast-keys                                               55          0.0001089999  1.981...e-06
org-agenda-files                                                   55          0.0001079999  1.963...e-06
org-element-restriction                                            55          0.0001069999  1.945...e-06
org-load-modules-maybe                                             55          9.799...e-05  1.781...e-06
org-tag-alist-to-groups                                            55          8.999...e-05  1.636...e-06
org-file-name-concat                                               55          5.499...e-05  9.999...e-07
org-element-parse-secondary-string                                 55          5.099...e-05  9.272...e-07
org--tag-add-to-alist                                              55          2.900...e-05  5.272...e-07
```

### Test with `with-plain-file`

```lisp
(defun org-roam-ql--get-file-marker (node)
  (with-plain-file (org-roam-node-file node) t
    (goto-char (org-roam-node-point node))
    (point-marker)))

(let ((nodes (--map (org-roam-node-from-id it) radom-node-ids)))
  (--map (when-let (buf (find-buffer-visiting (org-roam-node-file it))) (kill-buffer buf)) nodes)
  (run-elp 'org-roam-ql--get-file-marker nodes))
```

Results: 

```csv
  Function Name                                                    Call Count  Elapsed Time  Average Time
org-roam-ql--get-file-marker                                       55          28.741321999  0.5225694909
```


## Testing with `emacs -Q` (org version `9.5.4-g5a6442`)

The tests in the above as well this uses the following org version
```sh
Org mode version 9.5.4 (9.5.4-g5a6442 @ ~/.emacs.d/straight/build/org/)
```

The above tests were done with the all my setting running. So I also tested it out with `emacs -q`.

I first run emacs with `-Q` with straight bootstrapped:
```sh
emacs -Q -l ~/.emacs.d/straight/repos/straight.el/bootstrap.el
```

Then run the following script:
```lisp
(straight-use-package 'org)
(straight-use-package 'org-roam)

(defun run-elp (func sources)
  "Instrument org and FUNC and iterate on SOURCES with FUNC.
FUNC is a sumbol representing a function that takes one parameter.
SOURCES is a list of element that will be processed by FUNC"
  (elp-instrument-package "org")
  (elp-instrument-function func)
  (elp-reset-all)
  (mapcar func sources)
  (elp-results))

(defmacro with-plain-file (file keep-buf-p &rest body)
  "Same as `org-roam-with-file', but doesn't start `org-roam'."
  (declare (indent 2) (debug t))
  `(let* (new-buf
          (auto-mode-alist nil)
          (find-file-hook nil)
          (buf (or
                (and (not ,file)
                     (current-buffer)) ;If FILE is nil, use current buffer
                (find-buffer-visiting ,file) ; If FILE is already visited, find buffer
                (progn
                  (setq new-buf t)
                  (find-file-noselect ,file)))) ; Else, visit FILE and return buffer
          res)
     (with-current-buffer buf
       (setq res (progn ,@body))
       (unless (and new-buf (not ,keep-buf-p))
         (save-buffer)))
     (if (and new-buf (not ,keep-buf-p))
         (when (find-buffer-visiting ,file)
           (kill-buffer (find-buffer-visiting ,file))))
     res))

(defun test-org-load-files (func &optional restart)
  (let ((test-dir "~/temp/org-mode-test/")
        files)
    (message "Tests running")
    (when (and (file-exists-p test-dir) restart)
      (dolist (f (directory-files (file-truename test-dir))) (unless (member f '("." "..")) (delete-file f)))
      (delete-directory (file-truename test-dir) t))

    (if (or restart (not (file-exists-p test-dir)))
        (progn
          (make-directory (file-truename test-dir))
          ;; generating a bunch of file for testing
          (dolist (num (number-sequence 1 25 1))
            (let ((auto-mode-alist nil)
                  (find-file-hook nil)
                  (id (org-id-new))
                  (f (file-truename (format "~/temp/org-roam-test/test_%s.org" num))))
              (push f files)
              (with-current-buffer (find-file-noselect f)
                (erase-buffer)
                (insert (format "* This is the heading in file number %s
  :PROPERTIES:
  :ID:       %s
  :TEST_PROP_1: %s
  :TEST_PROP_2: id:%s
  :END:" num id num id))
                (save-buffer)
                (kill-buffer (find-buffer-visiting f))))))
      (progn
        (mapcar (lambda (f) (let ((f (find-buffer-visiting f)))
                              (em f)
                              (when f
                                (kill-buffer f))))
                (setq files (f-glob "*.org" test-dir)))))

    (run-elp func files)
    (with-current-buffer "*ELP Profiling Results*"
      (write-file (format "~/elp_results_%s" func (format-time-string "%Y-%m-%dT%H-%M-%S%-z"))))))

(defun --test-org-roam-with-file (f)
  (org-roam-with-file f t
    (goto-char 3)
    (point-marker)))

(defun --test-with-current-buffer (f)
  (with-current-buffer (find-file-noselect f)
    (goto-char 3)
    (point-marker)))

(defun --test-with-plain-file (f)
  (with-plain-file f t
    (goto-char 3)
    (point-marker)))

(setq org-roam-directory (file-truename "~/temp/org-mode-test/"))
(setq org-roam-node-display-template (concat "${title:*} " (propertize "${tags:10}" 'face 'org-tag)))
(org-roam-db-autosync-mode)

(with-eval-after-load 'org-roam
  ;; running twice to so that the first time around module loading won't effect times
  (dolist (func '(--test-org-roam-with-file
                  --test-with-current-buffer
                  --test-with-plain-file))
    (test-org-load-files func t))

  (dolist (func '(--test-org-roam-with-file
                  --test-with-current-buffer
                  --test-with-plain-file))
    (test-org-load-files func t)))
```

The results are as follows:

### Run 1:
#### With `with-current-buffer`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-current-buffer                               25          0.3538700000  0.0141548000
org-mode                                                 25          0.078992      0.00315968
org-roam-db-autosync--setup-file-h                       25          0.0404749999  0.0016189999
org-roam-file-p                                          25          0.0404000000  0.0016160000
org-roam-descendant-of-p                                 25          0.039471      0.00157884
org-set-regexps-and-options                              25          0.0356599999  0.0014263999
org-collect-keywords                                     50          0.0348489999  0.0006969799
org-fold-initialize                                      25          0.00966       0.0003864
org-fold-core-initialize                                 25          0.009571      0.0003828399
org-fold-core-add-folding-spec                           125         0.0088600000  7.088...e-05
org-element-cache-reset                                  25          0.006279      0.00025116
org-fold-core--property-symbol-get-create                1200        0.0058570000  4.880...e-06
org-persist-register                                     50          0.005518      0.0001103600
org-macro-initialize-templates                           25          0.005454      0.0002181599
org-persist--get-collection                              75          0.0051669999  6.889...e-05
org-persist--normalize-associated                        100         0.0042320000  4.232...e-05
org-fold-core-set-folding-spec-property                  1275        0.0016609999  1.302...e-06
org-install-agenda-files-menu                            25          0.0015780000  6.312e-05
org--collect-keywords-1                                  50          0.0012510000  2.502...e-05
org-macro--collect-macros                                25          0.00106       4.24e-05
org-make-options-regexp                                  50          0.0008890000  1.778...e-05
org-fold-core-get-folding-spec-from-alias                2400        0.0008710000  3.629...e-07
org-cycle-set-startup-visibility                         25          0.0007679999  3.071...e-05
org-fold-show-all--text-properties                       25          0.0007039999  2.815...e-05
org-fold-core-region                                     75          0.0005510000  7.346...e-06
org-set-font-lock-defaults                               25          0.0004940000  1.976...e-05
org-element--cache-setup-change-functions                25          0.0004249999  1.699...e-05
org-persist--find-index                                  75          0.0003999999  5.333...e-06
org-macro--find-keyword-value                            100         0.0003710000  3.710...e-06
org--set-faces-extend                                    50          0.000254      5.08e-06
org-macro--find-date                                     25          0.000247      9.88e-06
org-persist--normalize-container                         250         0.0002429999  9.719...e-07
org-cite-try-load-processor                              25          0.0002270000  9.080...e-06
org-babel-hide-all-hashes                                25          0.0002170000  8.680...e-06
org-setup-filling                                        25          0.0001920000  7.680...e-06
org-cite-get-processor                                   25          0.0001680000  6.720...e-06
org-find-invisible-foreground                            25          0.0001590000  6.360...e-06
org-persist-load                                         25          0.0001530000  6.120...e-06
org-update-radio-target-regexp                           25          0.000132      5.28e-06
org-persist-read                                         25          0.0001030000  4.120...e-06
org-roam--file-name-extension                            25          8.300...e-05  3.320...e-06
org-assign-fast-keys                                     25          7.9e-05       3.16e-06
org-extract-log-state-settings                           50          7.799...e-05  1.559...e-06
org-setup-comments-handling                              25          5.400...e-05  2.16e-06
org-macro--counter-initialize                            25          4.900...e-05  1.960...e-06
org-fold-core--isearch-setup                             25          4.700...e-05  1.880...e-06
org-compute-latex-and-related-regexp                     25          4.2e-05       1.68e-06
org-macro--set-templates                                 25          4.100...e-05  1.640...e-06
org-element-restriction                                  25          3.3e-05       1.32e-06
org-agenda-files                                         25          3.200...e-05  1.280...e-06
org-load-modules-maybe                                   25          2.900...e-05  1.160...e-06
org-delete-all                                           25          2.400...e-05  9.600...e-07
org-element-parse-secondary-string                       25          2.300...e-05  9.200...e-07
org-babel-result-hide-spec                               25          2.200...e-05  8.800...e-07
org-tag-alist-to-groups                                  25          1.300...e-05  5.200...e-07
org--tag-add-to-alist                                    25          1.200...e-05  4.800...e-07
```

#### with `org-roam-with-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-org-roam-with-file                                25          0.3233730000  0.0129349200
org-mode                                                 25          0.070406      0.00281624
org-fold-initialize                                      25          0.0493970000  0.0019758800
org-fold-core-initialize                                 25          0.0493009999  0.0019720399
org-fold-core-add-folding-spec                           125         0.0486619999  0.0003892959
org-fold-core--property-symbol-get-create                1125        0.0450600000  4.005...e-05
org-element-cache-reset                                  25          0.0068629999  0.00027452
org-persist-register                                     50          0.006138      0.00012276
org-macro-initialize-templates                           25          0.006024      0.00024096
org-persist--get-collection                              75          0.0057329999  7.643...e-05
org-persist--normalize-associated                        100         0.0046360000  4.636...e-05
org-set-regexps-and-options                              25          0.0025940000  0.0001037600
org-fold-core-set-folding-spec-property                  1275        0.0019359999  1.518...e-06
org-collect-keywords                                     50          0.001671      3.342e-05
org-install-agenda-files-menu                            25          0.0015079999  6.031...e-05
org--collect-keywords-1                                  50          0.0013849999  2.769...e-05
org-macro--collect-macros                                25          0.00117       4.68e-05
org-fold-core-get-folding-spec-from-alias                2250        0.0010050000  4.466...e-07
org-make-options-regexp                                  50          0.000976      1.952e-05
org-set-font-lock-defaults                               25          0.0005629999  2.251...e-05
org-persist--find-index                                  75          0.0004639999  6.186...e-06
org-macro--find-keyword-value                            100         0.0004170000  4.170...e-06
org-element--cache-setup-change-functions                25          0.000342      1.368...e-05
org-persist--normalize-container                         250         0.0002679999  1.071...e-06
org-macro--find-date                                     25          0.000261      1.044e-05
org-cite-try-load-processor                              25          0.0002520000  1.008...e-05
org--set-faces-extend                                    50          0.0002420000  4.84e-06
org-setup-filling                                        25          0.0002040000  8.160...e-06
org-cite-get-processor                                   25          0.0001850000  7.400...e-06
org-persist-load                                         25          0.0001790000  7.160...e-06
org-find-invisible-foreground                            25          0.0001580000  6.320...e-06
org-update-radio-target-regexp                           25          0.0001490000  5.960...e-06
org-persist-read                                         25          0.0001200000  4.800...e-06
org-assign-fast-keys                                     25          9.000...e-05  3.600...e-06
org-extract-log-state-settings                           50          8.199...e-05  1.639...e-06
org-setup-comments-handling                              25          6.2e-05       2.48e-06
org-macro--counter-initialize                            25          5.4e-05       2.16e-06
org-fold-core--isearch-setup                             25          5.300...e-05  2.120...e-06
org-compute-latex-and-related-regexp                     25          4.800...e-05  1.920...e-06
org-roam-with-file                                       25          4.700...e-05  1.880...e-06
org-macro--set-templates                                 25          4.400...e-05  1.760...e-06
org-agenda-files                                         25          3.100...e-05  1.240...e-06
org-load-modules-maybe                                   25          2.800...e-05  1.120...e-06
org-element-restriction                                  25          2.700...e-05  1.080...e-06
org-delete-all                                           25          2.100...e-05  8.400...e-07
org-element-parse-secondary-string                       25          1.700...e-05  6.800...e-07
org-tag-alist-to-groups                                  25          1.600...e-05  6.400...e-07
org--tag-add-to-alist                                    25          1.400...e-05  5.600...e-07
```

#### With `with-plain-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-plain-file                                   25          0.2287930000  0.00915172
```


### Run 2:
#### With `with-current-buffer`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-current-buffer                               25          0.3539380000  0.0141575200
org-mode                                                 25          0.0802119999  0.0032084799
org-fold-initialize                                      25          0.044382      0.00177528
org-fold-core-initialize                                 25          0.0442840000  0.0017713600
org-fold-core-add-folding-spec                           125         0.0435089999  0.0003480719
org-roam-db-autosync--setup-file-h                       25          0.0406990000  0.0016279600
org-roam-file-p                                          25          0.040631      0.00162524
org-fold-core--property-symbol-get-create                1200        0.0404260000  3.368...e-05
org-roam-descendant-of-p                                 25          0.039682      0.0015872800
org-element-cache-reset                                  25          0.00642       0.0002568
org-persist-register                                     50          0.005617      0.00011234
org-macro-initialize-templates                           25          0.0054350000  0.0002174000
org-persist--get-collection                              75          0.0052669999  7.022...e-05
org-persist--normalize-associated                        100         0.0042980000  4.298...e-05
org-set-regexps-and-options                              25          0.002329      9.316e-05
org-fold-core-set-folding-spec-property                  1275        0.0017129999  1.343...e-06
org-install-agenda-files-menu                            25          0.0015840000  6.336e-05
org-collect-keywords                                     50          0.0014700000  2.940...e-05
org--collect-keywords-1                                  50          0.001206      2.412e-05
org-macro--collect-macros                                25          0.001069      4.276...e-05
org-fold-core-get-folding-spec-from-alias                2400        0.0009050000  3.770...e-07
org-make-options-regexp                                  50          0.0008660000  1.732...e-05
org-cycle-set-startup-visibility                         25          0.000733      2.932e-05
org-fold-show-all--text-properties                       25          0.0006640000  2.656...e-05
org-set-font-lock-defaults                               25          0.000519      2.076e-05
org-fold-core-region                                     75          0.0005090000  6.786...e-06
org-element--cache-setup-change-functions                25          0.000457      1.828e-05
org-persist--find-index                                  75          0.0004219999  5.626...e-06
org-macro--find-keyword-value                            100         0.0003710000  3.710...e-06
org--set-faces-extend                                    50          0.0002789999  5.579...e-06
org-macro--find-date                                     25          0.0002430000  9.720...e-06
org-cite-try-load-processor                              25          0.0002420000  9.68e-06
org-persist--normalize-container                         250         0.0002409999  9.639...e-07
org-setup-filling                                        25          0.0002060000  8.24e-06
org-babel-hide-all-hashes                                25          0.0001920000  7.680...e-06
org-cite-get-processor                                   25          0.0001720000  6.880...e-06
org-persist-load                                         25          0.000167      6.679...e-06
org-find-invisible-foreground                            25          0.000153      6.12e-06
org-update-radio-target-regexp                           25          0.000135      5.4e-06
org-persist-read                                         25          0.0001070000  4.280...e-06
org-roam--file-name-extension                            25          8.700...e-05  3.480...e-06
org-assign-fast-keys                                     25          8.2e-05       3.28e-06
org-extract-log-state-settings                           50          7.699...e-05  1.539...e-06
org-setup-comments-handling                              25          5.600...e-05  2.240...e-06
org-fold-core--isearch-setup                             25          4.800...e-05  1.920...e-06
org-macro--counter-initialize                            25          4.3e-05       1.72e-06
org-compute-latex-and-related-regexp                     25          4.100...e-05  1.640...e-06
org-macro--set-templates                                 25          4e-05         1.600...e-06
org-agenda-files                                         25          3.300...e-05  1.320...e-06
org-element-restriction                                  25          2.900...e-05  1.160...e-06
org-load-modules-maybe                                   25          2.700...e-05  1.080...e-06
org-delete-all                                           25          2.500...e-05  1.000...e-06
org-element-parse-secondary-string                       25          1.900...e-05  7.600...e-07
org-babel-result-hide-spec                               25          1.600...e-05  6.400...e-07
org--tag-add-to-alist                                    25          1.300...e-05  5.200...e-07
org-tag-alist-to-groups                                  25          1.200...e-05  4.800...e-07
```

#### with `org-roam-with-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-org-roam-with-file                                25          0.299792      0.01199168
org-mode                                                 25          0.0647949999  0.0025917999
org-fold-initialize                                      25          0.0450550000  0.0018022000
org-fold-core-initialize                                 25          0.0449510000  0.0017980400
org-fold-core-add-folding-spec                           125         0.0443579999  0.0003548639
org-element-cache-reset                                  25          0.006359      0.00025436
org-fold-core--property-symbol-get-create                1125        0.0061050000  5.426...e-06
org-persist-register                                     50          0.005664      0.00011328
org-macro-initialize-templates                           25          0.005647      0.00022588
org-persist--get-collection                              75          0.0053229999  7.097...e-05
org-persist--normalize-associated                        100         0.0043520000  4.352...e-05
org-set-regexps-and-options                              25          0.002292      9.168e-05
org-fold-core-set-folding-spec-property                  1275        0.0017909999  1.404...e-06
org-install-agenda-files-menu                            25          0.0015469999  6.187...e-05
org-collect-keywords                                     50          0.0014850000  2.970...e-05
org--collect-keywords-1                                  50          0.00122       2.44e-05
org-macro--collect-macros                                25          0.0011669999  4.667...e-05
org-make-options-regexp                                  50          0.0008790000  1.758...e-05
org-fold-core-get-folding-spec-from-alias                2250        0.0008740000  3.884...e-07
org-set-font-lock-defaults                               25          0.0004860000  1.944...e-05
org-persist--find-index                                  75          0.0004259999  5.679...e-06
org-macro--find-keyword-value                            100         0.0004060000  4.060...e-06
org-element--cache-setup-change-functions                25          0.0003270000  1.308...e-05
org-macro--find-date                                     25          0.0002650000  1.060...e-05
org--set-faces-extend                                    50          0.000264      5.28e-06
org-persist--normalize-container                         250         0.0002429999  9.719...e-07
org-cite-try-load-processor                              25          0.0002250000  9.000...e-06
org-setup-filling                                        25          0.0001910000  7.640...e-06
org-persist-load                                         25          0.0001780000  7.120...e-06
org-cite-get-processor                                   25          0.0001670000  6.680...e-06
org-find-invisible-foreground                            25          0.0001640000  6.560...e-06
org-update-radio-target-regexp                           25          0.0001370000  5.480...e-06
org-persist-read                                         25          0.0001130000  4.520...e-06
org-assign-fast-keys                                     25          8.200...e-05  3.280...e-06
org-extract-log-state-settings                           50          7.499...e-05  1.499...e-06
org-setup-comments-handling                              25          5.8e-05       2.32e-06
org-roam-with-file                                       25          5.2e-05       2.08e-06
org-fold-core--isearch-setup                             25          4.8e-05       1.920...e-06
org-macro--set-templates                                 25          4.500...e-05  1.800...e-06
org-macro--counter-initialize                            25          4.3e-05       1.72e-06
org-compute-latex-and-related-regexp                     25          3.9e-05       1.559...e-06
org-agenda-files                                         25          3.5e-05       1.4e-06
org-load-modules-maybe                                   25          3.3e-05       1.32e-06
org-element-restriction                                  25          3.100...e-05  1.240...e-06
org-delete-all                                           25          2.900...e-05  1.160...e-06
org-element-parse-secondary-string                       25          2.400...e-05  9.600...e-07
org-tag-alist-to-groups                                  25          1.400...e-05  5.600...e-07
org--tag-add-to-alist                                    25          1.100...e-05  4.400...e-07
```

#### With `with-plain-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-plain-file                                   25          0.2317820000  0.0092712800
```

### Run 3
#### With `with-current-buffer`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-current-buffer                               25          0.3760549999  0.0150421999
org-mode                                                 25          0.1223050000  0.0048922
org-fold-initialize                                      25          0.0464850000  0.0018594000
org-fold-core-initialize                                 25          0.046367      0.00185468
org-fold-core-add-folding-spec                           125         0.0455039999  0.0003640319
org-roam-db-autosync--setup-file-h                       25          0.0427370000  0.0017094800
org-roam-file-p                                          25          0.0426590000  0.0017063600
org-macro-initialize-templates                           25          0.0422699999  0.0016907999
org-roam-descendant-of-p                                 25          0.0416490000  0.0016659600
org-fold-core-set-folding-spec-property                  1275        0.037526      2.943...e-05
org-macro--collect-macros                                25          0.036222      0.0014488799
org-element-cache-reset                                  25          0.0070009999  0.0002800399
org-fold-core--property-symbol-get-create                1200        0.0065220000  5.435...e-06
org-persist-register                                     50          0.0060450000  0.0001209000
org-persist--get-collection                              75          0.0056679999  7.557...e-05
org-persist--normalize-associated                        100         0.0046470000  4.647...e-05
org-set-regexps-and-options                              25          0.002571      0.00010284
org-collect-keywords                                     50          0.002029      4.058e-05
org-install-agenda-files-menu                            25          0.0017680000  7.072...e-05
org--collect-keywords-1                                  50          0.0017289999  3.457...e-05
org-make-options-regexp                                  50          0.0013410000  2.682...e-05
org-fold-core-get-folding-spec-from-alias                2400        0.0009450000  3.937...e-07
org-cycle-set-startup-visibility                         25          0.0008100000  3.24e-05
org-fold-show-all--text-properties                       25          0.0007339999  2.935...e-05
org-element--cache-setup-change-functions                25          0.000588      2.352e-05
org-fold-core-region                                     75          0.0005740000  7.653...e-06
org-set-font-lock-defaults                               25          0.0005720000  2.288...e-05
org-persist--find-index                                  75          0.000431      5.746...e-06
org-macro--find-keyword-value                            100         0.0004100000  4.100...e-06
org--set-faces-extend                                    50          0.0002759999  5.519...e-06
org-macro--find-date                                     25          0.0002710000  1.084...e-05
org-persist--normalize-container                         250         0.0002639999  1.055...e-06
org-cite-try-load-processor                              25          0.000254      1.016e-05
org-setup-filling                                        25          0.0002430000  9.720...e-06
org-babel-hide-all-hashes                                25          0.0002100000  8.400...e-06
org-cite-get-processor                                   25          0.0001840000  7.360...e-06
org-persist-load                                         25          0.0001760000  7.040...e-06
org-find-invisible-foreground                            25          0.0001680000  6.720...e-06
org-update-radio-target-regexp                           25          0.000152      6.08e-06
org-persist-read                                         25          0.0001150000  4.600...e-06
org-roam--file-name-extension                            25          9.700...e-05  3.880...e-06
org-extract-log-state-settings                           50          9.299...e-05  1.859...e-06
org-assign-fast-keys                                     25          8.600...e-05  3.440...e-06
org-setup-comments-handling                              25          6.000...e-05  2.400...e-06
org-macro--counter-initialize                            25          5.300...e-05  2.120...e-06
org-fold-core--isearch-setup                             25          4.900...e-05  1.960...e-06
org-compute-latex-and-related-regexp                     25          4.5e-05       1.800...e-06
org-macro--set-templates                                 25          4.400...e-05  1.760...e-06
org-element-restriction                                  25          3.6e-05       1.44e-06
org-agenda-files                                         25          3.599...e-05  1.439...e-06
org-load-modules-maybe                                   25          3.000...e-05  1.200...e-06
org-delete-all                                           25          2.900...e-05  1.160...e-06
org-tag-alist-to-groups                                  25          2.100...e-05  8.400...e-07
org-babel-result-hide-spec                               25          2.000...e-05  8.000...e-07
org-element-parse-secondary-string                       25          1.900...e-05  7.600...e-07
org--tag-add-to-alist                                    25          1e-05         4.000...e-07
```

#### with `org-roam-with-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-org-roam-with-file                                25          0.3454239999  0.0138169599
org-mode                                                 25          0.1183370000  0.0047334800
org-set-regexps-and-options                              25          0.0498989999  0.0019959599
org-collect-keywords                                     50          0.0488559999  0.0009771199
org-fold-initialize                                      25          0.047466      0.00189864
org-fold-core-initialize                                 25          0.047341      0.00189364
org-fold-core-add-folding-spec                           125         0.0465069999  0.0003720559
org-fold-core--property-symbol-get-create                1125        0.0426880000  3.794...e-05
org-element-cache-reset                                  25          0.0076450000  0.0003058000
org-persist-register                                     50          0.0066970000  0.0001339400
org-macro-initialize-templates                           25          0.0064580000  0.0002583200
org-persist--get-collection                              75          0.0062649999  8.353...e-05
org-persist--normalize-associated                        100         0.0051300000  5.130...e-05
org-fold-core-set-folding-spec-property                  1275        0.0021109999  1.655...e-06
org-install-agenda-files-menu                            25          0.0019630000  7.852...e-05
org--collect-keywords-1                                  50          0.0015359999  3.072e-05
org-macro--collect-macros                                25          0.001305      5.219...e-05
org-make-options-regexp                                  50          0.001092      2.184e-05
org-fold-core-get-folding-spec-from-alias                2250        0.0010640000  4.728...e-07
org-set-font-lock-defaults                               25          0.000631      2.524...e-05
org-element--cache-setup-change-functions                25          0.000541      2.164...e-05
org-persist--find-index                                  75          0.0004830000  6.440...e-06
org-macro--find-keyword-value                            100         0.0004490000  4.490...e-06
org--set-faces-extend                                    50          0.0003039999  6.079...e-06
org-macro--find-date                                     25          0.0003020000  1.208...e-05
org-setup-filling                                        25          0.0002960000  1.184...e-05
org-cite-try-load-processor                              25          0.0002909999  1.163...e-05
org-persist--normalize-container                         250         0.0002659999  1.063...e-06
org-cite-get-processor                                   25          0.0002160000  8.640...e-06
org-persist-load                                         25          0.0001980000  7.920...e-06
org-find-invisible-foreground                            25          0.0001830000  7.320...e-06
org-update-radio-target-regexp                           25          0.0001600000  6.400...e-06
org-persist-read                                         25          0.0001290000  5.160...e-06
org-assign-fast-keys                                     25          9.400...e-05  3.760...e-06
org-extract-log-state-settings                           50          8.799...e-05  1.759...e-06
org-setup-comments-handling                              25          7.2e-05       2.88e-06
org-fold-core--isearch-setup                             25          5.800...e-05  2.320...e-06
org-macro--counter-initialize                            25          5.600...e-05  2.24e-06
org-roam-with-file                                       25          5.300...e-05  2.120...e-06
org-compute-latex-and-related-regexp                     25          4.8e-05       1.920...e-06
org-macro--set-templates                                 25          4.5e-05       1.800...e-06
org-agenda-files                                         25          4.4e-05       1.759...e-06
org-element-restriction                                  25          3.600...e-05  1.440...e-06
org-load-modules-maybe                                   25          3.599...e-05  1.439...e-06
org-delete-all                                           25          3.100...e-05  1.240...e-06
org-element-parse-secondary-string                       25          2.600...e-05  1.040...e-06
org-tag-alist-to-groups                                  25          1.900...e-05  7.600...e-07
org--tag-add-to-alist                                    25          1.800...e-05  7.200...e-07
```

#### With `with-plain-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-plain-file                                   25          0.2099760000  0.0083990400
```


## Test with org version `9.5.5-g8cc821` in `emacs -Q`
The same test with `emacs -Q` with org version:
```sh
Org mode version 9.5.5 (9.5.5-g8cc821 @ ~/.emacs.d/straight/build/org/)
```

### Run 1
#### With `with-current-buffer`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-current-buffer                               25          0.3468619999  0.0138744799
org-mode                                                 25          0.109437      0.00437748
org-fold-initialize                                      25          0.042489      0.00169956
org-fold-core-initialize                                 25          0.0423939999  0.0016957599
org-fold-core-add-folding-spec                           125         0.0417029999  0.0003336239
org-roam-db-autosync--setup-file-h                       25          0.0403400000  0.0016136000
org-roam-file-p                                          25          0.0402700000  0.0016108000
org-roam-descendant-of-p                                 25          0.0393190000  0.0015727600
org-set-regexps-and-options                              25          0.0339719999  0.0013588799
org-collect-keywords                                     50          0.0331579999  0.0006631599
org--collect-keywords-1                                  50          0.0328970000  0.0006579400
org-make-options-regexp                                  50          0.0325419999  0.0006508399
org-element-cache-reset                                  25          0.0062250000  0.0002490000
org-fold-core--property-symbol-get-create                1200        0.0058510000  4.875...e-06
org-persist-register                                     50          0.0054980000  0.0001099600
org-macro-initialize-templates                           25          0.0054269999  0.0002170799
org-persist--get-collection                              75          0.0051739999  6.898...e-05
org-persist--normalize-associated                        100         0.0042200000  4.220...e-05
org-fold-core-set-folding-spec-property                  1150        0.0016499999  1.434...e-06
org-install-agenda-files-menu                            25          0.001484      5.936e-05
org-macro--collect-macros                                25          0.001083      4.332e-05
org-fold-core-get-folding-spec-from-alias                2400        0.0009030000  3.762...e-07
org-cycle-set-startup-visibility                         25          0.0007920000  3.168e-05
org-fold-show-all                                        25          0.0007310000  2.924...e-05
org-fold-region                                          75          0.0006160000  8.213...e-06
org-fold-core-region                                     75          0.0004960000  6.613...e-06
org-set-font-lock-defaults                               25          0.000479      1.916e-05
org-macro--find-keyword-value                            100         0.0004160000  4.160...e-06
org-persist--find-index                                  75          0.0004099999  5.466...e-06
org-element--cache-setup-change-functions                25          0.0003930000  1.572...e-05
org-macro--find-date                                     25          0.0002310000  9.240...e-06
org--set-faces-extend                                    50          0.000231      4.62e-06
org-persist--normalize-container                         250         0.0002249999  8.999...e-07
org-setup-filling                                        25          0.0002200000  8.800...e-06
org-cite-try-load-processor                              25          0.0002130000  8.520...e-06
org-babel-hide-all-hashes                                25          0.0001960000  7.840...e-06
org-cite-get-processor                                   25          0.0001610000  6.440...e-06
org-persist-load                                         25          0.000151      6.040...e-06
org-find-invisible-foreground                            25          0.0001420000  5.680...e-06
org-update-radio-target-regexp                           25          0.000125      5e-06
org-persist-read                                         25          0.0001060000  4.240...e-06
org-roam--file-name-extension                            25          8.400...e-05  3.360...e-06
org-assign-fast-keys                                     25          7.6e-05       3.04e-06
org-extract-log-state-settings                           50          7.399...e-05  1.479...e-06
org-setup-comments-handling                              25          5.299...e-05  2.119...e-06
org-macro--counter-initialize                            25          4.200...e-05  1.680...e-06
org-fold-core--isearch-setup                             25          4.199...e-05  1.679...e-06
org-macro--set-templates                                 25          3.700...e-05  1.480...e-06
org-compute-latex-and-related-regexp                     25          3.7e-05       1.48e-06
org-agenda-files                                         25          3.000...e-05  1.200...e-06
org-element-restriction                                  25          3.000...e-05  1.200...e-06
org-delete-all                                           25          2.600...e-05  1.040...e-06
org-load-modules-maybe                                   25          2.5e-05       1e-06
org-babel-result-hide-spec                               25          2.000...e-05  8.000...e-07
org-element-parse-secondary-string                       25          1.700...e-05  6.800...e-07
org-tag-alist-to-groups                                  25          1.400...e-05  5.600...e-07
org--tag-add-to-alist                                    25          9e-06         3.6e-07

```

#### with `org-roam-with-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-org-roam-with-file                                25          0.3024920000  0.0120996800
org-mode                                                 25          0.0967239999  0.0038689599
org-set-regexps-and-options                              25          0.0352130000  0.0014085200
org-set-font-lock-defaults                               25          0.0344420000  0.0013776800
org-fold-initialize                                      25          0.0100299999  0.0004011999
org-fold-core-initialize                                 25          0.0099269999  0.0003970799
org-fold-core-add-folding-spec                           125         0.0093699999  7.495...e-05
org-element-cache-reset                                  25          0.0066259999  0.0002650399
org-fold-core--property-symbol-get-create                1125        0.0062010000  5.512...e-06
org-persist-register                                     50          0.0059370000  0.0001187400
org-macro-initialize-templates                           25          0.0057430000  0.0002297200
org-persist--get-collection                              75          0.0055909999  7.454...e-05
org-persist--normalize-associated                        100         0.0045920000  4.592...e-05
org-fold-core-set-folding-spec-property                  1150        0.0017669999  1.536...e-06
org-collect-keywords                                     50          0.001493      2.986e-05
org-install-agenda-files-menu                            25          0.0014390000  5.756...e-05
org--collect-keywords-1                                  50          0.0012340000  2.468...e-05
org-macro--collect-macros                                25          0.001156      4.624e-05
org-fold-core-get-folding-spec-from-alias                2250        0.0009180000  4.080...e-07
org-make-options-regexp                                  50          0.0008840000  1.768...e-05
org-macro--find-keyword-value                            100         0.0004440000  4.440...e-06
org-persist--find-index                                  75          0.000423      5.639...e-06
org-element--cache-setup-change-functions                25          0.000332      1.328e-05
org-cite-try-load-processor                              25          0.000253      1.012...e-05
org-macro--find-date                                     25          0.0002520000  1.008...e-05
org-persist--normalize-container                         250         0.0002519999  1.007...e-06
org--set-faces-extend                                    50          0.0002170000  4.340...e-06
org-setup-filling                                        25          0.0002099999  8.4e-06
org-cite-get-processor                                   25          0.0001840000  7.360...e-06
org-persist-load                                         25          0.0001770000  7.080...e-06
org-find-invisible-foreground                            25          0.0001390000  5.560...e-06
org-update-radio-target-regexp                           25          0.000132      5.28e-06
org-persist-read                                         25          0.000128      5.12e-06
org-extract-log-state-settings                           50          8.799...e-05  1.759...e-06
org-assign-fast-keys                                     25          8e-05         3.200...e-06
org-fold-core--isearch-setup                             25          5.400...e-05  2.160...e-06
org-setup-comments-handling                              25          5.3e-05       2.12e-06
org-roam-with-file                                       25          4.3e-05       1.72e-06
org-macro--set-templates                                 25          4.200...e-05  1.680...e-06
org-macro--counter-initialize                            25          4.1e-05       1.64e-06
org-compute-latex-and-related-regexp                     25          3.6e-05       1.44e-06
org-element-restriction                                  25          3.200...e-05  1.280...e-06
org-agenda-files                                         25          3.100...e-05  1.240...e-06
org-delete-all                                           25          2.300...e-05  9.200...e-07
org-load-modules-maybe                                   25          2.100...e-05  8.400...e-07
org-element-parse-secondary-string                       25          1.900...e-05  7.600...e-07
org--tag-add-to-alist                                    25          1.500...e-05  6.000...e-07
org-tag-alist-to-groups                                  25          1.300...e-05  5.200...e-07
```

#### With `with-plain-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-plain-file                                   25          0.190576      0.00762304
```

### Run 2
#### With `with-current-buffer`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-current-buffer                               25          0.3675650000  0.0147026000
org-roam-db-autosync--setup-file-h                       25          0.0761019999  0.0030440799
org-roam-file-p                                          25          0.0760250000  0.0030410000
org-mode                                                 25          0.0478        0.001912
org-roam-descendant-of-p                                 25          0.0418020000  0.0016720800
org-roam--file-name-extension                            25          0.033206      0.00132824
org-fold-initialize                                      25          0.0102250000  0.0004090000
org-fold-core-initialize                                 25          0.0101079999  0.0004043199
org-fold-core-add-folding-spec                           125         0.0092419999  7.393...e-05
org-element-cache-reset                                  25          0.006654      0.00026616
org-fold-core--property-symbol-get-create                1200        0.0062640000  5.220...e-06
org-persist-register                                     50          0.005767      0.00011534
org-macro-initialize-templates                           25          0.0057529999  0.0002301199
org-persist--get-collection                              75          0.0053749999  7.166...e-05
org-persist--normalize-associated                        100         0.0043510000  4.351...e-05
org-set-regexps-and-options                              25          0.0025109999  0.00010044
org-install-agenda-files-menu                            25          0.0017969999  7.187...e-05
org-fold-core-set-folding-spec-property                  1150        0.0017119999  1.488...e-06
org-collect-keywords                                     50          0.001584      3.167...e-05
org--collect-keywords-1                                  50          0.001289      2.578e-05
org-macro--collect-macros                                25          0.0011589999  4.635...e-05
org-fold-core-get-folding-spec-from-alias                2400        0.0009350000  3.895...e-07
org-make-options-regexp                                  50          0.0009330000  1.866...e-05
org-cycle-set-startup-visibility                         25          0.000837      3.348e-05
org-fold-show-all                                        25          0.000764      3.056e-05
org-fold-region                                          75          0.000628      8.373...e-06
org-set-font-lock-defaults                               25          0.0005530000  2.212...e-05
org-fold-core-region                                     75          0.0005140000  6.853...e-06
org-element--cache-setup-change-functions                25          0.0005120000  2.048...e-05
org-persist--find-index                                  75          0.0004490000  5.986...e-06
org-macro--find-keyword-value                            100         0.0003950000  3.950...e-06
org--set-faces-extend                                    50          0.0002870000  5.740...e-06
org-macro--find-date                                     25          0.000271      1.084e-05
org-persist--normalize-container                         250         0.0002529999  1.011...e-06
org-cite-try-load-processor                              25          0.00025       1e-05
org-setup-filling                                        25          0.0002120000  8.480...e-06
org-babel-hide-all-hashes                                25          0.0002000000  8.000...e-06
org-persist-load                                         25          0.0001800000  7.200...e-06
org-cite-get-processor                                   25          0.0001770000  7.080...e-06
org-find-invisible-foreground                            25          0.00017       6.8e-06
org-update-radio-target-regexp                           25          0.0001390000  5.560...e-06
org-persist-read                                         25          0.0001170000  4.68e-06
org-assign-fast-keys                                     25          8.800...e-05  3.520...e-06
org-extract-log-state-settings                           50          7.699...e-05  1.539...e-06
org-fold-core--isearch-setup                             25          6.300...e-05  2.520...e-06
org-setup-comments-handling                              25          5.500...e-05  2.200...e-06
org-macro--counter-initialize                            25          4.900...e-05  1.960...e-06
org-macro--set-templates                                 25          4.000...e-05  1.600...e-06
org-agenda-files                                         25          3.599...e-05  1.439...e-06
org-compute-latex-and-related-regexp                     25          3.500...e-05  1.400...e-06
org-load-modules-maybe                                   25          3.4e-05       1.36e-06
org-element-restriction                                  25          3.4e-05       1.36e-06
org-delete-all                                           25          2.900...e-05  1.160...e-06
org-element-parse-secondary-string                       25          2.200...e-05  8.800...e-07
org-babel-result-hide-spec                               25          2.000...e-05  8.000...e-07
org-tag-alist-to-groups                                  25          2.000...e-05  8.000...e-07
org--tag-add-to-alist                                    25          1.800...e-05  7.200...e-07
```

#### with `org-roam-with-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-org-roam-with-file                                25          0.297846      0.01191384
org-mode                                                 25          0.0663639999  0.00265456
org-macro-initialize-templates                           25          0.0414050000  0.0016562000
org-macro--counter-initialize                            25          0.03567       0.0014268
org-fold-initialize                                      25          0.0099350000  0.0003974000
org-fold-core-initialize                                 25          0.009818      0.00039272
org-fold-core-add-folding-spec                           125         0.0091620000  7.329...e-05
org-element-cache-reset                                  25          0.006497      0.00025988
org-fold-core--property-symbol-get-create                1125        0.0060750000  5.400...e-06
org-persist-register                                     50          0.0057070000  0.0001141400
org-persist--get-collection                              75          0.0053299999  7.106...e-05
org-persist--normalize-associated                        100         0.0043460000  4.346...e-05
org-set-regexps-and-options                              25          0.002475      9.900...e-05
org-install-agenda-files-menu                            25          0.0017709999  7.083...e-05
org-fold-core-set-folding-spec-property                  1150        0.0017329999  1.506...e-06
org-collect-keywords                                     50          0.001583      3.166e-05
org--collect-keywords-1                                  50          0.0012859999  2.571...e-05
org-macro--collect-macros                                25          0.001171      4.684e-05
org-make-options-regexp                                  50          0.0009220000  1.844...e-05
org-fold-core-get-folding-spec-from-alias                2250        0.0008730000  3.880...e-07
org-set-font-lock-defaults                               25          0.0005250000  2.100...e-05
org-persist--find-index                                  75          0.000432      5.76e-06
org-element--cache-setup-change-functions                25          0.0004260000  1.704...e-05
org-macro--find-keyword-value                            100         0.0003990000  3.990...e-06
org--set-faces-extend                                    50          0.0002879999  5.759...e-06
org-macro--find-date                                     25          0.000267      1.068e-05
org-setup-filling                                        25          0.0002500000  1.000...e-05
org-persist--normalize-container                         250         0.0002469999  9.879...e-07
org-cite-try-load-processor                              25          0.0002300000  9.200...e-06
org-find-invisible-foreground                            25          0.0001780000  7.120...e-06
org-cite-get-processor                                   25          0.0001760000  7.040...e-06
org-persist-load                                         25          0.000171      6.840...e-06
org-update-radio-target-regexp                           25          0.000143      5.72e-06
org-persist-read                                         25          0.0001130000  4.520...e-06
org-assign-fast-keys                                     25          8.600...e-05  3.440...e-06
org-extract-log-state-settings                           50          7.599...e-05  1.519...e-06
org-setup-comments-handling                              25          6.100...e-05  2.440...e-06
org-fold-core--isearch-setup                             25          5.700...e-05  2.28e-06
org-roam-with-file                                       25          5.400...e-05  2.160...e-06
org-macro--set-templates                                 25          4.300...e-05  1.720...e-06
org-agenda-files                                         25          4.100...e-05  1.640...e-06
org-compute-latex-and-related-regexp                     25          4.000...e-05  1.600...e-06
org-element-restriction                                  25          3.500...e-05  1.400...e-06
org-load-modules-maybe                                   25          3.200...e-05  1.280...e-06
org-delete-all                                           25          3.100...e-05  1.240...e-06
org-element-parse-secondary-string                       25          2.300...e-05  9.200...e-07
org-tag-alist-to-groups                                  25          1.900...e-05  7.600...e-07
org--tag-add-to-alist                                    25          1.200...e-05  4.800...e-07
```

#### With `with-plain-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-plain-file                                   25          0.214249      0.00856996
```

### Run 3
#### With `with-current-buffer`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-current-buffer                               25          0.358344      0.01433376
org-roam-db-autosync--setup-file-h                       25          0.0754349999  0.0030173999
org-roam-file-p                                          25          0.075358      0.0030143199
org-roam-descendant-of-p                                 25          0.0742949999  0.0029717999
org-mode                                                 25          0.0468290000  0.0018731600
org-fold-initialize                                      25          0.0098470000  0.0003938800
org-fold-core-initialize                                 25          0.0097399999  0.0003895999
org-fold-core-add-folding-spec                           125         0.008941      7.1528e-05
org-element-cache-reset                                  25          0.0064449999  0.0002578
org-fold-core--property-symbol-get-create                1200        0.0060140000  5.011...e-06
org-persist-register                                     50          0.0056399999  0.0001127999
org-macro-initialize-templates                           25          0.00553       0.0002212
org-persist--get-collection                              75          0.0052869999  7.049...e-05
org-persist--normalize-associated                        100         0.0043050000  4.305...e-05
org-set-regexps-and-options                              25          0.0023629999  9.451...e-05
org-install-agenda-files-menu                            25          0.0017250000  6.900...e-05
org-fold-core-set-folding-spec-property                  1150        0.0016719999  1.453...e-06
org-collect-keywords                                     50          0.0014929999  2.985...e-05
org--collect-keywords-1                                  50          0.0012090000  2.418...e-05
org-macro--collect-macros                                25          0.001072      4.288e-05
org-fold-core-get-folding-spec-from-alias                2400        0.0008980000  3.741...e-07
org-make-options-regexp                                  50          0.0008630000  1.726...e-05
org-cycle-set-startup-visibility                         25          0.0008450000  3.380...e-05
org-fold-show-all                                        25          0.0007689999  3.075...e-05
org-fold-region                                          75          0.0006370000  8.493...e-06
org-set-font-lock-defaults                               25          0.0005360000  2.144...e-05
org-fold-core-region                                     75          0.0005210000  6.946...e-06
org-element--cache-setup-change-functions                25          0.0004589999  1.835...e-05
org-persist--find-index                                  75          0.0004320000  5.760...e-06
org-macro--find-keyword-value                            100         0.0003720000  3.720...e-06
org--set-faces-extend                                    50          0.0002739999  5.479...e-06
org-persist--normalize-container                         250         0.0002549999  1.019...e-06
org-cite-try-load-processor                              25          0.000252      1.008e-05
org-macro--find-date                                     25          0.0002400000  9.600...e-06
org-setup-filling                                        25          0.0002030000  8.120...e-06
org-babel-hide-all-hashes                                25          0.0001970000  7.880...e-06
org-cite-get-processor                                   25          0.0001860000  7.440...e-06
org-find-invisible-foreground                            25          0.0001790000  7.160...e-06
org-persist-load                                         25          0.0001760000  7.040...e-06
org-update-radio-target-regexp                           25          0.0001390000  5.560...e-06
org-persist-read                                         25          0.0001080000  4.320...e-06
org-roam--file-name-extension                            25          8.300...e-05  3.320...e-06
org-extract-log-state-settings                           50          8.299...e-05  1.659...e-06
org-assign-fast-keys                                     25          8.200...e-05  3.280...e-06
org-setup-comments-handling                              25          5.700...e-05  2.28e-06
org-fold-core--isearch-setup                             25          5.600...e-05  2.240...e-06
org-macro--set-templates                                 25          4.600...e-05  1.840...e-06
org-macro--counter-initialize                            25          4.5e-05       1.800...e-06
org-compute-latex-and-related-regexp                     25          3.899...e-05  1.559...e-06
org-element-restriction                                  25          3.800...e-05  1.520...e-06
org-agenda-files                                         25          3.7e-05       1.48e-06
org-load-modules-maybe                                   25          3.000...e-05  1.200...e-06
org-delete-all                                           25          2.900...e-05  1.160...e-06
org-babel-result-hide-spec                               25          2.400...e-05  9.600...e-07
org-element-parse-secondary-string                       25          2.400...e-05  9.600...e-07
org--tag-add-to-alist                                    25          1.900...e-05  7.600...e-07
org-tag-alist-to-groups                                  25          1.600...e-05  6.400...e-07
```

#### with `org-roam-with-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-org-roam-with-file                                25          0.3011910000  0.0120476400
org-mode                                                 25          0.065139      0.0026055600
org-macro-initialize-templates                           25          0.0411049999  0.0016441999
org-collect-keywords                                     50          0.036973      0.0007394599
org--collect-keywords-1                                  50          0.0366959999  0.0007339199
org-macro--collect-macros                                25          0.036578      0.00146312
org-make-options-regexp                                  50          0.036341      0.00072682
org-fold-initialize                                      25          0.0099750000  0.0003990000
org-fold-core-initialize                                 25          0.0098709999  0.0003948399
org-fold-core-add-folding-spec                           125         0.0092929999  7.434...e-05
org-element-cache-reset                                  25          0.006196      0.00024784
org-fold-core--property-symbol-get-create                1125        0.0061050000  5.426...e-06
org-persist-register                                     50          0.0055499999  0.0001109999
org-persist--get-collection                              75          0.0052079999  6.943...e-05
org-persist--normalize-associated                        100         0.0042200000  4.220...e-05
org-set-regexps-and-options                              25          0.0023600000  9.440...e-05
org-fold-core-set-folding-spec-property                  1150        0.0017279999  1.502...e-06
org-install-agenda-files-menu                            25          0.00158       6.32e-05
org-fold-core-get-folding-spec-from-alias                2250        0.0008660000  3.848...e-07
org-set-font-lock-defaults                               25          0.0005090000  2.036...e-05
org-persist--find-index                                  75          0.0004350000  5.8e-06
org-macro--find-keyword-value                            100         0.0003630000  3.630...e-06
org-element--cache-setup-change-functions                25          0.0003070000  1.228...e-05
org-macro--find-date                                     25          0.000266      1.064e-05
org--set-faces-extend                                    50          0.000264      5.28e-06
org-persist--normalize-container                         250         0.0002469999  9.879...e-07
org-cite-try-load-processor                              25          0.000228      9.12e-06
org-setup-filling                                        25          0.0001930000  7.72e-06
org-persist-load                                         25          0.0001780000  7.120...e-06
org-cite-get-processor                                   25          0.0001640000  6.560...e-06
org-find-invisible-foreground                            25          0.0001610000  6.440...e-06
org-update-radio-target-regexp                           25          0.00014       5.6e-06
org-persist-read                                         25          0.0001130000  4.520...e-06
org-assign-fast-keys                                     25          8.1e-05       3.240...e-06
org-extract-log-state-settings                           50          7.199...e-05  1.439...e-06
org-setup-comments-handling                              25          6.1e-05       2.44e-06
org-fold-core--isearch-setup                             25          5.200...e-05  2.080...e-06
org-roam-with-file                                       25          4.700...e-05  1.880...e-06
org-compute-latex-and-related-regexp                     25          4.499...e-05  1.8e-06
org-macro--set-templates                                 25          4.400...e-05  1.760...e-06
org-macro--counter-initialize                            25          4.100...e-05  1.640...e-06
org-element-restriction                                  25          3.400...e-05  1.360...e-06
org-agenda-files                                         25          3.200...e-05  1.280...e-06
org-element-parse-secondary-string                       25          2.800...e-05  1.120...e-06
org-load-modules-maybe                                   25          2.600...e-05  1.040...e-06
org-delete-all                                           25          2.300...e-05  9.200...e-07
org--tag-add-to-alist                                    25          1.900...e-05  7.600...e-07
org-tag-alist-to-groups                                  25          1.500...e-05  6.000...e-07
```

#### With `with-plain-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-plain-file                                   25          0.2157019999  0.00862808
```


## Summery from the `emacs -Q` profiles
<table class="table-auto">
 <colgroup><col>
 <col>
 </colgroup><tbody><tr>
  <td class="border border-slate-600 p-2" rowspan="2">Functions</td>
  <td class="border border-slate-600" colspan="4">Org version 9.5.5-g8cc821</td>
  <td class="border border-slate-600" colspan="4">Org version 9.5.4-g5a6442</td>
 </tr>
 <tr>
  <td class="border border-slate-600 p-2" >Run1</td>
  <td class="border border-slate-600 p-2" >Run2</td>
  <td class="border border-slate-600 p-2" >Run3</td>
  <td class="border border-slate-600 p-2" >Avg</td>
  <td class="border border-slate-600 p-2" >Run1</td>
  <td class="border border-slate-600 p-2" >Run2</td>
  <td class="border border-slate-600 p-2" >Run3</td>
  <td class="border border-slate-600 p-2" >Avg</td>
 </tr>
 <tr>
  <td class="border border-slate-600 p-2" >test-with-current-buffer</td>
  <td class="border border-slate-600 p-2" >0.0141548</td>
  <td class="border border-slate-600 p-2" >0.01415752</td>
  <td class="border border-slate-600 p-2" >0.0150422</td>
  <td class="border border-slate-600 p-2" >0.014451507</td>
  <td class="border border-slate-600 p-2" >0.01387448</td>
  <td class="border border-slate-600 p-2" >0.0147026</td>
  <td class="border border-slate-600 p-2" >0.01433376</td>
  <td class="border border-slate-600 p-2" >0.014303613</td>
 </tr>
 <tr>
  <td class="border border-slate-600 p-2" height="20" >test-org-roam-with-file</td>
  <td class="border border-slate-600 p-2" >0.01293492</td>
  <td class="border border-slate-600 p-2" >0.01199168</td>
  <td class="border border-slate-600 p-2" >0.01381696</td>
  <td class="border border-slate-600 p-2" >0.01291452</td>
  <td class="border border-slate-600 p-2" >0.01209968</td>
  <td class="border border-slate-600 p-2" >0.01191384</td>
  <td class="border border-slate-600 p-2" >0.01204764</td>
  <td class="border border-slate-600 p-2" >0.012020387</td>
 </tr>
 <tr>
  <td class="border border-slate-600 p-2" height="20" >test-with-plain-file</td>
  <td class="border border-slate-600 p-2" >0.00915172</td>
  <td class="border border-slate-600 p-2" >0.00927128</td>
  <td class="border border-slate-600 p-2" >0.00839904</td>
  <td class="border border-slate-600 p-2" >0.00894068</td>
  <td class="border border-slate-600 p-2" >0.00762304</td>
  <td class="border border-slate-600 p-2" >0.00856996</td>
  <td class="border border-slate-600 p-2" >0.00862808</td>
  <td class="border border-slate-600 p-2" >0.008273693</td>
 </tr>
</tbody></table>
