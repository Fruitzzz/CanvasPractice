import {Point} from './points';
class Shape {
    constructor(points) {
        this.path2D = null;
        this.intersectingShapes = [];
        this.points = points;
    }

    draw(context) {
        const startPoint = this.points[0];
        this.path2D = new Path2D();
        this.path2D.moveTo(startPoint.x, startPoint.y);
        this.points.forEach((point, index) => {
            if(index !== 0) {
                this.path2D.lineTo(point.x, point.y);
            }
        });
        context.fillStyle = this.pickFillColor();
        context.fill(this.path2D);
        context.stroke(this.path2D);
    }

    pickFillColor() {
        return this.intersectingShapes.length === 0? "#00FF00" : "#DC143C";          
    }
    move(offsets, mousePosition) {
        this.points.forEach((point, index) => {
            point.x = mousePosition.x + offsets[index].x;
            point.y = mousePosition.y + offsets[index].y;
        })
    }
}
export const shapes = [
    new Shape([
        new Point(100, 210),
        new Point(50, 250),
        new Point(75, 290),
        new Point(125, 290),
        new Point(150, 250),
        new Point(100, 210)
    ]),
    new Shape([
        new Point(50, 0),
        new Point(5, 100),
        new Point(50, 200),
        new Point(95, 100),
        new Point(50, 0)
    ]),
    new Shape([
        new Point(100, 320),
        new Point(50, 400),
        new Point(200, 450),
        new Point(150, 290),
        new Point(100, 320),
    ]),
];