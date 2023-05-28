import { h, useEffect, useState } from 'fre'
// import BlazeSlider from 'blaze-slider'
// import 'blaze-slider/dist/blaze.css'
import './swiper.css'
import { getPost } from '../util/api'
import { getSuo } from '../util/avatar'
import { push } from '../use-route'

export default function Swiper() {
    const [list, setList] = useState([])
    useEffect(() => {
        console.log(456)
        getPost('', '独播', 1, 6).then((res: any) => {
            setTimeout(() => {
                setList(res.posts)
                if (window.BlazeSlider) {
                    const el = document.querySelector('.blaze-slider')
                    new window.BlazeSlider(el as any)
                }
            }, 500)
        })
    }, [])

    return (
        <div class="blaze-slider">
            <div class="blaze-container">
                <div class="blaze-track-container">
                    <div class="blaze-track">
                        <div>
                            <ul>
                                {list.slice(0, 3).map((item, index) => {
                                    return <li key={item.id}><img src={getSuo(item.content)} onClick={() => push(`/play/gv${item.id}`)} /><p>{item.title}</p></li>
                                })}
                            </ul>
                        </div>
                        <div>
                            <ul>
                                {list.slice(3, 6).map(item => {
                                    return <li key={item.id}><img src={getSuo(item.content)} onClick={() => push(`/play/gv${item.id}`)} /><p>{item.title}</p></li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="my-structure">
                    <button class="blaze-prev">{'<'}</button>
                    <div class="blaze-pagination"></div>
                    <button class="blaze-next">{'>'}</button>
                </div>
            </div>
        </div>
    )
}