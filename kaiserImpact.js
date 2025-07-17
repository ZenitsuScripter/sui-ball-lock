// kaiserImpact.js

// Som do Kaiser Impact
const kaiserSound = new Audio("https://zenitsuscripter.github.io/kaiser/kaiser.mp3");
let kaiserActive = false;

function activateKaiserImpact(ball, player1, canvas, kaiserTextEl, ballDefaultSpeedX=6, ballDefaultSpeedYRange=6) {
  if(kaiserActive) return;

  const maxDistance = 200;
  const dx = ball.x - player1.x;
  const dy = ball.y - player1.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if(dist <= maxDistance){
    kaiserActive = true;
    kaiserSound.currentTime = 0;
    kaiserSound.play().catch(e => console.warn('Erro ao tocar som:', e));

    const goalCenterY = canvas.height/2;
    const dxGoal = canvas.width - ball.x;
    const dyGoal = goalCenterY - ball.y;
    const angle = Math.atan2(dyGoal, dxGoal);
    const basePower = ballDefaultSpeedX;
    const power = basePower * 5;

    ball.speedX = Math.cos(angle) * power;
    ball.speedY = Math.sin(angle) * power;
    ball.spin = 0;

    kaiserTextEl.style.opacity = '1';

    setTimeout(() => {
      const duration = 1000;
      const startTime = performance.now();
      const startSpeedX = ball.speedX;
      const startSpeedY = ball.speedY;
      const signX = Math.sign(ball.speedX) || 1;
      const signY = Math.sign(ball.speedY) || 1;
      const targetSpeedX = basePower * signX;
      const targetSpeedY = ((Math.random() * ballDefaultSpeedYRange) - ballDefaultSpeedYRange/2) * signY;

      function lerp(a,b,t) { return a + (b - a)*t; }
      function animateDeceleration(time){
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);
        ball.speedX = lerp(startSpeedX, targetSpeedX, t);
        ball.speedY = lerp(startSpeedY, targetSpeedY, t);
        if(t < 1) {
          requestAnimationFrame(animateDeceleration);
        } else {
          kaiserActive = false;
          kaiserTextEl.style.opacity = '0';
        }
      }
      requestAnimationFrame(animateDeceleration);
    }, 1000);
  }
}

// Expondo globalmente para ser usada no script principal
window.activateKaiserImpact = activateKaiserImpact;
window.kaiserActive = kaiserActive;
