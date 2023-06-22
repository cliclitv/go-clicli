import { h, useEffect, useState, useRef } from 'fre'
import './upload.css'
import { push } from '../use-route'
import { getUid } from '../util/avatar'
import { getUser } from '../util/api'

export default function UploadHeader({ pid }) {
    // const id = getAv(pid)

    return (
        <header class="upload-header">
            <ul>
                <li class={window.location.pathname.indexOf('addpost') > -1 ? 'active' : ''} onclick={() => push(`/addpost/0${window.location.search}`)}>
                    1.合集投稿
                </li>
                <li class={window.location.pathname.indexOf('my') > -1 ? 'active' : ''} onclick={() => push(`/my/${getUid()||getUser()?.id}${window.location.search}`)}>
                    2.合集编辑
                </li>
            </ul>
        </header>
    )
}