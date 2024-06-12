import { useEffect, useState } from "fre"
import { push } from "../use-route"
import { getGonggao, getPost } from "../util/api"
import { getSuo } from "../util/avatar"

const tags = ['日漫', '国漫', '美漫', '剧场版']

export default function Recommend(props) {
    const [posts, setPosts] = useState([])
    const [cat, setCat] = useState('日漫')
    const [tags, setTags] = useState([])
    useEffect(() => {
        getPost('新番,完结', cat == '日漫' ? '推荐' : cat, 1, 10).then((res: any) => {
            setPosts(res.posts)
        })
        getGonggao().then(res=>{
            setTags(res.result.videos.split('\n'))
        })
    }, [cat])
    return <div className="recommend">
        <div className="top">
            <h1>推荐</h1>
            <ul>
                {
                    tags.map(item => <li onclick={() => setCat(item)} class={item == cat ? 'active' : ''}>{item}</li>
                    )
                }
            </ul>
        </div>
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