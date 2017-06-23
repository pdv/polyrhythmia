//
// polyrhymthia
// pdv
//

'use strict';

const $ = (id) => document.getElementById(id);

const colors = {
    red: 'red'
};

const circle = {
    radius: 0,
    center: { x: 0, y: 0 }
};

const canvas = $('canvas');
const gctx = canvas.getContext('2d');
const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    gctx.canvas.width = width;
    gctx.canvas.height = height;
    // gctx.translate(width / 2, height / 2);
    circle.radius = (Math.min(width, height) / 2) * 0.9;
    circle.center = { x: width / 2, y: height / 2 };

    console.log('width: ' + width + ', height: ' + height);
    console.log('radius: ' + circle.radius);
    console.log('center: {x: ' + circle.center.x + ', y: ' + circle.center.y + '}');
};

const actx = new window.AudioContext();

const drawCircle = () => {
    gctx.strokeStyle = colors.red;
    gctx.lineWidth = 5;
    gctx.beginPath();
    gctx.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
    gctx.stroke();
};

const pointOnCircle = (angle) => {
    return {
        x: (Math.cos(angle) * circle.radius) + circle.center.x,
        y: (Math.sin(angle) * circle.radius) + circle.center.y
    };
};

const drawShape = (numSides, color) => {
    const startAngle = 3 * Math.PI / 2;
    const startPoint = pointOnCircle(startAngle);
    const dAngle = (2 * Math.PI) / numSides;

    gctx.strokeStyle = color;
    gctx.lineWidth = 5;
    gctx.beginPath();
    gctx.moveTo(startPoint.x, startPoint.y);

    let angle = startAngle;
    for (let i = 0; i < numSides; i++) {
        angle += dAngle;
        const point = pointOnCircle(angle);
        gctx.lineTo(point.x, point.y);
    }

    gctx.stroke();
};

const draw = () => {
    gctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    for (let i = 3; i <= 8; i++) {
        drawShape(i, 'green');
    }
    window.requestAnimationFrame(draw);
};

const main = () => {
    window.addEventListener('resize', resize, false);
    resize();
    draw();
};

window.onload = main;
