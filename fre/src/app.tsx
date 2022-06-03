import { render, Fragment, h, useEffect } from "fre"
import { useRoutes, push, A } from './use-route'



const routes = {
    '/': import('./home/home'),
    '/home/:id': import('./post/post')
}

const App = () => useRoutes(routes)

render(<App />, document.getElementById("app"))
