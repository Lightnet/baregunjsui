# jquery

# Information:
 Simple tips and learning for jquery.

```
$('#view').html(html_privatemessage);//not used this way, might leak?
$('#view').empty().append(html_privatemessage);//use this way it clean up handlers
```