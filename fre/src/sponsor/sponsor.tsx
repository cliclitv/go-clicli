import { useEffect, useRef, useState } from 'fre'
import { getUser, getUserB, pay, paycheck } from '../util/api'
import { getMatrix, render, renderPath } from 'qr-code-generator-lib'

import './sponsor.css'
import { getAvatar, getSuo } from '../util/avatar'


export default function Pay() {
    const [index, setIndex] = useState(0)
    const order = Math.floor(Math.random() * 10000000000)
    const [user, setUser] = useState({} as any);
    useEffect(() => {
        pay({
            price: Object.values(list)[index],
            order,
            uid: user?.id || getUser()?.id
        }).then((res: any) => {
            q.current.innerHTML = render(getMatrix(res.alipay_trade_precreate_response.qr_code), 'var(--secondary)')
            q2.current.href = res.alipay_trade_precreate_response.qr_code
        })
    }, [index, user])

    const q = useRef(null)
    const q2 = useRef(null)

    function changeUser(name) {
        getUserB({ name } as any).then(res => {
            setUser(res.result)
        })
    }

    const list = { '一天': 0.5, '一月': 15, '一季度': 45, '一年': 180 }

    return <div className="vip wrap section">
        {/* <h3>1. 请输入c站昵称</h3> */}
        <div class="userinfo">
            <input type="text" placeholder="请输入c站昵称" onInput={(e) => changeUser(e.target.value)} />
            <div className="avatar">
                <img src={getAvatar((user || {}).qq)} />
            </div>
        </div>
        <p>p.s. 请确认昵称和头像正确!</p>
        <ul>
            {Object.keys(list).map((item, i) => {
                return <li class={i === index ? 'active' : ''} onclick={() => setIndex(i)}>赞助{item} <span>￥{list[item]}</span></li>
            })}
        </ul>
        <h3>方式一：跳转支付宝APP</h3>
        <a href="" ref={q2}><button style={{ background: 'var(--secondary)', margin: '20px' }}>点此充值</button></a>
        <h3>方式二：支付宝扫码</h3>
        <div className="qrcode" ref={q}></div>
    </div>
}