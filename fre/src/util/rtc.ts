
import { getUser } from "./api";


export class WebRtc {
    pc: any;
    id: string
    otherPc: any
    ws: any
    constructor(id) {
        this.pc = new RTCPeerConnection({})

        this.id = id
        this.pc.onconnectionstatechange = this.onStateChange.bind(this)
        this.pc.onicecandidate = this.onCandidate.bind(this)
        this.pc.onaddstream = this.onAddStream.bind(this)

        this.reconnect()

    }
    reconnect() {
        const url = `wss://clicli-live.deno.dev?uid=${this.id}`

        this.ws = new WebSocket(url);
        this.ws.onopen = function () {
            console.log("连接已打开", url);
        };
        this.ws.onclose = (e) => {
            console.log(e)
            this.reconnect()
            console.log('链接已关闭')
        }
        this.ws.onerror = (e) => {
            console.log(e)
            console.log('链接出错')
        }

        // setInterval(() => {
        //     this.ws.send(JSON.stringify({ "cmd": 0 })) // 5s 一次心跳检测
        // }, 5000);

        const i = this.id
        const pc = this.pc
        const that = this

        this.ws.onmessage = function (event) {

            const data = JSON.parse(event.data)
            if (data.desc) { // setRemote
                if (i.toString() == data.tid) {
                    that.setRomete(data.desc)
                }

            }

            else if (data.candidate) {
                if (i.toString() == data.tid) {
                    const d = JSON.parse(data.content)
                    pc.addIceCandidate(d)
                }
            }

        }
    }
    onAddStream(e) {
        console.log(this.id)
        const v = document.querySelector('.remote') as any
        v.srcObject = e.stream
        console.log(e.stream)
    }
    onStateChange(e) {
        // console.log(e)
    }

    async onCandidate(e) {
        if (!e || !e.candidate) return
        localStorage.setItem(this.id.toString() + 'cd', JSON.stringify(e.candidate))
        this.sendCand(e.candidate)
    }

    sendCand(c: any) {
        const data = { uid: this.id, tid: this.id == '1' ? '2' : '1', candidate: c }
        console.log('发送消息', data)
        this.ws.send(JSON.stringify(data))
    }

    addStream(stream) {
        this.pc.addStream(stream)
    }

    async createOffer() {
        const desc = await this.pc.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false
        })
        await this.pc.setLocalDescription(desc)
        return desc
    }

    async setRomete(desc) {
        await this.pc.setRemoteDescription(JSON.parse(desc))
    }

    async createAnswer() {
        const desc = await this.pc.createAnswer()
        await this.pc.setLocalDescription(desc)
        return desc
    }
}


if (window.location.pathname == '/') {
    var pc2 = new WebRtc('2')
} else {
    var pc1 = new WebRtc('1')
}


export async function startPush(stream) {
    // i am uid1
    const push = async () => {
        pc1.addStream(stream)
        const desc = await pc1.createOffer()
        pc1.ws.send(JSON.stringify({ uid: '1', tid: '2', desc: JSON.stringify(desc) })) // remote
    }
    setInterval(async () => {
        await push()
    }, 2000);

}

export async function startPull() {
    const desc = await pc2.createAnswer()
    const str = JSON.stringify({ uid: "2", tid: "1", desc: JSON.stringify(desc) })
    pc2.ws.send(str)
}