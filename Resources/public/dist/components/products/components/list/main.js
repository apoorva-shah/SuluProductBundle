define(function(){"use strict";return{view:!0,fullSize:{width:!0},header:function(){return{title:"pim.products.title",noBack:!0,breadcrumb:[{title:"navigation.pim"},{title:"pim.products.title"}]}},templates:["/admin/productbase/template/product/list"],initialize:function(){this.render()},render:function(){this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/productbase/template/product/list")),this.sandbox.sulu.initListToolbarAndList.call(this,"productsFields","/admin/productbase/api/productbases/fields",{el:this.$find("#list-toolbar-container"),instanceName:"productsToolbar",inHeader:!0,template:[{id:1,icon:"user-add",title:"Add User","class":"highlight-white",disabled:!0},{id:2,icon:"bin",title:"Delete User",disabled:!0},{id:"import",icon:"file-import",title:"Import",group:"2",callback:function(){this.sandbox.emit("sulu.pim.products.import")}.bind(this)},{icon:"file-export",title:"Export",disabled:!0}]},{el:this.sandbox.dom.find("#products-list",this.$el),url:"/admin/productbase/api/productbases?flat=true",editable:!1,validation:!1,addRowTop:!0,progressRow:!0,fullWidth:!0,paginationOptions:{pageSize:4},pagination:!0,selectItem:{type:"checkbox"},removeRow:!1,sortable:!0})}}});