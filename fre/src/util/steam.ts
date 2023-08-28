import { WebRtc } from "./rtc";

export function saveFile(data: { file: File; fileName: string }) {
    return new Promise<{ code: number }>((resolve) => {
        const { file, fileName } = data;
        const requestFileSystem =
            // @ts-ignore
            window.requestFileSystem || window.webkitRequestFileSystem;
        if (!requestFileSystem) {
            console.error('不支持requestFileSystem');
            resolve({ code: 2 });
            return;
        }
        function onError(err) {
            console.error('saveFile错误', data.fileName);
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


export async function startRpc(stream) {

    const pc1 = new WebRtc()
    pc1.addStream(stream)
    const desc = await pc1.createOffer()

    const pc2 = new WebRtc()
    await pc2.setRomete(desc)
}