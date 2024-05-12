import { useEffect, useState, Fragment } from 'fre'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import { addDanmaku, getDanmakus, getUser } from '../util/api'
import './danmaku.css'

function getTimeStr(time) {
    let h = Math.floor(time / 3600) as any
    let m = Math.floor((time % 3600) / 60) as any
    let s = Math.floor(time % 60) as any
    h = h >= 10 ? h : '0' + h
    m = m >= 10 ? m : '0' + m
    s = s >= 10 ? s : '0' + s
    return h === '00' ? m + ':' + s : h + ':' + m + ':' + s
  }

export default function Danmaku({ post, p, danmakus }) {
    const [danmaku, setDanmaku] = useState('')

    function submit() {
        if (danmaku.length < 1) {
            return
        }
        const video = document.querySelector('e-player').shadowRoot.querySelector('video')
        const data = {
            pid: post.id,
            p,
            pos: Math.floor(video.currentTime),
            color: '#ffffff',
            content: danmaku,
        }
        window.dm.add(data)
        addDanmaku(data as any).then((res: any) => {
            alert(res.msg)
        })

    }
    const user = getUser() || {}
    return <div>
        <div class="danmaku">
            <div className="danmaku-input">
                <Avatar uqq={user.qq} uname={user.name} noname={true}></Avatar>
                <input type="text" placeholder="Duang~" onInput={(e) => setDanmaku(e.target.value)} />
                {user.id ? <button onClick={submit}>发送</button> : <button onclick={() => push('/login')}>登录</button>}
            </div>

            <h1>共有{danmakus ? danmakus.length : 0}条弹幕</h1>


            {danmakus && danmakus.map(item => {
                //@ts-ignore
                const time = dayjs(item.time).format('MM-DD-YYYY')
                //@ts-ignore
                const pos = getTimeStr(item.pos)
                return <div className="danmaku-item">
                    <p>{pos}</p>
                    {/* <p><a href={`https://www.clicli.cc/danmaku/delete/${item.id}?token=${window.localStorage.getItem('token')}`} target="_blank"><del>#{item.id}</del></a></p> */}
                    <p className="danmaku-block">{item.content}</p>
                    <p>{time}</p>
                </div>
            })}
        </div>
    </div>
}
