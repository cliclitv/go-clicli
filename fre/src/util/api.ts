import { get, post } from './post'

export function getPost(sort, tag, page, pageSize, status?, uid?) {
  return get(`https://www.clicli.cc/posts?status=${status || 'public'}&sort=${sort}&tag=${tag}&uid=${uid || ''}&page=${page}&pageSize=${pageSize}`)
}

export function getPostB(type, tag, page, pageSize, status?, uid?) {
  return get(`https://www.clicli.cc/posts?status=${status}&sort=${type}&tag=${tag}&uid=${uid || ''}&page=${page}&pageSize=${pageSize}`)
}

export function getRank(day) {
  return get(`https://www.clicli.cc/rank?day=${day}`)
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

function replaceContent(c = '') {
  return c.replace(/tb-binary.cdn.bcebos.com\/TbGame/g, 'bos.nj.bpc.baidu.com/tieba-movideo')
    .replace(/img[0-9].doubanio.com/g, 'doubanimg.deno.dev')
}

export function addPost(data) {
  let videos = replaceContent(data.videos)
  return post('https://www.clicli.cc/post/add', { videos: videos, ...data })
}

export function getUser() {
  return JSON.parse(window.localStorage.getItem('user'))
}


export function addUser(data) {
  return post(`https://www.clicli.cc/user/register`, data)
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

export function getComments(pid, rid, page?, pageSize?) {
  console.log(pid)
  return get(`https://www.clicli.cc/comments?pid=${pid}&rid=${rid}&page=${page || 1}&pageSize=${pageSize || 1000}`)
}

export function addComment({ pid, uid, pos, content, rid = 0, ruid, rstr }) {
  return post('https://www.clicli.cc/comment/add', {
    content,
    pos: pos.toString(),
    uid: getUser().id,
    pid, rid, ruid, rstr
  })
}

export function getDanmakus(pid, p, page?, pageSize?) {
  console.log(pid)
  return get(`https://www.clicli.cc/danmakus?pid=${pid}&p=${p}&page=${page || 1}&pageSize=${pageSize || 1000}`)
}

export function addDanmaku({ pid, p, uid, color, pos, content }) {
  return post('https://www.clicli.cc/danmaku/add', {
    content,
    color,
    p,
    pos,
    uid: getUser().id,
    pid
  })
}


export function getUsers(names) {
  return get(`https://www.clicli.cc/users?names=${names.join(',')}`)
}

export function getGonggao() {
  return get(`https://www.clicli.cc/post/1`)
}