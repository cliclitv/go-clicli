import { h, useEffect, useRef } from 'fre'
import { pay, paycheck } from '../util/api'
import { getMatrix, render, renderPath } from 'qr-code-generator-lib'
import { isMobile } from '../util/avatar'

import './vip.css'


export default function Pay() {
    const order = Math.floor(Math.random() * 10000000000)
    useEffect(() => {
        pay(0.5, order).then(res => {
            q.current.innerHTML = render(getMatrix(res.alipay_trade_precreate_response.qr_code), '#ff2b79')
            q2.current.href = res.alipay_trade_precreate_response.qr_code
        })
    }, [])
    const q = useRef(null)
    const q2 = useRef(null)

    return <div className="vip">
        <h1>方式一：跳转支付宝APP</h1>
        <a href="" ref={q2}><button>点此充值月卡</button></a>
        <h1>方式二：支付宝扫码</h1>
        <div className="qrcode" ref={q}></div>
    </div>
}