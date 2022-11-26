import { render, useState, h, useEffect } from "fre"
import { push } from '../use-route'
import { getUser, getBal } from "../util/api"
import { getAvatar } from "../util/avatar"
import './header.css'

export default function Header() {
    const [key, setKey] = useState("")
    const [bal, setBal] = useState(false)
    const [balance, setBalance] = useState(0)

    let user = getUser()
    const keydown = (e) => {
        if (e.keyCode == 13) {
            console.log(key)
            push(`/search/${key}`)
        }
    }

    useEffect(() => {
        console.log(bal)
        if (bal) {
            getBal(2).then(res => {
                setBalance(res.msg)
            })
        }
    }, [bal])


    const changeKey = (key) => {
        setKey(key)
    }

    const openWallet = () => {
        setBal(!bal)
    }

    return (
        <header>

            <div className="wrap flex">
                <h1 onclick={() => push('/')}>clicli!</h1>
                <div className="search">
                    <input type="text" placeholder="搜一下下菊花又不会坏😏" onKeyDown={keydown} onInput={(e) => changeKey(e.target.value)} />
                </div>
                <div className="biu">
                    <a href="https://zhuanlan.zhihu.com/p/585459295" target="_blank"><li><i className="icon-font icon-download"></i>Get APP</li></a>
                    <li onClick={() => push('/upload/0')}><i className="icon-font icon-upload"></i>Upload</li>
                    <li className="avatar" >
                        <img src={getAvatar((user || {}).qq)} alt="" onClick={openWallet} />
                        {bal && <div className="wallet">
                            <li><h2>{parseInt(balance as any)/1000000} CCB</h2></li>
                            <li onClick={() => push(`/user/${(user || {}).qq}`)}>个人中心</li>
                        </div>}
                    </li>

                </div>
            </div>
        </header>
    )
}