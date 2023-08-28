
import { getUser } from "./api";


export class WebRtc {
    pc: any;
    id: number
    otherPc: any
    ws: any
    constructor(id) {
        this.pc = new RTCPeerConnection({})
        const url = `wss://www.boyslove.org/chat?uid=${id}`
        console.log(url)
        this.ws = new WebSocket(url);
        this.id = id
        this.pc.onconnectionstatechange = this.onStateChange.bind(this)
        this.pc.onicecandidate = this.onCandidate.bind(this)
        this.pc.onaddstream = this.onAddStream.bind(this)
        this.ws.onopen = function () {
            console.log("连接已打开");
        };

        const i = this.id
        const pc = this.pc
        const that = this

        this.ws.onmessage = function (event) {
            console.log("收到服务器消息：", i, event.data);

            if (event.data != 'ok') {
                const data = JSON.parse(event.data)
                if (data.content == '1' || data.content == '2') {
                    that.setRomete(data.content)
                }
                else if (data.tid == '1' && data.content.indexOf('candidate') < -1) {
                    console.log(data.content)
                    pc.setRemoteDescription(data.content)
                }

                else if (i.toString() == data.tid) {
                    const d = JSON.parse(data.content)
                    console.log(111, d)
                    pc.addIceCandidate(d)
                }
            }
        };

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
        console.log('发送消息', this.id)
        localStorage.setItem(this.id.toString() + 'cd', JSON.stringify(e.candidate))
    }

    sendCand() {
        const candidate = localStorage.getItem(this.id + 'cd')
        const data = { "uid": this.id.toString(), "tid": this.id == 1 ? '2' : '1', "content": candidate, "cmd": 1 }
        this.ws.send(JSON.stringify(data))
    }

    addStream(stream) {
        this.pc.addStream(stream)
    }

    async createOffer(key) {
        const desc = await this.pc.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false
        })
        await this.pc.setLocalDescription(desc)
        localStorage.setItem(key, JSON.stringify(desc))
        return desc
    }

    async setRomete(key) {
        let desc = localStorage.getItem(key)
        await this.pc.setRemoteDescription(JSON.parse(desc))
    }

    async createAnswer(key) {
        const desc = await this.pc.createAnswer()
        await this.pc.setLocalDescription(desc)
        localStorage.setItem(key, JSON.stringify(desc))
        return desc
    }
}