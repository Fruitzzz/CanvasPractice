import { checkAllSegments, getSegments } from "../helpers/segmentHelper";

export class ShapeIntersectionService {
    constructor(shapes) {
        this.shapes = shapes;
    }

    checkShapesIntersection (selectedShape) {
        const conflictingShapes = this.getIntersectingShapes(selectedShape);

        selectedShape.clearIntersection();

        conflictingShapes.forEach(shape => {
            shape.intersectingShapes.push(selectedShape);
        })
        selectedShape.intersectingShapes = conflictingShapes;
    }

    getIntersectingShapes (selectedShape) {
        const conflictingShapes = [];
        const currentShapeSegments = getSegments(selectedShape.points);
        
        this.shapes.forEach(shape => {
            const shapeSegments = getSegments(shape.points);

            if (checkAllSegments(currentShapeSegments, shapeSegments) && shape !== selectedShape) {
                conflictingShapes.push(shape);
            }

        })

        return conflictingShapes;
    }
}