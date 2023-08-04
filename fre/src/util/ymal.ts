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
var dpr = window.devicePixelRatio
let stack = []
let stage = []

function drawPlayer(json = {}, canvas) {
    console.log(json)
    canvas.style.width = '1000px'
    canvas.style.height = (1000 / 16 * 9) + 'px'

    canvas.width = 1000
    canvas.height = 1000 / 16 * 9

    // canvas.style.background = '#333'

    const branchV = Object.values(json.branches)

    const branch = branchV[0]

    var ctx = canvas.getContext("2d")

    ctx.canvas.width = ctx.canvas.width * dpr
    ctx.canvas.height = ctx.canvas.height * dpr


    canvas.addEventListener('click', (e) => {
        let branchK = findBatch(e)

        if (branchK) {
            const branch = json.branches[branchK]
            console.log(branch)
            cursor = 0
            drawNextStep(branch[cursor++], ctx)
        } else {
            drawNextStep(branch[cursor++], ctx)
        }


    })
    drawNextStep(branch[cursor++], ctx)
}

let prevStep = null

function findBatch(e) {
    // console.log(e.clientX - 60, e.clientY - 100, stack.map(v => v.map(a => a / dpr)))
    const cx = e.clientX - 60
    const cy = e.clientY - 100

    for (const [x, y, w, h, v] of stack) {
        if (x / dpr < cx && y / dpr < cy && w / dpr > cx && h / dpr > cy) {
            console.log(v)
            return v
        }
    }

    return null
}

function drawNextStep(step, ctx) {
    console.log(step)
    // 默认加载第一句
    if (step == null) {
        cursor = 0
        return
    }

    const [key, value] = Object.entries(step)[0]
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    if (key == 'change') {
        stage = value
        drawImage2(ctx, stage[1], () => {
            prevStep = step
        })
    } else if (key == 'choose') {
        drawImage2(ctx, stage[1], () => {
            const [key2, value2] = Object.entries(prevStep)[0]
            drawDilog(ctx, key2, value2)
            drawSelect(ctx, key, value)
            prevStep = step

        })
    } else {
        drawImage2(ctx, stage[1], () => {
            drawDilog(ctx, key, value)
            prevStep = step
        })
    }
}

function drawSelect(ctx, name, value) {

    value.forEach((v, i) => {
        const x = ctx.canvas.width - 600
        const y = ctx.canvas.height - 550 - i * 110
        const w = 500
        const h = 100;

        stack.push([x, y, x + w, y + h, v])

        drawButton(ctx, x, y, 500, 100, 60, true)
        drawText(ctx, ctx.canvas.width - 350, ctx.canvas.height - 550 - i * 110 + 55, 500, v, true)
    });
}


function drawDilog(ctx, name, value) {
    drawText(ctx, 250, ctx.canvas.height - 450, 500, getName(name), false)
    drawButton(ctx, 100, ctx.canvas.height - 400, ctx.canvas.width - 200, 300, 160, false)
    drawText(ctx, 400, ctx.canvas.height - 300, 500, '『 ' + value + ' 』', false)
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

const drawText = function (ctx, x, y, w, text, oppo) {
    ctx.save()
    ctx.beginPath();
    const size = 50
    ctx.font = `${size}px Micosoft yahei`;
    ctx.fillStyle = oppo ? "black" : "white";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y, w);
    ctx.closePath();
    ctx.restore();
}

function drawImage2(ctx, src, cb) {
    ctx.save()
    let img = new Image();
    img.src = src
    img.onload = function () {
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)//绘制图片
        console.log(123)
        cb && cb()
    }
    ctx.restore()
}