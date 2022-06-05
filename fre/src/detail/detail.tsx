import { h, useEffect, useState, useRef } from 'fre'
import { getAvatar } from '../util/avatar'
import { get } from '../util/post'
import './detail.css'

export default function Detail() {
    const [detail, setDetail] = useState({} as any)
    const [pv, setPv] = useState(0 as any)
    const [videos, setVideos] = useState([])
    const [play, setPlay] = useState("")
    useEffect(() => {
        get('https://api.clicli.cc/post/4').then((res: any) => {
            get('https://api.clicli.cc/pv/4').then((res2: any) => {
                setDetail(res.result)
                setPv(res2.result.pv)
                let videos = buildVideos(res.result.videos)
                setVideos(videos)
                setPlay(videos[0][1])
            })
        })
    }, [])

    const list = {
        '投稿时间': detail.time,
        'gv号': detail.id,
        '热度': `${pv} ℃`,
        '标签': detail.tag,
        '分类': detail.sort
    }

    console.log(videos)
    return <div class="detail">
        <h1>{detail.title}</h1>
        <div class="author">
            <div class="avatar">
                <img src={getAvatar(detail.uqq)} alt="" />
            </div>
            <div class="user">
                <div class="name">{detail.uname}</div>
                <div class="uid">uid {detail.uid}</div>
            </div>
            {Object.keys(list).map(key => <li>
                <b>{key}</b><br />
                {list[key]}
            </li>
            )}

        </div>
        <div class="videos">
            {videos.map(v => {
                return <li>{v[0]}</li>
            })}
        </div>
        <div class="play">
            <div class="left">
                <div class="topic">这里可以是广告？</div>
                <Eplayer url={play} />
            </div>
            <div class="right">
                <ul class="tab"><li class="active">弹幕列表</li><li>联合投稿</li></ul>
                <div className="danmu">
                    <ul>
                        {/* <li>
                            <span class="text">文字</span>
                            <span>位置</span>
                            <span>发送时间</span></li> */}
                        <li>
                        <span class="text">还没有内容~</span><span>00:00</span>
                            <span>2022-06-06 14:50</span></li><li>
                        <span class="text">还没有内容~</span><span>00:00</span>
                            <span>2022-06-06 14:50</span></li> </ul>
                </div>
            </div>
        </div>
    </div>
}

function buildVideos(str) {
    return str.split('\n').map(v => v.split(' ')).filter(i => i.length > 0 && i[1] != null)
}

export function Eplayer(props) {
    const t = useRef(null)
    useEffect(() => {
        get(`https://api.clicli.cc/play?url=${props.url}`).then((res: any) => {
            const type = res.result.mtype === "m3u8" ? "hls" : res.result.mtype
            t.current.setAttribute('type', type)
            t.current.setAttribute('src', res.result.url)
        })
    }, [props.url])

    return (
        <div class='ep-wrap'>
            <e-player ref={t} class='ep' />
        </div>
    )
}