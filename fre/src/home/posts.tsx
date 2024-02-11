import { useEffect, useState} from "fre"
import { push } from "../use-route"
import { getPost } from "../util/api"
import { getSuo } from "../util/avatar"

export default function PostList(props) {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        getPost('完结,新番', '', 1, 30).then(res => {
            setPosts(res.posts)
        })
    }, [])
    return <div className="post-list wrap section">
        <h1>最新更新</h1>
        <ul>
            {posts.length > 0 && posts.map((item,index) => {
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
}