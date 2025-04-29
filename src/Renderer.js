export default class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.score = 0; // track player score
    }

    clear() {
        // wipe entire canvas each frame
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawLines(lines) {
        // set stroke style once
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        lines.forEach(line => {
            if (line.points.length < 2) return; // need at least two points
            this.ctx.beginPath();
            // start at first point
            this.ctx.moveTo(line.points[0].x, line.points[0].y);
            // connect each subsequent point
            line.points.forEach(p => this.ctx.lineTo(p.x, p.y));
            this.ctx.stroke();
        });
    }

    drawBall(ball) {
        // draw the ball as a filled circle
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#888';
        this.ctx.fill();
    }

    drawDot(dot) {
        // draw target dot
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'blue';
        this.ctx.fill();
    }

    // drawUI({ score, cooldown }) {
    //     // display score and drawing cooldown
    //     this.ctx.font = '18px sans-serif';
    //     this.ctx.fillStyle = '#000';
    //     this.ctx.fillText(`Score: ${score}`, 10, 25);
    //     if (cooldown) {
    //         this.ctx.fillText('Drawing cooldown...', 10, 50);
    //     }
    // }

    incrementScore() {
        // called when ball hits dot
        this.score++;
    }
}