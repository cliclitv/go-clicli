import { h, useEffect, useRef, useState } from 'fre'
import { pay, paycheck } from '../util/api'
import { getMatrix, render, renderPath } from 'qr-code-generator-lib'

import './vip.css'


export default function Pay() {
    const [index, setIndex] = useState(0)
    const order = Math.floor(Math.random() * 10000000000)
    useEffect(() => {
        pay(list[index] / 100, order).then(res => {
            q.current.innerHTML = render(getMatrix(res.alipay_trade_precreate_response.qr_code), '#ff2b79')
            q2.current.href = res.alipay_trade_precreate_response.qr_code
        })
    }, [index])
    const q = useRef(null)
    const q2 = useRef(null)

    const list = [100, 1000, 3000, 5000, 10000, 20000]

    return <div className="vip">
        <ul>
            {list.map((item, i) => {
                return <li class={i === index ? 'active' : ''} onclick={()=>setIndex(i)}>{item} 弯豆 <span>￥{item / 100}</span></li>
            })}
        </ul>
        <h1>方式一：跳转支付宝APP</h1>
        <a href="" ref={q2}><button style={{ background: '#ff2b79', margin: '20px' }}>点此充值</button></a>
        <h1>方式二：支付宝扫码</h1>
        <div className="qrcode" ref={q}></div>
    </div>
}