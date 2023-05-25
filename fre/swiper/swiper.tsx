import { h, useEffect, useState } from 'fre'
import BlazeSlider from 'blaze-slider'
import 'blaze-slider/dist/blaze.css'
import './swiper.css'
import { getPost } from '../src/util/api'
import { getSuo } from '../src/util/avatar'

export default function Swiper() {
    const [list, setList] = useState([])
    useEffect(() => {
        const el = document.querySelector('.blaze-slider')
        new BlazeSlider(el as any)
    }, [])
    useEffect(() => {
        getPost('', '独播', 1, 6).then((res: any) => {
            setList(res.posts)
        })
    }, [])
    return (
        <div class="blaze-slider">
            <div class="blaze-container">
                <div class="blaze-track-container">
                    <div class="blaze-track">
                        <div>
                            <ul>
                                {list.splice(0,3).map(item=>{
                                    return <li><img src={getSuo(item.content)} /><p>{item.title}</p></li>
                                })}
                            </ul>
                        </div>
                        <div>
                            <ul>
                            {list.splice(0,3).map(item=>{
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