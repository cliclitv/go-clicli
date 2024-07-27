import { useEffect, useState, useRef, Fragment } from 'fre'
import { addComment, getComments, getDanmakus, getPlayUrl, getPostDetail, getPv, getRandomAD, getUser, getUserB, getUsers } from '../util/api'
import { getAv, getAvatar, getSuo, removeSuo } from '../util/avatar'
import './play.css'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import { hotIcon, rssIcon } from '../util/icons'
import Markdown from '../component/md/md'

export default function Post({ gv, uu }) {
    const [id, fp] = getAv(gv || uu)
    const [post, setPost] = useState({} as any)
    const [videos, setVideos] = useState([])
    const [play, setPlay] = useState("")
    const [show, setShow] = useState(0)
    const [idx, setId] = useState(fp - 1)
    const [source, setSource] = useState('')
    const [authors, setAuthors] = useState('')
    const [danmakus, setDanmakus] = useState([])

    useEffect(() => {
        if (gv) {
            getComments(id, 0).then(res => {
                const dammas = (res as any).comments || []
                dammas.forEach(item => {
                    document.querySelector('e-player').setAttribute('danma', item.content)
                })
                setDanmakus(dammas)
            })
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
                    const url = videos[0][1]
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

            {isOther ? <Eimage content={post.content || ''}></Eimage> : <Eplayer url={play} live={isLive} post={post} idx={idx}></Eplayer>}

            <div className="p" style={{ height: '620px' }}>
                {
                    <ul class="tab">
                        <li class={(show == 0) && 'active'} onclick={() => setShow(0)}>{isOther ? '简介' : '分P'}</li>
                        <li class={(show == 1) && 'active'} onclick={() => setShow(1)}>弹幕</li>
                    </ul>
                }
                {
                    (show == 0) && <>
                        <div className="info">

                            <h1>{post.title}</h1>

                            <div className="tag">
                                <div className="tags">
                                    {post.tag && post.tag.split(' ').filter(t => t.length > 0).map(tag => {
                                        return <li>{tag}</li>
                                    })}
                                    {(((getUser() || {}).level & 0b1110) > 0 && !uu) ? <li onclick={() => push(`/draft/${id}`)}>编辑草稿 ⯈</li> : null}
                                </div>
                            </div>
                        </div>
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
                        {isOther && <Markdown text={removeSuo(post.content)}></Markdown>}
                    </>
                }
                {
                    (show == 1) && <Comment post={post} danmakus={danmakus || []}></Comment>
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
    const [comment, setComment] = useState('')
    const [ad, setAD] = useState({})
    const adref = useRef(null)

    useEffect(() => {
        const ep = window.customElements.get('e-player') as any

        ep.use('play', (host) => {
            document.querySelector('.ep-ad').style.display = 'none'
        })

        ep.use('pause', () => {

            getRandomAD().then(res => {
                setAD(res.data)
                document.querySelector('.ep-ad').style.display = 'block'
            })

        })

    }, [])

    useEffect(() => {
        getPlayUrl(props.url).then((res: any) => {
            const type = res.result.mtype === "m3u8" ? "hls" : res.result.mtype
            if (t.current) {
                t.current.setAttribute('type', type)
                t.current.setAttribute('src', res.result.url)
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


        for (let i = 0; i < 20; i++) {
            document.querySelector('e-player').setAttribute('danma', messages[parseInt(Math.random() * messages.length) as any] as string)
        }
    }, [props.url])

    function submit() {
        if (comment.length < 1) {
            return
        }
        const time = document.querySelector('e-player').shadowRoot.querySelector('video').currentTime
        addComment({
            pid: props.post.id,
            rid: 0,
            ruid: props.post.uid,
            rstr: [props.idx, time | 0, 'ffffff'].join('|'),
            content: comment,
        } as any).then((res: any) => {
            document.querySelector('e-player').setAttribute('danma', comment)
            setComment('')
        })

    }
    const user = getUser()

    return (
        <div style={{ 'position': 'relative' }}>
            <div class="ep-ad" t={adref}>
                <a href={ad.url} target="__blank">戳我跳转</a>
                <div className="suo" style={{
                    'background-image': `url(${ad.img})`,
                    'background-size': 'cover'
                }}>

                </div>
            </div>
            <div className="ep-wrap">
                {props.url != null ? <e-player ref={t} /> : <h1>没有正在播放的视频流</h1>}

            </div>
            <div class="comment-wrap">
                <div class="hot">
                    <span><i ref={dom => dom && (dom.innerHTML = hotIcon)}></i>{props.post.pv}℃</span>
                    <span><i ref={dom => dom && (dom.innerHTML = rssIcon)}></i>共有{props.post.uv?.split(',').length ?? 0}人追番</span>
                </div>
                <div className="comment-input">
                    <Avatar uqq={user?.qq}></Avatar>
                    <input type="text" placeholder="发个弹幕，见证当下" onInput={(e) => setComment(e.target.value)} value={comment} />
                    {user?.id ? <button onClick={submit}>发射</button> : <button onclick={() => push('/login')}>登录</button>}
                </div>
            </div>
        </div >
    )
}


function Eimage({ content }) {
    return <div className="ei-wrap">
        <img src={getSuo(content)} loading="lazy"></img>
    </div>
}

export function Comment({ post, danmakus }) {
    return <div>
        <div class="comment">
            <h1>共有{danmakus ? danmakus.length : 0}条弹幕</h1>
            {danmakus && danmakus.map(item => {
                return <div>
                    <div className="comment-item">
                        <Avatar uqq={item.uqq}></Avatar>
                        <p>{item.uname}: </p>
                        <p>{item.content}</p>
                    </div>
                </div>
            })}
        </div>
    </div>
}
