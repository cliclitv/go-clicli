import { render, Fragment, h, useEffect } from "fre"
import Header from "./header/header"

import './app.css'

function App() {
    return <>
        <Header></Header>
    </>
}

render(<App />, document.getElementById("app"))
