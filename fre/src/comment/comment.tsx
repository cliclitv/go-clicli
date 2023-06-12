import { h, useEffect, useState, Fragment } from 'fre'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import { addComment, getComments, getUser } from '../util/api'
import './comment.css'

function setRateDom(index, node) {
    for (let j = index; j < node.length; j++) {
        node[j].classList.remove('icon-star-fill')
    }
    for (let i = 0; i < index; i++) {
        node[i].classList.add('icon-star-fill')
    }
}

export default function Comment({ post }) {
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
    return <div class="comment">
        <h1>#弹幕<span>{comments?.length}</span></h1>
        <div className="comment-input">
            <Avatar uqq={user.qq} uname={user.name} noname={true}></Avatar>
            <input type="text" placeholder="Duang~" onInput={(e) => setComment(e.target.value)} />
            {user.id ? <button onClick={submit}>发送</button> : <button onclick={() => push('/login')}>登录</button>}
        </div>

        {comments && comments.map(item => {
            return <div className="comment-item">
                <li><Avatar uqq={item.uqq} uname={item.uname}></Avatar><time>{item.time}</time></li>
                <p><span>
                    </span>{item.content}</p>
            </div>
        })}
    </div>
}