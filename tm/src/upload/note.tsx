import { render, useState, h, useEffect, useRef } from "fre"
import { push } from "../use-route"
import { addNote, getNote, getUser, updateNote } from "../util/api"
import { getUid } from "../util/avatar"
import './upload.css'
import UploadHeader from "."
import { uploadImage } from "../util/upload"

export default function Upload(props) {
    const [note, setNote] = useState({ id: 0, title: "", uid: getUid(), pid: 30, time: "", content: "", tag: "", oid: 0 })


    useEffect(() => {
        // 监听 change 事件

        document.querySelector('#file').addEventListener('change', event => {
            uploadImage(event)
        })

    }, [])

    useEffect(() => {
        window.md = new (window as any).TinyMDE(document.querySelector('textarea'))
        if (props.id > 0) {

            getNote(props.id).then(res => {
                setNote(res.result)
            })

        } else {
            // 新增
        }

    }, [])

    function change(key, val) {
        setNote({
            ...note,
            [key as any]: val,
        } as any)
    }


    function submit() {
        if (props.id > 0) {
            updateNote(note as any).then(res => {
                alert(res.msg || '成功啦~')
            })
        } else {
            console.log(note)
            addNote(note as any).then(res => {
                alert(res.msg || '成功啦')
                // push(`/my/${getUser().id}`)
            })
        }
    }

    console.log(props.id)


    // const tags = [["甜文", "虐文", "爽文", '狗血', '意识流'],
    // ['古代', '现代', '民国', '未来'],
    // ['HE', 'BE', 'OE'],
    // ['1v1', 'NP', '骨科', '年上', '年下', '受转攻', '直掰弯', '攻控', '受控'],
    // ['快穿', '悬疑', '破镜重圆', '强制爱', '先虐受后虐攻', '追妻'],
    // ['ABO', '生子', '哨兵', '支服'],
    // ['娱乐圈', '宫廷', '网游'],
    // ['霹雳', '原神'],
    // ['授权转载', '无版权转载']]
    const tags = ['Recommend', '绘画', '小说', 'Cos']
    return (
        <div className="upload-tm">
            <UploadHeader pid={0} />

            <h1>分集投稿</h1>
            <div className="title">
                <input type="text" placeholder="请输入标题" value={note?.title} onInput={e => change('title', e.target.value)} />
            </div>
            <section>
                <i class="te te-bold" onclick={() => window.md.bold()}></i>
                <i class="te te-italic" onclick={() => window.md.italic()}></i>
                <i class="te te-quote" onclick={() => window.md.quote()}></i>
                <input id="file" type="file" accept="image/*" style="display:none" />
                <label for="file"><i class="te te-image"></i></label>
                <i class="te te-link" onclick={() => window.md.link()}></i>
                <i class="te te-code" onclick={() => window.md.blockCode()}></i>
            </section>
            <textarea spellcheck="false" placeholder="请输入正文，支持 markdown 语法" value={note?.content} onInput={e => change('content', e.target.value)}></textarea>
            {note?.id > 0 && <input type="text" value={note?.time} onInput={e => change('time', e.target.value)} />}


            <div className="submit">
                <button onClick={submit}>发布
                </button>
            </div>
        </div>
    )
}
