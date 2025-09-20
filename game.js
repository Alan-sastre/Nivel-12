function isMobile() {
  return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Configuración adaptativa para móviles
  const isMobileDevice = isMobile();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Dimensiones dinámicas basadas en el dispositivo
  let gameWidth, gameHeight;

  if (isMobileDevice) {
    // Para móviles, usar dimensiones más apropiadas
    gameWidth = Math.max(screenWidth, 800);
    gameHeight = Math.max(screenHeight, 600);
  } else {
    // Para desktop, mantener dimensiones originales pero más grandes
    gameWidth = 1200;
    gameHeight = 800;
  }

  const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      parent: "game",
      width: gameWidth,
      height: gameHeight,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      expandParent: false,
      fullscreenTarget: "game",
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    render: {
      pixelArt: true,
      antialias: true,
      roundPixels: true,
      willReadFrequently: true,
    },
    scene: [
      scenaPrincipal,
      scenaVideo,
      Fallos,
      scenaVideo2,
      DroneRepairScene,
      Rompecabezas,
      CircuitosQuemados,
      scenaVideo4,
      Ultima,
    ],
  };

  // Create the game container
  const gameContainer = document.createElement("div");
  gameContainer.id = "game";
  document.body.appendChild(gameContainer);

  // Create the game
  const game = new Phaser.Game(config);

  // Handle mobile orientation
  if (isMobile()) {
    window.addEventListener("resize", function () {
      if (window.innerHeight > window.innerWidth) {
        document.getElementById("turn").style.display = "flex";
      } else {
        document.getElementById("turn").style.display = "none";
      }
    });
  }
});
