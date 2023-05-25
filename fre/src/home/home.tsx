import { h, useEffect, useState } from 'fre'
import { getPost, getPostDetail, getRank } from '../util/api'
import { ListA } from '../list/list'
import { ListB } from '../list/list'
import './home.css'
import { buildVideos, Eplayer } from '../play/play'
import { getSuo } from '../util/avatar'
import Swiper from '../../swiper/swiper.tsx'

export default function Home() {
    const [recommend, setRecommend] = useState([])
    const [index, setIndex] = useState(0)
    const [ugc, setUgc] = useState([])
    const [rank, setRank] = useState([])
    useEffect(() => {

        getRank().then((res2: any) => {
            setRank(res2.posts.splice(0, 8))
        })
        getPost('', '原创', 1, 12).then((res: any) => {
            setUgc(res.posts)
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
                <Swiper></Swiper>
                <nav>
                    <ul>
                        {gametags.map((g, i) => <li class={index === i ? 'active' : ''} onclick={() => setIndex(i)}>{g}</li>)}
                    </ul>
                </nav>
                <ListA posts={recommend} />

                <h1>番剧，慢慢做...</h1>
                <ListB posts={rank} />
            </div>
        </div>
    )
}