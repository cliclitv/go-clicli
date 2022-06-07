import { render, useState, h, useEffect } from "fre"
import { push } from '../use-route'
import { getUser } from "../util/api"
import { getAvatar } from "../util/avatar"
import './header.css'
// import Search from 'widget/search'

export default function Header() {

    let user = getUser()

    return (
        <header>
            <div className="wrap flex">
                <h1>clicli!</h1>
                <div className="search">
                    <input type="text" placeholder="搜一下下菊花又不会坏😏" />
                </div>
                <div className="biu">
                    <li><i className="icon-font icon-download"></i>Get APP</li>
                    <li onClick={() => push('/upload/0')}><i className="icon-font icon-upload"></i>Upload</li>
                    <li className="avatar"><img src={getAvatar((user || {}).qq)} alt="" /></li>
                </div>
            </div>
        </header>
    )
}