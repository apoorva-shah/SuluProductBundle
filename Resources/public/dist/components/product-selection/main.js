define(function(){"use strict";var a={options:{eventNamespace:"sulu.product-selection",resultKey:"products",dataAttribute:"product-selection",dataDefault:[],hidePositionElement:!0,hideConfigButton:!0,navigateEvent:"sulu.router.navigate",translations:{noContentSelected:"product-selection.no-product-selected"}},templates:{data:['<div class="grid">','   <div class="grid-row search-row">','       <div class="grid-col-8"/>','       <div class="grid-col-4" id="product-selection-<%= instanceName %>-search"/>',"   </div>",'   <div class="grid-row">','       <div class="grid-col-12" id="product-selection-<%= instanceName %>-list"/>',"   </div>","</div>"].join(""),contentItem:['<a href="#" class="link" data-id="<%= id %>">','   <span class="value"><%= name %></span>','   <span class="value"><%= number %></span>',"</a>"].join("")},translations:{name:"product.name",overlayTitle:"product.content-type.headline",number:"product.number",id:"public.id"}},b=function(){this.sandbox.on("husky.overlay.product-selection."+this.options.instanceName+".add.initialized",c.bind(this)),this.sandbox.on("husky.overlay.product-selection."+this.options.instanceName+".add.opened",d.bind(this)),this.sandbox.dom.on(this.$el,"click",function(a){var b=this.sandbox.dom.data(a.currentTarget,"id"),c="pim/products/edit:"+b;return this.sandbox.emit(this.options.navigateEvent,c),!1}.bind(this),"a.link"),this.sandbox.on("husky.datagrid.product.view.rendered",function(){this.sandbox.emit("husky.overlay.product-selection."+this.options.instanceName+".add.set-position")}.bind(this))},c=function(){this.sandbox.start([{name:"search@husky",options:{appearance:"white small",instanceName:this.options.instanceName+"-product-search",el:"#product-selection-"+this.options.instanceName+"-search"}},{name:"datagrid@husky",options:{el:"#product-selection-"+this.options.instanceName+"-list",instanceName:"product",url:this.options.url,preselected:this.getData()||[],resultKey:this.options.resultKey,sortable:!1,columnOptionsInstanceName:"",clickCallback:function(a){this.sandbox.emit("husky.datagrid.product.toggle.item",a)}.bind(this),selectedCounter:!0,searchInstanceName:this.options.instanceName+"-product-search",searchFields:["name"],paginationOptions:{dropdown:{limit:20}},matchings:[{content:this.translations.id,name:"id",disabled:!0},{content:this.translations.name,name:"name"},{content:this.translations.number,name:"number"}]}}])},d=function(){var a=this.getData()||[];this.sandbox.emit("husky.datagrid.product.selected.update",a)},e=function(){this.sandbox.dom.on(this.$el,"click",function(){return!1}.bind(this),".search-icon"),this.sandbox.dom.on(this.$el,"keydown",function(a){return 13===event.keyCode?(a.preventDefault(),a.stopPropagation(),!1):void 0}.bind(this),".search-input")},f=function(){var a=this.sandbox.dom.createElement("<div/>");this.sandbox.dom.append(this.$el,a),this.sandbox.start([{name:"overlay@husky",options:{triggerEl:this.$addButton,cssClass:"product-content-overlay",el:a,removeOnClose:!1,container:this.$el,instanceName:"product-selection."+this.options.instanceName+".add",skin:"wide",okCallback:g.bind(this),title:this.translations.overlayTitle,data:this.templates.data({instanceName:this.options.instanceName})}}])},g=function(){var a=[],b=this.getData();this.sandbox.emit("husky.datagrid.product.items.get-selected",function(c){this.sandbox.util.foreach(c,function(c){var d=b.indexOf(c);-1!==d?a[d]=c:a.push(c)}.bind(this))}.bind(this));var c,d=Object.keys(a),e=[],f=d.length;for(c=0;f>c;c++)e.push(a[d[c]]);this.setData(e)};return{defaults:a,type:"itembox",initialize:function(){b.call(this),this.render(),f.call(this),e.call(this)},getUrl:function(a){var b=-1===this.options.url.indexOf("?")?"?":"&";return[this.options.url,b,this.options.idsParameter,"=",(a||[]).join(",")].join("")},getItemContent:function(a){return this.templates.contentItem(a)},sortHandler:function(a){this.setData(a,!1)},removeHandler:function(a){for(var b=this.getData(),c=-1,d=b.length;++c<d;)if(a===b[c]){b.splice(c,1);break}this.setData(b,!1)}}});