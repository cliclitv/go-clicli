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
    console.log(route)
    return <>
        {window.location.pathname !== '/login' && window.location.pathname !== '/register' && <Header />}
        {route}
    </>
}

try {
    render(<App />, document.getElementById("app"))
} catch (e) { }


