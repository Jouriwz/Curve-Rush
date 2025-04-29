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
        this.ctx.strokeStyle = '#E5E7EB';
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
        this.ctx.fillStyle = '#3ABFF8';
        this.ctx.fill();
    }

    drawDot(dot) {
        // draw target dot
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FACC15';
        this.ctx.fill();
    }

    drawTrajectory(ball, gravity, duration = 2, step = 0.1) {
        const ctx = this.ctx;
        let x  = ball.x,
            y  = ball.y,
            vx = ball.vx,
            vy = ball.vy;

        ctx.save();
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth   = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let t = 0; t < duration; t += step) {
            // simple Euler integration
            vy += gravity * step;
            x  += vx * step;
            y  += vy * step;
            ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.restore();
    }

    drawPath(points, { color = 'yellow', dash = [5,5], width = 1 } = {}) {
        if (points.length < 2) return;
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth   = width;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let p of points) ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.restore();
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