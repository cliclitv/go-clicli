import { render, Fragment, h, } from "fre"
import { useRoutes } from './use-route'
import './app.css'
import Header from "./header/header"


const routes = {
    '/': import('./home/home'),
    '/login': import('./login/login'),
    '/register': import('./login/register'),
    '/upload/:id': import('./upload/upload'),
    '/play/:gv': import('./play/play'),
    '/search/:k': import('./search/search'),
    '/user/:id': import('./login/register')
}

const App = () => {
    let route = useRoutes(routes)
    return <>
        <Header />
        {route}
        {/* {window.location.pathname !== '/login' && window.location.pathname !== '/register' ? <Footer /> : ''} */}
    </>
}

render(<App />, document.getElementById("app"))


// 以下都是时间戳对比
if (Date.now() < 1670256000000) {
    document.getElementById('app').style = `filter: grayscale(100%);position:absolute;top:0;bottom:0;left:0;right:0;`
}


