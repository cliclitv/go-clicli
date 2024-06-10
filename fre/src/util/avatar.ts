import md5 from 'blueimp-md5'
import { getUser } from './api'

export function getAvatar(avatar) {
  if (/^[0-9]+$/.test(avatar)) {
    return `https://q1.qlogo.cn/g?b=qq&nk=${avatar}&s=640`
  } else {
    let hash = md5(avatar)
    return `https://gravatar.aby.pub/avatar/${hash}?s=100`
  }
}

export function getSuo(content) {
  if (!content) return ""
  let m = content.match(/suo(.+?)\)/i)
  return m ? m[1].slice(2) : 'https://cdn-us.imgs.moe/2023/02/27/63fcb180cbb30.jpg'
}

export function removeSuo(content) {
  if (!content) return ""
  let m = content.replace(/suo(.+?)\)/ig,'')
  return m.slice(2)
}

export function getAv(id) {
  console.log(id)
  const [gv, fp] = id.split('#')
  return [gv.substring(2, id.length), fp ? fp.substring(1, fp.length) : 1]
}

export function isMobile() {
  try {
    document.createEvent("TouchEvent"); return true;
  } catch (e) {
    return false;
  }
}

export default function shouldVIP(time) {
  let tt = new Date(time)
  let ttt = tt.getTime()

  return ttt >= Date.now()
}
