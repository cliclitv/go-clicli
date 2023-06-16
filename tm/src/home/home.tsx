import { h, useEffect, useState } from 'fre'
import { getPost, getPostDetail, getRank } from '../util/api'
import { ListA } from '../list/list'
import { ListB } from '../list/list'
import './home.css'
import { getSuo, getBio } from '../util/avatar'
import { post } from '../util/post'
import { push } from '../use-route'

export default function Home() {
    const [recommend, setRecommend] = useState([])
    const [tip, setTip] = useState({})
    const [short, setShort] = useState([])
    const [other, setOther] = useState([])
    useEffect(() => {
        getPost('纯爱', '', 1, 8).then((res: any) => {
            setRecommend(res.posts)
        })
        getPost('', '其它', 1, 5).then((res: any) => {
            setOther(res.posts)
        })
        getPost('短篇', '', 1, 10).then((res: any) => {
            setShort(res.posts)
        })
        getPostDetail(30).then(res=>{
            setTip(res.result)
        })
    }, [])


    return (
        <div >
            <nav>
                <ul class="wrap">
                    <li class={window.location.pathname == '/' ? 'active' : ''}>首页</li>
                    <li>排行</li>
                    <li>索引</li>
                    <li>版权</li>
                </ul>
            </nav>
            <div class="wrap home">
                <div className="left">
                    <div className="swiper">
                        <img src={getSuo(tip.content)} />
                        <p>{tip.title}</p>
                    </div>
                    <h1>短篇强推</h1>
                    <ul>
                        {short.map(item => {
                            return <li>
                                <div><b>{item.sort} ·</b>
                                    <p>{item.title}</p></div>
                            </li>
                        })}
                    </ul>
                </div>
                <div className="middle">
                    <h1>畅销热追</h1>
                    <ul>
                        {recommend.map(item => {
                            return <li onclick={()=>push(`/book/tm${item.id}`)}>
                                <div>
                                    <b>{item.sort} ·</b>
                                    <h2>{item.title}</h2>
                                </div>
                                <p>{getBio(item.content)}</p>
                            </li>
                        })}

                    </ul>
                </div>
                <div className="right">
                    <h1>甜梦公告</h1>
                    <ul>
                        {other.map(item => {
                            return <li>
                                <div><b>{item.sort} ·</b>
                                    <p>{item.title}</p></div>
                            </li>
                        })}
                    </ul>
                </div>

            </div>
            <div className="wrap">
                <h1 class='list-h'>纯爱推荐</h1>
                <ListA posts={recommend} editor={false}></ListA>
            </div>
            <div className="wrap">
                <h1 class='list-h'>短篇推荐</h1>
                <ListA posts={short} editor={false}></ListA>
            </div>
        </div>
    )
}