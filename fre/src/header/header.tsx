import { render, useState, h, useEffect } from "fre"
import { push } from '../use-route'
import { getUser } from "../util/api"
import { getAvatar } from "../util/avatar"
import './header.css'
import abi from './abi'
// import Search from 'widget/search'

export default function Header() {
    const [key, setKey] = useState("")

    let user = getUser()
    const keydown = (e) => {
        if (e.keyCode == 13) {
            console.log(key)
            push(`/search/${key}`)
        }
    }

    const changeKey = (key) => {
        setKey(key)
    }

    const connect = async () =>{
        const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.public.blastapi.io');
        const signer = await provider.getSigner()
        let wallet = new ethers.Wallet('20e80ac8e2d2707facee7a8a88eae24f74513cb6a01601370c6eb4f5490f6e84',provider)

        const ccb = new ethers.Contract('0xD29F60b227aeb700431C97F256dEBe23E17C8956', abi, wallet)
        const value = await ccb.balanceOf('0x1fc0878dd3bCB537036b30cC1c2EB0b633E6c792')
        let valone = ethers.BigNumber.from(value).toNumber()
        console.log(valone/1000000)
    }

    return (
        <header>
            <div className="wrap flex">
                <h1 onclick={() => push('/')}>clicli!</h1>
                <div className="search">
                    <input type="text" placeholder="搜一下下菊花又不会坏😏" onKeyDown={keydown} onInput={(e) => changeKey(e.target.value)} />
                </div>
                <div className="biu">
                    <a href="https://zhuanlan.zhihu.com/p/585459295" target="_blank"><li><i className="icon-font icon-download"></i>Get APP</li></a>
                    <li onClick={() => push('/upload/0')}><i className="icon-font icon-upload"></i>Upload</li>
                    <li className="avatar"><img src={getAvatar((user || {}).qq)} alt="" onClick={()=>push(`/user/${(user||{}).qq}`)}/></li>
                    <i className="icon-font icon-shouye" onClick={connect}></i>
                </div>
            </div>
        </header>
    )
}