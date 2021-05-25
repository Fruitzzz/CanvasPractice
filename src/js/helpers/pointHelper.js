import { Point } from "../entities/point";

export function getSegments (points) {
    const segments = [];
        
    points.forEach((point, index) => {
        if (index !== points.length - 1) {
            segments.push({
                point1: new Point(point.x, point.y),
                point2: new Point(points[index + 1].x, points[index + 1].y)
            });
        }
    });

    return segments;
}
export function isCrossingSegments (segments1, segments2) {
    let isCrossing = false;
    let v1, v2, v3, v4;

    segments1.forEach(segment1 => {
        segments2.forEach(segment2 => {
            v1 = (segment2.point2.x - segment2.point1.x) * (segment1.point1.y - segment2.point1.y) - (segment2.point2.y - segment2.point1.y) * (segment1.point1.x - segment2.point1.x);
            v2 = (segment2.point2.x - segment2.point1.x) * (segment1.point2.y - segment2.point1.y) - (segment2.point2.y - segment2.point1.y) * (segment1.point2.x - segment2.point1.x);
            v3 = (segment1.point2.x - segment1.point1.x) * (segment2.point1.y - segment1.point1.y) - (segment1.point2.y - segment1.point1.y) * (segment2.point1.x - segment1.point1.x);
            v4 = (segment1.point2.x - segment1.point1.x) * (segment2.point2.y - segment1.point1.y) - (segment1.point2.y - segment1.point1.y) * (segment2.point2.x - segment1.point1.x);
            if (!isCrossing) {
                isCrossing = (v1 * v2 <= 0) && (v3 * v4 <= 0);
            }
        });
    });

    return isCrossing;
}