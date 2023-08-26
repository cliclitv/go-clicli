import { h, useEffect } from 'fre'
import './home.css'

export default function App() {
    useEffect(() => {
        const main = document.querySelector('main')
        const height = main.clientHeight
        console.log(height)
        const windowHeight = document.documentElement.clientHeight
        console.log(windowHeight)

        window.onscroll = () => {
            // 视差效果
            const realy = (1080 - windowHeight) * (document.documentElement.scrollTop / height)
            main.style.backgroundPositionY = -realy + 'px'
        }

    }, [])
    return (
        <div className="container">
        </div>
    )
}