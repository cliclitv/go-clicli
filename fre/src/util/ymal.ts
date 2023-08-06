export function renderYmal(str, node) {
    if (!str || !node) {
        return
    }

    var json
    // const json = window.jsyaml.load(str)
    if (window.jsyaml != null) {
        json = window.jsyaml.load(str)
        drawPlayer(json, node)
    }

}

let cursor = 0
let wiatbranch = false
var dpr = window.devicePixelRatio
let stack = []
let stage = []
let roles = []
let activeAudio = null

function drawPlayer(json = {}, canvas) {
    console.log(json)

    roles = json.roles
    canvas.style.width = '1000px'
    canvas.style.height = (1000 / 16 * 9) + 'px'

    canvas.w = 1000
    canvas.h = 1000 / 16 * 9

    canvas.width = 1000
    canvas.height = 1000 / 16 * 9

    // canvas.style.background = '#333'

    const branchV = Object.values(json.branches)

    const branch = branchV[0]

    var ctx = canvas.getContext("2d")

    ctx.canvas.width = ctx.canvas.width * dpr
    ctx.canvas.height = ctx.canvas.height * dpr


    canvas.addEventListener('click', (e) => {
        if (activeAudio) {
            activeAudio.play()
        }
        if (wiatbranch) {
            wiatbranch = false
            var branchK = findBatch(e, canvas)
        }

        if (branchK) {
            const branch = json.branches[branchK]
            cursor = 0
            drawNextStep(branch[cursor++], ctx)
        } else {
            if (branch[cursor] != null) {
                drawNextStep(branch[cursor++], ctx)
            } else {
                cursor = 0
                drawNextStep(branch[cursor++], ctx)
            }

        }


    })
    drawNextStep(branch[cursor++], ctx)
}

let prevStep = null

function findBatch(e, canvas) {
    const rect = canvas.getBoundingClientRect()
    // console.log(e.clientX - 60, e.clientY - 100, stack.map(v => v.map(a => a / dpr)))
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top

    console.log(cx, cy, e.pageX)

    for (const [x, y, w, h, v] of stack) {
        if (x / dpr < cx && y / dpr < cy && w / dpr > cx && h / dpr > cy) {
            console.log(v)
            return v
        }
    }

    return null
}

function getDprS(s) {
    return s / 2 * dpr
}

function drawNextStep(step, ctx) {

    const [key, value] = Object.entries(step)[0]
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    if (key == 'stage') {
        stage = value
        drawImage2(ctx, stage[1], () => {
            drawText2(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, 'Press the screen to start', {
                oppo: false,
                size: 50,
                align: 'center'
            })
            addAudio(stage[0])
            prevStep = step

        })


    } else if (key == 'choose') {
        wiatbranch = true
        drawImage2(ctx, stage[1], () => {
            const [key2, value2] = Object.entries(prevStep)[0]

            const cb = () => {
                drawDilog(ctx, key2, value2)
                drawSelect(ctx, key, value)
                prevStep = step
            }
            if (roles[key2]) {
                drawImage3(ctx, roles[key2], cb)
            } else {
                cb()
            }

        })
    } else {
        drawImage2(ctx, stage[1], () => {
            const cb = () => {
                drawDilog(ctx, key, value)
                prevStep = step
            }
            if (roles[key]) {
                drawImage3(ctx, roles[key], cb)
            } else {
                cb()
            }

        })
    }
}

function drawSelect(ctx, name, value) {

    value.forEach((v, i) => {
        const x = ctx.canvas.width - 250 * dpr
        const y = ctx.canvas.height - 250 * dpr - i * 50 * dpr
        const w = 250 * dpr
        const h = 40 * dpr;

        stack.push([x, y, x + w, y + h, v])

        drawButton(ctx, x, y, 200 * dpr, h, h / 2, true)
        drawText2(ctx, x + 10 * dpr, y + h / 2 + 2 * dpr, v, {
            oppo: true,
            size: 20,
            align: 'left'
        })
    });
}


function drawDilog(ctx, name, value) {
    drawText2(ctx, 120 * dpr, ctx.canvas.height - 210 * dpr, getName(name), {
        oppo: false,
        size: 20,
        align: 'left'
    })
    drawButton(ctx, 50 * dpr, ctx.canvas.height - 190 * dpr, ctx.canvas.width - 50 * dpr, 160 * dpr, 160 * dpr / 2, false)
    drawText2(ctx, 80 * dpr, ctx.canvas.height - 150 * dpr, '『 ' + value + ' 』', {
        oppo: false,
        size: 25,
        align: 'left'
    })

}

function getName(name) {
    return name === 'aside' ? '旁白' : name
}

const drawButton = function (ctx, x, y, width, height, radius, oppo) {

    ctx.save()
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.fillStyle = oppo ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    ctx.closePath();
    ctx.fill();
    ctx.restore()

}

const drawText2 = function (ctx, x, y, text, op) {
    ctx.save()
    ctx.beginPath();
    const size = op.size * dpr
    ctx.font = `${size}px Micosoft yahei`;
    ctx.fillStyle = op.oppo ? "black" : "white";
    ctx.textBaseline = 'middle';
    ctx.textAlign = op.align;
    ctx.fillText(text, x, y, 50 * text.length * dpr, 50 * dpr);
    ctx.closePath();
    ctx.restore();
}

function drawImage2(ctx, src, cb) {
    ctx.save()
    let img = new Image();
    img.src = src
    img.onload = function () {
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)//绘制图片
        cb && cb()
    }
    ctx.restore()
}

function drawImage3(ctx, src, cb) {
    ctx.save()
    let img = new Image();
    img.src = src

    img.onload = function () {
        const w = img.width * dpr
        const h = img.height * dpr
        ctx.drawImage(img, ctx.canvas.width / 2 - w / 2, ctx.canvas.height / 2 - h / 2, w, h)//绘制图片
        cb && cb()
    }
    ctx.restore()
}

function addAudio(src) {
    if (activeAudio) {
        let old = activeAudio
        old.pause()
    }
    const a = new Audio(src)
    activeAudio = a
    // document.body.appendChild(a)
}