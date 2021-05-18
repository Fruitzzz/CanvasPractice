const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
const shapes = [
    {
        path2D: null, 
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
            },
            {
                x: 100,
                y: 210
            }
        ]
    },
    {
        path2D: null, 
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
            {
                x: 50,
                y: 0
            }
       ]
    },
    {
        path2D: null, 
        conflictWith: [],
        startPoint: {
            x: 100,
            y: 320
        },
        points: [
            {
                x: 50,
                y: 400
            },
            {
                x: 200,
                y: 450
            },
            {
                x: 150,
                y: 290
            },
            {
                x: 100,
                y: 320
            }
       ]
    },
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
        shape.path2D = new Path2D();
        shape.path2D.moveTo(shape.startPoint.x, shape.startPoint.y);
        shape.points.forEach(point => {
            shape.path2D.lineTo(point.x, point.y);
        })
        shape.conflictWith.length != 0? printShape("red", shape.path2D): printShape("#00FF00", shape.path2D);
    })
};

const printShape = (color, shape) => {
    context.fillStyle = color;
    context.fill(shape);
    context.stroke(shape);
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

const checkConflicts = () => {
    const conflictingShapes = isOnShape([currentShape.startPoint, ...currentShape.points]);
    currentShape.conflictWith.forEach(shape => {
        const index = shape.conflictWith.indexOf(shape.conflictWith.findIndex(value => value.path2D === currentShape.path2D));
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

const isOnShape = (currentPoints) => {
    const conflictingShapes = [];
    const currentShapeVectors = getVectors(currentPoints);
   /*  shapes.forEach(shape => {
        currentPoints.forEach(point => {
            if(shape !== currentShape && context.isPointInPath(shape.path2D, point.x, point.y))
                conflictingShapes.push(shape);
        });
    }); */
    shapes.forEach(shape => {
        const shapeVectors = getVectors([shape.startPoint, ...shape.points]);
        if(isCrossingVectors(currentShapeVectors, shapeVectors) && shape !== currentShape)
            conflictingShapes.push(shape);
    })
    return conflictingShapes;
};

const isCrossingVectors = (vectors1, vectors2) => {
    let isCrossing = false;
    let v1, v2, v3, v4;
    vectors1.forEach(vector1 => {
        vectors2.forEach(vector2 => {
            v1 = (vector2.x2 - vector2.x1) * (vector1.y1 - vector2.y1) - (vector2.y2 - vector2.y1) * (vector1.x1 - vector2.x1);
            v2 = (vector2.x2 - vector2.x1) * (vector1.y2 - vector2.y1) - (vector2.y2 - vector2.y1) * (vector1.x2 - vector2.x1);
            v3 = (vector1.x2 - vector1.x1) * (vector2.y1 - vector1.y1) - (vector1.y2 - vector1.y1) * (vector2.x1 - vector1.x1);
            v4 = (vector1.x2 - vector1.x1) * (vector2.y2 - vector1.y1) - (vector1.y2 - vector1.y1) * (vector2.x2 - vector1.x1);
            if(!isCrossing)
                isCrossing = (v1 * v2 <= 0) && (v3 * v4 <= 0);
        });
    });
    return isCrossing;
}

const getVectors = (points) => {
    const vectors = [];
    for(let i = 0; i < points.length - 1; i++) {
        vectors.push({
            x1: points[i].x,
            y1: points[i].y,
            x2: points[i + 1].x,
            y2: points[i + 1].y
        })
    }
    return vectors;
}

const pickShape = (mouseX, mouseY) => {
    currentShape = null;
    shapes.forEach(shape => {
        if(context.isPointInPath(shape.path2D, mouseX, mouseY)) {
            currentShape = shape;
        }
    });
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