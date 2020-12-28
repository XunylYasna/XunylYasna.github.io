const ascii = ".:-=+*#%@"; 

const canvas = document.createElement('canvas');
// Sets the dimension of the canvas
canvas.width = 32;
canvas.height = 48;

const ctx = canvas.getContext('2d');

const asciicontainer = document.querySelector('.ascii');

const map = (x, max, min, tmax, tmin) => (x - min) / (max - min) * (tmax - tmin) + tmin;

const lerp = (x, a, b) => a + (b - a) * x;

const map_table = new Array(255).fill(1).map((_, i) => Math.ceil(map(i, 255, 0, ascii.length - 1, 0)));

const line = (x1, y1, x2, y2) => {
    ctx.beginPath();

    let grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.75)");
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.35)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0.12)");
    
    ctx.strokeStyle = grad;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

const getAsciiOutput = (canvas, ctx) => {
    let imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pix = imgd.data;

    let output = '';

    for (let i = 0, n = pix.length; i < n; i += 4) {
        let xpos = (i / 4) % canvas.width;
        let char = ascii[map_table[pix[i]]];
        
        if (xpos == 0) {
            output += '<div>';
        } else if (xpos == canvas.width - 1) {
            output.innerHTML += '</div>';
        }

        output += char == ascii[0] ? `<span style="color: #444">${char}</span>` : char;
    }

    return output;
}

const randomBox = () => ({
    x: Math.floor(Math.random() * 10) + 7,
    y: Math.floor(Math.random() * 15) + 7,
    sx: 0,
    sy: 0,
    w: 6,
    h: 10,
    progress: 0
});

let box = randomBox();
box.sx = box.x;
box.sy = box.y;

let nextPos = randomBox();

let tick = 0;
let mouseState = false;

const loop = () => {
    tick += 0.025;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f4f4f4'
    ctx.fillRect(box.x, box.y, box.w, box.h);


    line(box.x, box.y, 0, 0);
    line(box.x + box.w, box.y, canvas.width, 0);
    line(box.x, box.y + box.h, 0, canvas.height);
    line(box.x + box.w, box.y + box.h, canvas.width, canvas.height);

    ctx.beginPath();
    let x = box.x + box.w / 2;
    let y = box.y + box.h / 2;

    let grad = ctx.createRadialGradient(x, y, 5, x, y, 20);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    grad.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    
    ctx.fillStyle = grad;
    ctx.arc(x, y, 6 + 2.5 * Math.acos(Math.sin(tick) * Math.PI / 4), 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    if (!mouseState) {
        if (box.progress < 0.99) {
            box.progress += 0.005;
            box.x = lerp(box.progress, box.sx, nextPos.x);
            box.y = lerp(box.progress, box.sy, nextPos.y);
        } else {
            box = Object.assign({}, nextPos);
            box.sx = box.x;
            box.sy = box.y;
            nextPos = randomBox();
        }
    }

    asciicontainer.innerHTML = getAsciiOutput(canvas, ctx);

    requestAnimationFrame(loop);
}

loop();

asciicontainer.addEventListener('mouseenter', _ => {
    mouseState = true;
});

asciicontainer.addEventListener('mouseleave', _ => {
    mouseState = false;
});

window.addEventListener('mousemove', e => {
    if (mouseState) {
        box.x = map(e.clientX, window.innerWidth, 0, canvas.width, 0) - box.w / 2;
        box.y = map(e.clientY, window.innerHeight, 0, canvas.height, 0) - box.h / 2;
    }
});