import { render, Fragment, h, useEffect } from "fre"
import { useRoutes, push, A } from './use-route'
import './app.css'



const routes = {
    '/': import('./home/home'),
    '/home/:id': import('./post/post'),
    '/login': import('./login/login')
}

const App = () => useRoutes(routes)

render(<App />, document.getElementById("app"))
