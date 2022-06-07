import { render, useState, h, useEffect } from "fre"
import { push } from '../use-route'
import { getAvatar } from "../util/avatar"
import './upload.css'

export default function Upload() {


    return (
        <div className="upload">
            <input type="text" className="title" />
            <textarea name="" id="" cols="30" rows="10"></textarea>
        </div>
    )
}