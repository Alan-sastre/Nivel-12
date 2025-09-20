function isMobile() {
  return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      parent: "game",
      width: 1000,
      height: 500,
      autoCenter: Phaser.Scale.CENTER_BOTH,
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
