import { render, Fragment, h, } from "fre"
import { useRoutes } from './use-route'
import './app.css'
import Header from "./header/header"
import Footer from "./header/footer"

const routes = {
    '/': import('./home/home'),
    '/login': import('./login/login'),
    '/register': import('./login/register'),
    '/upload/:id': import('./upload/upload'),
    '/play/:gv': import('./home/home'),
    '/read/:gv': import('./home/home'),
    '/search/:k': import('./search/search'),
    '/user/:id': import('./login/register'),
    '/recharge': import('./recharge/recharge'),
    '/my/:id': import('./admin/admin'),
}

const App = () => {
    let route = useRoutes(routes)
    return <main>
        <Header />
        <div>{route}</div>
        <Footer />
    </main>
}

render(<App />, document.getElementById("app"))


