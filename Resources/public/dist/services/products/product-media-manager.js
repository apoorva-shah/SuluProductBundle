define(["jquery","services/husky/util"],function(a,b){"use strict";var c="/admin/api/products/%s/media",d=function(a,b){var d=c.replace("%s",a);return b&&(d+="/"+b),d};return{save:function(a,c){var e="PUT";return b.save(d(a,c.id),e,c)},"delete":function(a,c){return b.save(d(a,c),"DELETE")}}});