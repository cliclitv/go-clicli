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
        // getPost('纯爱', '', 1, 8).then((res: any) => {
        //     setRecommend(res.posts)
        // })
        // getPost('', '其它', 1, 5).then((res: any) => {
        //     setOther(res.posts)
        // })
        // getPost('短篇', '', 1, 10).then((res: any) => {
        //     setShort(res.posts)
        // })
        // getPostDetail(30).then(res => {
        //     setTip(res.result)
        // })
    }, [])


    return (
        <main class="wrap main">
            <h1>Fanfic</h1>
            <h2>一款由于半次元停服而产生的APP</h2>
            <div>
                {/* <img src="https://cdn-us.imgs.moe/2023/06/17/648d4af9bc8be.png" alt="" class="logo" /> */}
                <img src="https://cdn-us.imgs.moe/2023/06/17/648d5c210f99c.png" alt="" />
            </div>
            <a href="https://npm.elemecdn.com/bcy-app@0.0.2-beta1/web/app-release.apk"><button>下载</button></a>
            <div>投稿 & 数据迁移请加群：863417519</div>
            <div>发布页地址：https://fanfic.com.cn</div>
        </main>
    )
}