import { Segment } from "../entities/segment";

export function getSegments(points) {
    const segments = [];
        
    points.forEach((point, index) => {
        if (index !== points.length - 1) {
            segments.push( new Segment(point, points[index + 1]) );
        }
    });

    return segments;
}

export function getPointsOrientation(point1, point2, point3) {
    const value = (point3.y - point1.y) * (point2.x - point3.x) - (point3.x - point1.x) * (point2.y - point3.y);
  
    if (value == 0) {
        return 0;
    }  
  
    return (value > 0)? 1: 2;
}

export function checkAllSegments(segments1, segments2) {
    let isCrossing = false;

    segments1.forEach(segment1 => {
        segments2.forEach(segment2 => {
            if (!isCrossing) {
                isCrossing = isCrossingSegments(segment1, segment2);
            }
        });
    });

    return isCrossing;
}

export function distanceBetweenPointAndSegment(segment, point) {
    const vector = vectorProduct(segment.getSegmentCoordinates(), new Segment(segment.startPoint, point).getSegmentCoordinates());

    return Math.sqrt(Math.pow(vector, 2)) / segment.getSegmentLength();
}

export function getLengthByRelativePoint(point) {
    return  Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
}

export function vectorProduct(point1, point2) {
    return (point1.x * point2.y - point1.y * point2.x);
}

export function getPointsFromSegment(segment, shape) {
    return [
        shape.points.find(point => point === segment.startPoint),
        shape.points.find(point => point === segment.endPoint)
    ];
}

export function distanceBetweenTwoPoints(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

export function isCrossingSegments (segment1, segment2) {
    let o1 = getPointsOrientation(segment1.startPoint, segment1.endPoint, segment2.startPoint);
    let o2 = getPointsOrientation(segment1.startPoint, segment1.endPoint, segment2.endPoint);
    let o3 = getPointsOrientation(segment2.startPoint, segment2.endPoint, segment1.startPoint);
    let o4 = getPointsOrientation(segment2.startPoint, segment2.endPoint, segment1.endPoint);

    if (o1 != o2 && o3 != o4) {
        return true;
    }

    return false;
}