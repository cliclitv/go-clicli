import { render, useState, h, useEffect } from "fre"
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
                <div className="wrap flex">
                    <h1 onclick={() => push('/')}></h1>
                    <div className="search">
                        <input type="text" placeholder="搜一下下菊花又不会坏😏" onKeyDown={keydown} onInput={(e) => changeKey(e.target.value)} />
                    </div>
                    <div className="biu">
                        <a href="https://app.clicli.cc" target="_blank"><li>APP</li></a>
                        <li onClick={() => push('/recharge')}>弯豆</li>
                        <li onClick={openWallet} style={{ position: 'relative' }}>
                            <Avatar uqq={user.qq} uname={user.name} utime={user.time} />
                            {user.id ? <div className="wallet" style={{ display: show ? 'block' : 'none' }}>
                                <li>UID {user?.id}</li>
                                <li onClick={() => push('/upload/0')}>投稿</li>
                                <li onClick={() => push(`/my/${(user || {}).id}`)}>我的投搞</li>
                                <li onClick={() => push(`/user/${(user || {}).qq}`)}>个人中心</li>
                                <li onClick={logout}>退出</li>
                            </div> : <div className="wallet" style={{ display: show ? 'block' : 'none' }}>
                                <li>UID {user?.id}</li>
                                <li onClick={() => push('/login')}>登录</li>
                            </div>}
                        </li>
                    </div>
                </div>
            </div>

            <nav>
                <ul>
                    <li>综合</li>
                    <li onclick={() => {
                        alert('还不能点')
                    }}>动画</li>
                    <li onclick={() => {
                        alert('还不能点')
                    }}>漫画</li>
                    <li onclick={() => {
                        alert('还不能点')
                    }}>游戏</li>
                    <li onclick={() => {
                        alert('还不能点')
                    }}>声乐</li>
                    <li onclick={() => {
                        alert('还不能点')
                    }}>三次元</li>
                    <li onclick={() => {
                        alert('还不能点')
                    }}>文章</li>
                </ul>
            </nav>
        </header>
    )
}