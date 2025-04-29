// File: src/entities/Line.js
export default class Line {
    constructor(start) {
        // Initialize line with starting point
        this.points = [start];
    }

    // Add a new point to the line
    addPoint(pt) {
        this.points.push(pt);
    }
}
