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



export default function App(props) {
    return (
        <div>
            <div className="wrap section" style={{ display: 'flex' }}>
                <Recommend></Recommend>
                <RankList />
            </div>
            <WeekList />
            <PostList></PostList>
            {props.gv ? <div>
                <div class="postplayer"><i class='icon-font icon-close' onclick={() => {
                    push('/')
                }}></i>
                    <Post gv={props.gv}></Post>
                </div>
                <div className="mask"></div></div> : <div></div>}
        </div>

    )
}