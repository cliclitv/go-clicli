import { render, useState, h, useEffect } from "fre"
import { push } from '../use-route'
import { getUser, getBal } from "../util/api"
import { getAvatar } from "../util/avatar"
import './header.css'
import Avatar from "../component/avatar/avatar"

export default function Header() {
    const [key, setKey] = useState("")
    const [bal, setBal] = useState(false)
    const [balance, setBalance] = useState(0)

    let user = getUser() || {}
    const keydown = (e) => {
        if (e.keyCode == 13 && key!=="") {
            push(`/search/${key}`)
        }
    }

    useEffect(() => {
        if (bal) {
            getBal(user.id).then(res => {
                setBalance(res.msg)
            })
        }
    }, [bal])


    const changeKey = (key) => {
        setKey(key)
    }

    const openWallet = () => {
        setBal(bal === false ? true : false)
    }

    return (
        <header>

            <div className="wrap flex">
                <h1 onclick={() => push('/')}>clicli!</h1>
                <div className="search">
                    <input type="text" placeholder="搜一下下菊花又不会坏😏" onKeyDown={keydown} onInput={(e) => changeKey(e.target.value)} />
                </div>
                <div className="biu">
                    <a href="https://app.clicli.cc" target="_blank"><li><i className="icon-font icon-download"></i>APP</li></a>
                    {user.id == null && <a href="#" onclick={()=>push('/login')}><li><i className="icon-font icon-denglu"></i>登录</li></a>}
                    <li onClick={() => push('/upload/0')}><i className="icon-font icon-upload"></i>投稿</li>
                    <li onClick={() => push('/recharge')}><i className="icon-font icon-dadou"></i>弯豆</li>
                    <li onClick={openWallet} style={{position:'relative'}}>
                    <Avatar uqq={user.qq} uname={user.name} utime={user.time} />
                        <div className="wallet" style={{ display: bal ? 'block' : 'none' }}>
                            <h2>{user?.time} 弯豆</h2>
                            <li>UID {user?.id}</li>
                            <li onClick={() => push(`/my/${(user || {}).id}`)}>我的投搞</li>
                            <li onClick={() => push(`/user/${(user || {}).qq}`)}>个人中心</li>
                        </div>
                    </li>

                </div>
            </div>
        </header>
    )
}