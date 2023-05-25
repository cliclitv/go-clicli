import { h, useEffect, useState } from 'fre'
import { getPost, getPostDetail, getRank } from '../util/api'
import { ListA } from '../list/list'
import { ListB } from '../list/list'
import './home.css'
import { buildVideos, Eplayer } from '../play/play'
import { getSuo } from '../util/avatar'

export default function Home() {
    const [recommend, setRecommend] = useState([])
    const [index, setIndex] = useState(0)
    const [play, setPlay] = useState("")
    const [ugc, setUgc] = useState([])
    const [rank, setRank] = useState([])
    useEffect(() => {
        getPost('', '独播', 1, 8).then((res: any) => {
            setRecommend(res.posts)
        })
        getRank().then((res2: any) => {
            setRank(res2.posts.splice(0, 8))
        })
        getPost('', '原创', 1, 12).then((res: any) => {
            setUgc(res.posts)
        })
    }, [])

    useEffect(() => {
        recommend.length > 0 && getPostDetail(recommend[index].id).then(res => {
            const videos = res.result.videos
            const play = buildVideos(videos)[0][1]
            setPlay(play)
        })
    }, [index, recommend])

    return (
        <div>
            <div class="wrap home">

                <h1>原创，努力做！</h1>
                <ListA posts={ugc} />

                <h1>番剧，虽然不多，但还有...</h1>
                <ListB posts={rank} />
            </div>
        </div>
    )
}