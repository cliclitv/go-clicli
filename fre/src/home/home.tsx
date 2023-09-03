import { h, useEffect, useState } from 'fre'
import { getPost } from '../util/api'
import './home.css'
import Avatar from '../component/avatar/avatar'
import snarkdown from 'snarkdown'
import WeekList from '../week/week'
import Post from '../play/play'
import { push } from '../use-route'
import RankList from '../rank/rank'
import { startPull } from '../util/rtc'




export default function App(props) {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        getPost('', '', page, 10).then(res => {
            const newPosts = posts.concat(res.posts)
            setPosts(newPosts)
        })
    }, [page])
    return (
        <div>
            <div className="container">
                <div className="wrap" style={{ display: 'flex' }}>
                    {/* < /> */}
                    <RankList />
                </div>
                <WeekList />
                <UgcList />
                <PostList />
            </div>
            {props.gv && <div>
                <div class="postplayer"><i class='icon-font icon-close' onclick={() => {
                    push('/')
                }}></i>
                    <Post gv={props.gv}></Post>
                </div>
                <div className="mask"></div></div>}
        </div>

    )
}