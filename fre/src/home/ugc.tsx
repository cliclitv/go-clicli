import { useEffect, useState } from 'fre'
import { push } from '../use-route'
import { getPost, getStreams } from '../util/api'
import { getSuo } from '../util/avatar'
import '../week/week.css'
import Avatar from '../component/avatar/avatar'
// import { gametags } from '../draft/draft'

const gametags = []

export default function UGCList(props) {
    const [posts, setPosts] = useState([])
    const [tag, setTag] = useState('全部')
    const [streams, setStreams] = useState([])

    useEffect(() => {
        getPost(props.sort, tag == '全部' ? '' : tag, 1, 12).then((res: any) => {
            setPosts(res.posts)
        })
    }, [tag])

    useEffect(() => {
        if (props.sort === '直播') {
            getStreams().then(res => {
                setStreams(res.publishers.map(item => item.key))
            })
        }
    }, [])

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
                        const key = `live/uu${item.uid}`
                        const isLive = item.sort === '直播' && streams.includes(key)

                        return <li key={isLive ? -index : index} onClick={() => push(`/play/gv${item.id}`)} class={isLive ? 'live' : ''}>
                            <div className="post">
                                <div className="cover">
                                    <img src={getSuo(item.content)} loading="lazy" />
                                    <i>{item.pv}℃</i>
                                </div>
                                <div className="title">
                                    {props.sort === '直播' && <Avatar uqq={item.uqq}></Avatar>}
                                    <div className="names">

                                        <b>{item.title}</b>
                                        {props.sort === '直播' && <p>{item.uname}</p>}
                                    </div>
                                </div>
                            </div>
                        </li>
                    }
                    ).sort((a,b)=>a.key-b.key)}
                </ul>
            </div>
        </div>
    </div>
}