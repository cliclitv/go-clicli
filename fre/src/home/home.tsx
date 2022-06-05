import {h} from 'fre'
import {A} from '../use-route'

export default  function Home(){
    return(
        <div>
            <p>home</p>
            <A href='/login'>Login</A>
        </div>
    )
}