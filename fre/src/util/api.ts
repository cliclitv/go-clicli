import { get, post } from './post'

export function getPost(type, tag, page, pageSize, status?, uid?) {
  return get(`https://api.clicli.cc/posts?status=${status || 'public'}&sort=${type}&tag=${tag}&uid=${uid || ''}&page=${page}&pageSize=${pageSize}`)
}

export function getRank() {
  return get('https://api.clicli.cc/rank')
}

export function getPostDetail(pid) {
  return get(`https://api.clicli.cc/post/${pid}`)
}

export function getPlayUrl(url) {
  return get(`https://api.clicli.cc/play?url=${url}`)
}

export function getPv(pid) {
  return get(`https://api.clicli.cc/pv/${pid}`)
}

export function getSearch(key) {
  return get(`https://api.clicli.cc/search/posts?key=${key}`)
}

export function addPost({ title, content, status, sort, tag, uid, videos }) {
  return post('https://api.clicli.cc/post/add', {
    title,
    content,
    status,
    sort,
    tag,
    uid,
    videos
  })
}

export function updatePost({ id, title, content, status, sort, tag, uid, time, videos }) {
  return post(`https://api.clicli.cc/post/update/${id}`, { 
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