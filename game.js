function isMobile() {
  // Detección mejorada que combina User Agent y dimensiones de pantalla
  const userAgent = /Android|iPhone|iPad|iPod|Windows Phone|Mobile|Tablet/i.test(navigator.userAgent);
  const screenSize = window.innerWidth < 768 || window.innerHeight < 600;
  return userAgent || screenSize;
}

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Configuración adaptativa mejorada
  const isMobileDevice = isMobile();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Dimensiones optimizadas basadas en el dispositivo
  let gameWidth, gameHeight;

  if (isMobileDevice) {
    // Para móviles, usar dimensiones base optimizadas
    gameWidth = 800;  // Ancho base fijo para móviles
    gameHeight = 600; // Alto base fijo para móviles
  } else {
    // Para desktop, dimensiones optimizadas para mejor experiencia
    gameWidth = Math.min(screenWidth * 0.9, 1200); // Máximo 1200px o 90% de pantalla
    gameHeight = Math.min(screenHeight * 0.8, 700); // Máximo 700px o 80% de pantalla

    // Asegurar dimensiones mínimas para desktop
    gameWidth = Math.max(gameWidth, 1000);
    gameHeight = Math.max(gameHeight, 500);
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
      // Mejorar la escalabilidad en diferentes dispositivos
      min: {
        width: isMobileDevice ? 360 : 800,
        height: isMobileDevice ? 480 : 500
      },
      max: {
        width: isMobileDevice ? 800 : 1200,
        height: isMobileDevice ? 600 : 700
      }
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    render: {
      pixelArt: false, // Cambiar a false para mejor calidad en móviles
      antialias: true,
      roundPixels: false, // Cambiar a false para mejor renderizado
      willReadFrequently: true,
    },
    scene: [
      Rompecabezas,
      CircuitosQuemados,
      scenaVideo4,
      Ultima,
    ],
  };

  // Create the game container with better styling
  const gameContainer = document.createElement("div");
  gameContainer.id = "game";
  gameContainer.style.cssText = `
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%);
    overflow: hidden;
  `;
  document.body.appendChild(gameContainer);

  // Mejorar estilos del body para mejor experiencia
  document.body.style.cssText = `
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0d1117;
    overflow: hidden;
  `;

  // Create the game
  const game = new Phaser.Game(config);

  // Handle mobile orientation and resize events
  function handleResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Actualizar detección de móvil en tiempo real
    const currentlyMobile = newWidth < 768 || newHeight < 600;

    if (currentlyMobile) {
      // Mostrar mensaje de orientación si es necesario
      if (newHeight > newWidth && document.getElementById("turn")) {
        document.getElementById("turn").style.display = "flex";
      } else if (document.getElementById("turn")) {
        document.getElementById("turn").style.display = "none";
      }
    }

    // Redimensionar el juego manteniendo proporciones adecuadas
    if (currentlyMobile) {
      game.scale.resize(800, 600);
    } else {
      game.scale.resize(
        Math.min(newWidth * 0.9, 1200),
        Math.min(newHeight * 0.8, 700)
      );
    }
  }

  // Agregar event listeners para resize
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 100); // Pequeño delay para orientationchange
  });
});
