import { h, useEffect, useState } from 'fre'
// import BlazeSlider from 'blaze-slider'
// import 'blaze-slider/dist/blaze.css'
import './swiper.css'
import { getPost } from '../util/api'
import { getSuo } from '../util/avatar'

export default function Swiper() {
    const [list, setList] = useState([])
    useEffect(() => {
        const el = document.querySelector('.blaze-slider')
        new window.BlazeSlider(el as any)
    }, [])
    useEffect(() => {
        getPost('', '独播', 1, 6).then((res: any) => {
            setList(res.posts)
        })
    }, [])
    const a = list.slice(0,3);
    const b = list.slice(3,6)
    console.log(a,b)
    return (
        <div class="blaze-slider">
            <div class="blaze-container">
                <div class="blaze-track-container">
                    <div class="blaze-track">
                        <div>
                            <ul>
                                {a.map(item=>{
                                    return <li><img src={getSuo(item.content)} /><p>{item.title}</p></li>
                                })}
                            </ul>
                        </div>
                        <div>
                            <ul>
                            {b.map(item=>{
                                    return <li><img src={getSuo(item.content)} /><p>{item.title}</p></li>
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