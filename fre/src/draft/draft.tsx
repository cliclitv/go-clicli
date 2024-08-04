import { useState, useEffect } from "fre"
import { push } from "../use-route"
import { addPost, getGonggao, getPost, getPostB, getPostDetail, getUser } from "../util/api"
import './draft.css'

let lock = false

export const gametags = [
    '鬼畜', 'AMV/MAD', '音乐·PV', '游戏·GMV', 'VOCALOID',
    '原神', '星穹铁道', '崩坏三', '明日方舟', '火影忍者', '三国杀', '绝区零', '反恐精英', '英雄联盟', '王者荣耀', '塞尔达', '碧蓝航线', '鸣潮', '无畏契约', '我的世界', '其他游戏'
]

const tags1 = [['推荐', '幻灯', '国漫', '美漫', '剧场版', '漫画改', '小说改', '游戏改', '异世界', '耽美', '乙女', '百合', '后宫', '热血', '战斗', '运动', '奇幻', '神魔', '治愈',
    '搞笑', '冒险', '校园', '恐怖', '穿越', '推理', '科幻', '日常', '古风', '恋爱', '纯爱', 'r15', '泡面番', '黄金厕纸',
    '特摄', '真人剧'], [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, '更早'], '一月', '四月', '七月', '十月']


export default function Upload(props) {
    const [post, setPost] = useState({ title: "", status: "待审核", sort: "原创", time: "", content: "", tag: "", videos: "" })
    const user = getUser()
    const [tag, setTag] = useState([])
    const [draft, setDraft] = useState([])
    const [tags, setTags] = useState(tags1.flat())
    const [url, setUrl] = useState('')

    useEffect(() => {
        window.md = new (window as any).TinyMDE(document.querySelector('textarea'))
    }, [])


    useEffect(() => {

        if (props.id > 0) {
            getPostDetail(props.id).then((res: any) => {
                setPost(res.result)
                setTag(res.result.tag.split(' '))
            })

        } else if (props.id == '00') {

            getPostB('直播', '', 1, 1, '', user.id).then(res => {
                const data = {
                    videos: `HLS$https://cliclius.deno.dev/live/uu${getUser().id}.m3u8`,
                    sort: "直播",
                    status: 'public'
                } as any
                if (res.posts) {
                    data['id'] = res.posts[0].id
                    data['title'] = res.posts[0].title
                    data['content'] = res.posts[0].content
                    data['tag'] = res.posts[0].tag
                    setUrl(`https://www.clicli.cc/play/gv${data['id']}`)
                }
                setPost(data)

            })
        }
        if (user && props.id !== '00') {
            getPostB("", "", 1, 200, "", user?.id).then((res: any) => {
                setDraft(res.posts)
            })
            getGonggao().then(res => {
                let t = tags.concat(res.result.videos.split('\n'))
                setTags([...new Set(t)])
            })
        }
    }, [props.id])

    function change(key, val) {
        setPost({
            ...post,
            [key as any]: val,
        } as any)
    }

    function selectTag(item) {
        let a = tag
        if (tag.includes(item)) {
            a = tag.filter(i => i != item)
        } else {
            a = tag.concat([item])
        }
        setTag(a)
        change('tag', a.join(' '))
    }


    function submit() {
        if (lock) {
            return
        }
        console.log(post)
        if (!post.title || !post.content || !post.sort || !post.tag) {
            alert("都要填")
            return
        }
        lock = true


        addPost(post as any).then(res => {
            lock = false
            const gv = res.result?.id ? 'gv' + res.result?.id : ''
            alert((res.msg || '搞定^_^ ') + gv)
        })

    }

    const openWindow = (url) => {
        let myWindow = window.open(url, '', 'width=800,height=600,toolbar=no,menubar=no,scrollbars=no,resizeable=no,location=0,status=no')
        myWindow.focus()
    }

    return (
        <div className="wrap section" style={{ display: 'flex' }}>
            <div className="upload">
                <div className="title">
                    <input type="text" placeholder="请输入标题" value={post.title} onInput={e => change('title', e.target.value)} />
                </div>
                <section>
                    <i class="te te-bold" onclick={() => window.md.bold()}></i>
                    <i class="te te-italic" onclick={() => window.md.italic()}></i>
                    <i class="te te-quote" onclick={() => window.md.quote()}></i>
                    <i class="te te-image" onclick={() => window.md.image()}></i>
                    <i class="te te-link" onclick={() => window.md.link()}></i>
                    <i class="te te-code" onclick={() => window.md.blockCode()}></i>
                    <i class="te te-upload" onclick={() => openWindow('https://bcy-upload.deno.dev')}></i>
                </section>
                <textarea spellcheck="false" placeholder="请输入简介，支持 markdown 语法" value={post.content} onInput={e => change('content', e.target.value)}></textarea>
                {
                    props.id !== '00' && <textarea spellcheck="false" placeholder={
                        `直链框，请输入标题+$+直链，如：第一话$https://clicli.cc/001.mp4\n多个分P用回车隔开`
                    } value={post.videos} class="videos" onInput={e => change('videos', e.target.value)}></textarea>
                }

                {props.id !== '00' && <div className="options">
                    <select onInput={e => change('status', e.target.value)}>
                        <option value="wait" selected={post.status === 'wait'}>待审核</option>
                        <option value="remove" selected={post.status === 'remove'}>待删除</option>
                        <option value="under" selected={post.status === 'under'}>已下架</option>
                        {(user?.level & 0b1100) !== 0 && <option value="public" selected={post.status === 'public'}>发布</option>}
                    </select>
                    <select onInput={e => change('sort', e.target.value)}>
                        <option value="新番" selected={post.sort === '新番'}>新番</option>
                        <option value="完结" selected={post.sort === '完结'}>完结</option>
                        <option value="原创" selected={post.sort === '原创'}>原创</option>
                        <option value="直播" selected={post.sort === '直播'}>直播</option>
                    </select>
                    {props.id > 0 && <input type="text" value={post.time} onInput={e => change('time', e.target.value)} />}
                </div>}
                <div className="tags">
                    <ul>
                        {(post.sort === '原创' || post.sort === '直播' ? gametags : tags).map((item, index) => <li onClick={() => selectTag(item)} key={index.toString()}
                            className={tag.includes(item) ? 'active' : ''}>{item}</li>)}
                    </ul>

                </div>
                <div className="submit" onClick={submit}>
                    <button>发布</button>
                </div>
            </div>
            {(user && props.id !== '00') && <div className="draft">
                <p>草稿箱</p>
                <ul>
                    {(draft || []).map(item => {
                        return <li class={props.id === item.id.toString() ? 'active' : ''} onclick={() => push(`/draft/${item.id}`)}>{item.title}</li>
                    })}
                </ul>
            </div>}
            {(user && props.id === '00') && <div className="draft">
                <p>直播教程</p>
                <article>
                    1. 发布直播信息，在左侧编写然后点发布
                    2. 电脑使用 <a href="https://obsproject.com/" target="__blank">OBS</a>，服务器填写 <pre>rtmp://www.clicli.us/live/</pre>推流码填写 <pre>uu{user.id}</pre>
                    3. 手机使用<a href="https://www.sinsam.com/sm/download/?t=2" target="__blank">芯象</a>，推流地址填写 <pre>rtmp://www.clicli.us/live/uu{user.id}</pre>
                    4. 最后打开播放地址<pre>{url}</pre>播放
                </article>

            </div>}
        </div>
    )
}
