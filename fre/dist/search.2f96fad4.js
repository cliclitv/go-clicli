import{l,s as r,Y as s,o as i}from"./index.579af0b6.js";import{L as c}from"./list.4903fa35.js";function h({k:n}){const[t,a]=l([]);r(()=>{i(n).then(e=>{a(e.posts)})},[]);const o={home:"Home",list:"Index"};return s("div",null,s("div",{className:"wrap"},s("nav",null,Object.keys(o).map(e=>s("li",null,s("i",{className:`icon-font icon-${e}`}),o[e]))),s("main",null,s("h1",null,"Search Videos"),s(c,{posts:t}))))}export{h as default};
