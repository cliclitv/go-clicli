import { h, useEffect, useState } from 'fre'
import { push } from '../use-route'
import { getRank } from '../util/api'
import { getSuo } from '../util/avatar'
import './rank.css'


export default function Rank(props) {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        getRank(30).then((res: any) => {
            setPosts(res.posts)
        })
    }, [])
    return <div className="rank">
        <h1>排行榜</h1>
        <ul>
            {posts.length > 0 && posts.map((item, index) => {
                return index === 0 ?
                    <li className='current' key={item.id} onClick={() => push(`/play/gv${item.id}`)}>
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
                    <li key={item.id} onClick={() => push(`/play/gv${item.id}`)}>
                        <span className={index < 3 ? 'active' : ''}>{index + 1}</span>
                        
                            <div className='title'>{item.title}</div>
                    </li>
            })}
        </ul>
    </div>
}