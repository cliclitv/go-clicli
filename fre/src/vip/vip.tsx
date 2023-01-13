import {h, useEffect, useRef} from 'fre'
import { pay } from '../util/api'
import { getMatrix, render, renderPath } from 'qr-code-generator-lib'
import './vip.css'


export default function Pay() {
    useEffect(()=>{
        pay(0.1).then(res=>{
            q.current.innerHTML = render(getMatrix(res.alipay_trade_precreate_response.qr_code), '#ff2b79')
        })
    },[])
    const q = useRef(null)

    return <div changeName="vip">
        <h1>请扫描充值</h1>
        <div className="qrcode" ref={q}></div>
    </div>
}