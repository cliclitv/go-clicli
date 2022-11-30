import { render, Fragment, h, useEffect } from "fre"
import { useRoutes, push, A } from './use-route'
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
        {window.location.pathname !== '/login' && window.location.pathname !== '/register' && <Header />}
        {route}
    </>
}

try {
    render(<App />, document.getElementById("app"))
} catch (e) { }


let curDate = new Date();
// let curDate = curDate.setDate(curDate.getDate() - 1)

// 以下都是时间戳对比
if (Date.now() < 1670256000000) {
    document.body.style = `filter: grayscale(100%)`
}


