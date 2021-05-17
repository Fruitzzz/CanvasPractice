const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
const shapes = [
    {
        id: 0,
        conflictWith: [],
        startPoint: {
            x: 100,
            y: 210
        },
        points: [
            {
                x: 50,
                y: 250
            },
            {
                x: 75,
                y: 290
            },
            {
                x: 125,
                y: 290
            },
            {
                x: 150,
                y: 250
            }
        ]
    },
    {
        id: 1,
        conflictWith: [],
        startPoint: {
            x: 50,
            y: 0
        },
        points: [
            {
                x: 5,
                y: 100
            },
            {
                x: 50,
                y: 200
            },
            {
                x: 95,
                y: 100
            },
       ]
    },
    {
        id: 2,
        conflictWith: [],
        startPoint: {
            x: 200,
            y: 0
        },
        points: [
            {
                x: 300,
                y: 100
            },
            {
                x: 300,
                y: 200
            },
            {
                x: 150,
                y: 100
            },
       ]
    }
];

const mousePosition = {
    offset: {
        x: 0,
        y: 0
    },
    x: null,
    y: null
}

let currentShape = null;

const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => {
        context.beginPath();
        context.moveTo(shape.startPoint.x, shape.startPoint.y);
        shape.points.forEach(point => {
            context.lineTo(point.x, point.y);
        })
        context.closePath();
        shape.conflictWith.length != 0? printShape("red"): printShape("#00FF00");
    })
};

const printShape = (color) => {
    context.fillStyle = color;
    context.fill();
    context.stroke();
};

const recalculateProperties = () => {
    const oldX = currentShape.startPoint.x;
    const oldY = currentShape.startPoint.y;
    currentShape.startPoint.x =  mousePosition.x + mousePosition.offset.x;
    currentShape.startPoint.y = mousePosition.y + mousePosition.offset.y;
    currentShape.points.forEach(point => {
        point.x = currentShape.startPoint.x - (oldX - point.x);
        point.y = currentShape.startPoint.y - (oldY - point.y);
    })
};

const findExtremePoints = (shape) => {
    let left = shape.startPoint;
    let right = shape.startPoint;
    let bottom = shape.startPoint;
    let top = shape.startPoint;
    shape.points.forEach(point => {
        point.x < left.x? left = point : null;
        point.x > right.x? right = point : null;
        point.y < top.y? top = point: null;
        point.y > bottom.y? bottom = point : null;
    })
    return {
        left,
        right,
        bottom,
        top
    }
};

const checkConflicts = () => {
    const extremePoints = findExtremePoints(currentShape);
    const conflictingShapes = isOnShape(extremePoints);
    currentShape.conflictWith.forEach(shape => {
        const index = shape.conflictWith.indexOf(shape.conflictWith.findIndex(value => value.id === currentShape.id));
        shape.conflictWith.splice(shape.conflictWith.indexOf(index), 1);
    });
    if(conflictingShapes.length != 0) {
        conflictingShapes.forEach(shape => {
            shape.conflictWith.push(currentShape);
        })
        currentShape.conflictWith = conflictingShapes;
    }
    else {
        currentShape.conflictWith = [];
    }
};
const isOnShape = (shapePoints) => {
    let conflictingShapes = [];
    shapes.forEach(shape => {
        const extremePoints = findExtremePoints(shape);
        if((shapePoints.right.x > extremePoints.left.x && shapePoints.right.x < extremePoints.right.x) && (shapePoints.right.y > extremePoints.top.y && shapePoints.right.y < extremePoints.bottom.y))
            conflictingShapes.push(shape);
        else if((shapePoints.left.x > extremePoints.left.x && shapePoints.left.x < extremePoints.right.x) && (shapePoints.left.y > extremePoints.top.y && shapePoints.left.y < extremePoints.bottom.y))
            conflictingShapes.push(shape);
        else if((shapePoints.top.x > extremePoints.left.x && shapePoints.top.x < extremePoints.right.x) && (shapePoints.top.y > extremePoints.top.y && shapePoints.top.y < extremePoints.bottom.y))
            conflictingShapes.push(shape);
        else if(((shapePoints.bottom.x > extremePoints.left.x && shapePoints.bottom.x < extremePoints.right.x)) && (shapePoints.bottom.y > extremePoints.top.y && shapePoints.bottom.y < extremePoints.bottom.y))
            conflictingShapes.push(shape);
    })    
    return conflictingShapes;
};
const pickShape = (mouseX, mouseY) => {
    currentShape = null;
    shapes.forEach(shape => {
        const extremePoints = findExtremePoints(shape);
        if((mouseX > extremePoints.left.x && mouseX < extremePoints.right.x) && (mouseY < extremePoints.bottom.y && mouseY > extremePoints.top.y)) {
            currentShape = shape
        }
    })
};
const calcOffset = () => {
    mousePosition.offset.x = currentShape.startPoint.x - mousePosition.x;
    mousePosition.offset.y = currentShape.startPoint.y - mousePosition.y;
};

canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;
    if(currentShape) {
        recalculateProperties();
    }
});

canvas.addEventListener("mousedown", () => {
    pickShape(mousePosition.x, mousePosition.y);
    if(currentShape)
        calcOffset();
});

canvas.addEventListener("mouseup", () => {
    if(currentShape) {
        checkConflicts();
        currentShape = null;
    }
});

setInterval(draw, 10);