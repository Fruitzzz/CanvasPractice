import { getSegments, isCrossingSegments } from "../helpers/pointHelper";
import { Shape } from "../entities/shape";

export class ShapeService {

    constructor (points) {
        const shapes = [];

        points.forEach(array => {
            shapes.push(this.getShapeFromPoints(array));
        })

        this.shapes = shapes;
    }

    drawAllShapes (canvas, context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.shapes.forEach(shape => {
            shape.draw(context);
        })   
    }
    
    getShapeUnderPoint (point, context) {
        let currentShape = null;

        this.shapes.forEach(shape => {
            if (context.isPointInPath(shape.path2D, point.x, point.y)) {
              currentShape = shape;
            }
        });

        return currentShape;
    }

    checkShapesIntersection (currentShape) {
        const conflictingShapes = this.getIntersectingShapes(currentShape);

        currentShape.intersectingShapes.forEach(shape => {
            shape.intersectingShapes.splice(shape.intersectingShapes.findIndex(value => value.path2D === currentShape.path2D), 1);
        });
            conflictingShapes.forEach(shape => {
                shape.intersectingShapes.push(currentShape);
            })
            currentShape.intersectingShapes = conflictingShapes;
    }

    getIntersectingShapes (currentShape) {
        const conflictingShapes = [];
        const currentShapeSegments = getSegments(currentShape.points);
        
        this.shapes.forEach(shape => {
            const shapeSegments = getSegments(shape.points);
            if(isCrossingSegments(currentShapeSegments, shapeSegments) && shape !== currentShape)
                conflictingShapes.push(shape);
        })

        return conflictingShapes;
    }
    
    getShapeFromPoints(points) {
        return new Shape(points);
    }

}