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

const drawShape = (numSides) => {
};

const draw = () => {
    drawCircle();
    window.requestAnimationFrame(draw);
};

const main = () => {
    window.addEventListener('resize', resize, false);
    resize();
    draw();
};

window.onload = main;
