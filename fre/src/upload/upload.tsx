import { render, useState, h, useEffect, useLayout } from "fre"
import { push } from '../use-route'
import { getAvatar } from "../util/avatar"
import './upload.css'

export default function Upload() {
    const [tag, setTag] = useState("")

    useEffect(() => {
        var md = new window.TinyMDE(document.querySelector('textarea'))
    }, [])

    function selectTag(item) {
        if (tag.indexOf(item) > -1) {
            setTag(tag.replace(` ${item}`, ''))
        } else {
            setTag(tag + ' ' + item)
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
                <input type="text" placeholder="请输入标题" />
            </div>
            <section>
                <i class="te te-bold" onclick={() => md.bold()}></i>
                <i class="te te-italic" onclick={() => md.italic()}></i>
                <i class="te te-quote" onclick={() => md.quote()}></i>
                <i class="te te-image" onclick={() => md.image()}></i>
                <i class="te te-link" onclick={() => md.link()}></i>
                <i class="te te-code" onclick={() => md.blockCode()}></i>
            </section>
            <textarea spellcheck="false" placeholder="请输入简介，支持 markdown 语法"></textarea>
            <div className="tags">
                <ul>
                    {tags.map((item, index) => <li onClick={() => selectTag(item)} key={index.toString()}
                        className={tag.indexOf(item) > -1 ? 'active' : ''}>{item}</li>)}
                </ul>
            </div>
            <div className="options">
                <select name="" id="">
                    <option value="wait">待审核</option>
                    <option value="remove">待删除</option>
                    <option value="under">已下架</option>
                    <option value="under">发布</option>
                </select>
                <select name="" id="">
                    <option value="原创">原创</option>
                    <option value="新番">新番</option>
                    <option value="完结">完结</option>
                    <option value="剧场版">剧场版</option>
                    <option value="影视">影视</option>
                </select>
                <input type="text" value={Date.now()}/>
            </div>

            <div className="submit">
                <button>发布
                </button>
            </div>
        </div>
    )
}