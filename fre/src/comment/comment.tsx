import { h, useEffect, useState, Fragment } from 'fre'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import { addComment, getComments, getUser } from '../util/api'
import './comment.css'

export default function Comment({ post }) {
    console.log(post)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])

    const [rate, setRate] = useState(5)
    useEffect(() => {
        getComments(post.id).then(res => {
            setComments((res as any).comments)
        })
    }, [])

    function submit() {
        if (comment.length < 1) {
            return
        }
        addComment({
            pid: post.id,
            rate,
            content: comment,
        } as any).then(res => {
            alert(res.msg)
        })
    }
    const user = getUser() || {}
    return <div>
        <div class="comment">
            <div className="comment-input">
                <Avatar uqq={user.qq} uname={user.name} noname={true}></Avatar>
                <input type="text" placeholder="Duang~" onInput={(e) => setComment(e.target.value)} />
                {user.id ? <button onClick={submit}>发送</button> : <button onclick={() => push('/login')}>登录</button>}
            </div>

            <h1>共有{comments.length}条讨论</h1>


            {comments && comments.map(item => {
                const time = dayjs(item.time).format('MM-DD-YYYY')
                return <div className="comment-item">
                    <Avatar uqq={item.uqq}></Avatar>
                    <div className="comment-block">
                        <p>{item.uname}</p>
                        <p>{item.content}</p>
                        <p>{time}</p>
                    </div>

                </div>
            })}
        </div>
    </div>
}