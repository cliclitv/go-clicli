import md5 from 'blueimp-md5'
import { getUser } from './api'

export function getAvatar(avatar) {
  if (/^[0-9]+$/.test(avatar)) {
    return `https://q1.qlogo.cn/g?b=qq&nk=${avatar}&s=640`
  } else {
    let hash = md5(avatar)
    return `https://cravatar.cn/avatar/${hash}?d=wavatar`
  }
}

export function getSuo(content) {
  if (!content) return ""
  let m = content.match(/suo(.+?)\)/i)
  return m ? m[1].slice(2) : 'https://image.planet.youku.com/img/100/9/42605/i_1719400142605_ca83ed260c207767fc7f5b695e4fd0ad_b_w400h400.jpg'
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
