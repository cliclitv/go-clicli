import { useEffect, useState } from 'fre'
import { getSearch, getRank, getPost } from '../util/api'
import { push } from '../use-route'

export default function Search({ k }) {
    const [search, setSearch] = useState([])
    const [show, setShow] = useState(!!search)
    useEffect(() => {
        try {
            if (k.slice(0, 4) === 'uid:') {
                getPost("", "", 1, 10, null, k.slice(4)).then(res => {
                    setSearch(res.posts)
                })
            } else {
                getSearch(k).then((res: any) => {
                    setSearch(res.posts)
                })
            }
            document.body.addEventListener('click', () => {
                setShow(false)
            })
        } catch (e) {
            console.log(e)
        }
    }, [k])

    return (
        <div style={{ position: 'relative' }}>
            {<div className="wallet searchbox" style={{ display: show ? 'block' : 'none' }}>
                {search?.map(item => {
                    return <li onClick={() => push(`/play/gv${item.id}`)}>{item.title}</li>
                })}
            </div>}
        </div>
    )
}