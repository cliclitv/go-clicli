import { useEffect, useState } from 'fre'
import { push } from '../use-route'
import { getRank } from '../util/api'
import { getSuo } from '../util/avatar'
import './rank.css'


export default function Rank(props) {
    const [posts, setPosts] = useState([])
    const [day, setDay] = useState(300)
    useEffect(() => {
        getRank(day).then((res: any) => {
            setPosts(res.posts)
        })
    }, [day])
    return <div className="rank">
        <div class="top">
            <h1>排行榜</h1>
            <ul>
                <li onclick={() => setDay(300)} class={day === 300 ? 'active' : ''}>年榜</li>
                <li onclick={() => setDay(100)} class={day === 100 ? 'active' : ''}>季榜</li>
                <li onclick={() => setDay(30)} class={day === 30 ? 'active' : ''}>月榜</li>
            </ul>
        </div>
        <ul>
            {posts.length > 0 && posts.map((item, index) => {
                return index === 0 ?
                    <li className='current' key={index} onClick={() => push(`/play/gv${item.id}`)}>
                        <div className="cover">
                            <img src={getSuo(item.content)} />
                        </div>
                        <div className="info">
                            <div className="title">{item.title}</div>
                            <div className="bom">
                                <div className="tag">{item.tag}</div>
                                <div className="idx">{index + 1}</div>
                            </div>
                        </div>
                    </li>
                    :
                    <li key={index} onClick={() => push(`/play/gv${item.id}`)}>
                        <span className={index < 3 ? 'active' : ''}>{index + 1}</span>

                        <div className='title'>{item.title}</div>
                    </li>
            })}
        </ul>
    </div>
}