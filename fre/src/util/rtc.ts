export class WebRtc {
    pc: any;
    constructor() {
        this.pc = new RTCPeerConnection({})
        this.pc.onconnectionstatechange = this.onStateChange
        this.pc.onicecandidate = this.onCandidate
        this.pc.onaddstream = this.onAddStream

    }
    onAddStream(e) {
        console.log(e)

    }
    onStateChange(e) {

    }

    onCandidate() {

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

    async setRomete(desc){
        const e = await this.pc.setRemoteDescription(desc)
        console.log(e)
    }
}