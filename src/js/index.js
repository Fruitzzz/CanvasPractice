import "../css/style.css";
import { shapes } from "./config/shapes";
import { Point } from "./entities/point";
import { ShapeService } from "./services/shapeService";
import { ShapeIntersectionService } from "./services/shapeIntersectionService";
import { ShapeSnapService } from "./services/shapeSnapService";


window.onload = () => {
    let selectedShape;
    let mousePosition = new Point(0, 0, 0);

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const shapeService = new ShapeService(shapes);
    const createdShapes = shapeService.getAllShapes;
    const shapeIntersectionService = new ShapeIntersectionService(createdShapes);
    const shapeSnapService = new ShapeSnapService(createdShapes, mousePosition);
    const boundingClientRect = canvas.getBoundingClientRect();
    

    canvas.addEventListener("mousemove", (event) => {
        const point = new Point(event.clientX - boundingClientRect.x, event.clientY - boundingClientRect.y, 0);
        if(!selectedShape) {
            mousePosition = point;
            return;
        }

        if (selectedShape.snappedShapes.length === 0) {
            const delta = new Point(point.x - mousePosition.x, point.y - mousePosition.y, 0);
            selectedShape.move(delta);
            shapeIntersectionService.checkShapesIntersection(selectedShape);
        }

        if (selectedShape.snappedShapes.length !== 0) {
            shapeSnapService.shapeMoveInSnap(selectedShape, mousePosition, shapeIntersectionService);
        }

        if (selectedShape.intersectingShapes.length === 0 && selectedShape.snappedShapes.length === 0) {
            shapeSnapService.snap(selectedShape, mousePosition);
        }

        shapeService.drawAllShapes(canvas, context);
        mousePosition = point;
    });
    
    canvas.addEventListener("mousedown", () => {
        selectedShape = shapeService.getShapeUnderPoint(mousePosition, context);
        
        if (selectedShape && selectedShape.snappedShapes.length !== 0) {
            shapeSnapService.setMousePositionOnSnappedShape(mousePosition);
        }
    });
    
    canvas.addEventListener("mouseup", () => {
        if (selectedShape) {
            selectedShape.intersectingShapes.length !== 0? selectedShape.resetToOriginalPosition() : selectedShape.onMoveEnded();
            shapeService.drawAllShapes(canvas, context);

            selectedShape = null;
        }
    });

    shapeService.drawAllShapes(canvas, context);
}