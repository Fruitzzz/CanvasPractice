import "../css/style.css";
import { pointsArray } from "./config/pointConfig";
import { Point } from "./entities/point";
import { ShapeService } from "./services/shapeService";


window.onload = () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const shapeService = new ShapeService(pointsArray);
    const boundingClientRect = canvas.getBoundingClientRect();
    let currentShape;
    let mousePosition = new Point(0, 0);

    canvas.addEventListener("mousemove", (event) => {
        const point = new Point(event.clientX - boundingClientRect.x, event.clientY - boundingClientRect.y);

        if (currentShape) {
            const delta = new Point(point.x - mousePosition.x, point.y - mousePosition.y);
            currentShape.move(delta);
            shapeService.drawAllShapes(canvas, context);
        }
        
        mousePosition = point;
    });
    
    canvas.addEventListener("mousedown", () => {
        currentShape = shapeService.getShapeUnderPoint(mousePosition, context);
    });
    
    canvas.addEventListener("mouseup", () => {
        if (currentShape) {
            shapeService.checkShapesIntersection(currentShape);
            currentShape = null;
            shapeService.drawAllShapes(canvas, context);
        }
    });
    
    shapeService.drawAllShapes(canvas, context);
}