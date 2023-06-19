import { push } from "../use-route"
import { getBio, getSuo } from "../util/avatar"
import './list.css'
import { h } from 'fre'

export function ListA({ posts, editor }) {
    function navigate(id) {
        console.log(id)
        push(`/upload/${id}` + window.location.search)
    }

    const novel = s => s === '纯爱' || s === '言情' || s === '短篇' || s === '半次元'

    return <section className="a">
        {posts && posts.length > 0 && posts.map(item => {
            return <li onClick={() => {
                !editor && push(`/book/tm${item.id}`)
            }} key={item.id} >
                <div className="item">
                    <div className="cover">
                        {editor && <div class='editor' onclick={() => navigate(item.id)}>编辑</div>}
                        <img src={getSuo(item.content)} />
                    </div>
                    <div className="title">{item.title}</div>
                    <p>{getBio(item.content)}</p>
                </div>
            </li>
        })}
    </section>
}

export function ListB({ posts }) {
    return <section className="b">
        {posts && posts.length > 0 && posts.map(item => {
            return <li onClick={() => push(`/book/tm${item.id}`)} key={item.id} >
                <div className="item">
                    <div className="cover">
                        <img src={getSuo(item.content)} />
                        <div className="title">{item.title}</div>
                    </div>

                </div>
            </li>
        })}
    </section>
}