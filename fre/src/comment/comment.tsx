import { useEffect, useState, Fragment } from 'fre'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import { addComment, getUser } from '../util/api'
import './comment.css'
import Markdown from '../component/md/md'
import { removeSuo } from '../util/avatar'

export default function Comment({ post, danmakus }) {
    const isOther = post.tag?.includes('其它')
    const user = getUser() || {}
    return <div>
        {
            isOther && <Markdown text={removeSuo(post.content)}></Markdown>
        }
        <div class="comment">
            <h1>共有{danmakus ? danmakus.length : 0}条弹幕</h1>
            {danmakus && danmakus.map(item => {
                return <div>
                    <div className="comment-item">
                        <Avatar uqq={item.uqq}></Avatar>
                        <p>{item.uname}: </p>
                        <p>{item.content}</p>
                    </div>
                </div>
            })}
        </div>
    </div>
}
