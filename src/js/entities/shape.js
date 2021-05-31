import { Point } from "./point";

export class Shape {
    constructor(points) {
        this.path2D = null;
        this.intersectingShapes = [];
        this.snappedShapes = [];
        this.points = points;
        this.originalPoints = this.getPointsDuplicate(points);
    }

    draw(context) {
        this.path2D = new Path2D();
        const { fillStyle } = this.getFillStyle;

        this.path2D.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach((point) => {
                this.path2D.lineTo(point.x, point.y);
        });

        context.fillStyle = fillStyle;
        context.fill(this.path2D);
        context.stroke(this.path2D);
    }

    get getFillStyle() {
        return {
            fillStyle: this.intersectingShapes.length === 0? "#00FF00" : "#DC143C"          
        }
    }

    move(delta) {
        this.points.forEach(point => {
            point.x += delta.x;
            point.y += delta.y;
        })
    }

    getPointsDuplicate(points) {
        const duplicatePoints = [];

        points.forEach(point => {
            duplicatePoints.push(new Point(point.x, point.y));
        })

        return duplicatePoints;
    }

    clearIntersection() {
        this.intersectingShapes.forEach(shape => {
           shape.intersectingShapes.splice(this.intersectingShapes.findIndex(value => value.path2D === this.path2D), 1);
       });

       this.intersectingShapes = [];
    }
    
    clearSnap() {
        this.snappedShapes.forEach(snap => {
            snap.shape.snappedShapes.splice(this.snappedShapes.findIndex(value => value.path2D === this.path2D), 1);
        });
        this.snappedShapes = [];
    }

    onMoveEnded() {
        this.originalPoints = this.getPointsDuplicate(this.points);
    }

    resetToOriginalPosition() {
        this.clearIntersection();
        this.clearSnap();
        this.points = this.getPointsDuplicate(this.originalPoints);
    }
}
