define(function(){"use strict";return{view:!0,templates:["/admin/productbase/template/product/list"],initialize:function(){this.render()},render:function(){this.html(this.renderTemplate("/admin/productbase/template/product/list")),this.sandbox.sulu.initListToolbarAndList.call(this,"productsFields","/admin/productbase/api/products/fields",{el:this.sandbox.dom.find("#list-toolbar-container",this.$el),instanceName:"productsToolbar",template:[{id:1,icon:"user-add",title:"Add User","class":"highlight"},{id:2,icon:"bin",title:"Delete User",group:"1",disabled:!0},{id:"import",icon:"file-import",title:"Import",group:"2",callback:function(){this.sandbox.emit("sulu.pim.products.import")}.bind(this)},{icon:"file-export",title:"Export",group:"2"}]},{el:this.sandbox.dom.find("#products-list",this.$el),url:"/admin/productbase/api/products?flat=true",editable:!1,validation:!1,addRowTop:!0,progressRow:!0,paginationOptions:{pageSize:4},pagination:!0,selectItem:{type:"checkbox"},removeRow:!1,sortable:!0})}}});