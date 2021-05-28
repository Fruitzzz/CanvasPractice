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
        let selectedShape;
        this.shapes.forEach(shape => {
            if (context.isPointInPath(shape.path2D, point.x, point.y)) {
              selectedShape = shape;
            }
        });
        
        return selectedShape;
    }

    get getAllShapes() {
        return this.shapes;
    } 

    getShapeFromPoints(points) {
        return new Shape(points);
    }

}