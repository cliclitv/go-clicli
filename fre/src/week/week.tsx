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
            console.log(123)
            setTimeout(() => {
                setPosts(ret as any)
            }, 500);
        })
    }, [])
    const map = {
        0: '日',
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六'
    }
    return <div className="week-list">
        <div>
            <div className="headline">
                <h2>新番表</h2>
                <ul>
                    {posts && Object.keys(posts).map((item, index) => <button
                        className={index === day ? 'active' : ''}
                        onClick={() => setDay(index)}>{map[item]}</button>)}
                </ul>
            </div>
            <ul className="posts">
                {posts[day]?.slice(0, 8).map(item=>{
                    return <li>{item.title}</li>
                })}
            </ul>
        </div>
    </div>
}