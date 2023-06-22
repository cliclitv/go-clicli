import { render, Fragment, h, } from "fre"
import { useRoutes } from './use-route'
import './app.css'
import './m.css'
import Header from "./header/header"
import Footer from './header/footer'
import UploadHeader from './upload/index'
import { getUid } from "./util/avatar"

const routes = {
    '/': import('./home/home'),
    '/login': import('./login/login'),
    '/register': import('./login/register'),
    '/addpost/:id': import('./upload/post'),
    '/addnote/:pid': import('./upload/note'),
    '/editornote/:id': import('./upload/note'),
    '/search/:k': import('./search/search'),
    '/watch/:pid': import('./book/book'),
    '/user/:id': import('./login/register'),
    '/recharge': import('./recharge/recharge'),
    '/my/:id': import('./upload/my'),
}

const App = () => {
    let route = useRoutes(routes)
    const uid = getUid()
    return <div>
        {!uid && <Header />}
        <div>{route}</div>
        {/* <Footer /> */}
    </div>
}

render(<App />, document.getElementById("app"))


