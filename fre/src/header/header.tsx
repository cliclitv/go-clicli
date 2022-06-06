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
            <div className="wrap flex">
                <h1>clicli!</h1>
                <div className="search">
                    <input type="text" placeholder="搜一下下菊花又不会坏😏"/>
                </div>
                <div className="biu">
                    <li><i className="icon-font icon-download"></i><div className="download">Get APP</div></li>
                    <li><i className="icon-font icon-upload"></i><div className="download">Upload</div></li>
                    <li className="avatar"><img src={getAvatar(user.qq)} alt="" /></li>
                </div>
            </div>
        </header>
    )
}