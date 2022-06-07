import { h } from 'fre'
import { A, push } from '../use-route'

export default function Post({ id }) {
    return (
        <div>
            <p>{id}</p>
            <button onClick={() => push('/')}>Go home</button>
        </div>
    )
}