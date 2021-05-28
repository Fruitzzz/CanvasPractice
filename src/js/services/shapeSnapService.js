import {distanceBetweenPointAndSegment, distanceBetweenTwoPoints, getPointsFromSegment, getSegments } from "../helpers/segmentHelper";
import { Point } from "../entities/point";

export class ShapeSnapService {
    constructor(shapes, mousePosition) {
        this.shapes = shapes;
        this.mousePositionOnSnappedShape = new Point(mousePosition.x, mousePosition.y, 0);
    }

    snap(selectedShape, mousePosition) {
        const shapeForSnapping = this.getShapeForSnapping(selectedShape);

        if (!shapeForSnapping) {
            return;
        }

        const pointsOnSelectedShape = getPointsFromSegment(shapeForSnapping.selectedSegment, selectedShape);
        const delta = new Point(shapeForSnapping.segment.point1.x - pointsOnSelectedShape[1].x, shapeForSnapping.segment.point1.y - pointsOnSelectedShape[1].y, 0);
        const orientation = shapeForSnapping.segment.getSegmentOrientation;

        this.saveSnap(selectedShape, shapeForSnapping);
        this.setMousePositionOnSnappedShape(mousePosition);

        if (orientation === "X") {
            selectedShape.move(new Point (0, delta.y, 0));
        }

        else if (orientation === "Y") {
            selectedShape.move(new Point (delta.x, 0, 0));
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
        const orientation = selectedShape.snappedShapes[0].targetSegment.getSegmentOrientation;
        const borderValues = this.defineBorderValues(selectedShape.snappedShapes[0].targetSegment, selectedShape.snappedShapes[0].ownSegment);
        const delta = new Point(mousePosition.x - this.mousePositionOnSnappedShape.x, mousePosition.y - this.mousePositionOnSnappedShape.y, 0);

        if (distanceBetweenTwoPoints(mousePosition, this.mousePositionOnSnappedShape) > 20) {
            const point = new Point(mousePosition.x - this.mousePositionOnSnappedShape.x, mousePosition.y - this.mousePositionOnSnappedShape.y, 0);
            selectedShape.clearSnap();
            selectedShape.move(point);
            shapeIntersectionService.checkShapesIntersection(selectedShape);
            return;
        }
        
        if (orientation === "X") {
            this.moveAlongAxisX(borderValues, delta, selectedShape);
            this.mousePositionOnSnappedShape.x = mousePosition.x;
        }

        if (orientation === "Y") {
            this.mousePositionOnSnappedShape.y = mousePosition.y;
            this.moveAlongAxisY(borderValues, delta, selectedShape);
        }
    }

    moveAlongAxisX (borderValues, delta, selectedShape) {
        if ((borderValues.selectedPoints[1] + delta.x <= borderValues.targetPoints[1]) && (borderValues.selectedPoints[0] + delta.x >= borderValues.targetPoints[0])) {
            selectedShape.move(new Point(delta.x, 0, 0));
        }
    }

    moveAlongAxisY (borderValues, delta, selectedShape) {
        if ((borderValues.selectedPoints[1] + delta.y <= borderValues.targetPoints[1]) && (borderValues.selectedPoints[0] + delta.y >= borderValues.targetPoints[0])) {
            selectedShape.move(new Point(0, delta.y, 0));
        }
    }

    defineBorderValues (targetSegment, selectedSegment) {
        if (targetSegment.point1.x === selectedSegment.point1.x) {
            return  {
                targetPoints:
                [
                    Math.min(targetSegment.point1.y, targetSegment.point2.y),
                    Math.max(targetSegment.point1.y, targetSegment.point2.y)
                ],

                selectedPoints:
                [
                    Math.min(selectedSegment.point1.y, selectedSegment.point2.y),
                    Math.max(selectedSegment.point1.y, selectedSegment.point2.y)
                ]
            } 
        }
        
        return  {
            targetPoints:
            [
                Math.min(targetSegment.point1.x, targetSegment.point2.x),
                Math.max(targetSegment.point1.x, targetSegment.point2.x)
            ],

            selectedPoints:
            [
                Math.min(selectedSegment.point1.x, selectedSegment.point2.x),
                Math.max(selectedSegment.point1.x, selectedSegment.point2.x)
            ]
        } 
    }
    
    getShapeForSnapping (selectedShape) {
       const segments = getSegments(selectedShape.points);
       let closest;

       segments.forEach(segment => {
            this.shapes.forEach(shape => {
                if (shape === selectedShape) {
                    return;
                }

                const found =  this.getClosestSegment(shape, segment);
    
                if (found && !closest) {
                    closest = { 
                        ...found,
                        shape, 
                        selectedSegment: segment 
                    };
                }
    
                else if (found && closest) {
                    found.distance < closest.distance? closest = {
                        ...found,
                        shape,
                        selectedSegment: segment
                    } : null;
                }
            })
       })
       
       return closest;
    }

    setMousePositionOnSnappedShape (mousePosition) {
        this.mousePositionOnSnappedShape = new Point(mousePosition.x, mousePosition.y, 0);
    }

    getRelevantPoint (segment, points) {
        const isEqualDistance = points.every(point => distanceBetweenPointAndSegment(segment, point) === distanceBetweenPointAndSegment(segment, points[0]));

        return points.find(point => segment.isPointOnSegmentSpace(point) && isEqualDistance);
    }

    getClosestSegment (shape, targetSegment) {
        const segments = getSegments(shape.points);
        const targetAnchorPoints = this.getSegmentAnchorPoints(targetSegment);
        let closestSegment;

        segments.forEach(segment => {
            const relevantPoint = this.getRelevantPoint(segment, targetAnchorPoints);

            if (relevantPoint && distanceBetweenPointAndSegment(segment, relevantPoint) < 20) {
                closestSegment = {
                    segment,
                    distance: distanceBetweenPointAndSegment(segment, relevantPoint),
                    targetAnchorPoints
                };
            }
        })

        return closestSegment; 
    }

    getSegmentAnchorPoints (segment) {
       const anchorPoints = [
           segment.point1,
           segment.point2,
           segment.getcenterOfSegment 
       ];

       return anchorPoints;
    }
}