(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{105:function(e,t){},107:function(e,t){},141:function(e,t){},142:function(e,t){},16:function(e,t,a){var n=a(15),r=a(22);t.validateData=function(e,t){},t.generalRegister=function(e,t){var a={key:localStorage.getItem(r.csrfTokenNameKey),token:localStorage.getItem(r.csrfTokenName+localStorage.getItem(r.csrfTokenNameKey))};return new Promise(function(l,i){var s=new XMLHttpRequest;s.open("POST","https://xtacy.org/_register/gen/",!0),s.setRequestHeader("Content-Type","application/json"),s.send(JSON.stringify({data:e,csrf:a,checksum:t})),s.onreadystatechange=function(){if(4===s.readyState&&200===s.status){var e=JSON.parse(s.response),t=JSON.stringify({validation:e.validation,rgn:e.rgn}),a=n.createHmac("sha256",r.clientKey).update(t).digest("hex");e.hash===a?l(e):i("HASH_MISMATCH")}}})},t.competeRegister=function(e,t){var a={key:localStorage.getItem(r.csrfTokenNameKey),token:localStorage.getItem(r.csrfTokenName+localStorage.getItem(r.csrfTokenNameKey))};return new Promise(function(l,i){var s=new XMLHttpRequest;s.open("POST","https://xtacy.org/_register/com/",!0),s.setRequestHeader("Content-Type","application/json"),s.send(JSON.stringify({data:e,csrf:a,checksum:t})),s.onreadystatechange=function(){if(4===s.readyState&&200===s.status){var e=JSON.parse(s.response),t=JSON.stringify({validation:e.validation,rgn:e.rgn}),a=n.createHmac("sha256",r.clientKey).update(t).digest("hex");e.hash===a?l(e):i("HASH_MISMATCH")}}})},t.ticketRegister=function(e,t){var a={key:localStorage.getItem(r.csrfTokenNameKey),token:localStorage.getItem(r.csrfTokenName+localStorage.getItem(r.csrfTokenNameKey))};return new Promise(function(l,i){var s=new XMLHttpRequest;s.open("POST","https://xtacy.org/_register/tic/",!0),s.setRequestHeader("Content-Type","application/json"),s.send(JSON.stringify({data:e,csrf:a,checksum:t})),s.onreadystatechange=function(){if(4===s.readyState&&200===s.status){var e=JSON.parse(s.response),t=JSON.stringify({validation:e.validation,rgn:e.rgn}),a=n.createHmac("sha256",r.clientKey).update(t).digest("hex");e.hash===a?l(e):i("HASH_MISMATCH")}}})},t.getEventData=function(e){return new Promise(function(t,a){var n=new XMLHttpRequest;n.open("GET","https://xtacy.org/register/_eventData/"+e+"/",!0),n.send(),n.onreadystatechange=function(){if(4===n.readyState&&200===n.status){var e=JSON.parse(n.response);if(e.validation){for(var r=0;r<e.arb;r++)e.data=atob(e.data);e.data=JSON.parse(e.data),t(e)}else a("CSRF_INVALID")}}})},t.calcTaxInclAmount=function(e){return parseFloat((e+3)/.9705).toFixed(2)}},188:function(e,t,a){},190:function(e,t,a){},194:function(e,t,a){},196:function(e,t,a){},216:function(e,t,a){},218:function(e,t,a){},22:function(e){e.exports={csrfTokenName:"_xta_srf-tk:",csrfTokenNameKey:"_tk_nmk-del",clientKey:"29e08c47ff8a12ad6885fcb1ca99568b0016c541c5657c7956b0a4159fc3c4f1",hashToken:"x_sh_09a",firebase:{apiKey:"AIzaSyAd17pI-aG3Mx8x_HXNz4lQ7VWRWnSgy4E",authDomain:"xtacy-org.firebaseapp.com",databaseURL:"https://xtacy-org.firebaseio.com",projectId:"xtacy-org",storageBucket:"xtacy-org.appspot.com",messagingSenderId:"625260114530"}}},220:function(e,t,a){},223:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(39),i=a.n(l),s=a(5),c=a(6),o=a(8),m=a(7),u=a(9),d=a(15),p=a.n(d),h=a(225),g=a(227),f=a(226),E=(a(188),function(e){function t(){return Object(s.a)(this,t),Object(o.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("header",null,r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"logo"},r.a.createElement("div",{className:"logo-rotor"},r.a.createElement("div",{className:"rotary"})),r.a.createElement("p",{className:"logo-text"},"xtacy")),r.a.createElement("input",{type:"checkbox",id:"sidebar-toggle",hidden:!0}),r.a.createElement("label",{htmlFor:"sidebar-toggle",className:"hamburger"},r.a.createElement("span",null)),r.a.createElement("div",{className:"sidebar"},r.a.createElement("nav",{className:"sidebar-nav"},r.a.createElement("ul",null,r.a.createElement("li",null,r.a.createElement("a",{href:"/"},"home")),r.a.createElement("li",null,r.a.createElement("a",{href:"/about"},"about")),r.a.createElement("li",null,r.a.createElement("a",{href:"/events"},"events")),r.a.createElement("li",null,r.a.createElement("a",{href:"/contact"},"contact")),r.a.createElement("li",null,r.a.createElement("a",{href:"/register"},"register")))),r.a.createElement("div",{className:"accent"})),r.a.createElement("div",{className:"sidebar-shadow",id:"sidebar-shadow"}),r.a.createElement("nav",{className:"desktop-nav"},r.a.createElement("ul",null,r.a.createElement("li",null,r.a.createElement("a",{href:"/"},"home")),r.a.createElement("li",null,r.a.createElement("a",{href:"/about"},"about")),r.a.createElement("li",null,r.a.createElement("a",{href:"/events"},"events")),r.a.createElement("li",null,r.a.createElement("a",{href:"/contact"},"contact")),r.a.createElement("li",{className:"highlight"},r.a.createElement("a",{href:"/register",className:"highlight"},"register"))))))}}]),t}(n.Component)),v=(a(190),function(e){function t(){return Object(s.a)(this,t),Object(o.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("footer",null,r.a.createElement("div",{className:"base container"},r.a.createElement("div",{className:"collab"},r.a.createElement("div",null,r.a.createElement("span",{className:"base-title"},"xtacy"),r.a.createElement("br",null),"The annual techno-cultural extravaganza organized by Faculty of Engineering, Jamia Millia Islamia"),r.a.createElement("div",{className:"collab-imgs"},r.a.createElement("img",{src:"https://xtacy.org/static/img/collaborators.png",alt:""}))),r.a.createElement("p",{className:"dev"},"Developed with ",r.a.createElement("span",{role:"img","aria-label":"love"},"\ud83d\udc9b")," by NAMAK")))}}]),t}(n.Component)),y=a(55),b=a.n(y),N=(a(23),a(16)),S=a.n(N),T=(a(194),a(196),function(e){function t(){return Object(s.a)(this,t),Object(o.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"loading"},r.a.createElement("div",{className:"loading-rotary"},r.a.createElement("div",{className:"rotary"})),r.a.createElement("p",{className:"loading-x"},"x"))}}]),t}(n.Component)),x=(a(54),function(e){return r.a.createElement("div",{className:"SuccessPage"},r.a.createElement("div",{className:"container fit"},r.a.createElement(T,null),r.a.createElement("h3",null,"Success!"),r.a.createElement("div",null,r.a.createElement("b",null,"Your registration was successful"),r.a.createElement("br",null),r.a.createElement("br",null),"Your registration number is",r.a.createElement("div",{className:"rgn"},e.rgn),r.a.createElement("br",null),r.a.createElement("p",{className:"center"},"We have sent a confirmation message on the email you entered. If you don't recieve it in the next few minutes, please contact us at ",r.a.createElement("a",{href:"mailto:support@xtacy.org"},"support@xtacy.org")),r.a.createElement("span",null,r.a.createElement("a",{href:"/terms"},"Terms")," | ",r.a.createElement("a",{href:"/"},"Home")))))}),O=a(22),k=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(o.a)(this,Object(m.a)(t).call(this))).handleChange=function(t){var a=null,n=!0,r=e.state.data;""!==t.target.value&&(a=t.target.value),r[t.target.id]=a;var l=!0,i=!1,s=void 0;try{for(var c,o=e.state.required[Symbol.iterator]();!(l=(c=o.next()).done);l=!0){var m=c.value;(null===e.state.data[m]||t.target.id===m&&null===a)&&(n=!1)}}catch(u){i=!0,s=u}finally{try{l||null==o.return||o.return()}finally{if(i)throw s}}e.setState({requiredFulfilled:n,data:r})},e.action=function(){if(e.state.requiredFulfilled){var t=JSON.stringify(e.state.data),a=p.a.createHmac("sha256",O.clientKey).update(t).digest("hex");S.a.generalRegister(e.state.data,a).then(function(t){t.validation&&e.setState({completion:!0,rgn:t.rgn})}).catch(function(){alert("Error")})}else alert("Please fill in the required fields")},e.state={requiredFulfilled:!1,completion:!1,data:{regName:null,regEmail:null,regPhone:null,regInst:null},required:["regName","regEmail","regPhone"]},e}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("div",null,this.state.completion?r.a.createElement(x,{rgn:this.state.rgn}):r.a.createElement("div",{className:"Register container fit"},r.a.createElement("div",{className:"fluff"},r.a.createElement("h2",null,"Registration"),r.a.createElement("p",null,"Fill in the form and click register. You will recieve a confirmation email after a successful registration.")),r.a.createElement("div",{className:"form"},r.a.createElement("div",{className:"container fit"},r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regName",placeholder:"Name"}),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regEmail",placeholder:"Email"}),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regPhone",placeholder:"Phone"}),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regInst",placeholder:"Institution (Optional)"}),r.a.createElement("button",{className:"button solid",id:"reg",onClick:this.action.bind(this)},"REGISTER")))))}}]),t}(n.Component),C=function(){var e=localStorage.getItem("payment-error-code");localStorage.removeItem("payment-error-code");var t="This page isn't working.";switch(e){case"CSRF_TIMEOUT":t="The page timed out.";break;case"SERVER_ERROR":t="There was a server error.";break;case"PORTAL_ERROR":t="The payment service may be down.";break;case"RESPONSE_HASH_MISMATCH":t="The payment couldn't be verified."}return r.a.createElement("section",{className:"ErrorPage"},r.a.createElement("div",{className:"container"},r.a.createElement(T,null),r.a.createElement("h3",null,"that doesn't",r.a.createElement("br",null),"look right"),r.a.createElement("p",{className:"center"},r.a.createElement("b",null,t),r.a.createElement("br",null),r.a.createElement("br",null),"Try to reload the page or go back. If the issue persists, tell us about it at ",r.a.createElement("a",{href:"mailto:support@xtacy.org"},"support@xtacy.org"))))},I=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(o.a)(this,Object(m.a)(t).call(this))).Timer=function(){return e._isMounted&&e.setState({timeOut:!0})},e._isMounted=!1,e.state={timeOut:!1},e}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this._isMounted=!0,setTimeout(this.Timer,this.props.timeOut)}},{key:"componentWillUnmount",value:function(){this._isMounted=!1}},{key:"render",value:function(){return r.a.createElement("div",null,this.state.timeOut?r.a.createElement(C,null):r.a.createElement("div",{className:"LoadingPage"},r.a.createElement("div",{className:"container"},r.a.createElement(T,null),r.a.createElement("p",{className:"center"}," loading "))))}}]),t}(n.Component),R=a(96),D=a.n(R),j=a(22),_=function(e){function t(e){var a;return Object(s.a)(this,t),(a=Object(o.a)(this,Object(m.a)(t).call(this,e))).state={paypal:null,showButton:!1},window.React=r.a,window.ReactDOM=i.a,a}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){if(window.paypal){var e=this.props,t=e.isScriptLoaded,a=e.isScriptLoadSucceed;t&&a&&this.setState({showButton:!0,paypal:window.paypal})}}},{key:"componentWillReceiveProps",value:function(e){var t=e.isScriptLoaded,a=e.isScriptLoadSucceed;!this.state.showButton&&!this.props.isScriptLoaded&&t&&a&&this.setState({showButton:!0,paypal:window.paypal})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,this.state.showButton?r.a.createElement(this.state.paypal.Button.react,{style:{label:"buynow",layout:"vertical",size:"responsive",shape:"rect",color:"blue",branding:!0},funding:{allowed:[this.state.paypal.FUNDING.CARD,this.state.paypal.FUNDING.CREDIT]},env:this.props.env,clientId:this.props.clientId,commit:!0,payment:function(){return e.props.authorizedPayment},onAuthorize:function(t,a){var n={paymentID:e.props.authorizedPayment,payerID:"",txnID:e.props.txnid},r=JSON.stringify(n),l=p.a.createHmac("sha256",j.clientKey).update(r).digest("hex"),i=new XMLHttpRequest;i.open("POST","https://xtacy.org/_payment/execute/",!0),i.setRequestHeader("Content-Type","application/json"),i.send(JSON.stringify({data:n,csrf:{key:localStorage.getItem(j.csrfTokenNameKey),token:localStorage.getItem(j.csrfTokenName+localStorage.getItem(j.csrfTokenNameKey))},checksum:l})),i.onreadystatechange=function(){if(4===i.readyState&&200===i.status){var a=JSON.parse(atob(JSON.parse(i.response).data)),n=p.a.createHmac("sha256",j.clientKey).update(JSON.stringify(a.payment)).digest("hex");a.hash===n?e.props.onSuccess({paid:!0,cancelled:!1,paymentData:t}):e.paymentError("RESPONSE_HASH_MISMATCH")}}},onCancel:this.props.onCancel,onError:this.props.onError}):r.a.createElement(T,null))}}]),t}(n.Component),P=D()("https://www.paypalobjects.com/api/checkout.js")(_),w=(a(93),a(216),a(22)),M=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(o.a)(this,Object(m.a)(t).call(this))).paymentSuccesful=function(t){console.log("PAYMENT_SUCCESSFUL"),e.props.success(t)},e.paymentCancelled=function(){console.log("PAYMENT_CANCELLED"),e.props.back()},e.paymentError=function(t){console.error("PAYMENT_FAILED",t),localStorage.setItem("payment-error-code",t),e.setState({paymentAuthorized:!1})},e.state={paymentAuthorized:!1,CLIENT:null,txnID:null,paymentId:null,amount:null,data:null,required:[]},e}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.amount,a=S.a.calcTaxInclAmount(this.props.amount),n={amount:{base:t,tax:(a-t).toFixed(2),total:a},payer:{name:this.props.name,email:this.props.email,phone:this.props.phone},eventData:{eventDescription:this.props.info}},r=JSON.stringify(n),l=p.a.createHmac("sha256",w.clientKey).update(r).digest("hex"),i=new XMLHttpRequest;i.open("POST","https://xtacy.org/_payment/authorize/",!0),i.setRequestHeader("Content-Type","application/json"),i.send(JSON.stringify({data:n,csrf:{key:localStorage.getItem(w.csrfTokenNameKey),token:localStorage.getItem(w.csrfTokenName+localStorage.getItem(w.csrfTokenNameKey))},checksum:l})),i.onreadystatechange=function(){if(4===i.readyState&&200===i.status){var n=JSON.parse(atob(JSON.parse(i.response).data)),r=p.a.createHmac("sha256",w.clientKey).update(JSON.stringify(n.payment)).digest("hex");n.hash===r?e.setState({amount:{base:t,total:a},paymentId:n.payment.id,txnID:n.txnID,CLIENT:n.client,data:e.props.data,paymentAuthorized:!0}):e.paymentError("RESPONSE_HASH_MISMATCH")}else 4===i.readyState&&403===i.status?e.paymentError("CSRF_TIMEOUT"):4===i.readyState&&500===i.status&&e.paymentError("SERVER_ERROR")}}},{key:"render",value:function(){var e=this,t=this.state.CLIENT;return r.a.createElement("div",{className:"Payments container fit"},this.state.paymentAuthorized?r.a.createElement("div",null,r.a.createElement("h2",null,"Payments Page"),r.a.createElement("div",{className:"action container fit"},r.a.createElement("button",{className:"button",onClick:this.props.back.bind(this)},"BACK")),r.a.createElement("div",{className:"pricing"},r.a.createElement("p",null,"Total"),r.a.createElement("h3",null,"\u20b9 "+S.a.calcTaxInclAmount(this.props.amount)),r.a.createElement("p",{id:"tax"},r.a.createElement("i",null,"Incl. of 18% GST and 2.5% fees"))),r.a.createElement(P,{env:"sandbox",clientId:t,authorizedPayment:this.state.paymentId,payerId:this.state.txnID,onSuccess:this.paymentSuccesful,onCancel:this.paymentCancelled,onError:function(){return e.paymentError("PORTAL_ERROR")}})):r.a.createElement(I,{timeOut:5e3}))}}]),t}(n.Component),A=(a(218),a(22)),H=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(o.a)(this,Object(m.a)(t).call(this))).handleChange=function(t){var a=null,n=!0,r=e.state.data;""!==t.target.value&&(a=t.target.value),r[t.target.id]=a;var l=!0,i=!1,s=void 0;try{for(var c,o=e.state.required[Symbol.iterator]();!(l=(c=o.next()).done);l=!0){var m=c.value;(null===e.state.data[m]||t.target.id===m&&null===a)&&(n=!1)}}catch(u){i=!0,s=u}finally{try{l||null==o.return||o.return()}finally{if(i)throw s}}e.setState({requiredFulfilled:n,data:r})},e.handleTierChange=function(t){var a=e.state.data,n=e.props.eventData.metadata.price[t.target.value];switch(a.amount=n*a.number,t.target.value){case"0":a.tier="Budget";break;case"1":a.tier="Standard";break;case"2":a.tier="Premium"}e.setState({tierPricing:n,data:a})},e.handleSizeChange=function(t){var a=e.state.data;"incr"===t&&4!==a.number?a.number++:"decr"===t&&1!==a.number&&a.number--;var n=e.state.tierPricing*a.number;a.amount=n,e.setState({data:a})},e.action=function(){e.state.requiredFulfilled?e.setState({paymentReady:!0}):alert("Please fill in the required fields")},e.success=function(t){var a=JSON.stringify(e.state.data),n=crypto.createHmac("sha256",A.clientKey).update(a).digest("hex");S.a.ticketRegister(e.state.data,n).then(function(t){t.validation&&e.setState({paymentReady:!0,completion:!0,rgn:t.rgn})}).catch(function(){alert("Error")})},e.state={requiredFulfilled:!1,completion:!1,tierPricing:null,data:{eventId:null,regName:null,regEmail:null,regPhone:null,specialRequests:null,tier:null,number:0,amount:0},required:["regName","regEmail","regPhone"]},e}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e,t=this.state.data;t.eventId=this.props.eventData.eventId,"number"===typeof this.props.eventData.metadata.price?e=this.props.eventData.metadata.price:"object"===typeof this.props.eventData.metadata.price&&(e=this.props.eventData.metadata.price[1]),t.number=1,t.tier="Standard",t.amount=e*t.number,this.setState({tierPricing:e,data:t})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,this.state.paymentReady?this.state.completion?r.a.createElement(x,{rgn:this.state.rgn}):r.a.createElement(M,{name:this.state.data.regName,email:this.state.data.regEmail,phone:this.state.data.regPhone,amount:this.state.data.amount,data:this.props.eventData,back:function(){return e.setState({paymentReady:!1})},success:this.success}):r.a.createElement("div",{className:"Tickets container fit"},r.a.createElement("div",{className:"Details"},r.a.createElement("div",{className:"fluff"},r.a.createElement("p",null,r.a.createElement("i",null,"Events")),r.a.createElement("h2",null,this.props.eventData.title),r.a.createElement("p",null,"Fill in the form and click proceed. You will recieve a confirmation email after a successful booking.")),r.a.createElement("div",{className:"form"},r.a.createElement("div",{className:"container fit"},r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regName",placeholder:"Name"}),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regEmail",placeholder:"Email"}),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regPhone",placeholder:"Phone"}),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regInst",placeholder:"Institution (Optional)"})))),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("h3",null,r.a.createElement("span",{className:"highlight"},"Book Tickets")),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("div",{className:"Seats"},"object"===typeof this.props.eventData.metadata.price?r.a.createElement("div",{className:"display container"},r.a.createElement("img",{src:"https://xtacy.org/static/img/seatingTiers.png",alt:"seating"})):console.log(),r.a.createElement("div",{className:"controls container"},"object"===typeof this.props.eventData.metadata.price?r.a.createElement("div",{className:"tiers"},r.a.createElement("p",null,"Select a Teir"),r.a.createElement("select",{className:"dropdown",defaultValue:1,onChange:this.handleTierChange,passive:"true"},r.a.createElement("option",{value:0},"Budget"),r.a.createElement("option",{value:1},"Standard"),r.a.createElement("option",{value:2},"Premium"))):console.log(),r.a.createElement("div",{className:"selector"},r.a.createElement("p",null,"Select a Number"),r.a.createElement("div",{className:"number"},r.a.createElement("h3",{className:"actual-number"},this.state.data.number+" "+(this.state.data.number>1?"Tickets":"Ticket")),r.a.createElement("div",{className:"buttons"},r.a.createElement("label",{id:"decr",onClick:function(){e.handleSizeChange("decr")}},"-"),r.a.createElement("label",{id:"incr",onClick:function(){e.handleSizeChange("incr")}},"+")))),r.a.createElement("div",{className:"pricing"},r.a.createElement("p",{id:"trP"},"\u20b9 "+this.state.tierPricing+" per ticket"),r.a.createElement("p",{id:"tax"},r.a.createElement("i",null,"Incl. of 18% GST and 2.5% fees")),r.a.createElement("h3",null,"Total \u20b9 "+S.a.calcTaxInclAmount(this.state.data.amount))),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"specialRequests",placeholder:"Special Requests (if any)"}))),r.a.createElement("button",{className:"button solid",id:"reg",onClick:this.action.bind(this)},"PROCEED")))}}]),t}(n.Component),K=(a(220),a(22)),q=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(o.a)(this,Object(m.a)(t).call(this))).handleChange=function(t){var a=null,n=!0,r=e.state.data;if(""!==t.target.value&&(a=t.target.value),t.target.id.includes("/")){var l=t.target.id.split("/")[1],i=t.target.id.split("/")[0].split("#")[1];r.members[i][l]=a}else r[t.target.id]=a;var s=!0,c=!1,o=void 0;try{for(var m,u=e.state.required[Symbol.iterator]();!(s=(m=u.next()).done);s=!0){var d=m.value;if(d.includes("/")){d=d.split("/");var p=!0,h=!1,g=void 0;try{for(var f,E=e.state.data.members[Symbol.iterator]();!(p=(f=E.next()).done);p=!0){(null===f.value[d[1]]||t.target.id.split("/")[1]===d[1]&&null===a)&&(n=!1)}}catch(v){h=!0,g=v}finally{try{p||null==E.return||E.return()}finally{if(h)throw g}}}else(null===e.state.data[d]||t.target.id===d&&null===a)&&(n=!1)}}catch(v){c=!0,o=v}finally{try{s||null==u.return||u.return()}finally{if(c)throw o}}e.setState({requiredFulfilled:n,data:r})},e.action=function(){e.state.requiredFulfilled?e.props.eventData.metadata.paid?e.setState({paymentReady:!0}):e.success(null):alert("Please fill in the required fields")},e.success=function(t){var a=JSON.stringify(e.state.data),n=p.a.createHmac("sha256",K.clientKey).update(a).digest("hex");S.a.competeRegister(e.state.data,n,t).then(function(t){t.validation&&e.setState({paymentReady:!0,completion:!0,rgn:t.rgn})}).catch(function(){alert("Error")})},e.state={paymentReady:!1,requiredFulfilled:!1,completion:!1,data:{eventId:null,regTeamName:null,regTeamEmail:null,regTeamPhone:null,regTeamInst:null,amount:null,members:[]},required:["regTeamName","regTeamEmail","regTeamPhone"]},e}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e,t=this.state.data;if(t.eventId=this.props.eventData.eventId,this.props.eventData.metadata.collectTeamGit&&(t.regTeamGit=null),"strict"===this.props.eventData.metadata.teamSizeType){for(var a=0;a<this.props.eventData.metadata.teamSize;a++)t.members.push({index:a,name:null,email:null});e=["regTeamName","regTeamEmail","regTeamPhone","members/name","members/email"]}else"loose"===this.props.eventData.metadata.teamSizeType&&(e=["regTeamName","regTeamEmail","regTeamPhone","regTeamLeader","regTeamSize"]);t.amount=this.props.eventData.metadata.price,this.setState({data:t,required:e})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,this.state.paymentReady?this.props.eventData.metadata.paid?r.a.createElement(M,{name:this.state.data.regTeamName,email:this.state.data.regTeamEmail,phone:this.state.data.regTeamPhone,amount:this.state.data.amount,data:this.props.eventData,back:function(){return e.setState({paymentReady:!1})},success:this.success}):this.state.completion?r.a.createElement(x,{rgn:this.state.rgn}):console.log():r.a.createElement("div",{className:"Compete container fit"},r.a.createElement("div",{className:"Team"},r.a.createElement("div",{className:"fluff"},r.a.createElement("p",null,r.a.createElement("i",null,"Competitions")),r.a.createElement("h2",null,this.props.eventData.title),r.a.createElement("p",null,"Fill in the form and click register. You will recieve a confirmation email after a successful registration.")),r.a.createElement("div",{className:"form"},r.a.createElement("div",{className:"container fit"},r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regTeamName",placeholder:"Team Name"}),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regTeamEmail",placeholder:"Team Email"}),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regTeamPhone",placeholder:"Phone Number"}),this.props.eventData.metadata.collectTeamGit?r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regTeamGit",placeholder:"Team GitHub (Optional)"}):console.log(),"loose"===this.props.eventData.metadata.teamSizeType?r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regTeamLeader",placeholder:"Team Leader Name"}):console.log(),"loose"===this.props.eventData.metadata.teamSizeType?r.a.createElement("input",{type:"number",className:"textbox",onChange:this.handleChange,id:"regTeamSize",placeholder:"Team Size",max:this.props.eventData.metadata.teamSize,min:0}):console.log(),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.handleChange,id:"regTeamInst",placeholder:"Team Institution (Optional)"})))),"strict"===this.props.eventData.metadata.teamSizeType?r.a.createElement("div",null,r.a.createElement("h3",null,r.a.createElement("span",{className:"highlight"},"Team Member Details")),r.a.createElement("div",{className:"MemberData"},this.state.data.members.map(function(t,a){return r.a.createElement(L,{key:a,index:a,handleChange:e.handleChange})}))):console.log(),this.props.eventData.metadata.paid?r.a.createElement("div",{className:"pricing"},r.a.createElement("h3",null,"Total: \u20b9 "+S.a.calcTaxInclAmount(this.state.data.amount)),r.a.createElement("p",{id:"tax"},r.a.createElement("i",null,"Incl. of 18% GST and 2.5% fees")),r.a.createElement("button",{className:"button solid",id:"reg",onClick:this.action.bind(this)},"PROCEED")):r.a.createElement("button",{className:"button solid",id:"reg",onClick:this.action.bind(this)},"REGISTER")))}}]),t}(n.Component),L=function(e){function t(){return Object(s.a)(this,t),Object(o.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props.index;return r.a.createElement("div",{className:"Member container fit"},r.a.createElement("h3",{className:"title"},"Team Member ",e+1,0===e?r.a.createElement("span",{className:"team-leader-text"},r.a.createElement("span",null),"TEAM LEADER",r.a.createElement("span",null)):console.log()),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.props.handleChange,id:"mem#"+e+"/name",placeholder:"Name"}),r.a.createElement("input",{type:"text",className:"textbox",onChange:this.props.handleChange,id:"mem#"+e+"/email",placeholder:"Email"}))}}]),t}(n.Component),J=q,z=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(o.a)(this,Object(m.a)(t).call(this))).state={intent:null,event:null,eventData:null,loaded:!1},e}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;"gen"!==this.props.intent?S.a.getEventData(this.props.event).then(function(t){e.setState({intent:e.props.intent,event:e.props.event,eventData:t.data,loaded:!0})}).catch(function(e){console.log(e)}):this.setState({intent:this.props.intent,loaded:!0})}},{key:"render",value:function(){return r.a.createElement("div",{className:"Main"},this.state.loaded?"gen"!==this.state.intent?this.state.eventData.published?"com"!==this.state.intent?"tic"!==this.state.intent?r.a.createElement(C,null):r.a.createElement(H,{eventData:this.state.eventData}):r.a.createElement(J,{eventData:this.state.eventData}):r.a.createElement("div",{className:"container"},r.a.createElement(T,null),r.a.createElement("h2",null,"Not Published"),r.a.createElement("p",null,"Registrations are disabled for this event")):r.a.createElement(k,{eventData:this.state.eventData}):r.a.createElement(I,{timeOut:2500}))}}]),t}(n.Component),F=a(22),G=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(o.a)(this,Object(m.a)(t).call(this))).getParams=function(e){var t=new URLSearchParams(e.search);return{intent:t.get("int"),event:t.get("evt"),ref:t.get("ref")}},e.state={intent:null,event:null,hash:null,ref:null,verified:!1},e}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){var e=this;b.a.validateToken().then(function(t){if("CSR_TOKEN_VALID"===t||"CSR_TOKEN_GEN"===t||"CSR_TOKEN_GEN"===t||"CSR_TOKEN_RENEW"===t||"CSR_TIME_VALID"===t){console.log("SR Tokens Verified"),b.a.generateSecurityFluff(4);var a=e.getParams(window.location),n=!1;"gen"===a.intent&&(a.event="any");var r=a.intent+F.clientKey+a.event,l=p.a.createHash("sha256").update(r).digest("hex");sessionStorage.getItem(F.hashToken)===l&&(n=!0),e.setState({intent:a.intent,event:a.event,hash:l,ref:a.ref,verified:n})}}).catch(function(e){console.error(e)})}},{key:"render",value:function(){return r.a.createElement("div",{className:"Bookings"},r.a.createElement(E,null),this.state.verified?r.a.createElement("section",null,r.a.createElement(h.a,{basename:"/register"},r.a.createElement(g.a,null,r.a.createElement(f.a,{path:"/main"},r.a.createElement(z,{intent:this.state.intent,event:this.state.event})),r.a.createElement(f.a,{path:"/success",component:x}),r.a.createElement(f.a,{path:"/cancel",component:C}),r.a.createElement(f.a,{component:C})))):r.a.createElement(I,{timeOut:2500}),r.a.createElement(v,null))}}]),t}(n.Component);i.a.render(r.a.createElement(G,null),document.getElementById("root"))},23:function(e,t,a){},54:function(e,t,a){},55:function(e,t,a){var n=a(22);t.validateToken=function(){return new Promise(function(e,t){if(void 0!==localStorage.getItem("x-sr-vtime")&&(new Date).getTime()-localStorage.getItem("x-sr-vtime")<3e5)e("CSR_TIME_VALID");else{var a=new XMLHttpRequest;a.open("POST","http://xtacy.org/_secu/csrtoken/",!0),a.setRequestHeader("Content-Type","application/json");var r=localStorage.getItem(n.csrfTokenNameKey),l=localStorage.getItem(n.csrfTokenName+r);if(null===r){var i=localStorage.getItem(n.csrfTokenNameKey);localStorage.removeItem(n.csrfTokenNameKey),localStorage.removeItem(n.csrfTokenName+i),t("CSR_TOKEN_INVALID")}else a.send(JSON.stringify({key:r,token:l}));a.onreadystatechange=function(){if(4===a.readyState&&200===a.status){var i=JSON.parse(a.response);if(!0===i.status)localStorage.setItem("x-sr-vtime",(new Date).getTime()),e("CSR_TOKEN_VALID");else if(!1===i.status)localStorage.removeItem(n.csrfTokenName+r),r=i.key,l=i.token,localStorage.setItem(n.csrfTokenNameKey,r),localStorage.setItem(n.csrfTokenName+r,l),e("CSR_TOKEN_RENEW");else{var s=localStorage.getItem(n.csrfTokenNameKey);localStorage.removeItem(n.csrfTokenNameKey),localStorage.removeItem(n.csrfTokenName+s),t("CSR_TOKEN_INVALID")}}}}})},t.generateSecurityFluff=function(e){for(var t=["_td-xhr","__id","k_0-g01G","_fl_namk-xtc"],a=0;a<e;a++){var n=t[a%4],r="",l=Math.floor(24*Math.random());if(a%2===0)for(var i=0;i<l;i++)r+=Math.floor(36*Math.random()).toString("36");else for(var s=0;s<l;s++)r+=Math.floor(10*Math.random());localStorage.setItem(n,r)}}},93:function(e,t,a){var n=a(203);a(207),a(210),a(212);var r=a(22).firebase;0===n.apps.length&&n.initializeApp(r),t.firebase=n,t.database=n.database(),t.firestore=n.firestore().settings({timestampsInSnapshots:!0})},98:function(e,t,a){e.exports=a(223)}},[[98,2,1]]]);
//# sourceMappingURL=main.78de04ee.chunk.js.map