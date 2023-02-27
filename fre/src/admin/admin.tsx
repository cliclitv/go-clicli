import './admin.css'
import { h } from 'fre'

import { h, useEffect, useState } from 'fre'
import { getPost, getUser } from '../util/api'
import { ListA } from '../list/list'

export default function Home({ id }) {
    const [search, setSearch] = useState([])
    useEffect(() => {
        getPost("", "", 1, 100, null, id).then(res => {
            setSearch(res.posts)
        })
    }, [])


    return (
        <div>
            <div className="wrap">
                <main>
                    <h1>我的投稿</h1>
                    <ListA posts={search} editor={parseInt(id) === getUser().id} />
                </main>
            </div>
        </div>
    )
}