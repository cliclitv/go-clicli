import { render, useState, h, useEffect } from "fre"
import { push } from '../use-route'
import { getAvatar } from "../util/avatar"
import './header.css'
// import Search from 'widget/search'

export default function Header() {
    const obj = {
        投稿教程: 905,
        使用说明: 31,
        补档: 99
    }


    let user = JSON.parse(window.localStorage.getItem('user'))

    return (
        <header>
            <div class='header'>
                <div class='wrap'>
                    <nav class='nav'>
                        <a>
                            <li class='active'>主站</li>
                        </a>
                        <a href='https://app.clicli.cc'>
                            <li>APP下载</li>
                        </a>
                        {Object.keys(obj).map(key => (
                            <li onClick={() => push(`/play/gv${obj[key]}`)}>{key}</li>
                        ))}
                    </nav>
                    <div class='biu'>
                        <div className="avatar"><img src={getAvatar(user.qq)} alt="" /></div>
                        <div className="pancel">
                            <ul>
                                <li>投稿</li>
                                <li>充值</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}