import { push } from "../use-route"
import { getSuo } from "../util/avatar"
import './list.css'
import { h } from 'fre'

export function ListA({ posts }) {
    return <section className="a">
        {posts && posts.length > 0 && posts.map(item => {
            return <li onClick={() => push(`/play/gv${item.id}`)} key={item.id} >
                <div className="item">
                    <div className="cover">
                        <img src={getSuo(item.content)} />
                    </div>
                    <div className="title">{item.title}</div>
                </div>
            </li>
        })}
    </section>
}

export function ListB({ posts }) {
    return <section className="b">
        {posts && posts.length > 0 && posts.map(item => {
            return <li onClick={() => push(`/play/gv${item.id}`)} key={item.id} >
                <div className="item">
                    <div className="cover">
                        <img src={getSuo(item.content)} />
                    </div>
                    <div className="title">{item.title}</div>
                </div>
            </li>
        })}
    </section>
}