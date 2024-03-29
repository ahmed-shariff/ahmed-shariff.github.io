---
layout: post
comments: true
title: Profiling file loading times for org mode (part 2)
tags: ["emacs", "org"]
tagline: Trying to figure out why the load times with my config is much higher.
---
From previous post:
- Summery from the `emacs -Q` profiles
<div style="overflow-x:auto">
<table class="table-auto">
 <colgroup><col>
 <col>
 </colgroup><tbody><tr>
  <td rowspan="2">Functions</td>
  <td colspan="4">Org version 9.5.5-g8cc821</td>
  <td colspan="4">Org version 9.5.4-g5a6442</td>
 </tr>
 <tr>
  <td >Run1</td>
  <td >Run2</td>
  <td >Run3</td>
  <td >Avg</td>
  <td >Run1</td>
  <td >Run2</td>
  <td >Run3</td>
  <td >Avg</td>
 </tr>
 <tr>
  <td >test-with-current-buffer</td>
  <td >0.0141548</td>
  <td >0.01415752</td>
  <td >0.0150422</td>
  <td >0.014451507</td>
  <td >0.01387448</td>
  <td >0.0147026</td>
  <td >0.01433376</td>
  <td >0.014303613</td>
 </tr>
 <tr>
  <td height="20" >test-org-roam-with-file</td>
  <td >0.01293492</td>
  <td >0.01199168</td>
  <td >0.01381696</td>
  <td >0.01291452</td>
  <td >0.01209968</td>
  <td >0.01191384</td>
  <td >0.01204764</td>
  <td >0.012020387</td>
 </tr>
 <tr>
  <td height="20" >test-with-plain-file</td>
  <td >0.00915172</td>
  <td >0.00927128</td>
  <td >0.00839904</td>
  <td >0.00894068</td>
  <td >0.00762304</td>
  <td >0.00856996</td>
  <td >0.00862808</td>
  <td >0.008273693</td>
 </tr>
</tbody></table>
</div>

After my recent update to all my packages, I noticed a significant improvement to the performance when processing large number of nodes. Here I document three scenarios:
1. The first one is with the older verions (same as the one used in the previous versions). I had ran this some timeback and had a copy of the results kicking around. Including them for reference.
2. Running the same tests as soon as I start emacs with updated pacakges.
- org: aa48c80fe
- org-roam: 74422df
3. Running the same test after using emacs for sometime with the same packages as above.

# Re running the `emacs -Q` tests from the previous post with my config loaded in an older version
## With `with-current-buffer`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-current-buffer                                         25          20.085711     0.80342844
org-mode                                                           25          12.717267000  0.5086906800
org-roam-db-autosync--setup-file-h                                 25          0.0597199999  0.0023887999
org-roam-file-p                                                    25          0.0596120000  0.00238448
org-roam-descendant-of-p                                           25          0.0578610000  0.0023144400
org-display-inline-images                                          25          0.0438770000  0.0017550800
org-install-agenda-files-menu                                      25          0.04354       0.0017416
org-agenda-files                                                   25          0.033484      0.00133936
org-activate-links                                                 125         0.030238      0.000241904
org-activate-links--text-properties                                125         0.0299749999  0.0002397999
org-cycle-set-startup-visibility                                   25          0.0265480000  0.00106192
org-cycle-hide-drawers                                             25          0.0234        0.000936
org-fold--hide-drawers                                             50          0.0233779999  0.0004675599
org-ref-cite-activate                                              25          0.023179      0.0009271600
org-ref-valid-keys                                                 25          0.021546      0.00086184
org-element-at-point                                               50          0.0206690000  0.0004133800
org-element--parse-to                                              51          0.019772      0.0003876862
org-fold-initialize                                                25          0.0136660000  0.0005466400
org-fold-core-initialize                                           25          0.013498      0.0005399199
org-element--current-element                                       177         0.0115729999  6.538...e-05
org-fold-core-add-folding-spec                                     125         0.0114209999  9.1368e-05
org-element-cache-reset                                            25          0.0095030000  0.0003801200
org-fold-core--property-symbol-get-create                          1375        0.0078970000  5.743...e-06
org-macro-initialize-templates                                     25          0.0078380000  0.0003135200
org-persist-register                                               50          0.007524      0.00015048
org-persist--get-collection                                        75          0.0068669999  9.155...e-05
org-persist-load                                                   25          0.0061090000  0.0002443600
org-persist-read                                                   25          0.006026      0.00024104
org-persist--normalize-associated                                  100         0.0057460000  5.746...e-05
org-ref-org-menu                                                   25          0.005175      0.000207
org-get-limited-outline-regexp                                     229         0.0048349999  2.111...e-05
org-set-regexps-and-options                                        25          0.004457      0.00017828
org-element-headline-parser                                        76          0.0043840000  5.768...e-05
org-element--cache-put                                             202         0.0034609999  1.713...e-05
org-fold-region                                                    200         0.0027680000  1.384...e-05
org-fold-core-region                                               200         0.0024029999  1.201...e-05
org-collect-keywords                                               50          0.0021489999  4.297...e-05
org-fold-core-set-folding-spec-property                            1150        0.0021399999  1.860...e-06
org-cycle-content                                                  25          0.002023      8.092e-05
org--collect-keywords-1                                            50          0.0017540000  3.508...e-05
org-macro--collect-macros                                          25          0.001597      6.387...e-05
org-element--cache-setup-change-functions                          25          0.0015009999  6.003...e-05
org-element--get-node-properties                                   101         0.0014930000  1.478...e-05
org-element-org-data-parser                                        25          0.001467      5.868e-05
org-fold-hide-drawer-toggle                                        50          0.0014320000  2.864...e-05
org-fold-core-get-folding-spec-from-alias                          2750        0.0013539999  4.923...e-07
org-fold--hide-wrapper-toggle                                      50          0.00132       2.64e-05
org-element--cache-persist-before-read                             50          0.0013        2.6e-05
org-set-font-lock-defaults                                         25          0.0012340000  4.936...e-05
org-link-get-parameter                                             600         0.0011220000  1.870...e-06
org-make-options-regexp                                            50          0.0011200000  2.240...e-05
org-element--cache-compare                                         1000        0.0010750000  1.075...e-06
org-bullets-mode                                                   25          0.001023      4.092e-05
org-unfontify-region                                               25          0.001         4e-05
org-element-link-parser                                            100         0.0008899999  8.899...e-06
org-setup-filling                                                  25          0.0008059999  3.223...e-05
org-element-section-parser                                         51          0.0007710000  1.511...e-05
org-fontify-drawers                                                125         0.0007469999  5.975...e-06
org-macro--find-keyword-value                                      100         0.0006160000  6.160...e-06
org-do-emphasis-faces                                              25          0.0006100000  2.440...e-05
org-persist--find-index                                            100         0.000568      5.680...e-06
org-element--cache-persist-after-read                              50          0.0005660000  1.132...e-05
org-fold-folded-p                                                  50          0.0005580000  1.116...e-05
org--set-faces-extend                                              50          0.000551      1.102e-05
org-cite-activate                                                  25          0.000548      2.192e-05
org-fold-show-all                                                  25          0.0005279999  2.111...e-05
org-cite-get-processor                                             75          0.00052       6.933...e-06
org-element--cache-verify-element                                  50          0.0004670000  9.340...e-06
org-babel-hide-all-hashes                                          25          0.0004599999  1.84e-05
org-fold-core-folded-p                                             50          0.0004520000  9.040...e-06
org-activate-tags                                                  50          0.000355      7.1e-06
org-macro--find-date                                               25          0.0003549999  1.419...e-05
org-persist-load:elisp                                             50          0.0003460000  6.920...e-06
org-fold-core-get-folding-spec                                     50          0.0003330000  6.660...e-06
org-element--cache-active-p                                        656         0.0003290000  5.015...e-07
org-cite-try-load-processor                                        25          0.0003259999  1.303...e-05
org-extract-log-state-settings                                     225         0.0003140000  1.395...e-06
org-persist--normalize-container                                   300         0.0003090000  1.030...e-06
org-element--cache-find                                            50          0.0002980000  5.960...e-06
org-fontify-meta-lines-and-blocks                                  25          0.000291      1.164e-05
org-element-property-drawer-parser                                 51          0.000285      5.588...e-06
org-cycle-show-empty-lines                                         25          0.000281      1.124e-05
org-cite-processor-has-capability-p                                25          0.000279      1.116e-05
org-cycle-hide-archived-subtrees                                   25          0.000277      1.108e-05
org-cycle-set-visibility-according-to-property                     25          0.000268      1.072e-05
org-activate-footnote-links                                        25          0.000266      1.064e-05
org-fontify-meta-lines-and-blocks-1                                25          0.000226      9.04e-06
org-find-invisible-foreground                                      25          0.000222      8.88e-06
org-transclusion-fontify-meta-lines-and-blocks                     25          0.000209      8.360...e-06
org-file-menu-entry                                                475         0.0002059999  4.336...e-07
org-ref-find-bibliography                                          25          0.000201      8.040...e-06
org-fold-hide-archived-subtrees                                    25          0.000199      7.96e-06
org-fontify-inline-src-blocks                                      25          0.0001960000  7.840...e-06
org-font-lock-add-priority-faces                                   25          0.0001920000  7.680...e-06
org-footnote-next-reference-or-definition                          25          0.0001920000  7.680...e-06
org-element--get-global-node-properties                            25          0.0001870000  7.480...e-06
org-update-radio-target-regexp                                     25          0.0001810000  7.240...e-06
org-delete-all                                                     50          0.0001680000  3.360...e-06
org-element-property                                               450         0.0001589999  3.533...e-07
org-roam--file-name-extension                                      25          0.0001480000  5.920...e-06
org-at-comment-p                                                   50          0.0001409999  2.819...e-06
org-remove-flyspell-overlays-in                                    225         0.0001399999  6.222...e-07
org-activate-dates                                                 25          0.0001370000  5.480...e-06
org-fontify-inline-src-blocks-1                                    25          0.0001360000  5.440...e-06
org-fold-hide-drawer-all                                           25          0.000123      4.92e-06
org-do-latex-and-related                                           25          0.0001100000  4.400...e-06
org-split-string                                                   25          0.000109      4.360...e-06
org-get-level-face                                                 225         0.0001079999  4.799...e-07
org-activate-code                                                  25          0.0001070000  4.280...e-06
org-skip-whitespace                                                203         9.799...e-05  4.827...e-07
org-transclusion-font-lock-set                                     25          9.600...e-05  3.840...e-06
org-remove-keyword-keys                                            50          9.099...e-05  1.819...e-06
org-element--get-time-properties                                   76          8.599...e-05  1.131...e-06
org-setup-comments-handling                                        25          8.200...e-05  3.280...e-06
org-eldoc-load                                                     25          7.8e-05       3.119...e-06
org-element--cache-sync                                            50          6.999...e-05  1.399...e-06
org-ref-cite-version                                               25          6.500...e-05  2.600...e-06
org-re-property                                                    25          6.4e-05       2.56e-06
org-knuth-hash                                                     50          6.099...e-05  1.219...e-06
org-fold-core--isearch-setup                                       25          6e-05         2.4e-06
org-macro--counter-initialize                                      25          5.900...e-05  2.360...e-06
org-assign-fast-keys                                               25          5.800...e-05  2.320...e-06
org-compute-latex-and-related-regexp                               25          5.500...e-05  2.200...e-06
org-fontify-macros                                                 25          5.100...e-05  2.040...e-06
org-macro--set-templates                                           25          5.100...e-05  2.040...e-06
org-reduced-level                                                  76          5.099...e-05  6.710...e-07
org-remove-font-lock-display-properties                            25          4.8e-05       1.920...e-06
org-babel-result-hide-spec                                         25          4.699...e-05  1.879...e-06
org-string-nw-p                                                    25          4.600...e-05  1.840...e-06
org-load-modules-maybe                                             25          4.600...e-05  1.840...e-06
org-element-type                                                   100         4.199...e-05  4.199...e-07
org-bullets--fontify-buffer                                        25          3.800...e-05  1.520...e-06
org-tag-alist-to-groups                                            25          3.700...e-05  1.480...e-06
org-remove-inline-images                                           25          3.600...e-05  1.440...e-06
org-element-restriction                                            25          3.600...e-05  1.440...e-06
org-element-parse-secondary-string                                 25          2.600...e-05  1.040...e-06
org-file-name-concat                                               25          2.400...e-05  9.600...e-07
org-fontify-entities                                               25          2.400...e-05  9.600...e-07
org-fold-core-update-optimisation                                  25          2.200...e-05  8.800...e-07
org-activate-target-links                                          25          1.900...e-05  7.600...e-07
org-font-lock-hook                                                 25          1.600...e-05  6.400...e-07
org-font-lock-add-tag-faces                                        25          1.500...e-05  6.000...e-07
org-raise-scripts                                                  25          1.500...e-05  6.000...e-07
org--tag-add-to-alist                                              25          1.200...e-05  4.800...e-07
```

## with `org-roam-with-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-org-roam-with-file                                          25          19.847053000  0.7938821200
org-mode                                                           25          0.1672749999  0.0066909999
org-fold-initialize                                                25          0.1271850000  0.0050874000
org-fold-core-initialize                                           25          0.1270450000  0.0050818000
org-fold-core-add-folding-spec                                     125         0.1255340000  0.0010042720
org-fold-core--property-symbol-get-create                          1125        0.1222870000  0.0001086995
org-element-cache-reset                                            25          0.0102429999  0.0004097199
org-persist-register                                               50          0.0084080000  0.0001681600
org-macro-initialize-templates                                     25          0.008364      0.00033456
org-persist--get-collection                                        75          0.0078619999  0.0001048266
org-persist--normalize-associated                                  100         0.0067170000  6.717...e-05
org-install-agenda-files-menu                                      25          0.0060659999  0.0002426399
org-set-regexps-and-options                                        25          0.0043650000  0.0001746000
org-persist-load                                                   25          0.002914      0.00011656
org-persist-read                                                   25          0.0027960000  0.0001118400
org-collect-keywords                                               50          0.002123      4.246e-05
org-macro--collect-macros                                          25          0.0018740000  7.496...e-05
org-fold-core-set-folding-spec-property                            1150        0.0018139999  1.577...e-06
org--collect-keywords-1                                            50          0.0017480000  3.496...e-05
org-element--cache-setup-change-functions                          25          0.0013180000  5.272...e-05
org-set-font-lock-defaults                                         25          0.001164      4.656e-05
org-make-options-regexp                                            50          0.0010989999  2.197...e-05
org-fold-core-get-folding-spec-from-alias                          2250        0.0008990000  3.995...e-07
org-setup-filling                                                  25          0.000864      3.456e-05
org-macro--find-keyword-value                                      100         0.000809      8.09e-06
org--set-faces-extend                                              50          0.0005760000  1.152...e-05
org-persist--find-index                                            100         0.000558      5.58e-06
org-extract-log-state-settings                                     225         0.0004170000  1.853...e-06
org-macro--find-date                                               25          0.0003859999  1.543...e-05
org-cite-try-load-processor                                        25          0.0003030000  1.212...e-05
org-persist--normalize-container                                   250         0.00028       1.119...e-06
org-find-invisible-foreground                                      25          0.000231      9.24e-06
org-cite-get-processor                                             25          0.000223      8.92e-06
org-update-radio-target-regexp                                     25          0.0001890000  7.560...e-06
org-delete-all                                                     50          0.000161      3.22e-06
org-remove-keyword-keys                                            50          9.299...e-05  1.859...e-06
org-transclusion-font-lock-set                                     25          8.5e-05       3.4e-06
org-setup-comments-handling                                        25          7.9e-05       3.16e-06
org-macro--counter-initialize                                      25          6.9e-05       2.76e-06
org-compute-latex-and-related-regexp                               25          5.900...e-05  2.360...e-06
org-fold-core--isearch-setup                                       25          5.800...e-05  2.320...e-06
org-macro--set-templates                                           25          5.600...e-05  2.240...e-06
org-assign-fast-keys                                               25          5.500...e-05  2.200...e-06
org-agenda-files                                                   25          4.800...e-05  1.920...e-06
org-load-modules-maybe                                             25          4.400...e-05  1.760...e-06
org-element-restriction                                            25          4e-05         1.600...e-06
org-tag-alist-to-groups                                            25          3.400...e-05  1.360...e-06
org-element-parse-secondary-string                                 25          3.200...e-05  1.280...e-06
org-file-name-concat                                               25          2.300...e-05  9.200...e-07
org--tag-add-to-alist                                              25          1.700...e-05  6.800...e-07
```

## With `with-plain-file`
```csv
  Function Name                                          Call Count  Elapsed Time  Average Time
--test-with-plain-file                                             25          13.876995999  0.5550798399
```



# Running the same with the newer versions
## With `with-current-buffer`
```csv
--test-with-current-buffer                                         25          8.428858      0.33715432
org-mode                                                           25          4.50127       0.1800507999
org-roam-db-autosync--setup-file-h                                 25          0.039868      0.00159472
org-roam-file-p                                                    25          0.0397600000  0.0015904000
org-roam-descendant-of-p                                           25          0.037973      0.00151892
org-install-agenda-files-menu                                      25          0.0357489999  0.0014299599
org-agenda-files                                                   25          0.0233490000  0.0009339600
org-fold-initialize                                                25          0.0160719999  0.0006428799
org-fold-core-initialize                                           25          0.015929      0.0006371599
org-cycle-set-startup-visibility                                   25          0.0158069999  0.0006322799
org-display-inline-images                                          25          0.0138319999  0.00055328
org-cycle-hide-drawers                                             25          0.0135689999  0.0005427599
org-fold--hide-drawers                                             50          0.0135410000  0.0002708200
org-element-at-point                                               25          0.012106      0.0004842400
org-element--parse-to                                              26          0.0115910000  0.0004458076
org-element-cache-reset                                            25          0.0112219999  0.0004488799
org-fold-core-add-folding-spec                                     125         0.0110059999  8.804...e-05
org-fold-core--property-symbol-get-create                          1325        0.0076900000  5.803...e-06
org-macro-initialize-templates                                     25          0.007599      0.00030396
org-persist-register                                               50          0.0075939999  0.0001518799
org-element--current-element                                       77          0.0073840000  9.589...e-05
org-persist--get-collection                                        75          0.0061219999  8.162...e-05
org-ref-org-menu                                                   25          0.00532       0.0002128
org-persist--normalize-associated                                  100         0.0049910000  4.991...e-05
org-modern-mode                                                    25          0.0048930000  0.0001957200
org-set-regexps-and-options                                        25          0.004587      0.00018348
org-get-limited-outline-regexp                                     104         0.003864      3.715...e-05
org-activate-links                                                 50          0.0035809999  7.162e-05
org-activate-links--text-properties                                50          0.0034699999  6.939...e-05
org-element--cache-setup-change-functions                          25          0.0031500000  0.0001260000
org-collect-keywords                                               50          0.0022559999  4.511...e-05
org-fold-region                                                    175         0.0021749999  1.242...e-05
org-unfontify-region                                               50          0.0021089999  4.217...e-05
org-element-headline-parser                                        26          0.002071      7.965...e-05
org-fold-core-set-folding-spec-property                            1150        0.0020149999  1.752...e-06
org--collect-keywords-1                                            50          0.001886      3.772...e-05
org-fold-core-region                                               175         0.0018559999  1.060...e-05
org-macro--collect-macros                                          25          0.0016200000  6.480...e-05
org-element-org-data-parser                                        25          0.0014290000  5.716...e-05
org-modern--unfontify                                              25          0.0012829999  5.131...e-05
org-element--cache-put                                             102         0.00119       1.166...e-05
org-cycle-content                                                  25          0.001137      4.548e-05
org-set-font-lock-defaults                                         25          0.00113       4.519...e-05
org-make-options-regexp                                            50          0.0011139999  2.227...e-05
org-fold-core-get-folding-spec-from-alias                          2650        0.0010660000  4.022...e-07
org-modern--make-font-lock-keywords                                25          0.0009830000  3.932e-05
org-bullets-mode                                                   25          0.000896      3.584e-05
org-setup-filling                                                  25          0.000876      3.504e-05
org-element--get-node-properties                                   51          0.0007440000  1.458...e-05
org-fold-hide-drawer-toggle                                        25          0.0007269999  2.907...e-05
org-macro--find-keyword-value                                      100         0.0007239999  7.239...e-06
org-fold--hide-wrapper-toggle                                      25          0.0006590000  2.636...e-05
org-link-get-parameter                                             150         0.0006240000  4.160...e-06
org-element-section-parser                                         26          0.0006119999  2.353...e-05
org-persist--find-index                                            100         0.0005629999  5.629...e-06
org-cite-activate                                                  25          0.000539      2.156e-05
org-tempo-setup                                                    25          0.0005360000  2.144...e-05
org--set-faces-extend                                              50          0.0005319999  1.063...e-05
org-babel-hide-all-hashes                                          25          0.0005180000  2.072...e-05
org-cite-get-processor                                             75          0.000518      6.906...e-06
org-element-link-parser                                            25          0.0005050000  2.020...e-05
org-persist-load                                                   25          0.0004959999  1.983...e-05
org-fontify-drawers                                                50          0.0004200000  8.400...e-06
org-persist-read                                                   25          0.0004089999  1.636e-05
org-fold-show-all                                                  25          0.0003599999  1.439...e-05
org-do-emphasis-faces                                              25          0.0003580000  1.432...e-05
org-element--cache-verify-element                                  25          0.0003549999  1.419...e-05
org-tempo--update-maybe                                            25          0.000354      1.416e-05
org-persist--normalize-container                                   250         0.0003350000  1.340...e-06
org-macro--find-date                                               25          0.0003319999  1.327...e-05
org-cite-try-load-processor                                        25          0.000318      1.271...e-05
org-fold-folded-p                                                  25          0.000307      1.228e-05
org-extract-log-state-settings                                     225         0.0003060000  1.360...e-06
org-fontify-meta-lines-and-blocks                                  25          0.0002980000  1.192...e-05
org-modern--symbol                                                 500         0.0002930000  5.860...e-07
org-element--cache-compare                                         250         0.0002900000  1.160...e-06
org-cycle-show-empty-lines                                         25          0.0002900000  1.160...e-05
org-cite-processor-has-capability-p                                25          0.000267      1.068e-05
org-cycle-hide-archived-subtrees                                   25          0.000266      1.064e-05
org-activate-footnote-links                                        25          0.0002639999  1.055...e-05
org-fold-core-folded-p                                             25          0.0002529999  1.011...e-05
org-modern--update-label-face                                      25          0.000243      9.72e-06
org-cycle-set-visibility-according-to-property                     25          0.00023       9.2e-06
org-fontify-meta-lines-and-blocks-1                                25          0.000228      9.12e-06
org-element-property-drawer-parser                                 26          0.0002240000  8.615...e-06
org-find-invisible-foreground                                      25          0.0002140000  8.560...e-06
org-fontify-inline-src-blocks                                      25          0.0001980000  7.92e-06
org-element--get-global-node-properties                            25          0.0001970000  7.880...e-06
org-footnote-next-reference-or-definition                          25          0.000194      7.76e-06
org-fold-core-get-folding-spec                                     25          0.000189      7.560...e-06
org-tempo--keys                                                    25          0.0001760000  7.040...e-06
org-transclusion-fontify-meta-lines-and-blocks                     25          0.000174      6.96e-06
org-fold-hide-archived-subtrees                                    25          0.000174      6.96e-06
org-element--cache-active-p                                        325         0.0001709999  5.261...e-07
org-element--cache-find                                            25          0.0001550000  6.200...e-06
org-update-radio-target-regexp                                     25          0.0001530000  6.120...e-06
org-roam--file-name-extension                                      25          0.000146      5.84e-06
org-delete-all                                                     50          0.0001459999  2.919...e-06
org-at-comment-p                                                   50          0.0001399999  2.799...e-06
org-file-menu-entry                                                425         0.0001289999  3.035...e-07
org-activate-dates                                                 25          0.000128      5.12e-06
org-fold-hide-drawer-all                                           25          0.000126      5.04e-06
org-fontify-inline-src-blocks-1                                    25          0.000123      4.92e-06
org-activate-tags                                                  25          0.0001199999  4.8e-06
org-do-latex-and-related                                           25          0.000116      4.64e-06
org-remove-keyword-keys                                            50          9.499...e-05  1.899...e-06
org-remove-font-lock-display-properties                            50          9.199...e-05  1.839...e-06
org-eldoc-load                                                     25          7.900...e-05  3.160...e-06
org-setup-comments-handling                                        25          7.700...e-05  3.080...e-06
org-font-lock-add-priority-faces                                   25          7.600...e-05  3.040...e-06
org-transclusion-font-lock-set                                     25          7.400...e-05  2.960...e-06
org-element-property                                               150         6.599...e-05  4.399...e-07
org-activate-code                                                  25          6.500...e-05  2.600...e-06
org-re-property                                                    25          6.3e-05       2.52e-06
org-remove-flyspell-overlays-in                                    75          6.299...e-05  8.399...e-07
org-skip-whitespace                                                103         5.999...e-05  5.825...e-07
org-fold-core--isearch-setup                                       25          5.800...e-05  2.320...e-06
org-macro--counter-initialize                                      25          5.3e-05       2.12e-06
org-get-level-face                                                 75          5.299...e-05  7.066...e-07
org-compute-latex-and-related-regexp                               25          4.700...e-05  1.880...e-06
org-string-nw-p                                                    25          4.499...e-05  1.8e-06
org-assign-fast-keys                                               25          4.400...e-05  1.760...e-06
org-load-modules-maybe                                             25          4.300...e-05  1.720...e-06
org-macro--set-templates                                           25          4.200...e-05  1.680...e-06
org-knuth-hash                                                     25          4.100...e-05  1.640...e-06
org-element--get-time-properties                                   26          3.800...e-05  1.461...e-06
org-fold-core-update-optimisation                                  50          3.799...e-05  7.599...e-07
org-fontify-macros                                                 25          3.600...e-05  1.440...e-06
org-modern-mode-set-explicitly                                     25          3.600...e-05  1.440...e-06
org-tag-alist-to-groups                                            25          3.500...e-05  1.400...e-06
org-element-restriction                                            25          3.5e-05       1.4e-06
org-element--cache-sync                                            25          3.3e-05       1.32e-06
org-modern--update-fringe-bitmaps                                  25          3.200...e-05  1.280...e-06
org-bullets--fontify-buffer                                        25          3.100...e-05  1.240...e-06
org-file-name-concat                                               25          2.600...e-05  1.040...e-06
org-element-parse-secondary-string                                 25          2.200...e-05  8.800...e-07
org-font-lock-hook                                                 25          2.200...e-05  8.800...e-07
org-element-type                                                   50          2.000...e-05  4.000...e-07
org-babel-result-hide-spec                                         25          1.900...e-05  7.600...e-07
org-reduced-level                                                  26          1.900...e-05  7.307...e-07
org--tag-add-to-alist                                              25          1.800...e-05  7.200...e-07
org-activate-target-links                                          25          1.400...e-05  5.600...e-07
org-fontify-entities                                               25          1.100...e-05  4.400...e-07
org-font-lock-add-tag-faces                                        25          1e-05         4.000...e-07
org-raise-scripts                                                  25          1e-05         4.000...e-07
```

## With `org-roam-with-file`
```csv
--test-org-roam-with-file                                          25          8.7456740000  0.34982696
org-mode                                                           25          0.077627      0.00310508
org-fold-initialize                                                25          0.0153549999  0.0006142
org-fold-core-initialize                                           25          0.015202      0.00060808
org-element-cache-reset                                            25          0.0121030000  0.0004841200
org-fold-core-add-folding-spec                                     125         0.0104659999  8.372...e-05
org-install-agenda-files-menu                                      25          0.0103650000  0.0004146000
org-persist-register                                               50          0.008608      0.0001721599
org-fold-core--property-symbol-get-create                          1125        0.0070780000  6.291...e-06
org-persist--get-collection                                        75          0.0070069999  9.342...e-05
org-macro-initialize-templates                                     25          0.0065509999  0.0002620399
org-persist-load                                                   25          0.0060440000  0.0002417600
org-persist-read                                                   25          0.005958      0.0002383199
org-persist--normalize-associated                                  100         0.0058790000  5.879...e-05
org-set-regexps-and-options                                        25          0.0043779999  0.0001751199
org-element--cache-setup-change-functions                          25          0.0030009999  0.00012004
org-collect-keywords                                               50          0.0022260000  4.452...e-05
org-fold-core-set-folding-spec-property                            1150        0.0019309999  1.679...e-06
org--collect-keywords-1                                            50          0.0018540000  3.708...e-05
org-macro--collect-macros                                          25          0.00163       6.52e-05
org-element--cache-persist-before-read                             50          0.001473      2.946e-05
org-set-font-lock-defaults                                         25          0.0011539999  4.615...e-05
org-make-options-regexp                                            50          0.001094      2.187...e-05
org-fold-core-get-folding-spec-from-alias                          2250        0.0009190000  4.084...e-07
org-element--cache-persist-after-read                              50          0.000772      1.544e-05
org-macro--find-keyword-value                                      100         0.000656      6.56e-06
org-setup-filling                                                  25          0.0006380000  2.552...e-05
org-persist--find-index                                            100         0.0005770000  5.770...e-06
org--set-faces-extend                                              50          0.000498      9.96e-06
org-persist-load:elisp                                             50          0.0004560000  9.120...e-06
org-macro--find-date                                               25          0.000338      1.352e-05
org-persist--normalize-container                                   300         0.0003300000  1.100...e-06
org-cite-try-load-processor                                        25          0.000309      1.235...e-05
org-extract-log-state-settings                                     225         0.0002940000  1.306...e-06
org-cite-get-processor                                             25          0.0002260000  9.040...e-06
org-find-invisible-foreground                                      25          0.0002070000  8.28e-06
org-update-radio-target-regexp                                     25          0.000146      5.84e-06
org-delete-all                                                     50          0.0001459999  2.919...e-06
org-remove-keyword-keys                                            50          8.599...e-05  1.719...e-06
org-transclusion-font-lock-set                                     25          8.5e-05       3.4e-06
org-setup-comments-handling                                        25          7.700...e-05  3.080...e-06
org-macro--counter-initialize                                      25          5.700...e-05  2.28e-06
org-fold-core--isearch-setup                                       25          5.7e-05       2.28e-06
org-assign-fast-keys                                               25          4.900...e-05  1.960...e-06
org-compute-latex-and-related-regexp                               25          4.7e-05       1.879...e-06
org-macro--set-templates                                           25          4.4e-05       1.759...e-06
org-load-modules-maybe                                             25          4.100...e-05  1.640...e-06
org-agenda-files                                                   25          3.900...e-05  1.560...e-06
org-tag-alist-to-groups                                            25          3.700...e-05  1.480...e-06
org-element-restriction                                            25          3.500...e-05  1.400...e-06
org-file-name-concat                                               25          2.500...e-05  1.000...e-06
org-element-parse-secondary-string                                 25          2.100...e-05  8.400...e-07
org--tag-add-to-alist                                              25          1.200...e-05  4.800...e-07
```

## With `with-plain-file`
```csv
--test-with-plain-file                                             25          6.005398      0.2402159199
```

# Run on fresh start
## With `with-current-buffer`
```csv
--test-with-current-buffer                                         25          3.465567      0.13862268
org-mode                                                           25          1.7828609999  0.0713144399
org-roam-db-autosync--setup-file-h                                 25          0.0369889999  0.0014795599
org-roam-file-p                                                    25          0.0368999999  0.0014759999
org-roam-descendant-of-p                                           25          0.035055      0.0014022000
org-install-agenda-files-menu                                      25          0.025859      0.00103436
org-fold-initialize                                                25          0.0202249999  0.0008089999
org-fold-core-initialize                                           25          0.020086      0.00080344
org-agenda-files                                                   25          0.0191909999  0.0007676399
org-element-cache-reset                                            25          0.018989      0.0007595599
org-cycle-set-startup-visibility                                   25          0.013437      0.00053748
org-display-inline-images                                          25          0.0124029999  0.00049612
org-element--cache-setup-change-functions                          25          0.0122160000  0.00048864
org-cycle-hide-drawers                                             25          0.0113719999  0.0004548799
org-fold--hide-drawers                                             50          0.0113470000  0.0002269400
org-fold-core-add-folding-spec                                     125         0.010337      8.269...e-05
org-element-at-point                                               25          0.010041      0.00040164
org-element--parse-to                                              25          0.0095739999  0.0003829599
org-fold-core--property-symbol-get-create                          1325        0.0073220000  5.526...e-06
org-macro-initialize-templates                                     25          0.0062959999  0.00025184
org-persist-register                                               50          0.0062489999  0.0001249799
org-persist--get-collection                                        75          0.0057979999  7.730...e-05
org-element--current-element                                       75          0.0057680000  7.690...e-05
org-ref-org-menu                                                   25          0.005011      0.00020044
org-modern-mode                                                    25          0.0049369999  0.0001974799
org-persist--normalize-associated                                  100         0.0047380000  4.738...e-05
org-set-regexps-and-options                                        25          0.0043879999  0.0001755199
org-activate-links                                                 50          0.0030599999  6.119...e-05
org-get-limited-outline-regexp                                     100         0.0029639999  2.963...e-05
org-activate-links--text-properties                                50          0.002952      5.904...e-05
org-fold-region                                                    175         0.0021570000  1.232...e-05
org-unfontify-region                                               50          0.0021410000  4.282...e-05
org-collect-keywords                                               50          0.0019939999  3.987...e-05
org-fold-core-set-folding-spec-property                            1150        0.0018929999  1.646...e-06
org-fold-core-region                                               175         0.0018359999  1.049...e-05
org-element-headline-parser                                        25          0.0016690000  6.676e-05
org--collect-keywords-1                                            50          0.0016280000  3.256...e-05
org-modern--unfontify                                              25          0.0013659999  5.463...e-05
org-macro--collect-macros                                          25          0.0013400000  5.360...e-05
org-element-org-data-parser                                        25          0.0012379999  4.951...e-05
org-element--cache-put                                             100         0.001232      1.232e-05
org-fold-core-get-folding-spec-from-alias                          2650        0.0011810000  4.456...e-07
org-set-font-lock-defaults                                         25          0.0011670000  4.668...e-05
org-cycle-content                                                  25          0.0011330000  4.532...e-05
org-make-options-regexp                                            50          0.0011310000  2.262...e-05
org-bullets-mode                                                   25          0.0010220000  4.088e-05
org-modern--make-font-lock-keywords                                25          0.0009949999  3.979...e-05
org-fold-hide-drawer-toggle                                        25          0.000672      2.688e-05
org-element--get-node-properties                                   50          0.0006390000  1.278...e-05
org-setup-filling                                                  25          0.0006070000  2.428...e-05
org-fold--hide-wrapper-toggle                                      25          0.000607      2.428e-05
org-persist--find-index                                            100         0.0005829999  5.829...e-06
org-persist-load                                                   25          0.0005570000  2.228...e-05
org-link-get-parameter                                             150         0.0005510000  3.673...e-06
org-cite-get-processor                                             75          0.000528      7.04e-06
org-cite-activate                                                  25          0.0005200000  2.080...e-05
org-tempo-setup                                                    25          0.000506      2.024...e-05
org-macro--find-keyword-value                                      100         0.0004840000  4.840...e-06
org-persist-read                                                   25          0.0004689999  1.876e-05
org-element-link-parser                                            25          0.0004659999  1.863...e-05
org--set-faces-extend                                              50          0.0004520000  9.040...e-06
org-element-section-parser                                         25          0.000446      1.784e-05
org-babel-hide-all-hashes                                          25          0.0003989999  1.595...e-05
org-fontify-drawers                                                50          0.0003960000  7.920...e-06
org-fold-show-all                                                  25          0.0003580000  1.432...e-05
org-persist--normalize-container                                   250         0.0003430000  1.372...e-06
org-tempo--update-maybe                                            25          0.0003310000  1.324...e-05
org-modern--symbol                                                 500         0.0003250000  6.500...e-07
org-cite-try-load-processor                                        25          0.000325      1.3e-05
org-extract-log-state-settings                                     225         0.0002980000  1.324...e-06
org-do-emphasis-faces                                              25          0.000297      1.188e-05
org-element--cache-compare                                         250         0.00028       1.119...e-06
org-macro--find-date                                               25          0.0002799999  1.119...e-05
org-fold-folded-p                                                  25          0.0002790000  1.116...e-05
org-cite-processor-has-capability-p                                25          0.0002760000  1.104...e-05
org-cycle-show-empty-lines                                         25          0.0002430000  9.720...e-06
org-activate-footnote-links                                        25          0.0002410000  9.640...e-06
org-fold-core-folded-p                                             25          0.0002310000  9.240...e-06
org-activate-dates                                                 25          0.000231      9.24e-06
org-cycle-set-visibility-according-to-property                     25          0.0002140000  8.560...e-06
org-modern--update-label-face                                      25          0.0002040000  8.160...e-06
org-find-invisible-foreground                                      25          0.0002030000  8.120...e-06
org-cycle-hide-archived-subtrees                                   25          0.000184      7.36e-06
org-fontify-meta-lines-and-blocks                                  25          0.0001760000  7.040...e-06
org-fold-core-get-folding-spec                                     25          0.0001720000  6.880...e-06
org-footnote-next-reference-or-definition                          25          0.0001710000  6.840...e-06
org-element--cache-active-p                                        325         0.0001639999  5.046...e-07
org-element--get-global-node-properties                            25          0.0001570000  6.280...e-06
org-element-property-drawer-parser                                 25          0.0001550000  6.200...e-06
org-tempo--keys                                                    25          0.0001530000  6.120...e-06
org-fold-hide-drawer-all                                           25          0.0001490000  5.960...e-06
org-fontify-inline-src-blocks                                      25          0.0001420000  5.680...e-06
org-delete-all                                                     50          0.0001419999  2.839...e-06
org-update-radio-target-regexp                                     25          0.000141      5.64e-06
org-roam--file-name-extension                                      25          0.000139      5.559...e-06
org-element--cache-find                                            25          0.000133      5.32e-06
org-file-menu-entry                                                425         0.0001299999  3.058...e-07
org-element--cache-verify-element                                  25          0.0001290000  5.160...e-06
org-fontify-meta-lines-and-blocks-1                                25          0.00012       4.8e-06
org-do-latex-and-related                                           25          0.0001180000  4.720...e-06
org-transclusion-fontify-meta-lines-and-blocks                     25          0.000118      4.72e-06
org-at-comment-p                                                   50          0.0001109999  2.219...e-06
org-fold-hide-archived-subtrees                                    25          0.0001100000  4.400...e-06
org-activate-tags                                                  25          0.0001070000  4.280...e-06
org-remove-keyword-keys                                            50          9.399...e-05  1.879...e-06
org-remove-font-lock-display-properties                            50          8.999...e-05  1.799...e-06
org-transclusion-font-lock-set                                     25          8.900...e-05  3.560...e-06
org-setup-comments-handling                                        25          8.200...e-05  3.280...e-06
org-fontify-inline-src-blocks-1                                    25          8.000...e-05  3.200...e-06
org-eldoc-load                                                     25          8e-05         3.200...e-06
org-fold-core--isearch-setup                                       25          6.500...e-05  2.600...e-06
org-activate-code                                                  25          6.2e-05       2.48e-06
org-element-property                                               150         6.199...e-05  4.133...e-07
org-font-lock-add-priority-faces                                   25          6e-05         2.4e-06
org-re-property                                                    25          5.900...e-05  2.360...e-06
org-string-nw-p                                                    25          5.800...e-05  2.320...e-06
org-get-level-face                                                 75          5.699...e-05  7.599...e-07
org-skip-whitespace                                                100         5.499...e-05  5.499...e-07
org-macro--set-templates                                           25          5.400...e-05  2.16e-06
org-macro--counter-initialize                                      25          5.4e-05       2.16e-06
org-remove-flyspell-overlays-in                                    75          5.299...e-05  7.066...e-07
org-assign-fast-keys                                               25          4.800...e-05  1.920...e-06
org-compute-latex-and-related-regexp                               25          4.500...e-05  1.800...e-06
org-tag-alist-to-groups                                            25          3.9e-05       1.559...e-06
org-load-modules-maybe                                             25          3.800...e-05  1.520...e-06
org-fontify-macros                                                 25          3.500...e-05  1.400...e-06
org-modern--update-fringe-bitmaps                                  25          3.5e-05       1.4e-06
org-element--get-time-properties                                   25          3.400...e-05  1.360...e-06
org-knuth-hash                                                     25          3.4e-05       1.36e-06
org-element-restriction                                            25          3.300...e-05  1.320...e-06
org-modern-mode-set-explicitly                                     25          3.1e-05       1.24e-06
org-babel-result-hide-spec                                         25          2.900...e-05  1.160...e-06
org-bullets--fontify-buffer                                        25          2.800...e-05  1.120...e-06
org-element--cache-sync                                            25          2.800...e-05  1.120...e-06
org-file-name-concat                                               25          2.400...e-05  9.600...e-07
org-fold-core-update-optimisation                                  50          2.200...e-05  4.400...e-07
org-element-parse-secondary-string                                 25          2.100...e-05  8.400...e-07
org-element-type                                                   50          2.100...e-05  4.200...e-07
org-reduced-level                                                  25          2.000...e-05  8.000...e-07
org-font-lock-hook                                                 25          2.000...e-05  8.000...e-07
org-fontify-entities                                               25          1.600...e-05  6.400...e-07
org-activate-target-links                                          25          1.300...e-05  5.200...e-07
org--tag-add-to-alist                                              25          1.200...e-05  4.800...e-07
org-font-lock-add-tag-faces                                        25          8e-06         3.2e-07
org-raise-scripts                                                  25          8e-06         3.2e-07
```

## With `org-roam-with-file`
```csv
--test-org-roam-with-file                                          25          0.8115550000  0.0324622000
org-mode                                                           25          0.086655      0.0034662
org-fold-initialize                                                25          0.019463      0.00077852
org-fold-core-initialize                                           25          0.019332      0.0007732799
org-element-cache-reset                                            25          0.018756      0.0007502399
org-element--cache-setup-change-functions                          25          0.0106739999  0.0004269599
org-fold-core-add-folding-spec                                     125         0.0099649999  7.971...e-05
org-persist-register                                               50          0.007637      0.00015274
org-persist--get-collection                                        75          0.0071099999  9.479...e-05
org-fold-core--property-symbol-get-create                          1125        0.0067040000  5.959...e-06
org-persist--normalize-associated                                  100         0.0060490000  6.049...e-05
org-install-agenda-files-menu                                      25          0.006003      0.00024012
org-macro-initialize-templates                                     25          0.0052360000  0.0002094400
org-persist-load                                                   25          0.005126      0.00020504
org-persist-read                                                   25          0.0050450000  0.0002018000
org-set-regexps-and-options                                        25          0.0040520000  0.0001620800
org-fold-core-set-folding-spec-property                            1150        0.0019309999  1.679...e-06
org-collect-keywords                                               50          0.0018579999  3.715...e-05
org--collect-keywords-1                                            50          0.0015129999  3.025...e-05
org-macro--collect-macros                                          25          0.0012129999  4.851...e-05
org-element--cache-persist-before-read                             50          0.0010940000  2.188...e-05
org-set-font-lock-defaults                                         25          0.0010510000  4.204...e-05
org-make-options-regexp                                            50          0.001026      2.052e-05
org-fold-core-get-folding-spec-from-alias                          2250        0.0009360000  4.160...e-07
org-setup-filling                                                  25          0.0006090000  2.436...e-05
org-persist--find-index                                            100         0.0005649999  5.649...e-06
org--set-faces-extend                                              50          0.0005269999  1.053...e-05
org-element--cache-persist-after-read                              50          0.0004999999  9.999...e-06
org-macro--find-keyword-value                                      100         0.0004210000  4.210...e-06
org-persist--normalize-container                                   300         0.0003450000  1.150...e-06
org-persist-load:elisp                                             50          0.000299      5.98e-06
org-extract-log-state-settings                                     225         0.0002910000  1.293...e-06
org-cite-try-load-processor                                        25          0.0002879999  1.151...e-05
org-macro--find-date                                               25          0.0002729999  1.091...e-05
org-cite-get-processor                                             25          0.0002250000  9.000...e-06
org-find-invisible-foreground                                      25          0.0001990000  7.960...e-06
org-update-radio-target-regexp                                     25          0.0001470000  5.880...e-06
org-delete-all                                                     50          0.0001369999  2.739...e-06
org-remove-keyword-keys                                            50          8.599...e-05  1.719...e-06
org-setup-comments-handling                                        25          7.800...e-05  3.120...e-06
org-macro--counter-initialize                                      25          7.800...e-05  3.120...e-06
org-transclusion-font-lock-set                                     25          7.7e-05       3.08e-06
org-fold-core--isearch-setup                                       25          5.7e-05       2.28e-06
org-compute-latex-and-related-regexp                               25          4.800...e-05  1.920...e-06
org-assign-fast-keys                                               25          4.500...e-05  1.800...e-06
org-macro--set-templates                                           25          4.5e-05       1.800...e-06
org-load-modules-maybe                                             25          4.300...e-05  1.720...e-06
org-tag-alist-to-groups                                            25          3.700...e-05  1.480...e-06
org-agenda-files                                                   25          3.100...e-05  1.240...e-06
org-element-restriction                                            25          2.700...e-05  1.080...e-06
org-file-name-concat                                               25          2.600...e-05  1.040...e-06
org-element-parse-secondary-string                                 25          2.400...e-05  9.600...e-07
org--tag-add-to-alist                                              25          1.400...e-05  5.600...e-07
```

## With `with-plain-file`
```csv
--test-with-plain-file                                             25          0.6089500000  0.0243580000
```
