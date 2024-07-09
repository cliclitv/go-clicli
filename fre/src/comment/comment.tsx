import { useEffect, useState, Fragment } from 'fre'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import { addComment, getdanmakus, getUser } from '../util/api'
import './comment.css'
import Markdown from '../component/md/md'
import { removeSuo } from '../util/avatar'

export default function Comment({ post, danmakus }) {
    const [comment, setComment] = useState('')

    const [pos, setPos] = useState(0)

    function submit() {
        if (comment.length < 1) {
            return
        }
        addComment({
            pid: post.id,
            rid: 0,
            pos,
            ruid: post.uid,
            content: comment,
        } as any).then((res: any) => {
            document.querySelector('e-player').setAttribute('danma', comment)
        })

    }
    const isOther = post.tag?.includes('其它')
    const user = getUser() || {}
    return <div>
        {
            isOther && <Markdown text={removeSuo(post.content)}></Markdown>
        }
        <div class="comment">
            <div className="comment-input">
                <Avatar uqq={user.qq}></Avatar>
                <input type="text" placeholder="Duang~" onInput={(e) => setComment(e.target.value)} />
                {user.id ? <button onClick={submit}>发送</button> : <button onclick={() => push('/login')}>登录</button>}
            </div>

            <h1>共有{danmakus ? danmakus.length : 0}条弹幕</h1>
            {danmakus && danmakus.map(item => {
                //@ts-ignore
                const time = dayjs(item.time).format('MM-DD-YYYY')
                return <div className="comment-item">
                    <Avatar uqq={item.uqq}></Avatar>
                    <div className="comment-block">
                        <p>{item.uname} <a href={`https://www.clicli.cc/comment/delete/${item.id}?token=${window.localStorage.getItem('token')}`} target="_blank"><del>#{item.id}</del></a></p>
                        <p>{item.content}</p>
                        <p>{time}</p>
                    </div>

                </div>
            })}
        </div>
    </div>
}
