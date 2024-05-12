import { useEffect, useState, useRef, Fragment } from 'fre'
import { getDanmakus, getPlayUrl, getPostDetail, getPv, getUser } from '../util/api'
import { getAv } from '../util/avatar'
import snarkdown from 'snarkdown'
import './play.css'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import Comment from '../comment/comment'
import Danmaku from '../danmaku/danmaku'
import Danmu from './danmaku'

export default function Post({ gv }) {
    const [id, fp] = getAv(gv)
    const [post, setPost] = useState({} as any)
    const [videos, setVideos] = useState([])
    const [play, setPlay] = useState("")
    const [show, setShow] = useState(0)
    const [idx, setId] = useState(fp - 1)
    const [danmakus, setDanmakus] = useState([])

    var dm

    useEffect(() => {
        const p1 = getPostDetail(id)
        p1.then((res) => {
            setPost((res as any).result)
            const videos = buildVideos((res as any).result.videos || "")
            setVideos(videos)
            if (videos.length > 0) {
                setPlay(videos[0][1])
            }
            // a.current.innerHTML = snarkdown((res1 as any).result.content)
        })

    }, [])

    useEffect(() => {
        const canvas = document.querySelector('canvas')
        const video = document.querySelector('e-player').shadowRoot.querySelector('video')

        getDanmakus(id, idx).then(res => {
            setDanmakus((res as any).danmakus || [])
            console.log((res as any).danmakus)
            dm = new Danmu(canvas, video, (res as any).danmakus)
            video.addEventListener('play', function () {
                console.log("开始播放");
                dm.play()
            });
            video.addEventListener('pause', function () {
                console.log("播放暂停");
                dm.pause()
            });
        })
    }, [])



    const changeid = (i) => {
        setPlay(videos[i][1])
        setId(i)
    }

    return (
        <div class="wrap player">
            <div className="ep-wrap">
                <Eplayer url={play}></Eplayer>
            </div>
            <div className="p">
                <div className="info">
                    <div>
                        <div class='avatar-wrap'>
                            <div style={{ flex: 1 }}>
                                <Avatar uqq={post.uqq} uname={post.uname} />
                            </div>
                            <ul class="tab">
                                <li class={(show == 0) && 'active'} onclick={() => setShow(0)}>分P</li>
                                <li class={(show == 1) && 'active'} onclick={() => setShow(1)}>讨论</li>
                                <li class={(show == 2) && 'active'} onclick={() => setShow(2)}>弹幕</li>
                            </ul>
                        </div>

                        <h1>{post.title}<span>{post.pv} ℃</span>
                        </h1>
                    </div>
                    <div className="tag">
                        <div className="tags">
                            {post.tag && post.tag.split(' ').filter(t => t.length > 0).map(tag => {
                                return <li>{tag}</li>
                            })}
                            {((getUser() || {}).level & 0b1110) > 0 ? <li onclick={() => push(`/draft/${id}`)}>编辑草稿 ⯈</li> : null}
                        </div>
                    </div>
                </div>
                {
                    (show == 0) && <ul>
                        {videos.map((name, index) => {
                            return <li class={index == idx ? 'active' : ''} onClick={() => changeid(index)}>{`P${index + 1}. ${videos[index][0]}`}</li>
                        })}
                    </ul>
                }
                {
                    (show == 1) && post.id && <Comment post={post}></Comment>
                }

                {
                    (show == 2) && post.id && <Danmaku post={post} p={idx} danmakus={danmakus}></Danmaku>
                }
            </div>
        </div>


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
            if (t.current) {
                t.current.setAttribute('type', type)
                t.current.setAttribute('src', res.result.url)
            }
        })
    }, [props.url])

    return (
        <>
            <canvas id="danmaku"></canvas>
            <e-player ref={t} class='ep' />
        </>
    )
}
