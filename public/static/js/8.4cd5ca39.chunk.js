(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[8],{44:function(e,t,a){"use strict";var n=a(0),c=a.n(n);a(49);t.a=function(e){return c.a.createElement("div",{className:"card ".concat(e.className),style:e.style},e.children)}},49:function(e,t,a){},62:function(e,t,a){},63:function(e,t,a){},64:function(e,t,a){},72:function(e,t,a){"use strict";a.r(t);var n=a(47),c=a.n(n),r=a(48),s=a(10),l=a(0),i=a.n(l),m=a(50),u=a(15),o=a(51),p=a(8),f=(a(62),function(e){return i.a.createElement("div",{className:"avatar ".concat(e.className),style:e.style},i.a.createElement("img",{src:e.image,alt:e.alt,style:{width:e.width,height:e.width}}))}),h=a(44),d=(a(63),function(e){return i.a.createElement("li",{className:"user-item"},i.a.createElement(h.a,{className:"user-item__content"},i.a.createElement(p.b,{to:"/".concat(e.id,"/places")},i.a.createElement("div",{className:"user-item__image"},i.a.createElement(f,{image:"".concat("https://myplacesbyghosty.herokuapp.com","/").concat(e.image),alt:e.name})),i.a.createElement("div",{className:"user-item__info"},i.a.createElement("h2",null,e.name),i.a.createElement("h3",null,e.placeCount," ",1===e.placeCount?"Place":"Places")))))}),E=(a(64),function(e){return 0===e.items.length?i.a.createElement("div",{className:"center"},i.a.createElement("h2",null,"No users found.")):i.a.createElement("ul",{className:"users-list"},e.items.map((function(e){return i.a.createElement(d,{key:e.id,id:e.id,image:e.image,name:e.name,placeCount:e.places.length})})))});t.default=function(){var e=Object(l.useState)(),t=Object(s.a)(e,2),a=t[0],n=t[1],p=Object(o.a)(),f=p.error,h=p.clearError,d=p.sendRequest,g=p.isLoading;return Object(l.useEffect)((function(){(function(){var e=Object(r.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,d("https://myplacesbyghosty.herokuapp.com/api/users");case 3:t=e.sent,n(t.users),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}})()()}),[d]),i.a.createElement(l.Fragment,null,i.a.createElement(m.a,{error:f,onClear:h}),g&&i.a.createElement("div",{className:"center"},i.a.createElement(u.a,null)),!g&&a&&i.a.createElement(E,{items:a}),";")}}}]);
//# sourceMappingURL=8.4cd5ca39.chunk.js.map