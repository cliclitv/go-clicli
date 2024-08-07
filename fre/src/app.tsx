import { render, Fragment, } from "fre"
import { useRoutes } from './use-route'
import './app.css'
import Header from "./header/header"
import Footer from "./header/footer"
import { getToken } from "./util/post"

const routes = {
    '/': import('./home/home'),
    '/login': import('./home/home'),
    '/register': import('./home/home'),
    '/draft/:id': import('./draft/draft'),
    '/play/:gv': import('./home/home'),
    '/live/:uu': import('./home/home'),
    '/user/:uid': import('./home/home'),
    '/sponsor': import('./sponsor/sponsor'),
}

const App = () => {
    let route = useRoutes(routes)
    let token = getToken()
    if (token) {
        // 不需要登录，直接写 localstorage
        window.localStorage.setItem('token', token)
    }
    return <main>
        {!token && <Header />}
        <div class="container">{route}</div>
        {!token && <Footer />}
    </main>
}

render(<App />, document.getElementById("app"))


