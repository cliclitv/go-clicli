import { useEffect, useState, Fragment } from 'fre'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import { addComment, getComments, getUser } from '../util/api'
import './comment.css'

export default function Comment({ post, live }) {
    console.log(post)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])

    const [pos, setPos] = useState(0)
    useEffect(() => {
        if (live) {
            getComments(0, post.id).then(res => {
                setComments((res as any).comments || [])
            })
        } else {
            getComments(post.id, 0).then(res => {
                setComments((res as any).comments || [])
            })
        }
    }, [])

    function submit() {
        if (comment.length < 1) {
            return
        }
        if (live) {
            addComment({
                pid: 0,
                rid: post.id,
                pos,
                ruid: post.id,
                content: comment,
            } as any).then(res => {
                alert(res.msg)
            })
        } else {
            addComment({
                pid: post.id,
                rid: 0,
                pos,
                ruid: post.uid,
                content: comment,
            } as any).then(res => {
                alert(res.msg)
            })
        }
    }
    const user = getUser() || {}
    return <div>
        <div class="comment">
            <div className="comment-input">
                <Avatar uqq={user.qq} uname={user.name} noname={true}></Avatar>
                <input type="text" placeholder="Duang~" onInput={(e) => setComment(e.target.value)} />
                {user.id ? <button onClick={submit}>发送</button> : <button onclick={() => push('/login')}>登录</button>}
            </div>

            <h1>共有{comments ? comments.length : 0}条讨论</h1>


            {comments && comments.map(item => {
                const time = dayjs(item.time).format('MM-DD-YYYY')
                return <div className="comment-item">
                    <Avatar uqq={item.uqq}></Avatar>
                    <div className="comment-block">
                        <p>{item.uname}</p>
                        <p>{item.content}</p>
                        <del>{time} <a href={`https://www.clicli.cc/comment/delete/${item.id}?token=${window.localStorage.getItem('token')}`} target="_blank">#{item.id}</a></del>
                    </div>

                </div>
            })}
        </div>
    </div>
}
