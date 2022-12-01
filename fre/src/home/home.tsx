import { h, useEffect, useState } from 'fre'
import { getPost, getRank } from '../util/api'
import { ListA } from '../list/list'
import { ListB } from '../list/list'
import './home.css'

export default function Home() {
    const [recommend, setRecommend] = useState([])
    const [rank, setRank] = useState([])
    const [ugc, setUgc] = useState([])
    useEffect(() => {
        getPost('', '推荐', 1, 8).then((res: any) => {
            setRecommend(res.posts)
        })
        getRank().then((res2: any) => {
            setRank(res2.posts.splice(0, 8))
        })
        getPost('原创', '', 1, 8).then((res: any) => {
            setUgc(res.posts)
        })
    }, [])
    const obj = {
        "home": "Home",
        "list": "Index",
    }
    return (
        <div>
            <div className="wrap">
                <nav>
                    {Object.keys(obj).map(key => {
                        return <li><i className={`icon-font icon-${key}`}></i>{obj[key]}</li>
                    })}
                </nav>
                <main>
                    <h1>Recommend Videos</h1>
                    <ListA posts={recommend} />
                    <h1>Top10 Animes</h1>
                    <ListB posts={rank} />
                    <h1>UGC Videos</h1>
                    <ListA posts={ugc} />
                </main>
            </div>
        </div>
    )
}