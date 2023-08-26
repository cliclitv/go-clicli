import { h, useEffect, useState } from 'fre'
import { getPost } from '../util/api'
import './home.css'
import Avatar from '../component/avatar/avatar'
import { getSuo } from '../util/avatar'
import WeekList from '../week/week'

export default function App() {
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
        }, 20);
    }, [posts])
    return (
        <div className="container">
            <div className="left">
                {posts.map(item => {
                    return <section>
                        <h1>{item.title}</h1>
                        <div className="info">
                            <span>由</span>
                            <Avatar uqq={item.uqq} uname={item.uname}></Avatar>
                            <span>发布于<i>  </i></span>
                            <time>{item.time}</time>
                        </div>
                        <div><img src={getSuo(item.content)} class="suo" /></div>
                        <p>{'>> '}继续观看</p>
                    </section>
                })}
            </div>
            <div className="right">
                <WeekList></WeekList>
            </div>
        </div>
    )
}