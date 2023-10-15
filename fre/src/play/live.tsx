import { useEffect, useState, useRef } from 'fre'
import { getPlayUrl, getUserB } from '../util/api'
import { getAv } from '../util/avatar'
import snarkdown from 'snarkdown'
import './play.css'

export default function Live({ uu }) {
    const id = uu.substring(2, uu.length)
    const [play, setPlay] = useState("")
    const [user, setUser] = useState({})

    useEffect(() => {
        setPlay(`https://www.tm0.net/live/uu${id}.m3u8`)
        getUserB({ id: id } as any).then(res => {
            setUser(res.result)
        })
    }, [])

    return (
        <div className="ep-wrap">
            {play != '' && <Eplayer url={play} live={true}></Eplayer>}
        </div>


    )
}

export function buildVideos(str) {
    return str.split('\n').map(v => v.split('$')).filter(i => i.length > 0 && i[1] != null)
}

export function Eplayer(props) {
    const t = useRef(null)
    useEffect(() => {

        if (t.current) {
            t.current.setAttribute('type', 'hls')
            t.current.setAttribute('src', props.url)
            if (props.live) {
                t.current.shadowRoot.querySelector('.progress').style.display = 'none'
            }

        }
    }, [props.url])

    return (
        <e-player ref={t} class='ep' />
    )
}