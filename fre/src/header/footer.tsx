import { useEffect } from "fre"

export default function Footer(props) {
    useEffect(()=>{
        document.querySelector('ad').innerHTML = '<script src="//js.penxiangge.com/inc/s.php?s=72329&w=760&h=60"></script>';
    },[])
    return <footer class='wrap'>
        <div class="ad">
        </div>
        <p>© 2018 - 2023 clicli.cc & admin@clicli.us <a href="https://github.com/cliclitv" class='github'>Github</a></p>

        <ul class="friends">

            <a href="https://tempstsuma.cn/" class='github' target="_blank">友链(Tempstsuma)</a>
            <a href="https://www.summerpockets.com" class='github' target="_blank">友链(鸟白岛演绎厅)</a>
            <a href="https://www.huahuo6.com" class='github' target="_blank">友链(花火轻小说)</a>
        </ul>
    </footer>
}