//
// polyrhymthia
// pdv
//

'use strict';

const $ = (id) => document.getElementById(id);

// Global

const colors = {
    red: 'black'
};

const circle = {
    radius: 0,
    center: { x: 0, y: 0 }
};

const points = {}; // [Point: Bool]
const shapes = []; // [[Point]]

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

const loadShapes = () => {
    for (let numSides = 0; numSides <= 8; numSides++) {
        const shapePoints = pointsOnCircle(numSides);
        shapePoints.forEach((point) => { points[point] = false; });
        shapes[numSides] = shapePoints;
    }
};


// Canvas setup

const canvas = $('canvas');
const gctx = canvas.getContext('2d');
const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    gctx.canvas.width = width;
    gctx.canvas.height = height;
    circle.radius = (Math.min(width, height) / 2) * 0.9;
    circle.center = { x: width / 2, y: height / 2 };

    console.log('width: ' + width + ', height: ' + height);
    console.log('radius: ' + circle.radius);
    console.log('center: {x: ' + circle.center.x + ', y: ' + circle.center.y + '}');
};


// Cursor

const actx = new window.AudioContext();
const loopLength = 2; // secs
const startTime = actx.currentTime;
const cursorPos = () => {
    let elapsedTime = actx.currentTime - startTime;
    let elapsedLoops = Math.floor(elapsedTime / loopLength);
    return (elapsedTime - (elapsedLoops * loopLength)) / loopLength;
};
const cursorAngle = () => {
    return cursorPos() * 2 * Math.PI;
};

const drawCursor = () => {
    gctx.fillStyle = 'red';
    gctx.beginPath();
    const angle = cursorAngle();
    const point = pointOnCircle(angle);
    gctx.arc(point.x, point.y, 15, 0, 2 * Math.PI);
    gctx.fill();
};


// Drawing

const drawCircle = () => {
    gctx.strokeStyle = colors.red;
    gctx.lineWidth = 1;
    gctx.beginPath();
    gctx.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
    gctx.stroke();
};

const drawShape = (shape, color) => {
    gctx.strokeStyle = color;
    gctx.lineWidth = 1;
    gctx.beginPath();
    gctx.moveTo(shape[0].x, shape[0].y);
    shape.forEach((point) => { gctx.lineTo(point.x, point.y); });
    gctx.lineTo(shape[0].x, shape[0].y);
    gctx.stroke();
};

const draw = () => {
    gctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    shapes.slice(2).forEach((shape) => { drawShape(shape, 'black'); });
    drawCursor();
    window.requestAnimationFrame(draw);
};

const main = () => {
    window.addEventListener('resize', resize, false);
    resize();
    loadShapes();
    draw();
};

window.onload = main;
