//
// polyrhymthia
// pdv
//

'use strict';

const $ = (id) => document.getElementById(id);

// Global

const MAX_SIDES = 8;
const CURSOR_RADIUS = 15;
const COLORS = [
    '',
    'blue',
    'green',
    'yellow'
];

const circle = {
    radius: 0,
    center: { x: 0, y: 0 }
};

// Shapes / Points

const pointSet = new Set();
const points = {}; // [Point: { on: Bool, hover: Bool }]
const shapes = []; // [[Point]]

const pointString = (point) => {
    return "(" + point.x + "," + point.y + ")";
};

const pointStatus = (point) => {
    return points[pointString(point)];
};

const setPointStatus = (point, status) => {
    points[pointString(point)] = status;
};

const clearPointStatus = (point) => {
    setPointStatus(point, { color: 0, hover: false });
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

const addPoint = (point) => {
    let alreadyAdded = false;
    pointSet.forEach((pointInSet) => {
        if (dist(pointInSet, point) < CURSOR_RADIUS) {
            alreadyAdded = true;
        }
    });
    if (!alreadyAdded) {
        clearPointStatus(point);
        pointSet.add(point);
    }
};

const loadShapes = () => {
    for (let numSides = 0; numSides <= 8; numSides++) {
        const shapePoints = pointsOnCircle(numSides);
        shapePoints.forEach(addPoint);
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


// Mouse

const getMousePos = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x: x, y: y };
};

const dist = (a, b) => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

const checkPoints = (e, insideCB, outsideCB) => {
    const mousePos = getMousePos(canvas, e);
    pointSet.forEach((point) => {
        const before = pointStatus(point);
        let after;
        if (dist(point, mousePos) < CURSOR_RADIUS) {
            after = insideCB(before);
        } else {
            after = outsideCB(before);
        }
        setPointStatus(point, after);
    });
};


const clip = (value, min, max) => {
    return Math.max(min, Math.min(value, max));
};

const mousedown = (e) => {
    checkPoints(e, (status) => {
        status.on = !status.on;
        return status;
    }, (status) => {
        return status;
    });
};

const mousemove = (e) => {
    checkPoints(e, (status) => {
        status.hover = true;
        return status;
    }, (status) => {
        status.hover = false;
        return status;
    });
};

document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mousemove', mousemove, false);


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
    gctx.arc(point.x, point.y, CURSOR_RADIUS, 0, 2 * Math.PI);
    gctx.fill();
};


// Drawing

const drawCircle = () => {
    gctx.strokeStyle = COLOR.red;
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

const drawPoint = (point) => {
    const status = pointStatus(point);
    const color = COLORS[status.color];
    gctx.strokeStyle = color;
    gctx.beginPath();
    gctx.arc(point.x, point.y, CURSOR_RADIUS, 0, 2 * Math.PI);
    if (status.on) {
        gctx.fillStyle = color;
        gctx.fill();
    } else if (status.hover) {
        gctx.strokeStyle = color;
        gctx.stroke();
    }
};

const draw = () => {
    gctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    shapes.slice(2).forEach((shape) => { drawShape(shape, 'black'); });
    pointSet.forEach((point) => { drawPoint(point, pointStatus(point), 'green'); });
    drawCursor();
    window.requestAnimationFrame(draw);
};

const main = () => {
    window.addEventListener('resize', resize, false);
    resize();
    loadShapes();
    console.log(points);
    draw();
};

window.onload = main;
