import { useEffect, useState } from 'fre'
import { push } from '../use-route'
import { getPost } from '../util/api'
import { getSuo } from '../util/avatar'
import '../week/week.css'
import { gametags } from '../draft/draft'

export default function WeekList() {
    const [posts, setPosts] = useState([])
    const [tag, setTag] = useState('全部')
    useEffect(() => {
        getPost('原创', tag == '全部' ? '' : tag, 1, 18).then((res: any) => {
            setPosts(res.posts)
        })
    }, [tag])

    return <div className="week-list ugc-list">
        <div className="wrap section">
            <div className="headline">
                <h1>个人投稿区</h1>
                <ul>
                    {(['全部'].concat(gametags)).map((item, index) => <button
                        className={item === tag ? 'active' : ''}
                        onClick={() => setTag(item)}>{item}</button>)}
                </ul>
            </div>
            <div class="weekcontent">
                <ul className="posts">
                    {posts.map((item, index) => (
                        <li key={index} onClick={() => push(`/play/gv${item.id}`)}>
                            <div className="post">
                                <div className="cover">
                                    <img src={getSuo(item.content)} />
                                </div>
                                <div className="title">{item.title}</div>
                            </div>
                        </li>
                    )
                    )}
                </ul>
            </div>
        </div>
    </div>
}