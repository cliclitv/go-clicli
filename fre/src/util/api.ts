import { get, post } from './post'

export function getPost(type, tag, page, pageSize, status?, uid?) {
  return get(`https://www.clicli.cc/posts?status=${status || 'public'}&sort=${type}&tag=${tag}&uid=${uid || ''}&page=${page}&pageSize=${pageSize}`)
}

export function getPostB(type, tag, page, pageSize, status?, uid?) {
  return get(`https://www.clicli.cc/posts?status=${status}&sort=${type}&tag=${tag}&uid=${uid || ''}&page=${page}&pageSize=${pageSize}`)
}

export function getRank() {
  return get('https://www.clicli.cc/rank')
}

export function getPostDetail(pid) {
  return get(`https://www.clicli.cc/post/${pid}`)
}

export function getPlayUrl(url) {
  return get(`https://www.clicli.cc/play?url=${url}`)
}

export function getPv(pid) {
  return get(`https://www.clicli.cc/pv/${pid}`)
}

export function getSearch(key) {
  return get(`https://www.clicli.cc/search/posts?key=${key}`)
}

function replaceContent(c) {
  return c.replace(/vip.ffzyread.com/g, 'cdn2.deno.dev/read/2000')
  .replace(/vip.ffzyread1.com/g, 'cdn2.deno.dev/read1/2000')
  .replace(/vip.ffzy-play2.com/g, 'cdn2.deno.dev/2/2000')
  .replace(/vip.ffzy-play3.com/g, 'cdn2.deno.dev/3/2000')
  .replace(/vip.ffzy-play4.com/g, 'cdn2.deno.dev/4/2000')
  .replace(/vip.ffzy-play5.com/g, 'cdn2.deno.dev/5/2000')
  .replace(/vip.ffzy-play6.com/g, 'cdn2.deno.dev/6/2000')
  .replace(/vip.ffzy-play7.com/g, 'cdn2.deno.dev/7/2000')
  .replace(/vip.ffzy-play8.com/g, 'cdn2.deno.dev/8/2000')
  .replace(/vip.ffzy-play9.com/g, 'cdn2.deno.dev/9/2000')
  .replace(/vip.ffzy-play10.com/g, 'cdn2.deno.dev/4/2000')
  .replace(/vip.ffzy-online1.com/g, 'cdn2.deno.dev/01/2000')
  .replace(/vip.ffzy-online2.com/g, 'cdn2.deno.dev/02/2000')
  .replace(/vip.ffzy-online3.com/g, 'cdn2.deno.dev/03/2000')
  .replace(/vip.ffzy-online4.com/g, 'cdn2.deno.dev/04/2000')
  .replace(/vip.ffzy-online5.com/g, 'cdn2.deno.dev/05/2000')
  .replace(/vip.ffzy-online6.com/g, 'cdn2.deno.dev/06/2000')
  .replace(/vip.ffzy-online7.com/g, 'cdn2.deno.dev/07/2000')
  .replace(/vip.ffzy-online8.com/g, 'cdn2.deno.dev/08/2000')
  .replace(/vip.ffzy-online9.com/g, 'cdn2.deno.dev/09/2000')
  
}

export function addPost({ title, content, status, sort, tag, uid, videos }) {
  videos = replaceContent(videos)
  return post('https://www.clicli.cc/post/add', {
    title,
    content,
    status,
    sort,
    tag,
    uid: getUser().id,
    videos
  })
}

export function getUser() {
  return JSON.parse(window.localStorage.getItem('user'))
}

export function updatePost({ id, title, content, status, sort, tag, uid, time, videos }) {
  videos = replaceContent(videos)
  return post(`https://www.clicli.cc/post/update/${id}`, {
    id,
    title,
    content,
    status,
    sort,
    tag,
    uid,
    time,
    videos
  })
}

export function updateUser({ id, name, pwd, qq, level, hash, sign }) {
  return post(`https://www.clicli.cc/user/update/${id}`, {
    name, pwd, qq, level: parseInt(level), hash, sign
  })
}

export function getUserB({ id, qq, name }) {
  return get(`https://www.clicli.cc/user?uid=${id || ""}&uname=${name || ""}&uqq=${qq || ""}`)
}

export function getDogeToken({ fname, rname }) {
  return get(`https://www.clicli.cc/doge?fname=${fname}&rname=${rname}`)
}

export function getTransfer({ from, to }) {
  return get(`https://www.clicli.cc/eth/transfer?from=${from}&to=${to}`)
}

export function getBal(from) {
  return get(`https://www.clicli.cc/eth/balanceof?from=${from}`)
}

export function pay({ price, order, uid }) {
  return get(`https://www.clicli.cc/vip/pay?price=${price}&order=${order}&uid=${uid}`)
}

export function paycheck(tradeno) {
  return get(`https://www.clicli.cc/vip/paycheck?tradeno=${tradeno}`)
}

export function getArticles(pid) {
  return get(`https://www.clicli.cc/articles?pid=${pid}&page=1&pageSize=200`)
}

export function getArticle(pid) {
  return get(`https://www.clicli.cc/article/${pid}`)
}

export function addArticle({ pid, oid, title, content, bio }) {
  return post(`https://www.clicli.cc/article/add`, {
    pid: parseInt(pid),
    oid: parseInt(oid),
    content,
    title, bio
  })
}

export function updateArticle({ pid, oid, title, content, bio, id }) {
  return post(`https://www.clicli.cc/article/update/${id}`, {
    pid: parseInt(pid),
    oid: parseInt(oid),
    content,
    title, bio
  })
}