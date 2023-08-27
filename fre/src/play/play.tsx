import { h, useEffect, useState, useRef } from 'fre'
import { getPlayUrl, getPostDetail, getPv, getTransfer, getUser } from '../util/api'
import { getAv, getSuo } from '../util/avatar'
import snarkdown from 'snarkdown'
import './play.css'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'
import Comment from '../comment/comment'
import { renderYmal } from '../util/ymal'

export default function Post({ gv }) {
    console.log(gv)
    const [id, fp] = getAv(gv)
    const [post, setPost] = useState({} as any)
    const [videos, setVideos] = useState([])
    const [play, setPlay] = useState("")
    const [pv, setPv] = useState("")
    const a = useRef({} as any)
    const [show, setShow] = useState(false)
    const [idx, setId] = useState(fp - 1)

    console.log(id, fp)

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


    const changeid = (i) => {
        setPlay(videos[i][1])
        getPv(id)
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
                            <Avatar uqq={post.uqq} uname={post.uname} />
                            <ul class="tab">
                                <li class={show && 'active'} onclick={() => setShow(true)}>分P</li>
                                <li class={!show && 'active'} onclick={() => setShow(false)}>讨论</li>
                            </ul>
                        </div>

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

                </div>

                {
                    show && <ul>
                        {videos.map((name, index) => {
                            return <li class={index == idx ? 'active' : ''} onClick={() => changeid(index)}>{`P${index + 1}. ${videos[index][0]}`}</li>
                        })}
                    </ul>
                }
                {
                    !show && post.id && <Comment post={post}></Comment>
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
        <e-player ref={t} class='ep' />
    )
}