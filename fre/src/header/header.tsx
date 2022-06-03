import { render, useState, h, useEffect } from "fre"
import './header.css'


export default function Header() {
    return <header>
        <nav>
            <li>浏览</li>
            <li>更多</li>
        </nav>
        <nav>
            <input type="text" />
            <button>搜索</button>
        </nav>
        <nav>
            <li>登录</li>
            <li>注册</li>
            <li>投稿</li>
        </nav>
    </header>
}