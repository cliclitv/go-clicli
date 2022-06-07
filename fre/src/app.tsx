import { render, Fragment, h, useEffect } from "fre"
import { useRoutes, push, A } from './use-route'
import './app.css'
import Header from "./header/header"


const routes = {
    '/': import('./home/home'),
    '/login': import('./login/login'),
    '/upload/:id': import('./upload/upload')
}

const App = () => {
    let route = useRoutes(routes)
    return <>
        {window.location.pathname !== '/login' && <Header />}
        {route}
    </>
}

render(<App />, document.getElementById("app"))
