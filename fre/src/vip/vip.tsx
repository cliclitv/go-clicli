import {h, useEffect, useRef} from 'fre'
import { pay, paycheck } from '../util/api'
import { getMatrix, render, renderPath } from 'qr-code-generator-lib'
import { nanoid } from 'nanoid'

import './vip.css'


export default function Pay() {
    const order = Math.floor(Math.random()*10000000000)
    useEffect(()=>{
        pay(0.1,order).then(res=>{
            q.current.innerHTML = render(getMatrix(res.alipay_trade_precreate_response.qr_code), '#ff2b79')
            q2.current.href = res.alipay_trade_precreate_response.qr_code
        })
    },[])
    const check = ()=>{
        paycheck(order).then(res=>{
            console.log(123)
        })
    }
    const q = useRef(null)
    const q2 = useRef(null)

    return <div className="vip">
        <h1>请扫描充值</h1>
        <div className="qrcode" ref={q}></div>
        <a href="" ref={q2}><button>不扫码，点此充值</button></a>
    </div>
}