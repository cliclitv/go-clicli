import { render, Fragment, h, } from "fre"
import { useRoutes } from './use-route'
import './app.css'
import Header from "./header/header"
import Footer from './header/footer'

const routes = {
    '/': import('./home/home'),
    '/login': import('./login/login'),
    '/register': import('./login/register'),
    '/upload/:id': import('./upload/upload'),
    '/play/:gv': import('./play/play'),
    '/search/:k': import('./search/search'),
    '/user/:id': import('./login/register'),
    '/vip': import('./vip/vip')
}

const App = () => {
    let route = useRoutes(routes)
    console.log(route)
    const header =  <Header />
    const footer = <Footer />
    return <div>
        {window.location.pathname !== '/login' && window.location.pathname !== '/register' && header}
        <div>{route}</div>
        {window.location.pathname !== '/login' && window.location.pathname !== '/register' && footer}
    </div>
}

render(<App />, document.getElementById("app"))


// // 以下都是时间戳对比
// if (Date.now() < 1670256000000 && window.location.pathname === '/') {
//     document.getElementById('app').style = `filter: grayscale(100%);position:absolute;top:0;bottom:0;left:0;right:0;`
// }


