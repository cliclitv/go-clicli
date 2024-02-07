import { render, useState, useEffect, useRef } from "fre"
import { push } from "../use-route"
import { addPost, getDogeToken, getPostB, getPostDetail, getUser, updatePost } from "../util/api"
import './draft.css'

let lock = false

export default function Upload(props) {
    const [post, setPost] = useState({ title: "", status: "待审核", sort: "原创", time: "", content: "", tag: "", videos: "" })
    const user = getUser()
    const [draft, setDraft] = useState([])

    useEffect(() => {
        window.md = new (window as any).TinyMDE(document.querySelector('textarea'))


    }, [])

    // useEffect(() => {
    //     if (post.title && post.content && post.sort && post.tag) {
    //         console.log('???')
    //         setInterval(() => {
    //             console.log('自动保存')
    //             submit()
    //         }, 100000)
    //     }
    // }, [post])

    useEffect(() => {
        if (props.id > 0) {
            getPostDetail(props.id).then((res: any) => {
                setPost(res.result)
            })
        } else {
            // 新增
        }
        getPostB("", "", 1, 200, "", user.id).then(res => {
            setDraft(res.posts)
        })
    }, [props.id])

    function change(key, val) {
        setPost({
            ...post,
            [key as any]: val,
        } as any)
    }

    function selectTag(item) {
        if ((post.tag || '').indexOf(item) > -1) {
            setPost({
                ...post,
                tag: post.tag.replace(` ${item}`, ''),
            })
        } else {
            setPost({
                ...post,
                tag: post.tag + ' ' + item,
            })
        }

    }


    function submit() {
        if (lock) {
            return
        }
        if (!post.title || !post.content || !post.sort || !post.tag) {
            alert("都要填")
            return
        }
        lock = true
        if (props.id > 0) {
            updatePost(post as any).then(res => {
                lock = false
                alert((res.msg || '搞定^_^') + ' gv' + res.result.id)
            })
        } else {
            console.log(post)
            addPost(post as any).then(res => {
                lock = false
                alert((res.msg || '搞定^_^'))
                push(`/my/${getUser().id}`)
            })
        }
    }

    const openWindow = (url) => {
        let myWindow = window.open(url, '', 'width=800,height=600,toolbar=no, menubar=no, scrollbars=no, resizeable=no, location=0, status=no')
        myWindow.focus()
    }
    const tags = ['推荐', '幻灯', '个人原创', '授权转载', '国漫', '剧场版', '漫画改', '小说改', '游戏改', '耽美', '乙女', '百合', '后宫', '热血', '战斗', '运动', '奇幻', '神魔', '治愈',
        '搞笑', '冒险', '校园', '恐怖', '穿越', '推理', '科幻', '日常', '古风', '恋爱', 'r15', '泡面番', '黄金厕纸',
        '特摄', '真人剧', '其它']
    const acgzoneTags = [
        '推荐', '幻灯', '漫画', '动画', '游戏', '小说', '图包', '音乐', '三次元'
    ]
    return (
        <div className="wrap flex">
            <div className="upload">
                <p>编辑</p>
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
                    <i class="te te-upload" onclick={() => openWindow(`https://cdn.clicli.cc/upload?uid=${user.id}`)}></i>
                </section>
                <textarea spellcheck="false" placeholder="请输入简介，支持 markdown 语法" value={post.content} onInput={e => change('content', e.target.value)}></textarea>
                <textarea spellcheck="false" placeholder={post.sort === '里世界'
                    ? `图集框，请输入图床地址，如：https://clicli.cc/001.png\n多图流用回车隔开` :
                    `直链框，请输入标题+$+直链，如：第一话$https://clicli.cc/001.mp4\n多个分P用回车隔开`

                } value={post.videos} class="videos" onInput={e => change('videos', e.target.value)}></textarea>

                <div className="options">
                    <select onInput={e => change('status', e.target.value)}>
                        <option value="wait" selected={post.status === 'wait'}>待审核</option>
                        <option value="remove" selected={post.status === 'remove'}>待删除</option>
                        <option value="under" selected={post.status === 'under'}>已下架</option>
                        {(user.level & 0b1100) !== 0 && <option value="public" selected={post.status === 'public'}>发布</option>}
                    </select>
                    <select onInput={e => change('sort', e.target.value)}>
                        <option value="新番" selected={post.sort === '新番'}>新番</option>
                        <option value="完结" selected={post.sort === '完结'}>完结</option>
                        <option value="里世界" selected={post.sort === '里世界'}>里世界</option>
                    </select>
                    {props.id > 0 && <input type="text" value={post.time} onInput={e => change('time', e.target.value)} />}
                </div>
                <div className="tags">
                    <ul>
                        {(post.sort === '里世界' ? acgzoneTags : tags).map((item, index) => <li onClick={() => selectTag(item)} key={index.toString()}
                            className={(post.tag || '').indexOf(item) > -1 ? 'active' : ''}>{item}</li>)}
                    </ul>

                </div>
                <div className="submit" onClick={submit}>
                    <button>保存</button>
                </div>
            </div>
            <div className="draft">
                <p>草稿箱</p>
                <ul>
                    {(draft || []).map(item => {
                        return <li class={props.id === item.id.toString() ? 'active' : ''} onclick={() => push(`/draft/${item.id}`)}>{item.title}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}
