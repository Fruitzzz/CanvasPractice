import "../css/style.css";
import {shapes} from "./entities/shapes";
import {Point} from "./entities/points";
let mousePosition;
let offsets;
let currentShape;
let canvas;
let context;

window.onload = () => {
    offsets = [];
    currentShape = null;
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");
    mousePosition = new Point(0, 0);

    canvas.addEventListener("mousemove", (event) => {
        mousePosition.x = event.offsetX;
        mousePosition.y = event.offsetY;
        if(currentShape) {
            currentShape.move(offsets, mousePosition);
            drawAllShapes();
        }
    });
    
    canvas.addEventListener("mousedown", () => {
        pickShape();
        calcOffsets();
    });
    
    canvas.addEventListener("mouseup", () => {
        if(currentShape) {
            checkShapesIntersection();
            currentShape = null;
            offsets = [];
            drawAllShapes();
        }
    });
    drawAllShapes();
}

function checkShapesIntersection () {
    const conflictingShapes = getIntersectingShapes(currentShape.points);
    currentShape.intersectingShapes.forEach(shape => {
        shape.intersectingShapes.splice(shape.intersectingShapes.findIndex(value => value.path2D === currentShape.path2D), 1);
    });
        conflictingShapes.forEach(shape => {
            shape.intersectingShapes.push(currentShape);
        })
        currentShape.intersectingShapes = conflictingShapes;
};

function getIntersectingShapes (currentPoints) {
    const conflictingShapes = [];
    const currentShapeSegments = getSegments(currentPoints);
    shapes.forEach(shape => {
        const shapeSegments = getSegments(shape.points);
        if(isCrossingSegments(currentShapeSegments, shapeSegments) && shape !== currentShape)
            conflictingShapes.push(shape);
    })
    return conflictingShapes;
};

function isCrossingSegments (segments1, segments2) {
    let isCrossing = false;
    let v1, v2, v3, v4;
    segments1.forEach(segment1 => {
        segments2.forEach(segment2 => {
            v1 = (segment2.point2.x - segment2.point1.x) * (segment1.point1.y - segment2.point1.y) - (segment2.point2.y - segment2.point1.y) * (segment1.point1.x - segment2.point1.x);
            v2 = (segment2.point2.x - segment2.point1.x) * (segment1.point2.y - segment2.point1.y) - (segment2.point2.y - segment2.point1.y) * (segment1.point2.x - segment2.point1.x);
            v3 = (segment1.point2.x - segment1.point1.x) * (segment2.point1.y - segment1.point1.y) - (segment1.point2.y - segment1.point1.y) * (segment2.point1.x - segment1.point1.x);
            v4 = (segment1.point2.x - segment1.point1.x) * (segment2.point2.y - segment1.point1.y) - (segment1.point2.y - segment1.point1.y) * (segment2.point2.x - segment1.point1.x);
            if (!isCrossing) {
                isCrossing = (v1 * v2 <= 0) && (v3 * v4 <= 0);
            }
        });
    });
    return isCrossing;
};

function getSegments (points) {
    const segments = [];
    points.forEach((point, index) => {
        if (index !== points.length - 1) {
            segments.push({
                point1: new Point(point.x, point.y),
                point2: new Point(points[index + 1].x, points[index + 1].y)
            });
        }
    });
    return segments;
};

function pickShape () {
    currentShape = null;
    shapes.forEach(shape => {
        if (context.isPointInPath(shape.path2D, mousePosition.x, mousePosition.y)) {
            currentShape = shape;
        }
    });
};

function drawAllShapes() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        shape.draw(context);
    })
};

function calcOffsets () {
    currentShape.points.forEach(point => {
        offsets.push(new Point(point.x - mousePosition.x, point.y - mousePosition.y))
    });
};