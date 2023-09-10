import { useEffect, useState } from "fre"
import { push } from "../use-route"
import { getPost } from "../util/api"
import { getAvatar, getSuo } from "../util/avatar"

export default function UGCList(props) {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        getPost('原创', '', 1, 4).then(res => setPosts(res.posts))
    }, [])
    return <div className="ugc-list">
        <div className="wrap">
            <h1>原创投稿</h1>
            <ul className="posts">
                {posts && posts.map((item) => (
                    <li key={item.id} onClick={() => push(`/play/gv${item.id}`)}>
                        <div className="post">
                            <div className="cover">
                                <img src={getSuo(item.content)} />
                            </div>
                            <div className="info">
                                <div className="uqq"><img src={getAvatar(item.uqq)} /></div>
                                <div className="title">{item.title}</div>
                            </div>
                        </div>
                    </li>
                )
                )}
            </ul>
        </div>
    </div>
}