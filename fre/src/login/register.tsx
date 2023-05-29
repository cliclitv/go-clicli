import { h, useState, useEffect } from 'fre'
import { A, push } from '../use-route'
import { post } from '../util/post'
import './login.css'
import { getUser, getUserB, updateUser } from '../util/api'

export function logout() {
    localStorage.clear()
    window.location.href = 'https://www.clicli.cc'
}

export default function Register({ id }) {

    const [name, setName] = useState(null)
    const [pwd, setPwd] = useState(null)
    const [qq, setQQ] = useState(null)
    const [loading, setLoading] = useState(false)
    const [level, setLevel] = useState(0)
    const [uid, setUid] = useState(0)
    const [sign, setSign] = useState(null)

    useEffect(() => {
        if (id) {
            console.log('编辑用户')
            getUserB({ qq: id } as any).then((user: any) => {
                setName(user.result.name)
                setQQ(user.result.qq)
                setUid(user.result.id)
                setLevel(user.result.level)
                setSign(user.result.sign)
            })
        }

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

    function changeSign(v) {
        setSign(v)
    }

    async function register() {
        if (id != null) {
            console.log('修改用户')
            updateUser({ id: uid, name, qq, pwd, level: level, sign: sign }).then(res => {
                if ((res as any).code === 200) {
                    alert("修改成功啦~")
                }
            })
            return
        }
        if (!name || !qq || !pwd) {
            alert('全都得填::>_<::')
            return
        }
        setLoading(true)
        const res = await post("https://www.clicli.cc/user/register", { name, pwd, qq, time: 0, sign: "这个人很懒，什么都没有留下~" })
        setLoading(false)
        if (res.code === 200) {
            alert("注册成功啦~")
        } else {
            alert(res.msg)
        }
    }
    return <div class="login">
        <li><h1>CliCli.{id ? '个人中心' : '注册'}</h1></li>
        <li><input type="text" placeholder="QQ" onInput={(e) => changeQQ(e.target.value)} value={qq} /></li>
        <li><input type="text" placeholder="昵称" onInput={(e) => changeName(e.target.value)} value={name} /></li>
        <li><input type="text" placeholder={id ? "留空则不改" : "密码"} onInput={(e) => changePwd(e.target.value)} /></li>
        <li><input type="text" placeholder="签名" onInput={(e) => changeSign(e.target.value)} value={sign} /></li>

        {id && getUser().level > 3 && <select value={level} onInput={e => changeLevel(e.target.value)}>
            <option value="1">游客</option>
            <option value="2">作者</option>
            <option value="3">审核</option>
            <option value="4">管理</option>
        </select>}
        <li><button onClick={register} disabled={loading}>{loading ? '少年注册中...' : id ? '修改' : '注册'}</button></li>
        {id && <li><button onClick={logout} style={{ background: '#ff2b79' }}>退出登陆</button></li>}
        {!id && <li><A href="/login">登录</A></li>}
    </div>
}
