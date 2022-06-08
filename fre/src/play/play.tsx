import { h, useEffect, useState, useRef } from 'fre'
import { getPostDetail, getPv } from '../util/api'
import { getAv, getAvatar } from '../util/avatar'
import snarkdown from 'snarkdown'
import { get } from '../util/post'
import { A, push } from '../use-route'
import './play.css'

export default function Post({ gv }) {
    const id = getAv(gv)
    const [post, setPost] = useState({} as any)
    const [videos, setVideos] = useState([])
    const [play, setPlay] = useState("")
    const [pv, setPv] = useState("")
    const a = useRef({} as any)
    const [show, setShow] = useState(false)

    useEffect(() => {
        const p1 = getPostDetail(id)
        const p2 = getPv(id)
        Promise.all([p1, p2]).then(([res1, res2]) => {
            setPost((res1 as any).result)
            const videos = buildVideos((res1 as any).result.videos || "")
            setVideos(videos)
            if (videos.length > 0) {
                setPlay(videos[0][1])
            }
            setPv((res2 as any).result.pv)
            a.current.innerHTML = snarkdown((res1 as any).result.content)
        })
    }, [])

    return (
        <main>
            <div class="wrap player">
                <div className="ep-wrap">
                    <Eplayer url={play}></Eplayer>
                </div>
                <div className="p">
                    <div className="avatar"><img src={getAvatar(post.uqq)} alt="" /><p>{post.uname}</p></div>
                    <ul>
                        {videos.map((name, index) => {
                            return <li>{index}</li>
                        })}
                    </ul>
                </div>
            </div>
            <div className="info">
                <h1>{post.title}</h1>
                <div className="tag">
                    <p>{pv} ℃</p>
                    <div className="tags">
                        {post.tag && post.tag.split(' ').filter(t => t.length > 0).map(tag => {
                            return <li>{tag}</li>
                        })}
                        <li onclick={() => setShow(!show)}>展开详情 {show ? '⯅' : '⯆'}</li>
                        <li onclick={() => push(`/upload/${id}`)}>编辑稿子 ⯈</li>
                    </div>
                </div>
                {<article ref={a} style={{ display: show ? 'block' : 'none' }}></article>}

            </div>
        </main>
    )
}

function buildVideos(str) {
    return str.split('\n').map(v => v.split('$')).filter(i => i.length > 0 && i[1] != null)
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
        <e-player ref={t} class='ep' />
    )
}