import { render, useState, h, useEffect } from "fre"
import { push } from '../use-route'
import { getUser } from "../util/api"
import { getAvatar } from "../util/avatar"
import './header.css'
// import Search from 'widget/search'

export default function Header() {
    const [key, setKey] = useState("")

    let user = getUser()
    const keydown = (e) => {
        if (e.keyCode == 13) {
            console.log(key)
            push(`/search/${key}`)
        }
    }

    const changeKey = (key) => {
        setKey(key)
    }

    return (
        <header>
            <div className="wrap flex">
                <h1 onclick={() => push('/')}>clicli!</h1>
                <div className="search">
                    <input type="text" placeholder="搜一下下菊花又不会坏😏" onKeyDown={keydown} onInput={(e) => changeKey(e.target.value)} />
                </div>
                <div className="biu">
                    <li><i className="icon-font icon-download"></i>Get APP</li>
                    <li onClick={() => push('/upload/0')}><i className="icon-font icon-upload"></i>Upload</li>
                    <li className="avatar"><img src={getAvatar((user || {}).qq)} alt="" onClick={()=>push(`/user/${(user||{}).qq}`)}/></li>
                </div>
            </div>
        </header>
    )
}