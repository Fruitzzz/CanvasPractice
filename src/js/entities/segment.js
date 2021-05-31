import { getLengthByRelativePoint } from "../helpers/segmentHelper";
import { Point } from "./point";

export class Segment {
    constructor(point1, point2) {
        this.startPoint = point1;
        this.endPoint = point2;
    }

    getSegmentCoordinates() {
        return new Point(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y); 
    }

    isPointOnSegmentSpace(point) {
        const isPointWithinSegmentHorizontally = point.x > Math.min(this.startPoint.x, this.endPoint.x) && point.x < Math.max(this.startPoint.x, this.endPoint.x);
        const isPointWithinSegmentVertically = point.y > Math.min(this.startPoint.y, this.endPoint.y) && point.y < Math.max(this.startPoint.y, this.endPoint.y);

        if (isPointWithinSegmentHorizontally || isPointWithinSegmentVertically) {
            return true;
        }

        return false;
    }

    getSegmentOrientation() {
        return this.startPoint.x === this.endPoint.x ? "Y" : "X"
    }

    getSegmentCenter() {
        return new Point((this.startPoint.x + this.endPoint.x) / 2, (this.startPoint.y + this.endPoint.y ) / 2)
    }

    getSegmentLength() {
        const segmentCoordinates = this.getSegmentCoordinates();

        return getLengthByRelativePoint(segmentCoordinates);
    }
}