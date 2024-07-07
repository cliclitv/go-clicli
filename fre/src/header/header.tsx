import { render, useState, useEffect } from "fre"
import { push } from '../use-route'
import { getUser, getBal } from "../util/api"
import Search from "./search"
import './header.css'
import Avatar from "../component/avatar/avatar"
import { logout } from "../login/register"

function debounce(func, wait) {
    let timeout
    return function () {
        const context = this
        const args = arguments
        clearTimeout(timeout)
        timeout = setTimeout(function () {
            func.apply(context, args)
        }, wait)
    }
}

export default function Header() {
    const [key, setKey] = useState("")
    const [show, setShow] = useState(false)

    let user = getUser() || {}
    const keydown = (e) => {
        console.log(key)
    }

    const changeKey = debounce((key) => {
        setKey(key)
    }, 500)

    const openWallet = () => {
        setShow(!show)
    }

    return (
        <header>
            <div className="top">
                <div className="wrap flex section">
                    <div className="logo-wrap" onClick={() => push('/')}>
                        <div className="logo"></div>
                    </div>

                    <div className="search">
                        <input type="text" placeholder="搜一下下菊花又不会坏😏" onKeyDown={keydown} onInput={(e) => changeKey(e.target.value)} />
                        {key && <Search k={key}></Search>}
                    </div>
                    <div className="biu">
                        <li onClick={() => push('/')}>首页</li>
                            <a href="https://app.clicli.cc" target="_blank"><li>APP</li></a>
                            <li onClick={() => push('/sponsor')}>赞助会员</li>
                            <li onClick={() => push('/play/gv31')}>使用说明</li>
                        <li onClick={openWallet} style={{ position: 'relative' }}>
                            <Avatar uqq={user.qq} uname={user.name} utime={user.time} />
                            {user.id ? <div className="wallet" style={{ display: show ? 'block' : 'none' }}>
                                <li>UID {user?.id}</li>
                                <li onClick={() => push('/draft/0')}>草稿箱</li>
                                <li onClick={() => push(`/user/${(user || {}).qq}`)}>资料卡</li>
                                <li onClick={() => push(`/live/uu${(user || {}).id}`)}>直播间</li>
                                <li onClick={logout}>退出</li>
                            </div> : <div className="wallet" style={{ display: show ? 'block' : 'none' }}>
                                <li>UID {user?.id}</li>
                                <li onClick={() => push('/login')}>登录</li>
                            </div>}
                        </li>
                    </div>
                </div>

            </div>
        </header>
    )
}