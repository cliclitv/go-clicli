import {h} from 'fre'
import {A} from '../use-route'
import Header from '../header/header'
import Post from '../post/post'
import Detail from '../detail/detail'

export default  function Home(){
    return(
        <div>
            <Header/>
            <Detail/>
            {/* <A href='/login'>Login</A> */}
        </div>
    )
}