import { render, useState,  useEffect, useRef } from "fre"
import { push } from "../use-route";
import { addPost, getDogeToken, getPostDetail, getUser, updatePost } from "../util/api"
import './upload.css'

let lock = false;

export default function Upload(props) {
    const [post, setPost] = useState({ title: "", status: "待审核", sort: "原创", time: "", content: "", tag: "", videos: "" })
    const user = getUser()

    useEffect(() => {
        window.md = new (window as any).TinyMDE(document.querySelector('textarea'))
        if (props.id > 0) {
            getPostDetail(props.id).then((res: any) => {
                setPost(res.result)
            })
        } else {
            // 新增
        }
    }, [])

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
        let myWindow = window.open(url, '', 'width=800,height=600,toolbar=no, menubar=no, scrollbars=no, resizeable=no, location=0, status=no');
        myWindow.focus();
    }
    const tags = ['推荐', '个人原创', '授权转载', '国漫', '剧场版', '漫画改', '小说改', '游戏改', '耽美', '乙女', '百合', '后宫', '热血', '战斗', '运动', '奇幻', '神魔', '治愈',
        '搞笑', '冒险', '校园', '恐怖', '穿越', '推理', '科幻', '日常', '古风', '恋爱', 'r15', '泡面番', '黄金厕纸',
        '特摄', '真人剧', '其它']
    const gametags = [
        '鬼畜', 'AMV/MAD', '音乐·PV', '游戏·GMV', 'VOCALOID',
        '原神', '星穹铁道', '崩坏三', '明日方舟', '火影忍者', '三国杀', '绝区零', '反恐精英', '英雄联盟', '王者荣耀', '塞尔达', '碧蓝航线', '鸣潮', '无畏契约', '我的世界', '其他原创', '小程序', '小游戏'
    ]

    const maotags = ['动画', '漫画', '游戏', '广播剧', '画集', '文章']
    return (
        <div className="wrap">
            <div className="upload">
                <h1>投稿</h1>
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
                <textarea spellcheck="false" placeholder={`直链框，请输入标题+$+直链，如：第一话$https://clicli.cc/001.mp4\n多个分P用回车隔开`} value={post.videos} class="videos" onInput={e => change('videos', e.target.value)}></textarea>

                <div className="options">
                    <select onInput={e => change('status', e.target.value)}>
                        <option value="wait" selected={post.status === 'wait'}>待审核</option>
                        <option value="remove" selected={post.status === 'remove'}>待删除</option>
                        <option value="under" selected={post.status === 'under'}>已下架</option>
                        {user.level > 2 && <option value="public" selected={post.status === 'public'}>发布</option>}
                    </select>
                    <select onInput={e => change('sort', e.target.value)}>
                        <option value="新番" selected={post.sort === '新番'}>新番</option>
                        <option value="完结" selected={post.sort === '完结'}>完结</option>
                        <option value="推流" selected={post.sort === '推流'}>推流</option>
                        <option value="原创" selected={post.sort === '原创'}>原创</option>
                        <option value="漫画解说" selected={post.sort === '漫画解说'}>漫画解说</option>
                        <option value="漫剧" selected={post.sort === '漫剧'}>漫剧</option>
                    </select>
                    {props.id > 0 && <input type="text" value={post.time} onInput={e => change('time', e.target.value)} />}
                </div>
                <div className="tags">
                    <ul>
                        {(post.sort === '原创' ? gametags : tags).map((item, index) => <li onClick={() => selectTag(item)} key={index.toString()}
                            className={(post.tag || '').indexOf(item) > -1 ? 'active' : ''}>{item}</li>)}
                    </ul>
                </div>
                <div className="submit" onClick={submit}>
                    <button>发布
                    </button>
                </div>
            </div>
        </div>
    )
}
