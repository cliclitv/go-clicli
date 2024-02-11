import { useEffect, useState } from 'fre'
import { push } from '../use-route'
import { getPost } from '../util/api'
import { getSuo } from '../util/avatar'
import './week.css'

export default function WeekList() {
    const [posts, setPosts] = useState({})
    const [day, setDay] = useState(new Date().getDay())
    useEffect(() => {
        getPost('新番', '', 1, 100).then(res => {
            let ret = {}
            res.posts.forEach(item => {
                let day = new Date(item.time).getDay()
                ret[day] = ret[day] || []
                ret[day].push(item)
            })
            setPosts(ret)
        })
    }, [])
    const map = {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六'
    }
    return <div className="week-list">
        <div className="wrap section">
            <div className="headline">
                <h1>更新表</h1>
                <ul>
                    {posts && Object.keys(posts).map((item, index) => <button
                        className={index === day ? 'active' : ''}
                        onClick={() => setDay(index)}>{map[item]}</button>)}
                </ul>
            </div>
            <div class="weekcontent">
                <ul className="posts">
                    {posts[day] ? posts[day].map((item, index) => (
                        <li key={index} onClick={() => push(`/play/gv${item.id}`)}>
                            <div className="post">
                                <div className="cover">
                                    <img src={getSuo(item.content)} />
                                </div>
                                <div className="title">{item.title}</div>
                            </div>
                        </li>
                    )
                    ) : <div></div>}
                </ul>
                <div className="ad">
                    <a href="https://shop119340084.taobao.com/shop/view_shop.htm?spm=a230r.1.14.4.75dc14ecGDLY4r&user_number_id=1965847533&mm_sycmid=1_143947_3565a75377635dc11b2616c8c6d51a7d" target="_blank">
                        <span>官方赞助</span>
                        <img src="http://image.planet.youku.com/img/100/15/47949/i_1694758247949_203bbf08698d4b1e4d749e42c3e20be3_b_w1600h1600.jpg" alt="" />
                        <div>
                            <p>哥哥^_^打个胶叭！</p>
                            <button>暗号CLI</button>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
}