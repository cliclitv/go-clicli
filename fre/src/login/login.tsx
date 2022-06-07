import { h, useState } from 'fre'
import { A, push } from '../use-route'
import { post } from '../util/post'
import './login.css'

export default function Login() {
    const [name, setName] = useState("")
    const [pwd, setPwd] = useState("")

    function changeName(v) {
        setName(v)
    }

    function changePwd(v) {
        setPwd(v)
    }

    function login() {
        post("https://api.clicli.cc/user/login", { name, pwd }).then((res: any) => {
            if (res.code === 200) {
                window.localStorage.setItem('token', res.token)
                window.localStorage.setItem('user', JSON.stringify(res.user))
                push('/')
            } else {
                alert(res.msg)
            }

        })
    }
    return <div class="login">
        <li><h1>登录</h1></li>
        <li><input type="text" placeholder="昵称" onInput={(e) => changeName(e.target.value)} /></li>
        <li><input type="text" placeholder="密码" onInput={(e) => changePwd(e.target.value)} /></li>
        <li><button onClick={login}>登录</button></li>
        <li><A href="/">注册</A></li>
    </div>
}


export function Register() {
    return <div class="login">
        <li><h1>注册</h1></li>
        <li><input type="text" placeholder="QQ（唯一标识）" /></li>
        <li><input type="text" placeholder="昵称" /></li>
        <li><input type="text" placeholder="密码" /></li>
        <li><button>注册</button></li>
        <li><A href="/login">登录</A></li>
    </div>
}