import { h, useEffect, useState } from 'fre'
import { getPostB, getUser } from '../util/api'
import { ListA } from '../list/list'
import { getUid } from '../util/avatar'
import UploadHeader from '.'

export default function Home({ id }) {
    const [search, setSearch] = useState([])
    useEffect(() => {
        getPostB("", "", 1, 200, "", id).then(res => {
            setSearch(res.posts)
        })
    }, [])


    console.log(id, getUid())


    return (
        <div>
            <div className="wrap">
                <main>
                    <UploadHeader pid={0}/>
                    <ListA posts={search} editor={id === getUid()||getUser()?.id} />
                </main>
            </div>
        </div>
    )
}
