import { h, useEffect, useMemo, useState } from 'fre'
import { push } from '../use-route'
import { getPost } from '../util/api'
import { getSuo } from '../util/avatar'
import { ListB } from '../list/list'
import './week.css'


export default function WeekList() {
    const [posts, setPosts] = useState({})
    const [day, setDay] = useState(new Date().getDay())
    const [post, setPost] = useState([])
    useEffect(() => {
        getPost('新番', '', 1, 100,).then(res => {
            let ret = {}
            res.posts.forEach(item => {
                let day = new Date(item.time).getDay()
                ret[day] = ret[day] || []
                if (ret[day].indexOf(item) < 0) {
                    ret[day].push(item)
                }

            })
            setPosts(ret as any)
        })
        return () => {
            setPosts({})
        }
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
                    {posts && Object.values(map).map((item, index) => <button
                        className={index === day ? 'active' : ''}
                        onClick={() => setDay(index)}>{map[index]}</button>)}
                </ul>
            </div>
            {useMemo(() => {
                return <ul className="posts">
                    {posts[day] && posts[day].map(item => {
                        return <li onClick={() => push(`/play/gv${item.id}`)}>{item.title}</li>
                    })}
                </ul>
            })}
        </div>
    </div>
}