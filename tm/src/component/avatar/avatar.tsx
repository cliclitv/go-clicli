import { h } from 'fre'
import shouldVIP, { getAv, getAvatar } from '../../util/avatar'
import './avatar.css'

export default function Avatar(props) {
    return <div className="avatar">
        <img src={getAvatar(props.uqq)} alt="" /><p>{props.uname}</p>
        {/* <i className="icon-font icon-shouye" onClick={transfer}></i> */}
    </div>
}