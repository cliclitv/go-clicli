import { h, useEffect } from 'fre'
import { saveFile, startRpc } from '../util/steam'
import './live.css'

export default function Live() {

    useEffect(() => {

        document.querySelector('#file').addEventListener('change', event => {
            handleStream(event)
        })
    }, [])

    async function handleStream(e) {
        const files = e.target.files
        const file = files[0];
        console.log(file)
        const { code } = await saveFile({ file, fileName: files[0].name });
        if (code !== 1) return;
        const url = URL.createObjectURL(file);

        const videoEl = document.querySelector('video')

        videoEl.src = url

        const videoRes = await new Promise<HTMLVideoElement>((resolve) => {
            videoEl.onloadedmetadata = () => {
                resolve(videoEl);
            };
        });
        // @ts-ignore
        const stream = videoRes.captureStream();

        await startRpc(stream)
    }
    return <div class='live'>
        <form id="upForm" action="#" method="post" enctype="multipart/form-data">
            <input id="file" type="file" name="file" style="display:none" />
            <label for="file">选择文件</label>
        </form>
        <video src="" controls autoplay muted></video>
    </div>
}