import  { getAv, getAvatar } from '../../util/avatar'
import './avatar.css'

export default function Avatar(props) {
    return <div className="avatar">
        <img src={getAvatar(props.uqq)} alt="" loading="lazy"/>{
            props.uname && <p>{props.uname}</p>
        }
        {/* <i className="icon-font icon-shouye" onClick={transfer}></i> */}
    </div>
}