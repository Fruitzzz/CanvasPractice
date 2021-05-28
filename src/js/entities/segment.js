import { getLengthByRelativePoint } from "../helpers/segmentHelper";
import { Point } from "./point";

export class Segment {

    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
    }

    get getSegmentCoordinates() {
        return new Point(this.point2.x - this.point1.x, this.point2.y - this.point1.y, this.point2.z - this.point1.z); 
    }

    isPointOnSegmentSpace (point) {
        if (point.x > Math.min(this.point1.x, this.point2.x) && point.x < Math.max(this.point1.x, this.point2.x)) {
            return true;
        }

        if (point.y > Math.min(this.point1.y, this.point2.y) && point.y < Math.max(this.point1.y, this.point2.y)) {
            return true;
        }

        return false;
    }

    get getSegmentOrientation() {
        return this.point1.x === this.point2.x? "Y" : "X"
    }

    get getcenterOfSegment () {
        return new Point((this.point1.x + this.point2.x) / 2, (this.point1.y + this.point2.y ) / 2, 0)
    }

    get getSegmentLength() {
        const segmentCoordinates = this.getSegmentCoordinates;

        return getLengthByRelativePoint(segmentCoordinates);
    }
}