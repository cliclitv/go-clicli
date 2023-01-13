import {h, useEffect} from 'fre'
import { pay } from '../util/api'

export default function Pay() {
    useEffect(()=>{
        pay(0.1).then(res=>{
            console.log(res)
        })
    },[])
    return <div>123</div>
}