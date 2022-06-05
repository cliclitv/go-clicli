import { h } from 'fre'
import { A } from '../use-route'
import './login.css'

export default function Register() {
    return <div class="login">
        <li><h1>注册</h1></li>
        <li><input type="text" placeholder="QQ（唯一标识）" /></li>
        <li><input type="text" placeholder="昵称" /></li>
        <li><input type="text" placeholder="密码" /></li>
        <li><button>注册</button></li>
        <li><A href="/login">登录</A></li>
    </div>
}