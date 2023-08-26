import { h, useEffect, useState } from 'fre'
import { push } from '../use-route'
import { getPost, getRank } from '../util/api'
import { getSuo } from '../util/avatar'
import { ListB } from '../list/list'
import './rank.css'


export default function RankList() {
    const [posts, setPosts] = useState([])
    const [day, setDay] = useState(0)

    const days = [7, 30, 120, 500]
    useEffect(() => {
        getRank(days[day]).then(res => {
            setPosts(res.posts)
        })
    }, [day])

    const map = ['周榜', '月榜', '季榜', '年榜']

    return <div className="week-list">
        <div>
            <div className="headline">
                <h2>排行榜</h2>
                <ul>
                    {map.map((item, index) => <button
                        className={index === day ? 'active' : ''}
                        onClick={() => setDay(index)}>{item}</button>)}
                </ul>
            </div>
            <ul className="posts">
                {(posts || []).map(item => {
                    return <li onClick={() => push(`/play/gv${item.id}`)}>{item.title}</li>
                })}
            </ul>
        </div>
    </div>
}