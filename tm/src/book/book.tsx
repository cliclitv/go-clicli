import { h, useEffect, useState, useRef } from 'fre'
import snarkdown from 'snarkdown'
import { getArticle, getArticles, getPlayUrl, getPostDetail, getPv, getTransfer, getUser } from '../util/api'
import { getAv, getSuo } from '../util/avatar'
import './book.css'
import Avatar from '../component/avatar/avatar'

export default function Post({ pid }) {
    const id = getAv(pid)
    const [post, setPost] = useState({} as any)
    const [articles, setArticles] = useState([])
    const [article, setArticle] = useState({})
    const [index, setIndex] = useState(0)
    const [pv, setPv] = useState(0)
    console.log(123)

    useEffect(() => {
        const p1 = getPostDetail(id)
        const p2 = getPv(id)
        Promise.all([p1, p2]).then(([res1, res2]) => {
            getArticles(res1.result.id).then(res3 => {
                setPost((res1 as any).result)
                setArticles(res3.articles)
                getArticle(res3.articles[index].id).then(res => {
                    setArticle(res.result)
                })
            })
            setPv((res2 as any).result.pv)
        })

    }, [])

    useEffect(() => {
        const a = document.querySelector('article')
        if (article.content) {
            a.innerHTML = snarkdown(article?.content)
        }
    }, [article])

    useEffect(() => {
        console.log(articles[index])
        if (articles[index] != null) {
            getArticle(articles[index].id).then(res => {
                setArticle(res.result)
            })
        }
    }, [index])



    return (
        <main class="wrap">
            <div className="left2">
                <h1>{article.title}</h1>
                <article></article>
                <p><b>作者有话说：</b>
                    <li>{article.bio}</li></p>
            </div>
            <div className="right">
                <div className="bio">
                    <Avatar uname={post.uname} uqq={post.uqq} />
                </div>
                <section>
                    <ul>{
                        articles.map((a, i) => <li class={index === i ? 'active' : ''} onclick={() => setIndex(i)}>{a.title}</li>)}</ul>
                </section>
            </div>
        </main>
    )
}