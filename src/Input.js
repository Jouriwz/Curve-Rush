export default class Input {
    constructor(canvas) {
        this.canvas     = canvas;
        this.drawing    = false;
        this.onDrawStart = () => {};
        this.onDrawing   = () => {};
        this.onDrawEnd   = () => {};

        // bind handlers once so we can add/remove them
        this._moveHandler = this._handleMove.bind(this);
        this._upHandler   = this._handleUp.bind(this);

        // start drawing when mousedown/touchstart on the canvas
        canvas.addEventListener('mousedown', this._handleDown.bind(this));
        canvas.addEventListener('touchstart', e => {
            e.preventDefault();
            this._handleDown(e.touches[0]);
        });
    }

    _getPos(evt) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    }

    _handleDown(evt) {
        this.drawing = true;
        this.onDrawStart(this._getPos(evt));

        // now track movement & mouseup on the whole window
        window.addEventListener('mousemove', this._moveHandler);
        window.addEventListener('mouseup',   this._upHandler);

        // same for touch
        window.addEventListener('touchmove', this._moveHandler, { passive: false });
        window.addEventListener('touchend',  this._upHandler);
    }

    _handleMove(evt) {
        if (!this.drawing) return;
        // support touch and mouse events
        const source = evt.touches ? evt.touches[0] : evt;
        // prevent scrolling on touch
        if (evt.touches) evt.preventDefault();
        this.onDrawing(this._getPos(source));
    }

    _handleUp(evt) {
        if (!this.drawing) return;
        this.drawing = false;
        this.onDrawEnd();

        // clean up all global listeners
        window.removeEventListener('mousemove', this._moveHandler);
        window.removeEventListener('mouseup',   this._upHandler);

        window.removeEventListener('touchmove', this._moveHandler);
        window.removeEventListener('touchend',  this._upHandler);
    }
}
