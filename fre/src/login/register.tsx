import { h, useState, useEffect } from 'fre'
import { A, push } from '../use-route'
import { post } from '../util/post'
import '../util/metamask.js'
import './login.css'
import { getUserB, updateUser } from '../util/api'

export default function Register({ id }) {
    const [name, setName] = useState(null)
    const [pwd, setPwd] = useState(null)
    const [qq, setQQ] = useState(null)
    const [loading, setLoading] = useState(false)
    const [level, setLevel] = useState(0)
    const [uid, setUid] = useState(0)

    useEffect(async () => {
        console.log('编辑用户')
        const user = await getUserB({ qq: id })
        setName(user.result.name)
        setQQ(user.result.qq)
        setUid(user.result.id)
    }, [])


    function changeName(v) {
        setName(v)
    }

    function changePwd(v) {
        setPwd(v)
    }

    function changeQQ(v) {
        setQQ(v)
    }

    function changeLevel(v) {
        setLevel(v)
    }

    async function register() {
        if (id != null) {
            console.log('修改用户')
            updateUser({ id: uid, name, qq, pwd, desc: "", level: level }).then(res => {
                if (res.code === 200) {
                    alert("修改成功啦~")
                }
            })
            return
        }
        if (!name || !qq || !pwd) {
            alert('全都得填::>_<::')
        }
        setLoading(true)
        const getFn = (data) => {
            console.log(data)
        }
        const setAuthFn = (data) => {
            console.log(data)
        }
        const setUserFn = (data) => {
            console.log(data)
        }
        const hedgehog = new (window as any).Hedgehog(getFn, setAuthFn, setUserFn)
        let wallet
        if (hedgehog.isLoggedIn()) {
            wallet = hedgehog.getWallet()
        } else {
            wallet = await hedgehog.signUp(name, pwd)
            const hash = hedgehog.getWallet().getAddressString()
            console.log(hash)
            const res = await post("https://api.clicli.cc/user/register", { name, pwd, qq, hash })
            setLoading(false)
            alert("注册成功啦~")
        }
    }
    return <div class="login">
        <li><h1>CliCli.{id ? '编辑用户' : '注册'}</h1></li>
        <li><input type="text" placeholder="QQ" onInput={(e) => changeQQ(e.target.value)} value={qq} /></li>
        <li><input type="text" placeholder="昵称" onInput={(e) => changeName(e.target.value)} value={name} /></li>
        <li><input type="text" placeholder={id ? "留空则不改" : "密码（不可修改）"} onInput={(e) => changePwd(e.target.value)} /></li>
        <select value={level} onInput={e => changeLevel(e.target.value)}>
            <option value="0">游客</option>
            <option value="1">作者</option>
            <option value="2">审核</option>
            <option value="3">管理</option>
        </select>
        <li><button onClick={register} disabled={loading}>{loading ? '少年注册中...' : '注册'}</button></li>
        {!id && <li><A href="/login">登录</A></li>}
    </div>
}