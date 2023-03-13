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

export function addPost({ title, content, status, sort, tag, uid, videos }) {
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

export function pay({price, order, uid}) {
  return get(`https://www.clicli.cc/vip/pay?price=${price}&order=${order}&uid=${uid}`)
}

export function paycheck(tradeno) {
  return get(`https://www.clicli.cc/vip/paycheck?tradeno=${tradeno}`)
}