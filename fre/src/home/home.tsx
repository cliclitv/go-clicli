import { h, useEffect, useState } from 'fre'
import { getComments, getPost, getPostDetail, getRank } from '../util/api'
import { ListA, ListB } from '../list/list'
import './home.css'
import Avatar from '../component/avatar/avatar'
import Swiper from '../swiper/swiper.tsx'
import { push } from '../use-route'
import { getSuo } from '../util/avatar'
import Week from '../week/week'

export default function Home() {
    const [recommend, setRecommend] = useState([])
    const [index, setIndex] = useState(0)
    const [comments, setComments] = useState([])
    const [rank, setRank] = useState([])
    useEffect(() => {
        Promise.all([getComments(0, 1, 6), getRank()]).then(resA => {
            setComments(resA[0].comments)
            setRank(resA[1].posts)
        })
    }, [])

    useEffect(() => {
        getPost('', gametags[index], 1, 12).then((res: any) => {
            setRecommend(res.posts)
        })
    }, [index])

    const gametags = [
        '原创', '原神', '星穹铁道', '崩坏三', '明日方舟', '火影忍者', '三国杀', '王者荣耀', '塞尔达', '碧蓝航线', '其它原创'
    ]

    return (
        <div>
            <div class="wrap home">
                {comments && rank && recommend && <Swiper/>}
                <nav>
                    <ul>
                        {gametags.map((g, i) => <li class={index === i ? 'active' : ''} onclick={() => setIndex(i)}>{g}</li>)}
                    </ul>
                </nav>
                <ListA posts={recommend} />
                <Week></Week>
                <h1>旧番，慢慢做...</h1>
                <ListB posts={rank} />
                <h1>推番君</h1>
                <div className="tuifanjun">
                    {comments && comments.map(item => {
                        return <div class='comment-wrap'>
                            <div className="comment-item">
                                <div className="b">
                                    <li onClick={() => push(`/play/gv${item.pid}`)} key={item.id} >
                                        <div className="item">
                                            <div className="cover">
                                                <img src={getSuo(item.pcontent)} />
                                                <div className="title">{item.ptitle}</div>
                                            </div>
                                        </div>
                                    </li>
                                </div>
                                <div>
                                    <li><Avatar uqq={item.uqq} uname={item.uname}></Avatar><time>{item.time}</time></li>
                                    <p><span>
                                        <ul>{Array(5).fill(0).map((ite, idx) => {
                                            return <li class={item.rate > idx ? 'icon-font icon-star-fill' : 'icon-font icon-star'}></li>
                                        })}
                                        </ul></span>{item.content}</p>
                                </div>

                            </div>
                        </div>

                    })}
                </div>
            </div>
        </div>
    )
}