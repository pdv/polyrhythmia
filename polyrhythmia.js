//
// polyrhymthia
// pdv
//

'use strict';

const $ = (id) => document.getElementById(id);

const colors = {
    red: 'black'
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
    gctx.lineWidth = 1;
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

const pointsOnCircle = (numSides) => {
    const dAngle = (2 * Math.PI) / numSides;
    let angle = 3 * Math.PI / 2;
    let points = [];
    for (let i = 0; i < numSides; i++) {
        points.push(pointOnCircle(angle));
        angle += dAngle;
    }
    return points;
};

const drawShape = (numSides, color) => {
    gctx.strokeStyle = color;
    gctx.lineWidth = 1;
    gctx.beginPath();
    const points = pointsOnCircle(numSides);
    gctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => { gctx.lineTo(point.x, point.y); });
    gctx.lineTo(points[0].x, points[0].y);
    gctx.stroke();
};

const draw = () => {
    gctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    for (let i = 2; i <= 8; i++) {
        drawShape(i, 'black');
    }
    window.requestAnimationFrame(draw);
};

const main = () => {
    window.addEventListener('resize', resize, false);
    resize();
    draw();
};

window.onload = main;
