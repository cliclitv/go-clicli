import { useEffect, useState } from 'fre'
import './home.css'

import WeekList from '../week/week'
import Post from '../play/play'
import { push } from '../use-route'
import RankList from '../rank/rank'
import Recommend from './recommend'
import UGCList from './ugc'
import PostList from './posts'
import Login from '../login/login'
import Register from '../login/register'

function CenterSection({ comp, props }) {
    const Comp = comp
    return <div style={{ 'position': 'relative' }}>
        <div className={props.gv ? 'postplayer' : "usercenter"}>
            <Comp {...props}></Comp>
        </div>
        <div className="mask">
            <i class='icon-font icon-back' onclick={() => {
                push('/')
            }}></i>
        </div>
    </div>

}

export default function App(props) {
    return (
        <div>
            <div className="wrap section" style={{ display: 'flex' }}>
                <Recommend></Recommend>
                <RankList />
            </div>
            <WeekList />
            <UGCList></UGCList>
            <PostList></PostList>
            {
                window.location.pathname === '/login' && <CenterSection comp={Login} props={props}></CenterSection>

            }

            {
                window.location.pathname === '/register' &&
                <CenterSection comp={Register} props={props}></CenterSection>
            }

            {
                props.uid &&
                <CenterSection comp={Register} props={props}></CenterSection>
            }


            {props.gv && <CenterSection comp={Post} props={props}></CenterSection>}
        </div>

    )
}