import { h, useEffect, useState } from 'fre'
import { getSearch, getRank } from '../util/api'
import { ListA } from '../list/list'

export default function Home({k}) {
    const [search, setSearch] = useState([])
    useEffect(() => {
        getSearch(k).then((res: any) => {
            setSearch(res.posts)
        })
    }, [])
    const obj = {
        "home": "Home",
        "list": "Index",
    }
    return (
        <div>
            <div className="wrap">
                <nav>
                    {Object.keys(obj).map(key => {
                        return <li><i className={`icon-font icon-${key}`}></i>{obj[key]}</li>
                    })}
                </nav>
                <main>
                    <h1>Search Videos</h1>
                    <ListA posts={search} />
                </main>
            </div>

        </div>
    )
}