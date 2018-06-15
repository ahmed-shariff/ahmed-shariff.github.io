---
layout: page
title: Blog
---

{% for post in site.posts %}
  * {{ post.date | date_to_string }} &raquo; [ {{ post.title }} ]({{ post.url }})
	<br/><span style="display:inline-block; width: 20%;"></span><span style="display:inline-block; width: 50%;"><small>{{ post.tagline }}</small></span>
{% endfor %}
