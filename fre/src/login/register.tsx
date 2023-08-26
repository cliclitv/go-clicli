import { h, useState, useEffect } from 'fre'
import { A, push } from '../use-route'
import { post } from '../util/post'
import './login.css'
import { getUser, getUserB, updateUser } from '../util/api'

export function logout() {
    localStorage.clear()
    window.location.href = '/login'
}

export default function Register({ id }) {

    const [user, setUser] = useState({} as any)

    useEffect(() => {
        if (id) {
            getUserB({ qq: id } as any).then((user: any) => {
                setUser(user.result)
            })
        }

    }, [])

    function change(key, val) {
        setUser({
            ...user,
            [key as any]: val,
        } as any)
    }


    async function register() {
        if (id != null) {
            console.log('修改用户')
            updateUser(user as any).then(res => {
                if ((res as any).code === 200) {
                    alert("修改成功啦~")
                }
            })
            return
        }
        if (!user.name || !user.qq || !user.pwd) {
            alert('全都得填::>_<::')
            return
        }
        const res = await post("https://www.clicli.cc/user/register", { name: user.name, pwd: user.pwd, qq: user.qq, time: 0, sign: "这个人很懒，什么都没有留下~" }) as any
        if (res.code === 200) {
            alert("注册成功啦~")
        } else {
            alert(res.msg)
        }
    }

    return <div class="wrap"><div class="login">
        <li><h1>CliCli.{id ? '个人中心' : '注册'}</h1></li>
        <li><input type="text" placeholder="QQ" onInput={(e) => change('qq', e.target.value)} value={user.qq} /></li>
        <li><input type="text" placeholder="昵称" onInput={(e) => change('name', e.target.value)} value={user.name} /></li>
        <li><input type="text" placeholder={id ? "留空则不改" : "密码"} onInput={(e) => change('pwd', e.target.value)} /></li>
        <li><input type="text" placeholder="签名(可不填)" onInput={(e) => change('sign', e.target.value)} value={user.sign} /></li>

        {id && getUser().level >= 3 && <select value={user.level} onInput={e => change('level', e.target.value)}>
            <option value="1">游客</option>
            <option value="2">作者</option>
            <option value="3">审核</option>
            <option value="4">管理</option>
        </select>}
        <li><button onClick={register}>{id ? '修改' : '注册'}</button></li>
        {id && <li><button onClick={logout}>退出登陆</button></li>}
        {!id && <li><A href="/login">登录</A></li>}
    </div></div>
}
