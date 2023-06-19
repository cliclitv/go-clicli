import { render, useState, h, useEffect, useRef } from "fre"
import { addNote, addPost, getNote, updateNote, updatePost } from "../util/api"
// import './upload.css'

export default function Upload(props) {

    const [note, setNote] = useState({ id:props.id||0, pid: props.pid||0, title: "", oid: 0, content: "", bio: "" })

    console.log(note)

    useEffect(() => {
        if (props.id > 0) {
            getNote(props.id).then(res => {
                setNote(res.result)
            })
        }
    }, [])

    function change(key, val) {
        console.log(key, val)
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
            addNote(note as any).then(res => {
                alert(res.msg || '成功啦')
            })
        }
    }
    return (
        <div className="upload-tm">
            <h1>更新分集</h1>
            <div className="title">
                <input type="text" placeholder="请输入序号" value={note.oid} onInput={e => change('oid', e.target.value)} />
            </div>
            <div className="title">
                <input type="text" placeholder="请输入标题" value={note.title} onInput={e => change('title', e.target.value)} />
            </div>
            <textarea spellcheck="false" placeholder="请输入更新内容" value={note.content} onInput={e => change('content', e.target.value)}></textarea>
            <textarea spellcheck="false" placeholder="请输入作者有话说" value={note.bio} onInput={e => change('bio', e.target.value)}></textarea>


            <div className="submit" onClick={submit}>
                <button>更新
                </button>
            </div>
        </div>
    )
}
