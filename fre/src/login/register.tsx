import { h, useState, useEffect } from 'fre'
import { A, push } from '../use-route'
import { post } from '../util/post'
import '../util/metamask.js'
import './login.css'

export default function Register() {

    const [name, setName] = useState("")
    const [pwd, setPwd] = useState("")
    const [qq, setQQ] = useState("")
    const [hash, setHash] = useState("")

    function changeName(v) {
        setName(v)
    }

    function changePwd(v) {
        setPwd(v)
    }

    function changeQQ(v) {
        setQQ(v)
    }

    async function register() {
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
            setHash(hash)
            post("https://api.clicli.cc/user/register", { name, pwd, qq, hash }).then((res: any) => {
                push('/')
                alert(res.msg)
            })
        }
    }
    return <div class="login">
        <li><h1>CliCli.注册</h1></li>
        <li><input type="text" placeholder="QQ" onInput={(e) => changeQQ(e.target.value)} /></li>
        <li><input type="text" placeholder="昵称" onInput={(e) => changeName(e.target.value)} /></li>
        <li><input type="text" placeholder="密码（不可修改）" onInput={(e) => changePwd(e.target.value)} /></li>
        <li><button onClick={register}>{hash === "" ? '注册' : hash}</button></li>
        <li><A href="/login">登录</A></li>
    </div>
}