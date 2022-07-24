import { render, Fragment, h, useEffect } from "fre"
import { useRoutes, push, A } from './use-route'
import './app.css'
import Header from "./header/header"


const routes = {
    '/': import('./home/home'),
    '/login': import('./login/login'),
    '/register': import('./login/register'),
    '/upload/:id': import('./upload/upload'),
    '/play/:gv': import('./play/play')
}

const App = () => {
    let route = useRoutes(routes)
    return <>
        {window.location.pathname !== '/login' && window.location.pathname !== '/register' && <Header />}
        {route}
    </>
}

render(<App />, document.getElementById("app"))
