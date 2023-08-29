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
        setTimeout(() => {
            const main = document.querySelector('main')
            const height = main.clientHeight
            const windowHeight = document.documentElement.clientHeight
            window.onscroll = () => {
                // 视差效果
                const realy = (1000 - windowHeight) * (document.documentElement.scrollTop / height)
                main.style.backgroundPositionY = -realy + 'px'
            }
        }, 500);

    }, [posts, page])

    useEffect(() => {
        getPost('', '', page, 10).then(res => {
            const newPosts = posts.concat(res.posts)
            setPosts(newPosts)
        })
    }, [page])
    return (
        <div>
            <div className="container">
                <div className="left">
                    <div>
                        <h3>全站直播测试</h3>
                        <button style="margin:10px" onclick={() => startPull()}>拉流</button>
                        <video src="" controls autoplay class="remote"></video>

                    </div>
                    {posts.map(item => {
                        const time = dayjs(item.time).format('MM-DD-YYYY')
                        console.log(time)
                        return <section key={item.id}>
                            <h1 onClick={() => push(`/play/gv${item.id}`)}>{item.title}</h1>
                            <div className="info">
                                <span>由</span>
                                <Avatar uqq={item.uqq} uname={item.uname}></Avatar>
                                <span>发布于</span>
                                <span>{time}</span>
                            </div>
                            <article ref={(dom) => {
                                if (dom) {
                                    dom.innerHTML = snarkdown(item.content)
                                }
                            }}></article>
                            <p onClick={() => push(`/play/gv${item.id}`)}>{'>> '}继续观看</p>
                        </section>
                    })}
                    <button class="more" onClick={() => setPage(page + 1)}>加载更多</button>
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