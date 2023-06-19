import { h, useEffect, useState, useRef } from 'fre'
import snarkdown from 'snarkdown'
import { getNote, getNotes, getPlayUrl, getPostDetail, getPv, getTransfer, getUser } from '../util/api'
import { getAv, getSuo } from '../util/avatar'
import './book.css'
import Avatar from '../component/avatar/avatar'

export default function Post({ pid }) {
    const id = getAv(pid)
    const [post, setPost] = useState({} as any)
    const [notes, setNotes] = useState([])
    const [note, setNote] = useState({})
    const [index, setIndex] = useState(0)
    const [pv, setPv] = useState(0)
    console.log(123)

    useEffect(() => {
        const p1 = getPostDetail(id)
        const p2 = getPv(id)
        Promise.all([p1, p2]).then(([res1, res2]) => {
            getNotes(res1.result.id).then(res3 => {
                setPost((res1 as any).result)
                setNotes(res3.notes)
                getNote(res3.notes[index].id).then(res => {
                    setNote(res.result)
                })
            })
            setPv((res2 as any).result.pv)
        })

    }, [])

    useEffect(() => {
        const a = document.querySelector('note')
        if (note.content) {
            a.innerHTML = snarkdown(note?.content)
        }
    }, [note])

    useEffect(() => {
        console.log(notes[index])
        if (notes[index] != null) {
            getNote(notes[index].id).then(res => {
                setNote(res.result)
            })
        }
    }, [index])



    return (
        <main class="wrap">
            <div className="left2">
                <h1>{note.title}</h1>
                <note></note>
                <p><b>作者有话说：</b>
                    <li>{note.bio}</li></p>
            </div>
            <div className="right">
                <div className="bio">
                    <Avatar uname={post.uname} uqq={post.uqq} />
                </div>
                <section>
                    <ul>{
                        notes.map((a, i) => <li class={index === i ? 'active' : ''} onclick={() => setIndex(i)}>{a.title}</li>)}</ul>
                </section>
            </div>
        </main>
    )
}