import { useEffect, useState} from "fre"
import { push } from "../use-route"
import { getPost } from "../util/api"
import { getSuo } from "../util/avatar"

export default function Recommend(props) {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        getPost('新番,旧番', '推荐', 1, 10).then((res:any) => {
            setPosts(res.posts)
        })
    }, [])
    return <div className="recommend">
        <h1>编辑推荐</h1>
        <ul>
            {posts.length > 0 && posts.map(item => {
                return <li key={item.id} onClick={() => push(`/play/gv${item.id}`)}>
                    <div className="cover" >
                        <img src={getSuo(item.content)} />
                    </div>
                    <div className="title">{item.title}</div>
                </li>
            })}
        </ul>
    </div>
}