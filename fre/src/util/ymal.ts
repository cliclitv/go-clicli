export function renderYmal(str, node) {
    if (!str || !node) {
        return
    }
    console.log(str, node)
    var json
    // const json = window.jsyaml.load(str)
    if (window.jsyaml != null) {
        json = window.jsyaml.load(str)
        drawPlayer(json, node)
    }

}

let cursor = 0

function drawPlayer(json = {}, canvas) {
    console.log(123)
    // 设置宽高
    canvas.style.width = '1000px'
    canvas.style.height = (1000 / 16 * 9) + 'px'

    canvas.width = 1000
    canvas.height = 1000 / 16 * 9

    // canvas.style.background = '#333'

    const branches = json.branches

    var ctx = canvas.getContext("2d")


    canvas.addEventListener('click', (e) => {
        drawNextStep(branches, ctx)
    })
    drawNextStep(branches, ctx)
}

function drawNextStep(branches, ctx) {
    const branchKey = Object.keys(branches)[cursor++]

    const steps = branches[branchKey]

    if (steps == null) {
        console.log(branchKey)
        cursor = 0
        return
    }

    for (const step of steps) {
        const arr = Object.entries(step)[0] as any
        console.log(arr)
        if (arr[0] == 'change') {
            // 更换画布
            drawImage2(ctx, 'https://demo.openwebgal.com/game/background/WebGAL_New_Enter_Image.png')
        }
    }
}

function drawImage2(ctx, src) {
    let img = new Image();
    img.src = src
    var dpr = window.devicePixelRatio

    // 创建一个<img>元素
    console.log(1233)
    img.onload = function () {
        ctx.canvas.width = ctx.canvas.width * dpr
        ctx.canvas.height = ctx.canvas.height * dpr
        // ctx.scale(dpr, dpr)

        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)//绘制图片
    }
}