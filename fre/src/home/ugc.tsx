import { useEffect, useState } from "fre"
import { push } from "../use-route"
import { getPost, getUsers } from "../util/api"
import { getAvatar, getSuo } from "../util/avatar"
import Avatar from "../component/avatar/avatar"
import { get } from "../util/post"

export default function UGCList(props) {
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])
    const [active, setActive] = useState([])
    useEffect(() => {
        // getPost('原创', '', 1, 4).then(res => setPosts(res.posts))
        getUsers(4, 1, 9).then(res => {
            setUsers(res.users)
        })
        get('http://www.tm0.net:1985/api/v1/streams/').then(res => {
            let out = []
            res.streams.forEach(s => {
                if (s.publish.active) {
                    out.push(s.name)
                }
                setActive(out)
            })
        })
    }, [])

    console.log(active)
    return <div className="ugc-list">
        <div className="wrap">
            <h1 style={{ color: '#fff' }}>推荐直播</h1>
            <ul className="posts">
                {users && users.map(item => {
                    return <div class='user-card'>
                        <ul onclick={() => push(`/live/uu${item.id}`)}>
                            <li class='livecover'><img src={getAvatar(item.qq)} />{active.includes('uu' + item.id) &&
                                <i><img src="https://img.hongrenshuo.com.cn/h5/websiteManbo-live-icon-wr.png" /></i>
                            }</li>
                            <li class="r">
                                <div>
                                    <span>LIVE</span>
                                    <h2>{item.name}</h2>
                                </div>
                                <div>{item.sign}</div>
                            </li>
                        </ul>
                    </div>
                })}
            </ul>
        </div>
    </div>
}


// {posts && posts.map((item) => (
//     <li key={item.id} onClick={() => push(`/play/gv${item.id}`)}>
//         <div className="post">
//             <div className="cover">
//                 <img src={getSuo(item.content)} />
//             </div>
//             <div className="info">
//                 <div className="uqq"><img src={getAvatar(item.uqq)} /></div>
//                 <div className="title">{item.title}</div>
//             </div>
//         </div>
//     </li>
// )
// )}