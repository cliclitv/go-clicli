import { render, useState, useEffect } from "fre"
import { push } from '../use-route'
import { getUser, getBal } from "../util/api"
import { getAvatar } from "../util/avatar"
import './header.css'
import Avatar from "../component/avatar/avatar"
import { logout } from "../login/register"

export default function Header() {
    const [key, setKey] = useState("")
    const [show, setShow] = useState(false)

    let user = getUser() || {}
    const keydown = (e) => {
        if (e.keyCode == 13 && key !== "") {
            push(`/search/${key}`)
        }
    }

    const changeKey = (key) => {
        setKey(key)
    }

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
                    </div>
                    <div className="biu">
                        <a href="https://app.clicli.cc" target="_blank"><li>APP</li></a>
                        <a href="https://www.acgzone.fun" target="_blank"><li>ACG里世界</li></a>
                        <li onClick={() => push('/sponsor')}>赞助会员</li>
                        <li onClick={openWallet} style={{ position: 'relative' }}>
                            <Avatar uqq={user.qq} uname={user.name} utime={user.time} />
                            {user.id ? <div className="wallet" style={{ display: show ? 'block' : 'none' }}>
                                <li>UID {user?.id}</li>
                                <li onClick={() => push('/draft/0')}>草稿箱</li>
                                <li onClick={() => push(`/user/${(user || {}).qq}`)}>资料卡</li>
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