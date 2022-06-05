import { h, useEffect, useState } from 'fre'
import { getAvatar } from '../util/avatar'
import { get } from '../util/post'

export default function Detail() {
    const [detail, setDetail] = useState({} as any)
    const [pv, setPv] = useState(0 as any)
    useEffect(() => {

        get('https://api.clicli.cc/post/4').then((res: any) => {
            get('https://api.clicli.cc/pv/4').then((res2: any) => {
                setDetail(res.result)
                setPv(res2.result.pv)
            })
        })
    }, [])
    return <div class="detail">
        <h1>{detail.title}</h1>
        <div className="author">
            <div className="avatar">
                <img src={getAvatar(detail.uqq)} alt="" />
            </div>
            <div className="user">
                <div className="name">{detail.uname}</div>
                <div className="uid">{detail.uid}</div>
            </div>
            <div className="time">
                投稿时间<br />
                {detail.time}
            </div>
            <div className="time">
                gv号<br />
                {detail.id}
            </div>
            <div className="time">
                热度<br />
                {pv} ℃
            </div>
            <div className="time">
                标签<br />
                {detail.tag}
            </div>
        </div>
    </div>
}