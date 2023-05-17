import { h, useEffect, useState, useRef } from 'fre'
import { getPlayUrl, getPostDetail, getPv, getTransfer, getUser } from '../util/api'
import { getAv, getSuo } from '../util/avatar'
import snarkdown from 'snarkdown'
import './book.css'
import Avatar from '../component/avatar/avatar'
import { push } from '../use-route'

export default function Post({ pid }) {
    const id = getAv(pid)
    const [post, setPost] = useState({} as any)
    const [videos, setVideos] = useState([])
    const [pv, setPv] = useState(0)
    console.log(123)

    useEffect(() => {
        const p1 = getPostDetail(id)
        const p2 = getPv(id)
        Promise.all([p1, p2]).then(([res1, res2]) => {
            setPost((res1 as any).result)
            setPv((res2 as any).result.pv)
        })

    }, [])


    return (
        <main>
            {id}
        </main>
    )
}