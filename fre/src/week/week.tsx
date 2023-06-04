import { h, useEffect, useState } from 'fre'
import { push } from '../use-route'
import { getPost } from '../util/api'
import { getSuo } from '../util/avatar'
import { ListB } from '../list/list'
import './week.css'


export default function WeekList() {
    const [posts, setPosts] = useState([])
    const [day, setDay] = useState(new Date().getDay())
    useEffect(() => {
        getPost('新番', '', 1, 100,).then(res => {
            let ret = {}
            res.posts.forEach(item => {
                let day = new Date(item.time).getDay()
                ret[day] = ret[day] || []
                ret[day].push(item)
            })
            setPosts(ret as any)
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
        <div className="wrap">
            <div className="headline">
                <h1>新番表</h1>
                <ul>
                    {posts && Object.keys(posts).map((item, index) => <button
                        className={index === day ? 'active' : ''}
                        onClick={() => setDay(index)}>{map[item]}</button>)}
                </ul>
            </div>
            <ul className="posts">
                <ListB posts={posts[day]?.slice(0, 8)} />
            </ul>
        </div>
    </div>
}