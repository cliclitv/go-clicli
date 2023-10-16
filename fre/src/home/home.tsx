import { useEffect, useState } from 'fre'
import { getPost } from '../util/api'
import './home.css'
import Avatar from '../component/avatar/avatar'
import snarkdown from 'snarkdown'
import WeekList from '../week/week'
import Post from '../play/play'
import { push } from '../use-route'
import RankList from '../rank/rank'
import Recommend from './recommend'
import UGCList from './ugc'
import PostList from './posts'
import Live from '../play/live'



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
            <div className="wrap" style={{ display: 'flex' }}>
                <Recommend></Recommend>
                <RankList />
            </div>
            <WeekList />
            <UGCList />
            <PostList></PostList>
            {props.gv ? <div>
                <div class="postplayer"><i class='icon-font icon-close' onclick={() => {
                    push('/')
                }}></i>
                    {props.gv.indexOf('gv') > -1 ? <Post gv={props.gv}></Post> : <Live uu={props.gv}></Live>}
                </div>
                <div className="mask"></div></div> : <div></div>}
        </div>

    )
}