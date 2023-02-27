import { h, useEffect, useState, useRef } from 'fre'
import { getPlayUrl, getPostDetail, getPv, getTransfer, getUser } from '../util/api'
import { getAv, getSuo } from '../util/avatar'
import snarkdown from 'snarkdown'
import './play.css'
import Avatar from '../component/avatar/avatar'

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

    useEffect(()=>{
        const root = document.querySelector('e-player')
        const video = root.shadowRoot.querySelector('#video')
        const img = document.querySelector('.image')
        console.log(img)

        video.addEventListener('play', function () { //播放开始执行的函数
            img && img.setAttribute('style','animation-play-state: running;')
        });

        video.addEventListener('pause', function () { //播放开始执行的函数
            img && img.setAttribute('style','animation-play-state: paused;')
        });

        video.addEventListener('ended', function () { //播放开始执行的函数
            img && img.setAttribute('style','animation-play-state: paused;')
        });
    },[post.content])

    const changeid = (id) => {
        setPlay(videos[id][1])
    }

    const transfer = () => {
        getTransfer({ from: getUser()?.id, to: post.uid }).then(res => {
            alert(`${(res as any).msg}`)
        })
    }

    const oth = (post.tag || "").indexOf('其它') < 0

    return (
        <main>
            {oth ? (<div class="wrap player">
                <div className="ep-wrap">
                    {post && post.sort === '广播剧' &&
                        <div className="poster">
                            <img src={getSuo(post.content)} class="image"/>
                        </div>
                    }
                    <Eplayer url={play}></Eplayer>
                </div>
                <div className="p">
                    <Avatar uqq={post.uqq} uname={post.uname} utime={post.utime} />
                    <ul>
                        {videos.map((name, index) => {
                            return <li onClick={() => changeid(index)}>{index + 1}</li>
                        })}
                    </ul>
                </div>
            </div>) : <div></div>}
            <div className="info">
                <h1>{post.title}</h1>
                <div className="tag">
                    <p>{pv} ℃</p>
                    <div className="tags">
                        {post.tag && post.tag.split(' ').filter(t => t.length > 0).map(tag => {
                            return <li>{tag}</li>
                        })}
                        <li onclick={() => setShow(!show)}>展开详情 {show ? '⯅' : '⯆'}</li>
                    </div>
                </div>
                {<article ref={a} style={{ display: (show || !oth) ? 'block' : 'none' }}></article>}

            </div>
        </main>
    )
}

export function buildVideos(str) {
    return str.split('\n').map(v => v.split('$')).filter(i => i.length > 0 && i[1] != null)
}

export function Eplayer(props) {
    const t = useRef(null)
    useEffect(() => {
        getPlayUrl(props.url).then((res: any) => {
            const type = res.result.mtype === "m3u8" ? "hls" : res.result.mtype
            t.current.setAttribute('type', type)
            t.current.setAttribute('src', res.result.url)
        })
    }, [props.url])

    return (
        <e-player ref={t} class='ep' />
    )
}