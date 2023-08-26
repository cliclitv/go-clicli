import { h, useEffect, useState } from 'fre'
import { getPost } from '../util/api'
import './home.css'
import Avatar from '../component/avatar/avatar'
import snarkdown from 'snarkdown'
import WeekList from '../week/week'
import Post from '../play/play'
import { push } from '../use-route'
import RankList from '../rank/rank'

export default function App(props) {
    const [posts, setPosts] = useState([])
    useEffect(() => {

        getPost('', '', 1, 10).then(res => {
            setPosts(res.posts)
        })

    }, [])

    useEffect(() => {
        setTimeout(() => {
            const main = document.querySelector('main')
            const height = main.clientHeight
            const windowHeight = document.documentElement.clientHeight
            window.onscroll = () => {
                // 视差效果
                const realy = (1080 - windowHeight) * (document.documentElement.scrollTop / height)
                main.style.backgroundPositionY = -realy + 'px'
            }
        }, 500);

    }, [posts])
    return (
        <div>
            <div className="container">
                <div className="left">
                    {posts.map(item => {
                        return <section>
                            <h1 onClick={() => push(`/play/gv${item.id}`)}>{item.title}</h1>
                            <div className="info">
                                <span>由</span>
                                <Avatar uqq={item.uqq} uname={item.uname}></Avatar>
                                <span>发布于<i>  </i></span>
                                <time>{item.time}</time>
                            </div>
                            <article ref={(dom) => dom.innerHTML = snarkdown(item.content)}></article>
                            <p onClick={() => push(`/play/gv${item.id}`)}>{'>> '}继续观看</p>
                        </section>
                    })}
                </div>
                <div className="right">
                    <WeekList></WeekList>
                    <RankList></RankList>
                </div>
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