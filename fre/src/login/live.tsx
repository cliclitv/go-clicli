import { h, useEffect } from 'fre'
import { startPull, startPush } from '../util/rtc'
import { saveFile } from '../util/steam'
import './live.css'

let videoStream = null

export function getStream(){
    return videoStream
}

export default function Live() {

    useEffect(() => {

        document.querySelector('#file').addEventListener('change', event => {
            handleStream(event)
        })
    }, [])

    async function handleStream(e) {
        const files = e.target.files
        const file = files[0];
        const { code } = await saveFile({ file, fileName: files[0].name });
        if (code !== 1) return;
        const url = URL.createObjectURL(file);

        const videoEl = document.querySelector('.local') as any

        videoEl.src = url

        const videoRes = await new Promise<HTMLVideoElement>((resolve) => {
            videoEl.onloadedmetadata = () => {
                resolve(videoEl);
            };
        });
        // @ts-ignore
        let stream = videoRes.captureStream();

        videoStream = stream

        await startPush()
    }
    return <div class='live'>
        <form id="upForm" action="#" method="post" enctype="multipart/form-data">
            <input id="file" type="file" name="file" style="display:none" />
            <label for="file">选择文件开始直播</label>
        </form>
        <video src="" controls autoplay class="local"></video>

    </div>
}