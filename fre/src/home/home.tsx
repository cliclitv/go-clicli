import {h} from 'fre'
import {A} from '../use-route'
import Header from '../header/header'

export default  function Home(){
    return(
        <div>
            <Header/>
            <A href='/login'>Login</A>
        </div>
    )
}