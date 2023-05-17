import { h } from 'fre'
import shouldVIP, { getAv, getAvatar } from '../../util/avatar'
import './avatar.css'

export default function Avatar(props) {
    return <div className="avatar">
        <img src={getAvatar(props.uqq)} alt="" /><p>{props.uname}</p>
        {shouldVIP(props.utime) && <b></b>}
        {/* <i className="icon-font icon-shouye" onClick={transfer}></i> */}
    </div>
}