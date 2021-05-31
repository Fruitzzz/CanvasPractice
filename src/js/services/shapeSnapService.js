import * as segmentHelper from "../helpers/segmentHelper";
import { Point } from "../entities/point";

export class ShapeSnapService {
    constructor(shapes, mousePosition) {
        this.shapes = shapes;
        this.mousePositionOnSnappedShape = new Point(mousePosition.x, mousePosition.y);
    }

    snap(selectedShape, mousePosition) {
        const shapeForSnapping = this.getShapeForSnapping(selectedShape);

        if (!shapeForSnapping) {
            return;
        }

        const pointsOnSelectedShape = segmentHelper.getPointsFromSegment(shapeForSnapping.selectedSegment, selectedShape);
        const delta = new Point(shapeForSnapping.segment.startPoint.x - pointsOnSelectedShape[1].x, shapeForSnapping.segment.startPoint.y - pointsOnSelectedShape[1].y);
        const orientation = shapeForSnapping.segment.getSegmentOrientation();

        this.saveSnap(selectedShape, shapeForSnapping);
        this.setMousePositionOnSnappedShape(mousePosition);

        if (orientation === "X") {
            selectedShape.move(new Point (0, delta.y));
        } else if (orientation === "Y") {
            selectedShape.move(new Point (delta.x, 0));
        }
    }

    saveSnap (selectedShape, shapeForSnapping) {
        selectedShape.snappedShapes.push({
            ownSegment: shapeForSnapping.selectedSegment,
            targetSegment: shapeForSnapping.segment,
            shape: shapeForSnapping.shape
        });

        shapeForSnapping.shape.snappedShapes.push({
            ownSegment: shapeForSnapping.segment,
            targetSegment: shapeForSnapping.selectedSegment,
            shape: selectedShape
        });
    }

    shapeMoveInSnap (selectedShape, mousePosition, shapeIntersectionService) {
        const orientation = selectedShape.snappedShapes[0].targetSegment.getSegmentOrientation();
        const borderValues = this.defineBorderValues(selectedShape.snappedShapes[0].targetSegment, selectedShape.snappedShapes[0].ownSegment);
        const point = new Point(mousePosition.x - this.mousePositionOnSnappedShape.x, mousePosition.y - this.mousePositionOnSnappedShape.y);

        if (segmentHelper.distanceBetweenTwoPoints(mousePosition, this.mousePositionOnSnappedShape) > 20) {
            const point = new Point(mousePosition.x - this.mousePositionOnSnappedShape.x, mousePosition.y - this.mousePositionOnSnappedShape.y);

            selectedShape.clearSnap();
            selectedShape.move(point);
            shapeIntersectionService.checkShapesIntersection(selectedShape);

            return;
        }
        
        if (orientation === "X") {
            this.moveAlongAxisX(borderValues, point, selectedShape);
            this.mousePositionOnSnappedShape.x = mousePosition.x;
        }

        if (orientation === "Y") {
            this.mousePositionOnSnappedShape.y = mousePosition.y;
            this.moveAlongAxisY(borderValues, point, selectedShape);
        }
    }

    moveAlongAxisX (borderValues, delta, selectedShape) {
        if ((borderValues.selectedPoints[1] + delta.x <= borderValues.targetPoints[1]) && (borderValues.selectedPoints[0] + delta.x >= borderValues.targetPoints[0])) {
            selectedShape.move(new Point(delta.x, 0));
        }
    }

    moveAlongAxisY (borderValues, delta, selectedShape) {
        if ((borderValues.selectedPoints[1] + delta.y <= borderValues.targetPoints[1]) && (borderValues.selectedPoints[0] + delta.y >= borderValues.targetPoints[0])) {
            selectedShape.move(new Point(0, delta.y));
        }
    }

    defineBorderValues(targetSegment, selectedSegment) {
        if (targetSegment.startPoint.x === selectedSegment.startPoint.x) {
            return {
                targetPoints: [
                    Math.min(targetSegment.startPoint.y, targetSegment.endPoint.y),
                    Math.max(targetSegment.startPoint.y, targetSegment.endPoint.y)
                ],

                selectedPoints: [
                    Math.min(selectedSegment.startPoint.y, selectedSegment.endPoint.y),
                    Math.max(selectedSegment.startPoint.y, selectedSegment.endPoint.y)
                ]
            } 
        }
        
        return {
            targetPoints: [
                Math.min(targetSegment.startPoint.x, targetSegment.endPoint.x),
                Math.max(targetSegment.startPoint.x, targetSegment.endPoint.x)
            ],

            selectedPoints: [
                Math.min(selectedSegment.startPoint.x, selectedSegment.endPoint.x),
                Math.max(selectedSegment.startPoint.x, selectedSegment.endPoint.x)
            ]
        } 
    }
    
    getShapeForSnapping(selectedShape) {
       const segments = segmentHelper.getSegments(selectedShape.points);
       let closest;

       segments.forEach(segment => {
            this.shapes.forEach(shape => {
                if (shape === selectedShape) {
                    return;
                }

                const found = this.getClosestSegment(shape, segment);
    
                if (found && !closest) {
                    closest = { 
                        ...found,
                        shape, 
                        selectedSegment: segment 
                    };
                } else if (found && closest) {
                    found.distance < closest.distance ? closest = {
                        ...found,
                        shape,
                        selectedSegment: segment
                    } : null;
                }
            })
       })
       
       return closest;
    }

    setMousePositionOnSnappedShape(mousePosition) {
        this.mousePositionOnSnappedShape = new Point(mousePosition.x, mousePosition.y);
    }

    getRelevantPoint(segment, points) {
        const isEqualDistance = points.every(point => segmentHelper.distanceBetweenPointAndSegment(segment, point) === segmentHelper.distanceBetweenPointAndSegment(segment, points[0]));

        return points.find(point => segment.isPointOnSegmentSpace(point) && isEqualDistance);
    }

    getClosestSegment(shape, targetSegment) {
        const segments = segmentHelper.getSegments(shape.points);
        const targetAnchorPoints = this.getSegmentAnchorPoints(targetSegment);
        let closestSegment;

        segments.forEach(segment => {
            const relevantPoint = this.getRelevantPoint(segment, targetAnchorPoints);

            if (relevantPoint && segmentHelper.distanceBetweenPointAndSegment(segment, relevantPoint) < 20) {
                closestSegment = {
                    segment,
                    distance: segmentHelper.distanceBetweenPointAndSegment(segment, relevantPoint),
                    targetAnchorPoints
                };
            }
        })

        return closestSegment; 
    }

    getSegmentAnchorPoints (segment) {
       const anchorPoints = [
           segment.startPoint,
           segment.endPoint,
           segment.getSegmentCenter()
       ];

       return anchorPoints;
    }
}