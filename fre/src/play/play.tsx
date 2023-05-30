import { h, useEffect, useState, useRef } from 'fre'
import { getPlayUrl, getPostDetail, getPv, getTransfer, getUser } from '../util/api'
import { getAv, getSuo } from '../util/avatar'
import snarkdown from 'snarkdown'
import './play.css'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import Comment from '../comment/comment'

export default function Post({ gv }) {
    const id = getAv(gv)
    const [post, setPost] = useState({} as any)
    const [videos, setVideos] = useState([])
    const [play, setPlay] = useState("")
    const [pv, setPv] = useState("")
    const a = useRef({} as any)
    const [show, setShow] = useState(false)
    const [idx, setId] = useState(0)

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
            // a.current.innerHTML = snarkdown((res1 as any).result.content)
        })

    }, [])

    useEffect(() => {
        const a = document.querySelector('article')
        if (post.content) {
            a.innerHTML = snarkdown(post?.content)
        }
    }, [post])


    const changeid = (i) => {
        setPlay(videos[i][1])
        getPv(id)
        setId(i)
    }

    const oth = (post.tag || "").indexOf('其它') < 0
    return (
        <main>
            {oth ? (<div class="wrap player">
                <div className="ep-wrap">
                    <Eplayer url={play}></Eplayer>
                </div>
                <div className="p">
                    <div className="info">
                        <div>
                            <div class='avatar-wrap'> <Avatar uqq={post.uqq} /> <li onclick={() => setShow(!show)}>详情{' >'}</li></div>

                            <h1>{post.title}<span>{pv} ℃</span>
                            </h1>
                        </div>
                        <div className="tag">
                            <div className="tags">
                                {post.tag && post.tag.split(' ').filter(t => t.length > 0).map(tag => {
                                    return <li>{tag}</li>
                                })}
                                {(getUser() || {}).level > 1 && <li onclick={() => push(`/upload/${id}`)}>编辑稿子 ⯈</li>}
                            </div>
                        </div>
                        {<div class='article' style={{ display: (show || !oth) ? 'block' : 'none' }}>
                            <div class='xiangqing'>
                                <li>详情</li><p onClick={() => setShow(false)}>×</p>
                            </div>
                            <article ref={a}></article>
                        </div>}

                    </div>
                    <ul>
                        {videos.map((name, index) => {
                            if (name[1].indexOf('v.qq.com') > -1) {
                                return <a href={name[1]} target="_blank"><li class={'active qq'}>{`P${index + 1}. 腾讯正版`}</li></a>
                            }

                            if (name[1].indexOf('iqiyi') > -1) {
                                return <a href={name[1]} target="_blank"><li class={'active bilibili'}>{`P${index + 1}. 爱奇艺正版`}</li></a>
                            }

                            if (name[1].indexOf('bilibili') > -1) {
                                return <a href={name[1]} target="_blank"><li class={'active bilibili'}>{`P${index + 1}. bilibili正版`}</li></a>
                            }
                            return <li class={index == idx ? 'active' : ''} onClick={() => changeid(index)}>{`P${index + 1}. ${videos[index][0]}`}</li>
                        })}
                    </ul>
                </div>
            </div>) : (

                <div class='article2'>
                    <div>
                        <Avatar uqq={post.uqq} />
                        <h1>{post.title}</h1>
                        {(getUser() || {}).level > 1 && <li onclick={() => push(`/upload/${id}`)}>编辑稿子 ⯈</li>}
                    </div>
                    <article></article>
                </div>
            )}

            {post.id && <Comment post={post} />}

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
            // t.current?.shadowRoot?.querySelector('video')?.play()

        })
    }, [props.url])

    return (
        <e-player ref={t} class='ep' />
    )
}