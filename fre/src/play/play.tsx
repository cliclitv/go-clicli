import { useEffect, useState, useRef, Fragment } from 'fre'
import { getDanmakus, getPlayUrl, getPostDetail, getPv, getUser, getUserB, getUsers } from '../util/api'
import { getAv, getAvatar, getSuo } from '../util/avatar'
import './play.css'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import Comment from '../comment/comment'
import Danmaku from '../danmaku/danmaku'
import Danmu from './danmaku'
import { get } from '../util/post'

export default function Post({ gv, uu }) {
    const [id, fp] = getAv(gv || uu)
    const [post, setPost] = useState({} as any)
    const [videos, setVideos] = useState([])
    const [play, setPlay] = useState("")
    const [show, setShow] = useState(0)
    const [idx, setId] = useState(fp - 1)
    const [danmakus, setDanmakus] = useState([])
    const [source, setSource] = useState('')
    const [authors, setAuthors] = useState('')

    useEffect(() => {
        if (gv) {
            getPostDetail(id).then((res: any) => {
                setPost((res as any).result)
                const videos = buildVideos((res as any).result.videos || "", res.result.uname)
                const names = buildNames(videos)
                if (names.length > 1) {
                    getUsers(names).then((res: any) => {
                        setAuthors(res.users)
                    })
                }
                setVideos(videos)
                setSource(res.result.uname)
                console.log(videos)
                if (videos.length > 0) {
                    const url = videos[0][1]
                    console.log(url)
                    fetch(url).then(res => {
                        console.log(res)
                        if (res.status === 403) {
                            setPlay(null)
                        } else {
                            setPlay(url)
                        }
                    })
                }
            })
        }

        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    useEffect(() => {
        getDanmakus(id, idx).then(res => {
            setDanmakus((res as any).danmakus || [])

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
    const isLive = post.sort === '直播'

    return (
        <div class="wrap player">

            {isOther ? <Eimage content={post.content || ''}></Eimage> : <Eplayer url={play} live={isLive}></Eplayer>}

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
                            {(((getUser() || {}).level & 0b1110) > 0 && !uu) ? <li onclick={() => push(`/draft/${id}`)}>编辑草稿 ⯈</li> : null}
                        </div>
                    </div>
                </div>
                {
                    (show == 0) && <>
                        <ul class="tabs">
                            {(authors || []).map((item, i) => {
                                return <div class={item.name == source ? 'active' : ''} onClick={() => setSource(item.name)}>
                                    <Avatar uqq={item.qq}></Avatar>
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
                console.log(props.live)
                if (props.live) {
                    t.current.setAttribute('live', props.live)
                }
            }
        })
    }, [props.url, props.live])

    useEffect(() => {
        const messages = [
            '来了来了',
            '沙发~',
            '准时到达',
            '发个弹幕见证一下',
            'c站招募投稿君',
            'c站招募主播',
            'up主威武',
            'c站发光发热',
            '发一下弹幕菊花有不会坏',
            '有人在吗',
            '兄弟们又见面了',
            '哈哈哈哈哈',
            '呵呵呵',
            '嘻嘻'
        ]


        for (let i = 0; i < 100; i++) {

            document.querySelector('e-player').setAttribute('danma', messages[Math.random() * messages.length] as string)
        }



    }, [])

    return (
        <div className="ep-wrap">
            {props.url != null ? <e-player ref={t} class='ep' /> : <h1>没有正在播放的视频流</h1>}
        </div>
    )
}


function Eimage({ content }) {
    return <div className="ei-wrap">
        <img src={getSuo(content)}></img>
    </div>
}