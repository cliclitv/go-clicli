import { useEffect, useState } from "fre"
import { push } from "../use-route"
import { getPost, getUsers } from "../util/api"
import { getAvatar, getSuo } from "../util/avatar"
import Avatar from "../component/avatar/avatar"

export default function UGCList(props) {
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])
    useEffect(() => {
        // getPost('原创', '', 1, 4).then(res => setPosts(res.posts))
        getUsers(4, 1, 9).then(res => {
            setUsers(res.users)
        })
    }, [])
    return <div className="ugc-list">
        <div className="wrap">
            <h1 style={{ color: '#fff' }}>推荐直播</h1>
            <ul className="posts">
                {users && users.map(item => {
                    return <div class='user-card'>
                        <ul>
                            <li><img src={getAvatar(item.qq)} /></li>
                            <li class="r">
                                <div>
                                    <span>LIVE</span>
                                    <h2>{item.name}</h2>
                                </div>
                                <p>{item.sign}</p>
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