import { useEffect, useState } from "fre"
import { push } from "../use-route"
import { getPost } from "../util/api"
import { getSuo } from "../util/avatar"

function groupByPosts(posts) {
    const out = {}

    posts.forEach(item => {
        const uid = item.uname
        const list = out[uid] || []
        list.push(item)
        out[uid] = list
    });

    return out
}

export default function PostList(props) {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        getPost('完结,新番', '', 1, 100).then(res => {
            const out = groupByPosts(res.posts)
            setPosts(out)
        })
    }, [])
    return <div className="post-list wrap section">
        <h1>最新更新</h1>
        <ul>
            {Object.keys(posts).map(name => {
                const postss = posts[name]
                return <div class="card-wrap">
                    <div class="post-card">
                        <h2>@{name} 更新了</h2>
                        <ul>
                            {postss.map((item, index) => {
                                return (
                                    <li key={index} onClick={() => push(`/play/gv${item.id}`)}>
                                        <div className="cover">
                                            <img src={getSuo(item.content)} />
                                        </div>
                                        <div className="title">{item.title}</div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            })}
        </ul>
    </div>
}