// Entry point: import core modules
import Game     from './Game.js';
import Renderer from './Renderer.js';
import Physics  from './Physics.js';
import Input    from './Input.js';

// Grab canvas, overlay and 2D context
const canvas  = document.getElementById('gameCanvas');
const overlay = document.getElementById('overlayScore');
const muteBtn = document.getElementById('muteBtn');
const ctx     = canvas.getContext('2d');

// Set fixed size for centered game window
canvas.width  = 800;
canvas.height = 600;

// Instantiate subsystems
const physics  = new Physics({ gravity: 980 });
const renderer = new Renderer(ctx);
const input    = new Input(canvas);
const game     = new Game({ physics, renderer, input, canvas });

// --- Background music playlist ---
const bgPlaylist = [
    'src/sounds/bgMusic/track1.mp3',
    'src/sounds/bgMusic/track2.mp3'
];
let bgIndex   = 0;
const bgAudio = new Audio();
bgAudio.volume = 0.2;

// play whatever is in bgAudio.src, then queue up the next track
function playBgTrack() {
    bgAudio.src = bgPlaylist[bgIndex];
    bgAudio.play().catch(() => {
        // still blocked? we’ll retry on next user interaction
    });
}

// when one track ends, advance and replay
bgAudio.addEventListener('ended', () => {
    bgIndex = (bgIndex + 1) % bgPlaylist.length;
    playBgTrack();
});

// defer autoplay until the first interaction
let musicStarted = false;
function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    playBgTrack();
    // remove these listeners, we only need one kick-off
    window.removeEventListener('mousedown', startMusic);
    window.removeEventListener('touchstart',  startMusic);
}

// listen for the user’s first click or tap
window.addEventListener('mousedown', startMusic);
window.addEventListener('touchstart',  startMusic);

// Mute/unmute toggle
muteBtn.addEventListener('click', () => {
    bgAudio.muted = !bgAudio.muted;
    muteBtn.textContent = bgAudio.muted ? 'Unmute Music' : 'Mute Music';
});


// Track time between frames for consistent motion
let lastTime = performance.now();
function loop(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    game.update(dt);
    game.render();

    // update score overlay from renderer state
    overlay.textContent = `Score: ${renderer.score}`;

    requestAnimationFrame(loop);
}

// Kick off the game loop
requestAnimationFrame(loop);
