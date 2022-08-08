import { render, useState, h, useEffect } from "fre"
import { addPost, getPostDetail, updatePost } from "../util/api"
import './upload.css'

export default function Upload(props) {
    const [post, setPost] = useState({ title: "", status: "", sort: "", time: "", content: "", tag: "", videos: "" })

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
        console.log(key, val)
        setPost({
            ...post,
            [key as any]: val,
        } as any)
    }

    function selectTag(item) {
        if (post.tag.indexOf(item) > -1) {
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
        if (props.id > 0) {
            updatePost(post as any).then(res => {
                alert("更新成功啦！")
            })
        } else {
            console.log(post)
            addPost(post as any).then(res=>{
                alert("更新成功啦！")
            })
        }
    }
    const tags = ['推荐', '转载', '漫画改', '小说改', '耽美', '乙女', '百合', '后宫', '热血', '战斗', '运动', '奇幻', '神魔',
        '搞笑', '冒险', '校园', '恐怖', '穿越', '推理', '科幻', '日常', '古风', '恋爱', 'r15', '泡面番', '治愈',
        '鬼畜', 'AMV/MAD', '音乐·PV', '游戏·GMV', 'VOCALOID', '影视',
        '特摄', '真人剧', '其它']
    return (
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
            </section>
            <textarea spellcheck="false" placeholder="请输入简介，支持 markdown 语法" value={post.content} onInput={e => change('content', e.target.value)}></textarea>
            <textarea spellcheck="false" placeholder={`请输入标题+$+直链，如：第一话$https://clicli.cc/001.mp4\n多个分P用回车隔开`} value={post.videos} class="videos" onInput={e => change('videos', e.target.value)}></textarea>
            <div className="tags">
                <ul>
                    {tags.map((item, index) => <li onClick={() => selectTag(item)} key={index.toString()}
                        className={post.tag.indexOf(item) > -1 ? 'active' : ''}>{item}</li>)}
                </ul>
            </div>
            <div className="options">
                <select value={post.status} onInput={e => change('status', e.target.value)}>
                    <option value="wait">待审核</option>
                    <option value="remove">待删除</option>
                    <option value="under">已下架</option>
                    <option value="public">发布</option>
                </select>
                <select value={post.sort} onInput={e => change('sort', e.target.value)}>
                    <option value="原创">原创</option>
                    <option value="新番">新番</option>
                    <option value="完结">完结</option>
                    <option value="剧场版">剧场版</option>
                    <option value="影视">影视</option>
                </select>
                {props.id > 0 && <input type="text" value={post.time} onInput={e => change('time', e.target.value)} />}
            </div>

            <div className="submit" onClick={submit}>
                <button>发布
                </button>
            </div>
        </div>
    )
}