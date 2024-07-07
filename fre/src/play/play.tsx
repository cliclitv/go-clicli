import { useEffect, useState, useRef, Fragment } from 'fre'
import { getDanmakus, getPlayUrl, getPostDetail, getPv, getUser, getUserB, getUsers } from '../util/api'
import { getAv, getSuo } from '../util/avatar'
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
    const [source, setSource] = useState('')
    const [authors, setAuthors] = useState('')
    const [beat, setBeat] = useState('')

    useEffect(() => {
        getPostDetail(id).then((res: any) => {
            setPost((res as any).result)
            const videos = buildVideos((res as any).result.videos || "", res.result.uname)
            const names = buildNames(videos)
            if (names.length > 0) {
                getUsers(names).then((res: any) => {
                    setAuthors(res.users)
                })
            }
            setVideos(videos)
            setSource(res.result.uname)
            if (videos.length > 0) {
                setPlay(videos[0][1])
                setBeat(videos[0][2])
            }
        })
        document.body.style.overflow = 'hidden'
        return ()=>{
            document.body.style.overflow = 'auto'
        }
    }, [])

    useEffect(() => {
        const canvas = document.querySelector('canvas')
        const video = document.querySelector('e-player').shadowRoot.querySelector('video')

        getDanmakus(id, idx).then(res => {
            setDanmakus((res as any).danmakus || [])
            window.dm = new Danmu(canvas, video, (res as any).danmakus || [])
            video.addEventListener('play', function () {
                console.log("开始播放")
                window.dm.play()
            })
            video.addEventListener('pause', function () {
                console.log("播放暂停")
                window.dm.pause()
            })
        })
    }, [])

    useEffect(() => {
        if (isOther) {
            setShow(1)
        }
    }, [post])


    const changeid = (i) => {
        const v = videos
        setPlay(v[i][1])
        setId(i)
    }

    const isOther = post.tag?.includes('其它')
    const isMug = post.tag?.includes('音游')
    const isLive = post.tag?.includes('直播')

    return (
        <div class="wrap player">

            {isOther ? <Eimage content={post.content || ''}></Eimage> : <Eplayer url={play} isMug={isMug} beat={beat} live={isLive}></Eplayer>}

            <div className="p" style={{ height: isOther ? '800px' : '565px' }}>
                <div className="info">
                    <div>
                        <div class='avatar-wrap'>
                            <div style={{ flex: 1 }}>
                                {isOther && <Avatar uqq={post.uqq} uname={post.uname} />}
                            </div>
                            {
                                !isOther && <ul class="tab">
                                    <li class={(show == 0) && 'active'} onclick={() => setShow(0)}>分P</li>
                                    <li class={(show == 1) && 'active'} onclick={() => setShow(1)}>讨论</li>
                                    <li class={(show == 2) && 'active'} onclick={() => setShow(2)}>弹幕</li>
                                </ul>
                            }
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
                    (show == 0) && <>
                        <ul class="tabs">
                            {(authors || []).map((item, i) => {
                                return <div class={item.name == source ? 'active' : ''} onClick={() => setSource(item.name)}>
                                    <Avatar uqq={item.qq} noname={true}></Avatar>
                                </div>
                            })}
                        </ul>
                        <ul>
                            {(buildNameVideos(videos, source) || []).map((video, ii) => {
                                return <li class={video[3] == idx ? 'active' : ''} onClick={() => changeid(video[3])}>{`${video[0]}`}</li>
                            })}
                        </ul>
                    </>
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

export function buildVideos(str, uname) {
    return str.split('\n').map((v, i) => {
        const [title, content, name] = v.split('$')
        return [title, content, name || uname, i]
    }).filter(i => i.length > 0 && i[1] != null)
}

export function buildNames(videos) {
    if (!videos) return []
    const names = []

    videos.forEach((varr) => {
        let [title, content, name] = varr
        if (!names.includes(name) && !name.includes(":")) {
            names.push(name)
        }
    })
    return names
}

export function buildNameVideos(videos, name) {
    return videos.filter(item => item[2] == name)
}

export function Eplayer(props) {
    const t = useRef(null)
    useEffect(() => {
        getPlayUrl(props.url).then((res: any) => {
            const type = res.result.mtype === "m3u8" ? "hls" : res.result.mtype
            if (t.current) {
                t.current.setAttribute('type', type)
                t.current.setAttribute('src', res.result.url)
                if (props.isMug) {
                    t.current.setAttribute('beatmap', props.beat)
                    t.current.setAttribute('height', '565')
                }
                if(props.live){
                    t.current.setAttribute('live', props.live)
                }
            }
        })
    }, [props.url])

    return (
        <div className="ep-wrap">
            <canvas id="danmaku"></canvas>
            <e-player ref={t} class='ep' />
        </div>
    )
}


function Eimage({ content }) {
    return <div className="ei-wrap">
        <img src={getSuo(content)}></img>
    </div>
}