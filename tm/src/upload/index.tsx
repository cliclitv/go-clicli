import { h, useEffect, useState, useRef } from 'fre'
import './upload.css'
import { push } from '../use-route'
import { getUid } from '../util/avatar'

export default function UploadHeader({ pid }) {
    // const id = getAv(pid)

    return (
        <header class="upload-header">
            <ul>
                <li class={window.location.pathname.indexOf('my') > -1 ? 'active' : ''} onclick={() => push(`/my/${getUid()}${window.location.search}`)}>
                    0.我的投稿
                </li>
                <li class={window.location.pathname.indexOf('addpost') > -1 ? 'active' : ''} onclick={() => push(`/addpost/0${window.location.search}`)}>
                    1.投稿合集
                </li>
                <li class={window.location.pathname.indexOf('addnote') > -1 ? 'active' : ''} onclick={() => {
                    if (pid == 0) {
                        alert('pid 不能为空')
                        return
                    }
                    push(`/addnote/${pid}${window.location.search}`)
                }}>
                    2.投稿分集
                </li>

            </ul>
        </header>
    )
}