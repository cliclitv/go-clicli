import{o as e,$ as l,A as p,c as r,p as g}from"./index.bc10636e.js";/* empty css              */function h(){const[n,u]=e(""),[o,i]=e("");function a(t){u(t)}function c(t){i(t)}function s(){r("https://api.clicli.cc/user/login",{name:n,pwd:o}).then(t=>{t.code===200?(window.localStorage.setItem("token",t.token),window.localStorage.setItem("user",JSON.stringify(t.user)),g("/")):alert(t.msg)})}return l("div",{class:"login"},l("li",null,l("h1",null,"CliCli.\u767B\u5F55")),l("li",null,l("input",{type:"text",placeholder:"\u6635\u79F0",onInput:t=>a(t.target.value)})),l("li",null,l("input",{type:"text",placeholder:"\u5BC6\u7801",onInput:t=>c(t.target.value)})),l("li",null,l("button",{onClick:s},"\u767B\u5F55")),l("li",null,l(p,{href:"/register"},"\u6CE8\u518C")))}export{h as default};