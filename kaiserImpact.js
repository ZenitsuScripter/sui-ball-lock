// kaiserImpact.js

(() => {
  const kaiserSound = new Audio("https://zenitsuscripter.github.io/kaiser/kaiser.mp3");
  let kaiserActive = false;
  let kaiserTimeout = null;

  function activateKaiserImpact(ball, player, canvas, kaiserTextEl, ballDefaultSpeedX = 6, ballDefaultSpeedYRange = 6) {
    if (kaiserActive) return;

    const maxDistance = 200;
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > maxDistance) return;

    kaiserActive = true;

    // Tocar som
    kaiserSound.currentTime = 0;
    kaiserSound.play().catch(() => {});

    // Mostrar texto KAISER IMPACT
    kaiserTextEl.style.opacity = '1';

    // Calcular ângulo em direção ao gol direito (assumindo gol na direita)
    const goalCenterY = canvas.height / 2;
    const dxGoal = canvas.width - ball.x;
    const dyGoal = goalCenterY - ball.y;
    const angle = Math.atan2(dyGoal, dxGoal);

    const basePower = ballDefaultSpeedX;
    const power = basePower * 5;

    // Aumenta velocidade da bola com força máxima
    ball.speedX = Math.cos(angle) * power;
    ball.speedY = Math.sin(angle) * power;
    ball.spin = 0;

    // Após 1 segundo, inicia desaceleração suave para velocidade padrão
    if (kaiserTimeout) clearTimeout(kaiserTimeout);
    kaiserTimeout = setTimeout(() => {
      const duration = 1000;
      const startTime = performance.now();
      const startSpeedX = ball.speedX;
      const startSpeedY = ball.speedY;
      const signX = Math.sign(ball.speedX) || 1;
      const signY = Math.sign(ball.speedY) || 1;
      const targetSpeedX = ballDefaultSpeedX * signX;
      const targetSpeedY = ((Math.random() * ballDefaultSpeedYRange) - ballDefaultSpeedYRange / 2) * signY;

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function animateDeceleration(time) {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);

        ball.speedX = lerp(startSpeedX, targetSpeedX, t);
        ball.speedY = lerp(startSpeedY, targetSpeedY, t);

        if (t < 1) {
          requestAnimationFrame(animateDeceleration);
        } else {
          kaiserActive = false;
          kaiserTextEl.style.opacity = '0';
        }
      }
      requestAnimationFrame(animateDeceleration);
    }, 1000);
  }

  // Exportar para global
  window.activateKaiserImpact = activateKaiserImpact;
  Object.defineProperty(window, 'kaiserActive', {
    get: () => kaiserActive,
  });
})();
