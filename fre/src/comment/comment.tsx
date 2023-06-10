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

function computed(arr = []) {
    let sum = arr.map(i => i.rate).reduce((pre, curr) => {
        return pre + curr
    })
    return sum / arr.length
}

export default function Comment({ post }) {
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [rate2, setRate2] = useState(0)

    const [rate, setRate] = useState(5)
    useEffect(() => {
        getComments(post.id).then(res => {
            setComments(res.comments)
            setRate2(computed(res.comments))
        })
    }, [])

    useEffect(() => {
        const ul = document.querySelector('.rate').firstChild
        ul.childNodes.forEach((item, index) => {
            console.log(rate2)
            if (rate2 > index) {
                item.classList.add('icon-star-fill')
            }
        })
    }, [rate2])
    useEffect(() => {
        const ul = document.querySelector('.rate').firstChild
        ul.childNodes.forEach((item, index) => {
            item.addEventListener('click', e => {
                setRateDom(index + 1, ul.childNodes)
                setRate(index + 1)

            })
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
        <h1>#推语<span>{comments?.length}</span></h1>
        <div className="rate">
            <ul>
                <li class='icon-font icon-star'></li>
                <li class='icon-font icon-star'></li>
                <li class='icon-font icon-star'></li>
                <li class='icon-font icon-star'></li>
                <li class='icon-font icon-star'></li>
            </ul>
        </div>
        <div className="comment-input">
            <Avatar uqq={user.qq} uname={user.name} noname={true}></Avatar>
            <input type="text" placeholder="你的推语会出现在首页哦~" onInput={(e) => setComment(e.target.value)} />
            {user.id ? <button onClick={submit}>发送</button> : <button onclick={() => push('/login')}>登录</button>}
        </div>

        {comments && comments.map(item => {
            return <div className="comment-item">
                <li><Avatar uqq={item.uqq} uname={item.uname}></Avatar><time>{item.time}</time></li>
                <p><span>
                    <ul>{Array(5).fill(0).map((ite, idx) => {
                        return <li class={item.rate > idx ? 'icon-font icon-star-fill' : 'icon-font icon-star'}></li>
                    })}
                    </ul></span>{item.content}</p>
            </div>
        })}
    </div>
}