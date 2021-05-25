export class Shape {
    constructor(points) {
        this.path2D = null;
        this.intersectingShapes = [];
        this.points = points;
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
}
