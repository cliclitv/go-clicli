import { render, Fragment, h, useEffect } from "fre"
import { useRoutes, push, A } from './use-route'

const routes = {
  '/': () => (
    <div>
      <p>home</p>
      <A href='/home/jack'>Go jack</A>
    </div>
  ),
  '/home/:id': ({ id }) => (
    <div>
      <p>{id}</p>
      <button onClick={() => push('/')}>Go home</button>
    </div>
  )
}

const App = () => useRoutes(routes)

render(<App />, document.getElementById("app"))
