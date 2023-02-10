import { h, useEffect, useState } from 'fre'
import { getSearch, getRank, getPost } from '../util/api'
import { ListA } from '../list/list'

export default function Home({k}) {
    const [search, setSearch] = useState([])
    useEffect(() => {
        if(k.slice(0,4) === 'uid:'){
            getPost("","",1,100,null,k.slice(4)).then(res=>{
                setSearch(res.posts)
            })
        }else{
           getSearch(k).then((res: any) => {
            setSearch(res.posts)
        }) 
        }
        
    }, [])

    return (
        <div>
            <div className="wrap">
                <main>
                    <h1>Search Videos</h1>
                    <ListA posts={search} />
                </main>
            </div>
        </div>
    )
}