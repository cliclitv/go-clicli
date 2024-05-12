import { useEffect, useState, Fragment } from 'fre'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import { addDanmaku, getDanmakus, getUser } from '../util/api'
import './comment.css'

export default function Danmaku({ post,p }) {
    const [comment, setDanmaku] = useState('')
    const [comments, setDanmakus] = useState([])
    useEffect(() => {

        getDanmakus(post.id, 0).then(res => {
            setDanmakus((res as any).comments || [])
        })

    }, [])

    function submit() {
        if (comment.length < 1) {
            return
        }
        addDanmaku({
            pid: post.id,
            p: 0,
            pos:0,
            color:'#fffff',
            content: comment,
        } as any).then((res: any) => {
            alert(res.msg)
        })

    }
    const user = getUser() || {}
    return <div>
        <div class="comment">
            <div className="comment-input">
                <Avatar uqq={user.qq} uname={user.name} noname={true}></Avatar>
                <input type="text" placeholder="Duang~" onInput={(e) => setDanmaku(e.target.value)} />
                {user.id ? <button onClick={submit}>发送</button> : <button onclick={() => push('/login')}>登录</button>}
            </div>

            <h1>共有{comments ? comments.length : 0}条讨论</h1>


            {comments && comments.map(item => {
                //@ts-ignore
                const time = dayjs(item.time).format('MM-DD-YYYY')
                return <div className="comment-item">
                    <div className="comment-block">
                        <p><a href={`https://www.clicli.cc/comment/delete/${item.id}?token=${window.localStorage.getItem('token')}`} target="_blank"><del>#{item.id}</del></a></p>
                        <p>{item.content}</p>
                        <p>{time}</p>
                    </div>

                </div>
            })}
        </div>
    </div>
}
