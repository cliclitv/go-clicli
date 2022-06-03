import {h} from 'fre'
import {A} from '../use-route'

export default  function Home(){
    return(
        <div>
            <p>home</p>
            <A href='/home/jack'>Go jack</A>
        </div>
    )
}