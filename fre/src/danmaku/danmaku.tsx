import { useEffect, useState, Fragment } from 'fre'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import { addDanmaku, getDanmakus, getUser } from '../util/api'
import './danmaku.css'

export default function Danmaku({ post, p }) {
    const [danmaku, setDanmaku] = useState('')
    const [danmakus, setDanmakus] = useState([])
    useEffect(() => {

        getDanmakus(post.id, 0).then(res => {
            setDanmakus((res as any).danmakus || [])
        })

    }, [])

    function submit() {
        if (danmaku.length < 1) {
            return
        }
        addDanmaku({
            pid: post.id,
            p,
            pos: 0,
            color: '#fffff',
            content: danmaku,
        } as any).then((res: any) => {
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
                return <div className="danmaku-item">
                    <p><a href={`https://www.clicli.cc/danmaku/delete/${item.id}?token=${window.localStorage.getItem('token')}`} target="_blank"><del>#{item.id}</del></a></p>
                    <p className="danmaku-block">{item.content}</p>
                    <p>{time}</p>

                </div>
            })}
        </div>
    </div>
}
