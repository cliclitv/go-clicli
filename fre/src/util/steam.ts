import { WebRtc } from "./rtc";

export function saveFile(data: { file: File; fileName: string }) {
    return new Promise<{ code: number }>((resolve) => {
        const { file, fileName } = data;
        const requestFileSystem =
            // @ts-ignore
            window.requestFileSystem || window.webkitRequestFileSystem;
        if (!requestFileSystem) {
            resolve({ code: 2 });
            return;
        }
        function onError(err) {
            console.log(err);
            resolve({ code: 2 });
        }
        function onFs(fs) {
            // 创建文件
            fs.root.getFile(
                fileName,
                { create: true },
                (fileEntry) => {
                    // 创建文件写入流
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = () => {
                            // 完成后关闭文件
                            fileWriter.abort();
                            resolve({ code: 1 });
                        };
                        // 写入文件内容
                        fileWriter.write(file);
                    });
                },
                onError
            );
        }
        // Opening a file system with temporary storage
        requestFileSystem(
            // @ts-ignore
            window.PERSISTENT,
            0,
            onFs,
            onError
        );
    });
}


if (window.location.pathname == '/') {
    var pc2 = new WebRtc('2')
} else {
    var pc1 = new WebRtc('1')
}


export async function startRpc(stream) {
    pc1.addStream(stream)
    await pc1.createOffer('1')
    pc1.ws.send(JSON.stringify({ "uid": "1", "tid": "2", "content": "1", "cmd": 1 }))

    if(localStorage.getItem('1cd')){
        pc1.sendCand()
    }

}

export async function startPull() {

    // await pc2.setRomete('1')
    const desc = await pc2.createAnswer('2')
    pc2.ws.send(JSON.stringify({ "uid": "2", "tid": "1", "content": "2", "cmd": 1 }))
}