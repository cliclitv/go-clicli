import './admin.css'
import { h } from 'fre'

import { h, useEffect, useState } from 'fre'
import { getPostB, getUser } from '../util/api'
import { ListA } from '../list/list'

export default function Home({ id }) {
    const [search, setSearch] = useState([])
    useEffect(() => {
        getPostB("", "", 1, 200, "", id).then(res => {
            setSearch(res.posts)
        })
    }, [])


    return (
        <div>
            <div className="wrap">
                    <h1>我的投稿</h1>
                    <ListA posts={search} editor={parseInt(id) === getUser().id} />
            </div>
        </div>
    )
}
