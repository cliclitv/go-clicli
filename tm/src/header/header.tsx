import { render, useState, h } from "fre"
import { push } from '../use-route'
import { getUser, getBal } from "../util/api"
import './header.css'
import Avatar from "../component/avatar/avatar"

export default function Header() {
    const [key, setKey] = useState("")
    const [bal, setBal] = useState(false)
    const [balance, setBalance] = useState(0)

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
        setBal(bal === false ? true : false)
    }

    return (
        <header>

            <div className="wrap flex">
                <div className="logo-wrap"><div class="logo" onclick={() => push('/')}></div></div>
                <div className="search">
                    <input type="text" placeholder="搜一下下菊花又不会坏😏" onKeyDown={keydown} onInput={(e) => changeKey(e.target.value)} />
                </div>
                <div className="biu">
                    <a href="https://app.tm0.net" target="_blank"><li><i className="icon-font icon-download"></i>APP</li></a>
                    {user.id == null ? <a href="#" onclick={() => push('/login')}><li><i className="icon-font icon-denglu"></i>登录</li></a>:<a></a>}
                    <li onClick={() => push('/recharge')}><i className="icon-font icon-dadou"></i>弯豆</li>
                    <ul onClick={openWallet} style={{ position: 'relative' }}>
                        <Avatar uqq={user.qq} uname={user.name} utime={user.time} />
                        <div className="wallet" style={{ display: bal ? 'block' : 'none' }}>
                            <li>UID {user?.id}</li>
                            <li onClick={() => push('/publish/0')}>投稿</li>
                            <li onClick={() => push(`/my/${(user || {}).id}`)}>我的投搞</li>
                            <li onClick={() => push(`/user/${(user || {}).qq}`)}>个人中心</li>
                        </div>
                    </ul>

                </div>
            </div>
        </header>
    )
}