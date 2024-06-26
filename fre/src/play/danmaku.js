export class Danmaku {
    constructor(canvas, video, data) {
        this.canvas = canvas
        this.video = video
        this.context = canvas.getContext('2d')
        this.canvas.width = video.clientWidth
        this.canvas.height = video.clientHeight
        let defaultOpts = {
            color: '#fff',
            fontSize: 20,
            speed: 2,
            data: []
        }
        Object.assign(this, defaultOpts, { data })

        this.paused = true
        this.danmaku = this.data.map(danmu => new Danmu(danmu, this))

        this.render()
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.draw()
        if (!this.paused) {
            requestAnimationFrame(this.render.bind(this))
        }
    }

    draw() {
        let cTime = this.video.currentTime
        this.danmaku.forEach(danmu => {
            if (!danmu.flag && danmu.pos <= cTime) {
                if (!danmu.once) {
                    danmu.init()
                    danmu.once = true
                }
                danmu.x -= danmu.speed
                danmu.render()
                if (danmu.x <= danmu.width * -1) {
                    danmu.flag = true
                }
            }
        })
    }

    add(danmu) {
        this.danmaku.push(new Danmu(danmu, this))
    }

    play() {
        this.paused = false
        this.render()
    }

    pause() {
        this.paused = true
    }

    reset() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        let cTime = this.video.currentTime
        this.danmaku.forEach(danmu => {
            danmu.flag = false
            if (cTime < danmu.pos) {
                danmu.paused = false
            } else {
                danmu.flag = true
            }
        })
    }
}

class Danmu {
    constructor(danmu, vm) {
        this.danmu = danmu
        this.content = danmu.content
        this.pos = danmu.pos
        this.vm = vm
    }

    init() {
        this.color = this.danmu.color || this.vm.color
        this.fontSize = this.danmu.fontSize || this.vm.fontSize
        this.speed = this.danmu.speed || this.vm.speed

        let span = document.createElement('span')
        span.innerText = this.content
        span.style.font = this.fontSize + 'px "微软雅黑"'
        span.style.position = 'absolute'
        document.body.appendChild(span)
        this.width = span.clientWidth
        document.body.removeChild(span)

        this.x = this.vm.canvas.width
        let r = this.vm.canvas.height * Math.random()
        this.y = r - (r % this.fontSize)

        if (this.y < this.fontSize) this.y = this.fontSize
        if (this.y > this.vm.canvas.height - this.fontSize)
            this.y = this.vm.canvas.height - this.fontSize
    }

    render() {
        this.vm.context.font = this.fontSize + 'px "微软雅黑"'
        this.vm.context.fillStyle = this.color
        this.vm.context.fillText(this.content, this.x, this.y)
    }
}

export default Danmaku