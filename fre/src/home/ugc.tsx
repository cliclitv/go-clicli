import { useEffect, useState } from 'fre'
import { push } from '../use-route'
import { getPost } from '../util/api'
import { getSuo } from '../util/avatar'
import '../week/week.css'
import Avatar from '../component/avatar/avatar'
// import { gametags } from '../draft/draft'

const gametags = []

export default function WeekList(props) {
    const [posts, setPosts] = useState([])
    const [tag, setTag] = useState('全部')

    useEffect(() => {
        getPost(props.sort, tag == '全部' ? '' : tag, 1, 12).then((res: any) => {
            setPosts(res.posts)
        })
    }, [tag])

    //https://img.hongrenshuo.com.cn/h5/websiteManbo-live-icon-wr.png

    return <div className="week-list ugc-list">
        <div className="wrap section">
            <div className="">
                <h1>{props.sort}区</h1>
                <ul>
                    {([].concat(gametags)).map((item, index) => <button
                        className={item === tag ? 'active' : ''}
                        onClick={() => setTag(item)}>{item}</button>)}
                </ul>
            </div>
            <div class="weekcontent">
                <ul className="posts">
                    {posts.map((item, index) => {
                        const isLive = item.sort === '直播'
                        return <li key={index} onClick={() => push(`/play/gv${item.id}`)} class={isLive ? 'live' : ''}>
                            <div className="post">
                                <div className="cover">
                                    <img src={getSuo(item.content)} loading="lazy"/>
                                </div>
                                <div className="title">
                                    {props.sort === '直播' && <Avatar uqq={item.uqq}></Avatar>}
                                    <p>{item.title}</p>
                                </div>
                            </div>
                        </li>
                    }
                    )}
                </ul>
            </div>
        </div>
    </div>
}