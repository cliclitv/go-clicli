import { h, useEffect, useState } from 'fre'
// import BlazeSlider from 'blaze-slider'
// import 'blaze-slider/dist/blaze.css'
import './swiper.css'
import { getPost } from '../util/api'
import { getSuo } from '../util/avatar'
import { push } from '../use-route'

export default function Swiper() {
    const [list1, setList1] = useState([])
    const [list2, setList2] = useState([])
    useEffect(() => {
        getPost('', '独播', 1, 6).then((res: any) => {
            setList1(res.posts.slice(0, 3))
            setList2(res.posts.slice(3, 6))
            setTimeout(() => {
                if (window.BlazeSlider) {
                    const el = document.querySelector('.blaze-slider')
                    new window.BlazeSlider(el as any)
                }
            })
        })
    }, [])
    useEffect(() => {
        document.querySelectorAll('ul').innerHTML = ''
    }, [list1, list2])
    return (
        <div class="blaze-slider">
            <div class="blaze-container">
                <div class="blaze-track-container">
                    <div class="blaze-track">
                        <div>
                            <ul>
                                {list1.map(item => {
                                    return <li key={item.id}><img src={getSuo(item.content)} onClick={() => push(`/play/gv${item.id}`)} /><p>{item.title}</p></li>
                                })}
                            </ul>
                        </div>
                        <div>
                            <ul>
                                {list2.map(item => {
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