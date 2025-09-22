class CircuitosQuemados extends Phaser.Scene {
  constructor() {
    super({ key: 'CircuitosQuemados' });
  }

  preload() {
    // Los recursos ya están cargados en el preloader principal
  }

  create() {
    // Configurar el fondo
    this.cameras.main.setBackgroundColor('#0a0a0a');

    // Detectar si es móvil
    this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

    // Crear fondo mejorado
    this.createEnhancedBackground();

    // Crear efectos de partículas flotantes
    this.createFloatingParticles();

    // Crear efectos ambientales
    this.createAmbientEffects();

    // Crear efectos de chispas
    this.createSparkEffects();

    // Título principal con animación (ajustado para móviles)
    const titleSize = this.isMobile ? '28px' : '36px';
    const titleY = this.isMobile ? 40 : 50;

    const mainTitle = this.add.text(this.cameras.main.centerX, titleY, '⚡ SISTEMAS DAÑADOS ⚡', {
      fontSize: titleSize,
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Animación del título
    this.tweens.add({
      targets: mainTitle,
      alpha: { from: 0.7, to: 1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Power2'
    });

    // Subtítulo (ajustado para móviles)
    const subtitleSize = this.isMobile ? '14px' : '18px';
    const subtitleY = this.isMobile ? 70 : 100;

    const subtitle = this.add.text(this.cameras.main.centerX, subtitleY, '', {
      fontSize: subtitleSize,
      fontFamily: 'Arial',
      fill: '#74b9ff',
      align: 'center'
    }).setOrigin(0.5);

    // Línea decorativa
    const decorativeLine = this.add.graphics()
      .lineStyle(3, 0x74b9ff, 0.8)
      .lineBetween(this.cameras.main.centerX - 200, 140, this.cameras.main.centerX + 200, 140);

    this.tweens.add({
      targets: decorativeLine,
      alpha: { from: 0.5, to: 1 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Crear texturas dinámicas
    this.createDynamicTextures();

    // Crear los cuadros de circuitos
    this.createCircuitBoxes();

    // Inicializar sistema de progreso de IA
    this.initializeAIProgress();

    // Inicializar sistema de finalización
    this.initializeCompletionSystem();

    // Inicializar sistema de modales
    this.initializeModalSystem();
  }

  initializeModalSystem() {
    // Variable para controlar si hay un modal abierto
    this.currentModal = null;
    this.modalContainer = null;
  }

  createModal(systemType, systemData) {
    // Si ya hay un modal abierto, cerrarlo primero
    if (this.currentModal) {
      this.closeModal();
      return;
    }

    // Crear contenedor principal del modal
    this.modalContainer = this.add.container(0, 0).setDepth(2000);

    // Overlay de fondo semi-transparente
    const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.8)
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerdown', () => this.closeModal());

    // Dimensiones del modal adaptadas para móviles
    const modalWidth = this.isMobile ? this.cameras.main.width - 40 : 600;
    const modalHeight = this.isMobile ? this.cameras.main.height - 100 : 500;
    const modalX = this.cameras.main.centerX;
    const modalY = this.cameras.main.centerY;

    // Fondo principal del modal con gradiente
    const modalBg = this.add.graphics()
      .fillGradientStyle(0x1e3c72, 0x2a5298, 0x1e3c72, 0x2a5298, 1)
      .fillRoundedRect(modalX - modalWidth/2, modalY - modalHeight/2, modalWidth, modalHeight, 20)
      .lineStyle(4, 0x74b9ff, 0.9)
      .strokeRoundedRect(modalX - modalWidth/2, modalY - modalHeight/2, modalWidth, modalHeight, 20);

    // Efecto de brillo del modal
    const modalGlow = this.add.graphics()
      .lineStyle(6, 0x00d4ff, 0.6)
      .strokeRoundedRect(modalX - modalWidth/2 - 5, modalY - modalHeight/2 - 5, modalWidth + 10, modalHeight + 10, 25);

    // Animación del brillo (REMOVIDA)
    // this.tweens.add({
    //   targets: modalGlow,
    //   alpha: { from: 0.4, to: 0.8 },
    //   duration: 2000,
    //   yoyo: true,
    //   repeat: -1,
    //   ease: 'Sine.easeInOut'
    // });

    // Botón de cerrar (X) - SIN ANIMACIONES
    const closeButtonSize = this.isMobile ? 40 : 35;
    const closeButton = this.add.graphics()
      .fillStyle(0xe74c3c, 1)
      .fillCircle(modalX + modalWidth/2 - 30, modalY - modalHeight/2 + 30, closeButtonSize/2)
      .lineStyle(3, 0xc0392b)
      .strokeCircle(modalX + modalWidth/2 - 30, modalY - modalHeight/2 + 30, closeButtonSize/2)
      .setInteractive(new Phaser.Geom.Circle(modalX + modalWidth/2 - 30, modalY - modalHeight/2 + 30, closeButtonSize/2), Phaser.Geom.Circle.Contains, { useHandCursor: true })
      .on('pointerdown', () => this.closeModal());
      // ANIMACIONES DE HOVER REMOVIDAS
      // .on('pointerover', () => {
      //   this.tweens.add({
      //     targets: closeButton,
      //     scaleX: 1.1,
      //     scaleY: 1.1,
      //     duration: 200,
      //     ease: 'Power2.easeOut'
      //   });
      // })
      // .on('pointerout', () => {
      //   this.tweens.add({
      //     targets: closeButton,
      //     scaleX: 1,
      //     scaleY: 1,
      //     duration: 200,
      //     ease: 'Power2.easeOut'
      //   });
      // });

    const closeText = this.add.text(modalX + modalWidth/2 - 30, modalY - modalHeight/2 + 30, '✕', {
      fontSize: this.isMobile ? '20px' : '18px',
      fontFamily: 'Arial Black',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Título del modal
    const titleSize = this.isMobile ? '24px' : '28px';
    const modalTitle = this.add.text(modalX, modalY - modalHeight/2 + 60, `🔧 SISTEMA ${systemType.toUpperCase()}`, {
      fontSize: titleSize,
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Subtítulo
    const subtitleSize = this.isMobile ? '14px' : '16px';
    const modalSubtitle = this.add.text(modalX, modalY - modalHeight/2 + 95, systemData.subtitle, {
      fontSize: subtitleSize,
      fontFamily: 'Arial',
      fill: '#74b9ff',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Línea decorativa
    const decorLine = this.add.graphics()
      .lineStyle(3, 0x74b9ff, 0.8)
      .lineBetween(modalX - 150, modalY - modalHeight/2 + 115, modalX + 150, modalY - modalHeight/2 + 115);

    // Contenido específico del sistema
    const contentContainer = this.add.container(modalX, modalY - modalHeight/2 + 160);
    this.createModalContent(systemType, contentContainer, modalWidth, modalHeight);

    // Botón de iniciar juego - SIN ANIMACIONES
    const gameButtonWidth = this.isMobile ? 200 : 180;
    const gameButtonHeight = this.isMobile ? 50 : 45;
    const gameButton = this.add.graphics()
      .fillGradientStyle(0x27ae60, 0x2ecc71, 0x27ae60, 0x2ecc71, 1)
      .fillRoundedRect(modalX - gameButtonWidth/2, modalY + modalHeight/2 - 80, gameButtonWidth, gameButtonHeight, 22)
      .lineStyle(3, 0x229954)
      .strokeRoundedRect(modalX - gameButtonWidth/2, modalY + modalHeight/2 - 80, gameButtonWidth, gameButtonHeight, 22)
      .setInteractive(new Phaser.Geom.Rectangle(modalX - gameButtonWidth/2, modalY + modalHeight/2 - 80, gameButtonWidth, gameButtonHeight), Phaser.Geom.Rectangle.Contains, { useHandCursor: true })
      .on('pointerdown', () => {
        this.closeModal();
        this.startSystemGame(systemType);
      });
      // ANIMACIONES DE HOVER REMOVIDAS
      // .on('pointerover', () => {
      //   this.tweens.add({
      //     targets: gameButton,
      //     scaleX: 1.05,
      //     scaleY: 1.05,
      //     duration: 200,
      //     ease: 'Power2.easeOut'
      //   });
      // })
      // .on('pointerout', () => {
      //   this.tweens.add({
      //     targets: gameButton,
      //     scaleX: 1,
      //     scaleY: 1,
      //     duration: 200,
      //     ease: 'Power2.easeOut'
      //   });
      // });

    const gameButtonText = this.add.text(modalX, modalY + modalHeight/2 - 55, '🎮 INICIAR REPARACIÓN', {
      fontSize: this.isMobile ? '16px' : '14px',
      fontFamily: 'Arial Bold',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Agregar todos los elementos al contenedor del modal
    this.modalContainer.add([
      overlay, modalBg, modalGlow, closeButton, closeText, 
      modalTitle, modalSubtitle, decorLine, contentContainer, 
      gameButton, gameButtonText
    ]);

    // Animación de entrada del modal (REMOVIDA)
    // this.modalContainer.setAlpha(0).setScale(0.8);
    // this.tweens.add({
    //   targets: this.modalContainer,
    //   alpha: 1,
    //   scaleX: 1,
    //   scaleY: 1,
    //   duration: 400,
    //   ease: 'Back.easeOut'
    // });

    this.currentModal = systemType;

    // Sonido de apertura del modal
    if (this.sound.get('alert')) {
      this.sound.play('alert', { volume: 0.3 });
    }
  }

  createMemoryGameContent(container, width, isMobile, systemIndex) {
    // === FONDO PRINCIPAL FUTURISTA ===
    const mainBackground = this.add.graphics()
      .fillGradientStyle(0x0a0f1a, 0x1a2332, 0x0f1b2d, 0x243447, 0.98)
      .fillRoundedRect(-width/2 + 10, -200, width - 20, 400, 25)
      .lineStyle(3, 0x00ccff, 0.8)
      .strokeRoundedRect(-width/2 + 10, -200, width - 20, 400, 25);
    
    // Efecto de brillo exterior múltiple
    const glowEffect1 = this.add.graphics()
      .lineStyle(2, 0x00ffff, 0.4)
      .strokeRoundedRect(-width/2 + 8, -202, width - 16, 404, 27);
    
    const glowEffect2 = this.add.graphics()
      .lineStyle(1, 0x66ccff, 0.2)
      .strokeRoundedRect(-width/2 + 6, -204, width - 12, 408, 29);
    
    container.add([mainBackground, glowEffect1, glowEffect2]);

    // === HEADER SECTION MEJORADO ===
    // Panel superior con diseño hexagonal y mejor espaciado
    const headerPanel = this.add.graphics()
      .fillGradientStyle(0x001122, 0x003366, 0x002244, 0x004488, 0.95)
      .fillRoundedRect(-width/2 + 25, -185, width - 50, 90, 15)
      .lineStyle(2, 0x00ccff, 0.9)
      .strokeRoundedRect(-width/2 + 25, -185, width - 50, 90, 15);
    
    // Líneas de circuito decorativas en el header con mejor distribución
    const headerCircuits = this.add.graphics()
      .lineStyle(2, 0x00ffff, 0.7)
      .moveTo(-width/2 + 35, -175)
      .lineTo(-width/2 + 100, -175)
      .lineTo(-width/2 + 110, -165)
      .moveTo(width/2 - 100, -175)
      .lineTo(width/2 - 35, -175)
      .lineTo(width/2 - 45, -165)
      .lineStyle(1, 0x66ccff, 0.5)
      .moveTo(-width/2 + 40, -160)
      .lineTo(-width/2 + 80, -160)
      .moveTo(width/2 - 80, -160)
      .lineTo(width/2 - 40, -160);
    
    // Indicadores de estado en el header con mejor posicionamiento
    const statusIndicators = this.add.graphics()
      .fillStyle(0x00ff00, 0.9)
      .fillCircle(-width/2 + 45, -170, 4)
      .fillStyle(0x00ff00, 0.9)
      .fillCircle(-width/2 + 60, -170, 4)
      .fillStyle(0xffaa00, 0.9)
      .fillCircle(-width/2 + 75, -170, 4)
      .fillStyle(0xff3366, 0.9)
      .fillCircle(-width/2 + 90, -170, 4);
    
    container.add([headerPanel, headerCircuits, statusIndicators]);

    // Título principal con efecto holográfico avanzado y mejor posicionamiento
    const titleShadow = this.add.text(2, -148, '⚡ SISTEMA DE MEMORIA NEURAL', {
      fontSize: isMobile ? '18px' : '24px',
      fontFamily: 'Orbitron, Arial Black',
      fill: '#003366',
      align: 'center',
      alpha: 0.6
    }).setOrigin(0.5);
    
    const title = this.add.text(0, -150, '⚡ SISTEMA DE MEMORIA NEURAL', {
      fontSize: isMobile ? '18px' : '24px',
      fontFamily: 'Orbitron, Arial Black',
      fill: '#00ffff',
      align: 'center',
      stroke: '#001133',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Efecto de resplandor animado en el título
    const titleGlow = this.add.text(0, -150, '⚡ SISTEMA DE MEMORIA NEURAL', {
      fontSize: isMobile ? '18px' : '24px',
      fontFamily: 'Orbitron, Arial Black',
      fill: '#66ffff',
      align: 'center',
      alpha: 0.4
    }).setOrigin(0.5);
    
    container.add([titleShadow, titleGlow, title]);

    // Animación del resplandor del título
    this.tweens.add({
      targets: titleGlow,
      alpha: { from: 0.4, to: 0.8 },
      scaleX: { from: 1, to: 1.05 },
      scaleY: { from: 1, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtítulo con información técnica y mejor espaciado
    const subtitle = this.add.text(0, -120, 'PROTOCOLO DE SINCRONIZACIÓN CUÁNTICA v2.1', {
      fontSize: isMobile ? '9px' : '11px',
      fontFamily: 'Courier New, monospace',
      fill: '#66ccff',
      align: 'center',
      letterSpacing: 1,
      alpha: 0.8
    }).setOrigin(0.5);
    container.add(subtitle);

    // === PANEL DE INFORMACIÓN MEJORADO ===
    const infoPanelBg = this.add.graphics()
      .fillGradientStyle(0x001a2e, 0x003366, 0x002244, 0x004488, 0.9)
      .fillRoundedRect(-width/2 + 30, -85, width - 60, 60, 12)
      .lineStyle(2, 0x0099cc, 0.8)
      .strokeRoundedRect(-width/2 + 30, -85, width - 60, 60, 12);
    
    // Decoración del panel de información con mejor distribución
    const infoDecoration = this.add.graphics()
      .lineStyle(1, 0x00ccff, 0.6)
      .moveTo(-width/2 + 40, -75)
      .lineTo(-width/2 + 70, -75)
      .moveTo(width/2 - 70, -75)
      .lineTo(width/2 - 40, -75)
      .fillStyle(0x00ffff, 0.8)
      .fillCircle(-width/2 + 40, -55, 2)
      .fillCircle(width/2 - 40, -55, 2);
    
    container.add([infoPanelBg, infoDecoration]);

    // Descripción del juego con mejor espaciado
    const description = this.add.text(0, -70, 'MEMORIZA LA SECUENCIA DE ACTIVACIÓN', {
      fontSize: isMobile ? '11px' : '13px',
      fontFamily: 'Courier New, monospace',
      fill: '#00ffff',
      align: 'center',
      letterSpacing: 1
    }).setOrigin(0.5);
    
    const instructions = this.add.text(0, -50, 'REPRODUCE EL PATRÓN NEURAL EXACTO', {
      fontSize: isMobile ? '9px' : '11px',
      fontFamily: 'Courier New, monospace',
      fill: '#66ccff',
      align: 'center',
      letterSpacing: 0.5,
      alpha: 0.9
    }).setOrigin(0.5);
    
    const additionalInfo = this.add.text(0, -35, 'PRECISIÓN REQUERIDA: 100%', {
      fontSize: isMobile ? '8px' : '10px',
      fontFamily: 'Courier New, monospace',
      fill: '#99ccff',
      align: 'center',
      letterSpacing: 0.5,
      alpha: 0.8
    }).setOrigin(0.5);
    
    container.add([description, instructions, additionalInfo]);

    // === PANEL DE ESTADO MEJORADO ===
    const statusPanelBg = this.add.graphics()
      .fillGradientStyle(0x0a1428, 0x1a2332, 0x0f1b2d, 0x243447, 0.95)
      .fillRoundedRect(-width/2 + 40, -15, width - 80, 50, 10)
      .lineStyle(2, 0x00ccff, 0.9)
      .strokeRoundedRect(-width/2 + 40, -15, width - 80, 50, 10);
    
    // LEDs de estado del sistema con mejor posicionamiento
    const systemLeds = this.add.graphics()
      .fillStyle(0x00ff00, 1)
      .fillCircle(-width/2 + 55, 0, 3)
      .fillStyle(0x00ff00, 1)
      .fillCircle(-width/2 + 70, 0, 3)
      .fillStyle(0xffaa00, 0.8)
      .fillCircle(-width/2 + 85, 0, 3)
      .fillStyle(0x333333, 0.5)
      .fillCircle(-width/2 + 100, 0, 3);
    
    // Etiquetas de los LEDs con mejor espaciado
    const ledLabels = this.add.text(-width/2 + 77, 12, 'SYS | MEM | CPU | NET', {
      fontSize: '7px',
      fontFamily: 'Courier New, monospace',
      fill: '#66ccff',
      alpha: 0.7
    }).setOrigin(0.5);
    
    container.add([statusPanelBg, systemLeds, ledLabels]);

    const statusText = this.add.text(0, 25, 'INICIALIZANDO MATRIZ NEURAL...', {
      fontSize: isMobile ? '10px' : '12px',
      fontFamily: 'Courier New, monospace',
      fill: '#00ffff',
      letterSpacing: 1
    }).setOrigin(0.5);
    container.add(statusText);

    // Variables del juego
    const colors = [0xff3366, 0x3366ff, 0x00ffcc, 0x66ff33];
    const colorNames = ['ROJO', 'AZUL', 'CIAN', 'VERDE'];
    const sequence = [];
    const userSequence = [];
    let showingSequence = false;

    // Generar secuencia aleatoria
    for (let i = 0; i < 4; i++) {
      sequence.push(Phaser.Math.Between(0, 3));
    }

    // === ÁREA DE BOTONES REDISEÑADA CON MEJOR ESPACIADO ===
    const buttonAreaBg = this.add.graphics()
      .fillGradientStyle(0x0a1428, 0x1a2332, 0x0f1b2d, 0x243447, 0.95)
      .fillRoundedRect(-width/2 + 20, 50, width - 40, 140, 20)
      .lineStyle(3, 0x00ccff, 0.8)
      .strokeRoundedRect(-width/2 + 20, 50, width - 40, 140, 20);
    
    // Efectos de brillo en el área de botones
    const buttonAreaGlow1 = this.add.graphics()
      .lineStyle(2, 0x00ffff, 0.4)
      .strokeRoundedRect(-width/2 + 18, 48, width - 36, 144, 22);
    
    const buttonAreaGlow2 = this.add.graphics()
      .lineStyle(1, 0x66ccff, 0.2)
      .strokeRoundedRect(-width/2 + 16, 46, width - 32, 148, 24);
    
    // Panel de control interno con mejor espaciado
    const controlPanelBg = this.add.graphics()
      .fillGradientStyle(0x001122, 0x003366, 0x002244, 0x004488, 0.9)
      .fillRoundedRect(-width/2 + 35, 65, width - 70, 110, 15)
      .lineStyle(2, 0x0099cc, 0.7)
      .strokeRoundedRect(-width/2 + 35, 65, width - 70, 110, 15);
    
    // Líneas de circuito decorativas en el panel con mejor distribución
    const controlCircuits = this.add.graphics()
      .lineStyle(1, 0x00ccff, 0.6)
      .moveTo(-width/2 + 45, 75)
      .lineTo(-width/2 + 80, 75)
      .moveTo(width/2 - 80, 75)
      .lineTo(width/2 - 45, 75)
      .moveTo(-width/2 + 45, 165)
      .lineTo(-width/2 + 80, 165)
      .moveTo(width/2 - 80, 165)
      .lineTo(width/2 - 45, 165)
      .lineStyle(2, 0x66ccff, 0.4)
      .moveTo(-width/2 + 50, 80)
      .lineTo(-width/2 + 50, 160)
      .moveTo(width/2 - 50, 80)
      .lineTo(width/2 - 50, 160);
    
    // Título del panel de control
    const controlTitle = this.add.text(0, 85, 'MATRIZ DE CONTROL NEURAL', {
      fontSize: isMobile ? '8px' : '10px',
      fontFamily: 'Courier New, monospace',
      fill: '#66ccff',
      align: 'center',
      letterSpacing: 1,
      alpha: 0.8
    }).setOrigin(0.5);
    
    container.add([buttonAreaBg, buttonAreaGlow1, buttonAreaGlow2, controlPanelBg, controlCircuits, controlTitle]);

    // Crear botones de colores completamente rediseñados con mejor espaciado
    const colorButtons = [];
    for (let i = 0; i < 4; i++) {
      const xPos = -120 + (i * 80);
      const yPos = 120; // Posición más centrada en el panel
      
      // === ESTRUCTURA DEL BOTÓN FUTURISTA ===
      
      // Base principal hexagonal
      const hexagonalBase = this.add.graphics()
        .fillGradientStyle(0x0a0a0a, 0x1a1a1a, 0x0f0f0f, 0x2a2a2a, 0.95)
        .fillCircle(xPos, yPos, 32)
        .lineStyle(3, colors[i], 0.9)
        .strokeCircle(xPos, yPos, 32)
        .lineStyle(2, colors[i], 0.6)
        .strokeCircle(xPos, yPos, 36)
        .lineStyle(1, colors[i], 0.3)
        .strokeCircle(xPos, yPos, 40);
      
      // Anillo de energía exterior
      const energyRing = this.add.graphics()
        .lineStyle(4, colors[i], 0.5)
        .strokeCircle(xPos, yPos, 44);
      
      // Anillo medio pulsante
      const pulseRing = this.add.graphics()
        .lineStyle(2, colors[i], 0.7)
        .strokeCircle(xPos, yPos, 38);
      
      // Botón principal con gradiente avanzado
      const mainButton = this.add.graphics()
        .fillGradientStyle(colors[i], Phaser.Display.Color.Interpolate.ColorWithColor(colors[i], 0xffffff, 100, 30), colors[i], Phaser.Display.Color.Interpolate.ColorWithColor(colors[i], 0x000000, 100, 20), 0.9)
        .fillCircle(xPos, yPos, 28);
      
      // Núcleo holográfico central
      const holoCore = this.add.graphics()
        .fillGradientStyle(0xffffff, colors[i], 0xffffff, colors[i], 0.6)
        .fillCircle(xPos, yPos, 18)
        .lineStyle(1, 0xffffff, 0.8)
        .strokeCircle(xPos, yPos, 18);
      
      // Patrón de circuito interno avanzado
      const circuitGrid = this.add.graphics()
        .lineStyle(1, 0xffffff, 0.8)
        // Cruz principal
        .moveTo(xPos - 12, yPos)
        .lineTo(xPos + 12, yPos)
        .moveTo(xPos, yPos - 12)
        .lineTo(xPos, yPos + 12)
        // Líneas diagonales
        .moveTo(xPos - 8, yPos - 8)
        .lineTo(xPos + 8, yPos + 8)
        .moveTo(xPos - 8, yPos + 8)
        .lineTo(xPos + 8, yPos - 8)
        // Puntos de conexión
        .fillStyle(0xffffff, 1)
        .fillCircle(xPos - 8, yPos, 2)
        .fillCircle(xPos + 8, yPos, 2)
        .fillCircle(xPos, yPos - 8, 2)
        .fillCircle(xPos, yPos + 8, 2)
        // Centro brillante
        .fillStyle(colors[i], 1)
        .fillCircle(xPos, yPos, 4)
        .fillStyle(0xffffff, 0.8)
        .fillCircle(xPos, yPos, 2);
      
      // Indicadores LED de estado
      const statusLedTop = this.add.circle(xPos, yPos - 25, 3, 0x333333, 0.8);
      const statusLedRight = this.add.circle(xPos + 25, yPos, 3, 0x333333, 0.8);
      const statusLedBottom = this.add.circle(xPos, yPos + 25, 3, 0x333333, 0.8);
      const statusLedLeft = this.add.circle(xPos - 25, yPos, 3, 0x333333, 0.8);
      
      // Etiqueta del color con diseño futurista
      const colorLabel = this.add.text(xPos, yPos + 55, colorNames[i], {
        fontSize: '12px',
        fontFamily: 'Orbitron, Arial Black',
        fill: colors[i],
        align: 'center',
        letterSpacing: 2,
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);
      
      // Código hexadecimal del color
      const hexCode = this.add.text(xPos, yPos + 70, `#${colors[i].toString(16).toUpperCase().padStart(6, '0')}`, {
        fontSize: '8px',
        fontFamily: 'Courier New, monospace',
        fill: '#66ccff',
        align: 'center',
        alpha: 0.7
      }).setOrigin(0.5);
      
      // Crear botón interactivo invisible
      const interactiveButton = this.add.circle(xPos, yPos, 44, 0x000000, 0)
        .setInteractive({ useHandCursor: true });
      
      // Asignar propiedades al botón
      interactiveButton.colorIndex = i;
      interactiveButton.hexBase = hexagonalBase;
      interactiveButton.energyRing = energyRing;
      interactiveButton.pulseRing = pulseRing;
      interactiveButton.mainButton = mainButton;
      interactiveButton.holoCore = holoCore;
      interactiveButton.circuitGrid = circuitGrid;
      interactiveButton.statusLeds = [statusLedTop, statusLedRight, statusLedBottom, statusLedLeft];
      interactiveButton.colorLabel = colorLabel;
      
      colorButtons.push(interactiveButton);
      container.add([
        hexagonalBase, energyRing, pulseRing, mainButton, holoCore, circuitGrid,
        statusLedTop, statusLedRight, statusLedBottom, statusLedLeft,
        colorLabel, hexCode, interactiveButton
      ]);

      // === ANIMACIONES CONTINUAS ===
      
      // Rotación del anillo de energía
      this.tweens.add({
        targets: energyRing,
        rotation: Math.PI * 2,
        duration: 4000,
        repeat: -1,
        ease: 'Linear'
      });
      
      // Pulsación del anillo medio
      this.tweens.add({
        targets: pulseRing,
        alpha: { from: 0.7, to: 0.3 },
        scaleX: { from: 1, to: 1.15 },
        scaleY: { from: 1, to: 1.15 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Brillo del núcleo holográfico
      this.tweens.add({
        targets: holoCore,
        alpha: { from: 0.6, to: 0.9 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Power2'
      });
      
      // Parpadeo sutil del patrón de circuito
      this.tweens.add({
        targets: circuitGrid,
        alpha: { from: 0.8, to: 1 },
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // === EVENTOS DE INTERACCIÓN REDISEÑADOS ===
      
      // Efectos hover avanzados
      interactiveButton.on('pointerover', () => {
        if (!showingSequence) {
          // Activar todos los LEDs de estado
          interactiveButton.statusLeds.forEach(led => {
            led.setFillStyle(colors[i], 1);
            this.tweens.add({
              targets: led,
              scaleX: 1.5,
              scaleY: 1.5,
              duration: 200,
              ease: 'Back.easeOut'
            });
          });
          
          // Intensificar el anillo de energía
          this.tweens.add({
            targets: energyRing,
            alpha: 1,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            ease: 'Back.easeOut'
          });
          
          // Brillo del núcleo holográfico
          this.tweens.add({
            targets: holoCore,
            alpha: 1,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            ease: 'Back.easeOut'
          });
          
          // Intensificar el patrón de circuito
          this.tweens.add({
            targets: circuitGrid,
            alpha: 1,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 200
          });
          
          // Efecto de brillo en la etiqueta
          this.tweens.add({
            targets: colorLabel,
            scaleX: 1.1,
            scaleY: 1.1,
            alpha: 1,
            duration: 200,
            ease: 'Back.easeOut'
          });
        }
      });

      interactiveButton.on('pointerout', () => {
        if (!showingSequence) {
          // Desactivar LEDs de estado
          interactiveButton.statusLeds.forEach(led => {
            led.setFillStyle(0x333333, 0.8);
            this.tweens.add({
              targets: led,
              scaleX: 1,
              scaleY: 1,
              duration: 200,
              ease: 'Back.easeOut'
            });
          });
          
          // Restaurar anillo de energía
          this.tweens.add({
            targets: energyRing,
            alpha: 0.5,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.easeOut'
          });
          
          // Restaurar núcleo holográfico
          this.tweens.add({
            targets: holoCore,
            alpha: 0.6,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.easeOut'
          });
          
          // Restaurar patrón de circuito
          this.tweens.add({
            targets: circuitGrid,
            alpha: 0.8,
            scaleX: 1,
            scaleY: 1,
            duration: 200
          });
          
          // Restaurar etiqueta
          this.tweens.add({
            targets: colorLabel,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 200,
            ease: 'Back.easeOut'
          });
        }
      });

      interactiveButton.on('pointerdown', () => {
        if (showingSequence) return;

        // === EFECTOS VISUALES DE ACTIVACIÓN ===
        
        // Explosión de energía en el botón principal
        this.tweens.add({
          targets: mainButton,
          scaleX: 1.6,
          scaleY: 1.6,
          alpha: 1,
          duration: 150,
          yoyo: true,
          ease: 'Back.easeOut'
        });

        // Pulso intenso en el núcleo holográfico
        this.tweens.add({
          targets: holoCore,
          scaleX: 1.8,
          scaleY: 1.8,
          alpha: 1,
          duration: 200,
          yoyo: true,
          ease: 'Power3'
        });

        // Expansión del anillo de energía
        this.tweens.add({
          targets: energyRing,
          scaleX: 1.4,
          scaleY: 1.4,
          alpha: 1,
          duration: 300,
          yoyo: true,
          ease: 'Power2'
        });

        // Activación secuencial de LEDs
        interactiveButton.statusLeds.forEach((led, index) => {
          this.time.delayedCall(index * 50, () => {
            led.setFillStyle(0x00ff00, 1);
            this.tweens.add({
              targets: led,
              scaleX: 2,
              scaleY: 2,
              duration: 200,
              yoyo: true,
              ease: 'Back.easeOut'
            });
          });
        });

        // Efecto de circuito eléctrico
        this.tweens.add({
          targets: circuitGrid,
          alpha: 1,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 250,
          yoyo: true,
          ease: 'Power2'
        });

        // Efecto de partículas de energía mejorado
        this.createAdvancedMemoryParticles(xPos, yPos, colors[i]);

        // Efecto de onda expansiva
        this.createEnergyWave(xPos, yPos, colors[i]);

        userSequence.push(i);

        if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
          // === EFECTOS DE ERROR AVANZADOS ===
          statusText.setText('⚠️ ERROR CRÍTICO EN MATRIZ NEURAL');
          statusText.setFill('#ff3366');
          
          // Efecto de error en todos los botones
          colorButtons.forEach(btn => {
            // Error en todos los LEDs
            btn.statusLeds.forEach(led => {
              led.setFillStyle(0xff0000, 1);
              this.tweens.add({
                targets: led,
                alpha: { from: 1, to: 0 },
                duration: 100,
                repeat: 5,
                yoyo: true
              });
            });
            
            // Efecto de cortocircuito en el botón
            this.tweens.add({
              targets: [btn.mainButton, btn.holoCore],
              tint: 0xff0000,
              scaleX: 0.7,
              scaleY: 0.7,
              duration: 300,
              yoyo: true,
              ease: 'Power2'
            });
            
            // Parpadeo errático del patrón de circuito
            this.tweens.add({
              targets: btn.circuitGrid,
              alpha: { from: 0.8, to: 0 },
              rotation: { from: 0, to: 0.2 },
              duration: 80,
              repeat: 6,
              yoyo: true
            });
            
            // Distorsión del anillo de energía
            this.tweens.add({
              targets: btn.energyRing,
              scaleX: { from: 1, to: 1.3 },
              scaleY: { from: 1, to: 0.7 },
              alpha: { from: 0.5, to: 0.1 },
              duration: 200,
              repeat: 3,
              yoyo: true
            });
          });

          userSequence.length = 0;
          this.time.delayedCall(2500, () => {
            statusText.setText('🔄 REINICIANDO PROTOCOLO NEURAL...');
            statusText.setFill('#00ffff');
            
            // Restaurar todos los elementos
            colorButtons.forEach(btn => {
              btn.statusLeds.forEach(led => {
                led.setFillStyle(0x333333, 0.8);
                led.setScale(1);
                led.setAlpha(0.8);
              });
              
              // Limpiar efectos de tinte
              btn.mainButton.clearTint();
              btn.holoCore.clearTint();
              btn.circuitGrid.setRotation(0);
              btn.energyRing.setScale(1);
            });
            
            showSequence();
          });
        } else if (userSequence.length === sequence.length) {
          // === EFECTOS DE ÉXITO ESPECTACULARES ===
          statusText.setText('✅ MATRIZ NEURAL SINCRONIZADA CON ÉXITO');
          statusText.setFill('#66ff33');
          
          // Efecto de éxito en todos los botones
          colorButtons.forEach((btn, btnIndex) => {
            this.time.delayedCall(btnIndex * 100, () => {
              // LEDs de éxito en cascada
              btn.statusLeds.forEach((led, ledIndex) => {
                this.time.delayedCall(ledIndex * 50, () => {
                  led.setFillStyle(0x00ff00, 1);
                  this.tweens.add({
                    targets: led,
                    scaleX: 2.5,
                    scaleY: 2.5,
                    duration: 400,
                    yoyo: true,
                    ease: 'Back.easeOut'
                  });
                });
              });
              
              // Efecto de victoria en el botón
              this.tweens.add({
                targets: [btn.mainButton, btn.holoCore],
                tint: 0x00ff00,
                scaleX: 1.4,
                scaleY: 1.4,
                duration: 500,
                yoyo: true,
                ease: 'Back.easeOut'
              });
              
              // Rotación triunfal del anillo de energía
              this.tweens.add({
                targets: btn.energyRing,
                rotation: Math.PI * 4,
                scaleX: 1.6,
                scaleY: 1.6,
                alpha: 1,
                duration: 800,
                ease: 'Power2'
              });
              
              // Brillo intenso del patrón
              this.tweens.add({
                targets: btn.circuitGrid,
                alpha: 1,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 600,
                yoyo: true,
                ease: 'Power2'
              });
            });
          });
          
          // Completar el circuito
          this.time.delayedCall(3000, () => {
            this.completeCircuitRepair('MEMORIA', systemIndex);
            this.closeModal();
          });
        }
      });
      
      // Efectos de éxito
      this.tweens.add({
        targets: [btn, btn.innerCore],
        tint: 0x00ff00,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 400,
        yoyo: true,
        ease: 'Back.easeOut'
      });
            
      // Pulso del anillo exterior
      this.tweens.add({
        targets: btn.outerRing,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 1,
        duration: 600,
        yoyo: true
      });
      
      // Brillo del patrón
      this.tweens.add({
        targets: btn.circuitPattern,
        alpha: 1,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 400,
        yoyo: true
      });
      
      // Completar el circuito
      this.time.delayedCall(2000, () => {
        this.completeCircuitRepair('MEMORIA', systemIndex);
        this.closeModal();
      });
    }

    // Función para mostrar la secuencia
    const showSequence = () => {
      showingSequence = true;
      userSequence.length = 0;
      let step = 0;

      const showStep = () => {
        if (step < sequence.length) {
          const buttonIndex = sequence[step];
          const button = colorButtons[buttonIndex];

          this.tweens.add({
            targets: [button, button.innerGlow],
            alpha: 1,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 500,
            yoyo: true,
            ease: 'Back.easeOut',
            onComplete: () => {
              step++;
              if (step < sequence.length) {
                this.time.delayedCall(400, showStep);
              } else {
                showingSequence = false;
                statusText.setText('REPITE LA SECUENCIA');
                statusText.setFill('#00d4ff');
              }
            }
          });

          // Efecto de brillo durante la demostración
          this.tweens.add({
            targets: button.buttonBg,
            alpha: 0.3,
            duration: 500,
            yoyo: true
          });
        }
      };

      this.time.delayedCall(800, showStep);
    };

    // Iniciar el juego
    showSequence();
  }

  // Función auxiliar para crear partículas de memoria
  createMemoryParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(x, y, 2, color, 0.8);
      
      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-30, 30),
        y: y + Phaser.Math.Between(-30, 30),
        alpha: 0,
        duration: 600,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  // Función auxiliar para crear partículas avanzadas de memoria
  createAdvancedMemoryParticles(x, y, color) {
    // Partículas principales con trayectorias curvas
    for (let i = 0; i < 12; i++) {
      const particle = this.add.circle(x, y, Phaser.Math.Between(2, 4), color, 0.9);
      const angle = (i / 12) * Math.PI * 2;
      const distance = Phaser.Math.Between(40, 80);
      
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        scaleX: 0.1,
        scaleY: 0.1,
        alpha: 0,
        duration: 800,
        ease: 'Power3.easeOut',
        onComplete: () => particle.destroy()
      });
    }

    // Partículas secundarias con efecto de chispa
    for (let i = 0; i < 6; i++) {
      const spark = this.add.rectangle(x, y, 8, 2, color, 0.8);
      spark.setRotation(Phaser.Math.Between(0, Math.PI * 2));
      
      this.tweens.add({
        targets: spark,
        x: x + Phaser.Math.Between(-60, 60),
        y: y + Phaser.Math.Between(-60, 60),
        scaleX: 0,
        alpha: 0,
        duration: 600,
        ease: 'Power2.easeOut',
        onComplete: () => spark.destroy()
      });
    }
  }

  // Función auxiliar para crear ondas de energía
  createEnergyWave(x, y, color) {
    // Onda principal
    const wave1 = this.add.circle(x, y, 10, color, 0);
    wave1.setStrokeStyle(3, color, 0.8);
    
    this.tweens.add({
      targets: wave1,
      scaleX: 8,
      scaleY: 8,
      alpha: 0,
      duration: 800,
      ease: 'Power2.easeOut',
      onComplete: () => wave1.destroy()
    });

    // Onda secundaria
    const wave2 = this.add.circle(x, y, 5, color, 0);
    wave2.setStrokeStyle(2, color, 0.6);
    
    this.time.delayedCall(200, () => {
      this.tweens.add({
        targets: wave2,
        scaleX: 6,
        scaleY: 6,
        alpha: 0,
        duration: 600,
        ease: 'Power2.easeOut',
        onComplete: () => wave2.destroy()
      });
    });

    // Pulso de energía central
    const pulse = this.add.circle(x, y, 15, color, 0.3);
    this.tweens.add({
      targets: pulse,
      scaleX: 0.2,
      scaleY: 0.2,
      alpha: 0,
      duration: 400,
      ease: 'Back.easeIn',
      onComplete: () => pulse.destroy()
    });
  }

  createModalContent(systemType, container, modalWidth, modalHeight) {
    const contentWidth = modalWidth - 80;
    const isMobile = this.isMobile;
    
    // Encontrar el índice del sistema para los minijuegos
    const systemIndex = this.circuitBoxes.findIndex(box => 
      box.titleText.text === systemType
    );

    switch(systemType) {
      case 'ROBÓTICA':
        this.createRoboticsGameContent(container, contentWidth, isMobile, systemIndex);
        break;
      case 'IA':
        this.createAIGameContent(container, contentWidth, isMobile, systemIndex);
        break;
      case 'MEMORIA':
        this.createMemoryGameContent(container, contentWidth, isMobile, systemIndex);
        break;
      case 'SECUENCIA':
        this.createSequenceGameContent(container, contentWidth, isMobile, systemIndex);
        break;
    }
  }

  createRoboticsContent(container, width, isMobile) {
    const fontSize = isMobile ? '14px' : '16px';
    const smallFont = isMobile ? '12px' : '14px';

    // Descripción del problema
    const description = this.add.text(0, 0, 
      '🤖 Los sistemas de movimiento del robot están dañados.\n' +
      'Los servomotores no responden correctamente y las\n' +
      'articulaciones están desalineadas.', {
      fontSize: fontSize,
      fontFamily: 'Arial',
      fill: '#ecf0f1',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    // Estado del sistema
    const statusBg = this.add.graphics()
      .fillStyle(0xe74c3c, 0.3)
      .fillRoundedRect(-width/2 + 20, 80, width - 40, 60, 10)
      .lineStyle(2, 0xe74c3c)
      .strokeRoundedRect(-width/2 + 20, 80, width - 40, 60, 10);

    const statusText = this.add.text(0, 110, 
      '⚠️ ESTADO: CRÍTICO\n' +
      '🔧 REPARACIÓN REQUERIDA: Calibración de motores', {
      fontSize: smallFont,
      fontFamily: 'Arial Bold',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Instrucciones del juego
    const instructionsBg = this.add.graphics()
      .fillStyle(0x3498db, 0.2)
      .fillRoundedRect(-width/2 + 20, 160, width - 40, 80, 10)
      .lineStyle(2, 0x3498db)
      .strokeRoundedRect(-width/2 + 20, 160, width - 40, 80, 10);

    const instructions = this.add.text(0, 200, 
      '🎯 OBJETIVO DEL JUEGO:\n' +
      '• Conecta los cables en el orden correcto\n' +
      '• Calibra los servomotores siguiendo la secuencia\n' +
      '• Completa la reparación en el tiempo límite', {
      fontSize: smallFont,
      fontFamily: 'Arial',
      fill: '#74b9ff',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5);

    container.add([description, statusBg, statusText, instructionsBg, instructions]);
  }

  createAIContent(container, width, isMobile) {
    const fontSize = isMobile ? '14px' : '16px';
    const smallFont = isMobile ? '12px' : '14px';

    const description = this.add.text(0, 0, 
      '🧠 El sistema de inteligencia artificial presenta\n' +
      'errores en el procesamiento de datos y toma de\n' +
      'decisiones. Los algoritmos necesitan recalibración.', {
      fontSize: fontSize,
      fontFamily: 'Arial',
      fill: '#ecf0f1',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    const statusBg = this.add.graphics()
      .fillStyle(0xf39c12, 0.3)
      .fillRoundedRect(-width/2 + 20, 80, width - 40, 60, 10)
      .lineStyle(2, 0xf39c12)
      .strokeRoundedRect(-width/2 + 20, 80, width - 40, 60, 10);

    const statusText = this.add.text(0, 110, 
      '⚠️ ESTADO: INESTABLE\n' +
      '🔧 REPARACIÓN REQUERIDA: Optimización de algoritmos', {
      fontSize: smallFont,
      fontFamily: 'Arial Bold',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const instructionsBg = this.add.graphics()
      .fillStyle(0x9b59b6, 0.2)
      .fillRoundedRect(-width/2 + 20, 160, width - 40, 80, 10)
      .lineStyle(2, 0x9b59b6)
      .strokeRoundedRect(-width/2 + 20, 160, width - 40, 80, 10);

    const instructions = this.add.text(0, 200, 
      '🎯 OBJETIVO DEL JUEGO:\n' +
      '• Responde preguntas de lógica y programación\n' +
      '• Optimiza los algoritmos de decisión\n' +
      '• Restaura la funcionalidad de la IA', {
      fontSize: smallFont,
      fontFamily: 'Arial',
      fill: '#e74c3c',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5);

    container.add([description, statusBg, statusText, instructionsBg, instructions]);
  }

  createMemoryContent(container, width, isMobile) {
    const fontSize = isMobile ? '14px' : '16px';
    const smallFont = isMobile ? '12px' : '14px';

    const description = this.add.text(0, 0, 
      '💾 Los módulos de memoria presentan corrupción\n' +
      'de datos y sectores dañados. La información\n' +
      'crítica del sistema está en riesgo.', {
      fontSize: fontSize,
      fontFamily: 'Arial',
      fill: '#ecf0f1',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    const statusBg = this.add.graphics()
      .fillStyle(0xe67e22, 0.3)
      .fillRoundedRect(-width/2 + 20, 80, width - 40, 60, 10)
      .lineStyle(2, 0xe67e22)
      .strokeRoundedRect(-width/2 + 20, 80, width - 40, 60, 10);

    const statusText = this.add.text(0, 110, 
      '⚠️ ESTADO: DEGRADADO\n' +
      '🔧 REPARACIÓN REQUERIDA: Recuperación de datos', {
      fontSize: smallFont,
      fontFamily: 'Arial Bold',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const instructionsBg = this.add.graphics()
      .fillStyle(0x1abc9c, 0.2)
      .fillRoundedRect(-width/2 + 20, 160, width - 40, 80, 10)
      .lineStyle(2, 0x1abc9c)
      .strokeRoundedRect(-width/2 + 20, 160, width - 40, 80, 10);

    const instructions = this.add.text(0, 200, 
      '🎯 OBJETIVO DEL JUEGO:\n' +
      '• Memoriza las secuencias de colores\n' +
      '• Reproduce los patrones correctamente\n' +
      '• Restaura la integridad de los datos', {
      fontSize: smallFont,
      fontFamily: 'Arial',
      fill: '#16a085',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5);

    container.add([description, statusBg, statusText, instructionsBg, instructions]);
  }

  createSequenceContent(container, width, isMobile) {
    const fontSize = isMobile ? '14px' : '16px';
    const smallFont = isMobile ? '12px' : '14px';

    const description = this.add.text(0, 0, 
      '⚡ Los sistemas de secuenciación lógica están\n' +
      'desorganizados. Los procesos no siguen el orden\n' +
      'correcto y causan errores en cascada.', {
      fontSize: fontSize,
      fontFamily: 'Arial',
      fill: '#ecf0f1',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5);

    const statusBg = this.add.graphics()
      .fillStyle(0x8e44ad, 0.3)
      .fillRoundedRect(-width/2 + 20, 80, width - 40, 60, 10)
      .lineStyle(2, 0x8e44ad)
      .strokeRoundedRect(-width/2 + 20, 80, width - 40, 60, 10);

    const statusText = this.add.text(0, 110, 
      '⚠️ ESTADO: DESORGANIZADO\n' +
      '🔧 REPARACIÓN REQUERIDA: Reorganización lógica', {
      fontSize: smallFont,
      fontFamily: 'Arial Bold',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const instructionsBg = this.add.graphics()
      .fillStyle(0x2980b9, 0.2)
      .fillRoundedRect(-width/2 + 20, 160, width - 40, 80, 10)
      .lineStyle(2, 0x2980b9)
      .strokeRoundedRect(-width/2 + 20, 160, width - 40, 80, 10);

    const instructions = this.add.text(0, 200, 
      '🎯 OBJETIVO DEL JUEGO:\n' +
      '• Ordena las secuencias numéricas correctamente\n' +
      '• Sigue los patrones lógicos establecidos\n' +
      '• Restaura el orden del sistema', {
      fontSize: smallFont,
      fontFamily: 'Arial',
      fill: '#3498db',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5);

    container.add([description, statusBg, statusText, instructionsBg, instructions]);
  }

  closeModal() {
    if (!this.modalContainer) return;

    // Animación de salida
    this.tweens.add({
      targets: this.modalContainer,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 300,
      ease: 'Power2.easeIn',
      onComplete: () => {
        this.modalContainer.destroy();
        this.modalContainer = null;
        this.currentModal = null;
      }
    });

    // Sonido de cierre
    if (this.sound.get('defense')) {
      this.sound.play('defense', { volume: 0.2 });
    }
  }

  startSystemGame(systemType) {
    // Mapear el tipo de sistema al método correspondiente
    const systemIndex = ['ROBÓTICA', 'IA', 'MEMORIA', 'SECUENCIA'].indexOf(systemType);
    
    switch(systemType) {
      case 'ROBÓTICA':
        this.startRoboticsGame(systemIndex);
        break;
      case 'IA':
        this.startAIGame(systemIndex);
        break;
      case 'MEMORIA':
        this.startMemoryGame(systemIndex);
        break;
      case 'SECUENCIA':
        this.startSequenceGame(systemIndex);
        break;
    }
  }

  createEnhancedBackground() {
    // Crear múltiples capas de fondo con gradientes
    for (let i = 0; i < 5; i++) {
      const bgLayer = this.add.graphics()
        .fillGradientStyle(
          0x0a0a0a,
          0x1a1a2e,
          0x16213e,
          0x0f3460,
          0.3 + (i * 0.1)
        )
        .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

      // Animación sutil de las capas
      this.tweens.add({
        targets: bgLayer,
        alpha: { from: 0.3, to: 0.6 },
        duration: 3000 + (i * 500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Crear efectos de humo
    this.createSmokeEffects();

    // Crear líneas de energía
    this.createEnergyLines();

    // Crear patrones de circuitos
    this.createCircuitPatterns();
  }

  createSmokeEffects() {
    for (let i = 0; i < 8; i++) {
      const smoke = this.add.circle(
        Phaser.Math.Between(0, this.cameras.main.width),
        this.cameras.main.height + 50,
        Phaser.Math.Between(20, 40),
        0x2c3e50,
        0.2
      );

      this.tweens.add({
        targets: smoke,
        y: -100,
        alpha: { from: 0.2, to: 0 },
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        duration: Phaser.Math.Between(8000, 12000),
        delay: i * 1000,
        onComplete: () => {
          smoke.y = this.cameras.main.height + 50;
          smoke.alpha = 0.2;
          smoke.scaleX = 1;
          smoke.scaleY = 1;
          this.createSmokeEffects();
        }
      });
    }
  }

  createEnergyLines() {
    for (let i = 0; i < 6; i++) {
      const line = this.add.graphics()
        .lineStyle(2, 0x74b9ff, 0.4)
        .lineBetween(
          Phaser.Math.Between(0, this.cameras.main.width),
          Phaser.Math.Between(0, this.cameras.main.height),
          Phaser.Math.Between(0, this.cameras.main.width),
          Phaser.Math.Between(0, this.cameras.main.height)
        );

      this.tweens.add({
        targets: line,
        alpha: { from: 0.1, to: 0.6 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createCircuitPatterns() {
    // Crear patrones de circuitos en el fondo
    for (let i = 0; i < 15; i++) {
      const pattern = this.add.graphics();
      const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
      const y = Phaser.Math.Between(50, this.cameras.main.height - 50);

      // Dibujar patrón de circuito
      pattern
        .lineStyle(1, 0x34495e, 0.3)
        .strokeRect(x, y, 30, 20)
        .strokeRect(x + 5, y + 5, 20, 10)
        .strokeCircle(x + 15, y + 10, 3);

      if (Math.random() > 0.5) {
        this.tweens.add({
          targets: pattern,
          alpha: { from: 0.3, to: 0.7 },
          duration: Phaser.Math.Between(3000, 6000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }

    // Efecto de pulso general
    const pulseOverlay = this.add.graphics()
      .fillStyle(0x74b9ff, 0.05)
      .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    this.tweens.add({
      targets: pulseOverlay,
      alpha: { from: 0.02, to: 0.08 },
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createFloatingParticles() {
    // Crear partículas flotantes
    for (let i = 0; i < 30; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.cameras.main.width),
        Phaser.Math.Between(0, this.cameras.main.height),
        Phaser.Math.Between(1, 3),
        Phaser.Math.RND.pick([0x74b9ff, 0x00d4ff, 0x3498db]),
        0.6
      );

      // Movimiento flotante
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-100, 100),
        y: particle.y + Phaser.Math.Between(-80, 80),
        duration: Phaser.Math.Between(8000, 12000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Parpadeo
      this.tweens.add({
        targets: particle,
        alpha: { from: 0.3, to: 0.8 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Rotación ocasional
      if (Math.random() > 0.7) {
        this.tweens.add({
          targets: particle,
          rotation: Math.PI * 2,
          duration: Phaser.Math.Between(10000, 15000),
          repeat: -1,
          ease: 'Linear'
        });
      }
    }
  }

  createDynamicTextures() {
    // Crear textura para cuadros de circuitos
    this.add.graphics()
      .fillStyle(0x16213e)
      .fillRoundedRect(0, 0, 220, 140, 10)
      .lineStyle(2, 0x0f3460)
      .strokeRoundedRect(0, 0, 220, 140, 10)
      .generateTexture('circuit-box', 220, 140)
      .destroy();

    // Crear textura para botón rojo
    this.add.graphics()
      .fillStyle(0xff4757)
      .fillRoundedRect(0, 0, 80, 28, 14)
      .lineStyle(2, 0xff3742)
      .strokeRoundedRect(0, 0, 80, 28, 14)
      .generateTexture('red-button', 80, 28)
      .destroy();

    // Crear textura para botón rojo hover
    this.add.graphics()
      .fillStyle(0xff6b7d)
      .fillRoundedRect(0, 0, 80, 28, 14)
      .lineStyle(2, 0xff5722)
      .strokeRoundedRect(0, 0, 80, 28, 14)
      .generateTexture('red-button-hover', 80, 28)
      .destroy();
  }

  createCircuitBoxes() {
    // Inicializar array de cuadros de circuitos
    this.circuitBoxes = [];

    // Ajustar posiciones según el dispositivo - centrados más hacia el medio
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const boxes = this.isMobile ? [
      { title: 'ROBÓTICA', subtitle: 'Sistemas de movimiento', x: centerX - 120, y: centerY - 60, icon: '🤖' },
      { title: 'IA', subtitle: 'Inteligencia artificial', x: centerX + 120, y: centerY - 60, icon: '🧠' },
      { title: 'MEMORIA', subtitle: 'Almacenamiento de datos', x: centerX - 120, y: centerY + 80, icon: '💾' },
      { title: 'SECUENCIA', subtitle: 'Lógica de programación', x: centerX + 120, y: centerY + 80, icon: '⚡' }
    ] : [
      { title: 'ROBÓTICA', subtitle: 'Sistemas de movimiento', x: centerX - 150, y: centerY - 80, icon: '🤖' },
      { title: 'IA', subtitle: 'Inteligencia artificial', x: centerX + 150, y: centerY - 80, icon: '🧠' },
      { title: 'MEMORIA', subtitle: 'Almacenamiento de datos', x: centerX - 150, y: centerY + 100, icon: '💾' },
      { title: 'SECUENCIA', subtitle: 'Lógica de programación', x: centerX + 150, y: centerY + 100, icon: '⚡' }
    ];

    boxes.forEach((boxData, index) => {
      this.createCircuitBox(boxData, index);
    });
  }

  createCircuitBox(boxData, index) {
    // Crear contenedor principal
    const container = this.add.container(boxData.x, boxData.y);

    // Ajustar tamaños para móviles
    const boxWidth = this.isMobile ? 180 : 220;
    const boxHeight = this.isMobile ? 120 : 140;
    const boxRadius = this.isMobile ? 12 : 15;

    // Fondo del cuadro con gradiente mejorado
    const boxBg = this.add.graphics()
      .fillGradientStyle(0x1e3c72, 0x2a5298, 0x1e3c72, 0x2a5298, 1)
      .fillRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, boxRadius)
      .lineStyle(3, 0x74b9ff, 0.8)
      .strokeRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, boxRadius)
      .setInteractive(new Phaser.Geom.Rectangle(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight), Phaser.Geom.Rectangle.Contains);

    // Efecto de brillo
    const glowEffect = this.add.graphics()
      .lineStyle(4, 0x00d4ff, 0.6)
      .strokeRoundedRect(-boxWidth/2-5, -boxHeight/2-5, boxWidth+10, boxHeight+10, boxRadius+3);

    // Animación del brillo
    this.tweens.add({
      targets: glowEffect,
      alpha: { from: 0.3, to: 0.8 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Ajustar posición y tamaño del icono para móviles
    const iconX = this.isMobile ? -60 : -70;
    const iconY = this.isMobile ? -30 : -35;
    const iconRadius = this.isMobile ? 24 : 28;
    const iconSize = this.isMobile ? '28px' : '32px';

    // Fondo del icono
    const iconBg = this.add.graphics()
      .fillGradientStyle(0x2c3e50, 0x34495e, 0x2c3e50, 0x34495e, 1)
      .fillCircle(iconX, iconY, iconRadius)
      .lineStyle(3, 0x74b9ff, 0.9)
      .strokeCircle(iconX, iconY, iconRadius);

    // Animación del fondo del icono
    this.tweens.add({
      targets: iconBg,
      scaleX: { from: 1, to: 1.1 },
      scaleY: { from: 1, to: 1.1 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const icon = this.add.text(iconX, iconY, boxData.icon, {
      fontSize: iconSize,
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);

    // Animación del icono
    this.tweens.add({
      targets: icon,
      rotation: { from: -0.1, to: 0.1 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Ajustar posiciones y tamaños de texto para móviles
    const titleSize = this.isMobile ? '18px' : '22px';
    const titleX = this.isMobile ? -79 : -89;
    const titleY = this.isMobile ? -84 : -94;

    // Sombra del título
    const titleShadow = this.add.text(titleX+1, titleY+1, boxData.title, {
      fontSize: titleSize,
      fontFamily: 'Arial Black',
      fill: '#2c3e50',
      stroke: '#1a252f',
      strokeThickness: 2
    });

    const title = this.add.text(titleX, titleY, boxData.title, {
      fontSize: titleSize,
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 2
    });

    // Animación del título
    this.tweens.add({
      targets: title,
      alpha: { from: 1, to: 0.8 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Ajustar subtítulo para móviles
    const subtitleSize = this.isMobile ? '12px' : '14px';
    const subtitleX = this.isMobile ? -80 : -90;
    const subtitleY = this.isMobile ? 5 : 8;

    // Subtítulo
    const subtitle = this.add.text(subtitleX, subtitleY, boxData.subtitle, {
      fontSize: subtitleSize,
      fontFamily: 'Arial',
      fill: '#ecf0f1',
      fontStyle: 'italic',
      stroke: '#2c3e50',
      strokeThickness: 1
    });

    // Ajustar fondo del estado para móviles
    const statusWidth = this.isMobile ? 100 : 120;
    const statusHeight = this.isMobile ? 20 : 22;
    const statusX = this.isMobile ? -85 : -95;
    const statusY = this.isMobile ? 30 : 35;

    // Fondo del estado
    const statusBg = this.add.graphics()
      .fillGradientStyle(0xe74c3c, 0xc0392b, 0xe74c3c, 0xc0392b, 0.3)
      .fillRoundedRect(statusX, statusY, statusWidth, statusHeight, 11)
      .lineStyle(2, 0xe74c3c, 0.9)
      .strokeRoundedRect(statusX, statusY, statusWidth, statusHeight, 11);

    // Animación del fondo del estado
    this.tweens.add({
      targets: statusBg,
      alpha: { from: 0.8, to: 0.4 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Ajustar texto del estado para móviles
    const statusTextSize = this.isMobile ? '10px' : '11px';
    const statusTextX = this.isMobile ? -35 : -35;
    const statusTextY = this.isMobile ? 40 : 46;

    const status = this.add.text(statusTextX, statusTextY, 'ESTADO: DAÑADO', {
      fontSize: statusTextSize,
      fontFamily: 'Arial Bold',
      fill: '#ffffff',
      stroke: '#c0392b',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Variables para la barra de progreso (solo para IA)
    let progressBar = null;
    let progressFill = null;
    let progressText = null;

    if (boxData.title === 'IA') {
      // Fondo decorativo principal con múltiples capas
      const progressMainBg = this.add.graphics()
        .fillGradientStyle(0x1a252f, 0x2c3e50, 0x34495e, 0x2c3e50, 0.95)
        .fillRoundedRect(-100, 55, 140, 30, 15)
        .lineStyle(3, 0x74b9ff, 0.9)
        .strokeRoundedRect(-100, 55, 140, 30, 15);

      // Segundo fondo con efecto de profundidad
      const progressBg = this.add.graphics()
        .fillGradientStyle(0x2c3e50, 0x34495e, 0x2c3e50, 0x34495e, 0.9)
        .fillRoundedRect(-95, 58, 130, 24, 12)
        .lineStyle(2, 0x00d4ff, 0.7)
        .strokeRoundedRect(-95, 58, 130, 24, 12);

      // Barra de progreso de fondo con textura
      progressBar = this.add.graphics()
        .fillGradientStyle(0x0f1419, 0x1a252f, 0x2c3e50, 0x1a252f, 1)
        .fillRoundedRect(-90, 62, 120, 16, 8)
        .lineStyle(2, 0x34495e, 0.9)
        .strokeRoundedRect(-90, 62, 120, 16, 8);

      // Relleno de la barra con gradiente animado
      progressFill = this.add.graphics()
        .fillGradientStyle(0x00d4ff, 0x74b9ff, 0x3498db, 0x00cec9, 1)
        .fillRoundedRect(-90, 62, 0, 16, 8);

      // Efecto de brillo principal
      const progressGlow = this.add.graphics()
        .lineStyle(4, 0x00d4ff, 0.8)
        .strokeRoundedRect(-102, 53, 144, 34, 17);

      // Efecto de brillo secundario
      const progressGlow2 = this.add.graphics()
        .lineStyle(2, 0x74b9ff, 0.6)
        .strokeRoundedRect(-97, 56, 134, 28, 14);

      // Partículas flotantes alrededor de la barra
      for (let i = 0; i < 8; i++) {
        const particle = this.add.circle(
          -90 + (i * 15) + Phaser.Math.Between(-5, 5),
          70 + Phaser.Math.Between(-8, 8),
          Phaser.Math.Between(1, 2),
          Phaser.Math.RND.pick([0x00d4ff, 0x74b9ff, 0x3498db]),
          0.7
        );

        // Animación de las partículas
        this.tweens.add({
          targets: particle,
          y: particle.y + Phaser.Math.Between(-10, 10),
          alpha: { from: 0.3, to: 0.9 },
          duration: Phaser.Math.Between(2000, 4000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: i * 200
        });

        container.add(particle);
      }

      // Animación del brillo principal
      this.tweens.add({
        targets: progressGlow,
        alpha: { from: 0.3, to: 0.9 },
        scaleX: { from: 0.98, to: 1.02 },
        scaleY: { from: 0.98, to: 1.02 },
        duration: 2500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Animación del brillo secundario
      this.tweens.add({
        targets: progressGlow2,
        alpha: { from: 0.4, to: 0.8 },
        duration: 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: 500
      });

      // Texto de progreso con efectos mejorados
      progressText = this.add.text(-30, 70, '0%', {
        fontSize: '14px',
        fontFamily: 'Arial Black',
        fill: '#ffffff',
        stroke: '#2c3e50',
        strokeThickness: 3,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
          blur: 4,
          stroke: true,
          fill: true
        }
      }).setOrigin(0.5);

      // Animación del texto
      this.tweens.add({
        targets: progressText,
        scaleX: { from: 1, to: 1.05 },
        scaleY: { from: 1, to: 1.05 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Etiqueta "PROGRESO IA" mejorada
      const progressLabel = this.add.text(-95, 45, '⚡ PROGRESO IA ⚡', {
        fontSize: '11px',
        fontFamily: 'Arial Black',
        fill: '#00d4ff',
        stroke: '#2c3e50',
        strokeThickness: 2,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#000000',
          blur: 2,
          stroke: true,
          fill: true
        }
      });

      // Animación de la etiqueta
      this.tweens.add({
        targets: progressLabel,
        alpha: { from: 0.8, to: 1 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Indicadores de estado en los extremos
      const leftIndicator = this.add.circle(-85, 70, 3, 0x00d4ff, 0.8);
      const rightIndicator = this.add.circle(25, 70, 3, 0xe74c3c, 0.8);

      // Animación de los indicadores
      this.tweens.add({
        targets: [leftIndicator, rightIndicator],
        scaleX: { from: 1, to: 1.3 },
        scaleY: { from: 1, to: 1.3 },
        alpha: { from: 0.6, to: 1 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Agregar todos los elementos adicionales al contenedor
      container.add([
        progressMainBg, progressBg, progressGlow, progressGlow2,
        progressLabel, leftIndicator, rightIndicator
      ]);
    }

    // Botón de reparación con fondo
    const repairButtonBg = this.add.graphics()
      .fillGradientStyle(0xe74c3c, 0xc0392b, 0xe74c3c, 0xc0392b, 1)
      .fillRoundedRect(25, 35, 80, 30, 15)
      .lineStyle(2, 0xa93226)
      .strokeRoundedRect(25, 35, 80, 30, 15)
      .setInteractive(new Phaser.Geom.Rectangle(25, 35, 80, 30), Phaser.Geom.Rectangle.Contains, { useHandCursor: true });

    const buttonText = this.add.text(65, 50, 'REPARAR', {
      fontSize: '12px',
      fontFamily: 'Arial Bold',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Agregar todos los elementos al contenedor
    const elementsToAdd = [boxBg, glowEffect, iconBg, icon, titleShadow, title, subtitle, statusBg, status, repairButtonBg, buttonText];
    if (progressBar) elementsToAdd.push(progressBar, progressFill, progressText);
    container.add(elementsToAdd);

    // Guardar referencias para poder modificarlas después
    this.circuitBoxes[index] = {
      container: container,
      boxBg: boxBg,
      glowEffect: glowEffect,
      iconBg: iconBg,
      iconText: icon,
      titleText: title,
      subtitleText: subtitle,
      statusBg: statusBg,
      statusText: status,
      repairButton: { container: repairButtonBg, text: buttonText },
      progressBar: progressBar,
      progressFill: progressFill,
      progressText: progressText
    };

    // Efectos interactivos del cuadro principal
    boxBg.on('pointerover', () => {
      if (!this.isMobile) {
        this.tweens.add({
          targets: container,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 200,
          ease: 'Power2'
        });
        glowEffect.setAlpha(0.6);
      }
    });

    boxBg.on('pointerout', () => {
      if (!this.isMobile) {
        this.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Power2'
        });
        glowEffect.setAlpha(0.3);
      }
    });

    // Efectos interactivos del botón
    repairButtonBg.on('pointerover', () => {
      if (!this.isMobile) {
        this.tweens.add({
          targets: [repairButtonBg, buttonText],
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 150,
          ease: 'Power2'
        });
      }
    });

    repairButtonBg.on('pointerout', () => {
      if (!this.isMobile) {
        this.tweens.add({
          targets: [repairButtonBg, buttonText],
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: 'Power2'
        });
      }
    });

    // Mejorar eventos táctiles para móviles
    repairButtonBg.on('pointerdown', (pointer, localX, localY, event) => {
      // Prevenir propagación en móviles para evitar doble toque
      if (this.isMobile) {
        event.stopPropagation();
      }

      // Feedback visual inmediato para móviles
      this.tweens.add({
        targets: [repairButtonBg, buttonText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        ease: 'Power2'
      });

      this.handleCircuitRepair(boxData.title, index);
    });

    // Agregar soporte para eventos táctiles específicos en móviles
    if (this.isMobile) {
      repairButtonBg.on('pointerup', () => {
        this.tweens.add({
          targets: [repairButtonBg, buttonText],
          scaleX: 1,
          scaleY: 1,
          duration: 100,
          ease: 'Power2'
        });
      });
    }

    // Animación de entrada del contenedor
    container.setAlpha(0);
    container.setScale(0.5);
    container.setRotation(0.1);

    this.tweens.add({
      targets: container,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      duration: 800,
      delay: index * 300,
      ease: 'Elastic.easeOut'
    });
  }

  createHoverParticles(x, y) {
    // Crear partículas de hover
    for (let i = 0; i < 5; i++) {
      const particle = this.add.circle(
        x + Phaser.Math.Between(-50, 50),
        y + Phaser.Math.Between(-30, 30),
        Phaser.Math.Between(2, 4),
        0x74b9ff,
        0.8
      );

      this.tweens.add({
        targets: particle,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        y: particle.y - 30,
        duration: 1000,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  createSparkEffects() {
    // Crear efectos de chispas ocasionales
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
        const y = Phaser.Math.Between(100, this.cameras.main.height - 100);

        for (let i = 0; i < 8; i++) {
          const spark = this.add.circle(x, y, 2, 0xffd700, 1);

          this.tweens.add({
            targets: spark,
            x: x + Phaser.Math.Between(-60, 60),
            y: y + Phaser.Math.Between(-60, 60),
            alpha: 0,
            duration: 800,
            ease: 'Power2.easeOut',
            onComplete: () => spark.destroy()
          });
        }
      },
      loop: true
    });
  }

  handleCircuitRepair(circuitType, index) {
    const circuitBox = this.circuitBoxes[index];

    // Crear partículas de hover en la posición del clic
    this.createHoverParticles(circuitBox.container.x, circuitBox.container.y);

    // Obtener datos del sistema para el modal
    const systemData = {
      'ROBÓTICA': { subtitle: 'Sistemas de movimiento', icon: '🤖' },
      'IA': { subtitle: 'Inteligencia artificial', icon: '🧠' },
      'MEMORIA': { subtitle: 'Almacenamiento de datos', icon: '💾' },
      'SECUENCIA': { subtitle: 'Lógica de programación', icon: '⚡' }
    };

    // Abrir modal del sistema correspondiente
    this.createModal(circuitType, systemData[circuitType]);
  }

  startRoboticsGame(index) {
    // Juego de robótica: hacer clic en secuencia
    const circuitBox = this.circuitBoxes[index];
    let clickCount = 0;
    const maxClicks = 5;

    circuitBox.statusText.setText('REPARANDO...');
    circuitBox.statusBg.clear()
      .fillGradientStyle(0xf39c12, 0xe67e22, 0xf39c12, 0xe67e22, 0.3)
      .fillRoundedRect(-95, 35, 120, 22, 11)
      .lineStyle(2, 0xf39c12, 0.9)
      .strokeRoundedRect(-95, 35, 120, 22, 11);

    const clickHandler = () => {
      clickCount++;

      // Efecto visual de clic
      this.tweens.add({
        targets: circuitBox.container,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        yoyo: true,
        ease: 'Power2'
      });

      if (clickCount >= maxClicks) {
        this.completeCircuitRepair('ROBÓTICA', index);
        circuitBox.repairButton.container.off('pointerdown', clickHandler);
      }
    };

    circuitBox.repairButton.container.on('pointerdown', clickHandler);
  }

  startAIGame(index) {
    // Juego de IA: barra de progreso automática
    const circuitBox = this.circuitBoxes[index];
    let progress = 0;

    circuitBox.statusText.setText('PROCESANDO...');
    circuitBox.statusBg.clear()
      .fillGradientStyle(0xf39c12, 0xe67e22, 0xf39c12, 0xe67e22, 0.3)
      .fillRoundedRect(-95, 35, 120, 22, 11)
      .lineStyle(2, 0xf39c12, 0.9)
      .strokeRoundedRect(-95, 35, 120, 22, 11);

    const progressTimer = this.time.addEvent({
      delay: 100,
      callback: () => {
        progress += 2;
        const width = (progress / 100) * 120;

        circuitBox.progressFill.clear()
          .fillStyle(0x00d4ff, 1)
          .fillRoundedRect(-90, 60, width, 10, 5);

        circuitBox.progressText.setText(progress + '%');

        if (progress >= 100) {
          this.completeCircuitRepair('IA', index);
          progressTimer.destroy();
        }
      },
      loop: true
    });
  }

  startMemoryGame(index) {
    // Juego de memoria: secuencia de colores con diseño futurista
    const circuitBox = this.circuitBoxes[index];
    const colors = [0xff3366, 0x3366ff, 0x00ffcc, 0x66ff33];
    const colorNames = ['NEURAL-R', 'NEURAL-B', 'NEURAL-C', 'NEURAL-G'];
    const sequence = [];
    const userSequence = [];
    let currentStep = 0;
    let showingSequence = false;

    // Generar secuencia aleatoria
    for (let i = 0; i < 4; i++) {
      sequence.push(Phaser.Math.Between(0, 3));
    }

    circuitBox.statusText.setText('MATRIZ NEURAL...');
    circuitBox.statusBg.clear()
      .fillGradientStyle(0x0a1428, 0x1a2332, 0x0f1b2d, 0x243447, 0.95)
      .fillRoundedRect(-95, 35, 120, 22, 11)
      .lineStyle(2, 0x00ccff, 0.9)
      .strokeRoundedRect(-95, 35, 120, 22, 11);

    // Crear botones de colores con diseño futurista mejorado
    const colorButtons = [];
    for (let i = 0; i < 4; i++) {
      const xPos = circuitBox.container.x - 60 + (i * 40);
      const yPos = circuitBox.container.y + 90;
      
      // Base hexagonal del botón
      const hexBase = this.add.graphics()
        .fillStyle(0x1a1a2e, 0.9)
        .fillCircle(xPos, yPos, 20)
        .lineStyle(2, colors[i], 0.8)
        .strokeCircle(xPos, yPos, 20);
      
      // Anillo exterior pulsante
      const outerRing = this.add.graphics()
        .lineStyle(3, colors[i], 0.6)
        .strokeCircle(xPos, yPos, 25);
      
      // Núcleo interno brillante
      const innerCore = this.add.graphics()
        .fillStyle(colors[i], 0.8)
        .fillCircle(xPos, yPos, 12)
        .lineStyle(1, 0xffffff, 0.9)
        .strokeCircle(xPos, yPos, 12);
      
      // Patrón de circuito interno
      const circuitPattern = this.add.graphics()
        .lineStyle(1, 0xffffff, 0.4)
        .moveTo(xPos - 8, yPos)
        .lineTo(xPos + 8, yPos)
        .moveTo(xPos, yPos - 8)
        .lineTo(xPos, yPos + 8)
        .moveTo(xPos - 6, yPos - 6)
        .lineTo(xPos + 6, yPos + 6)
        .moveTo(xPos - 6, yPos + 6)
        .lineTo(xPos + 6, yPos - 6);
      
      // Indicador LED
      const ledIndicator = this.add.graphics()
        .fillStyle(colors[i], 0.3)
        .fillCircle(xPos, yPos - 30, 3)
        .lineStyle(1, colors[i], 0.8)
        .strokeCircle(xPos, yPos - 30, 3);
      
      // Etiqueta del botón
      const buttonLabel = this.add.text(xPos, yPos + 35, colorNames[i], {
        fontSize: '8px',
        fontFamily: 'Courier New, monospace',
        fill: colors[i],
        align: 'center'
      }).setOrigin(0.5);
      
      // Animación de pulsación constante
      this.tweens.add({
        targets: outerRing,
        alpha: { from: 0.3, to: 0.8 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      // Crear contenedor interactivo
      const buttonContainer = this.add.container(0, 0, [hexBase, outerRing, innerCore, circuitPattern, ledIndicator, buttonLabel]);
      const hitArea = new Phaser.Geom.Circle(xPos, yPos, 25);
      buttonContainer.setInteractive(hitArea, Phaser.Geom.Circle.Contains, { useHandCursor: true });
      
      buttonContainer.colorIndex = i;
      buttonContainer.innerCore = innerCore;
      buttonContainer.outerRing = outerRing;
      buttonContainer.ledIndicator = ledIndicator;
      buttonContainer.circuitPattern = circuitPattern;
      colorButtons.push(buttonContainer);

      buttonContainer.on('pointerdown', () => {
        if (showingSequence) return;

        // Efecto visual mejorado al hacer clic
        this.tweens.add({
          targets: innerCore,
          scaleX: 1.4,
          scaleY: 1.4,
          alpha: 1,
          duration: 150,
          yoyo: true,
          ease: 'Power2.easeOut'
        });
        
        // Efecto en el anillo exterior
        this.tweens.add({
          targets: outerRing,
          scaleX: 1.2,
          scaleY: 1.2,
          alpha: 1,
          duration: 150,
          yoyo: true,
          ease: 'Power2.easeOut'
        });
        
        // Activar LED
        this.tweens.add({
          targets: ledIndicator,
          alpha: 1,
          scaleX: 1.5,
          scaleY: 1.5,
          duration: 200,
          yoyo: true
        });
        
        // Partículas de energía
        this.createMemoryParticles(xPos, yPos, colors[i]);

        userSequence.push(i);

        if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
          // Error - reiniciar con feedback mejorado
          circuitBox.statusText.setText('ERROR NEURAL');
          circuitBox.statusText.setColor('#ff3366');
          userSequence.length = 0;
          
          // Efecto de error en todos los botones
          colorButtons.forEach(btn => {
            this.tweens.add({
              targets: btn.innerCore,
              alpha: 0.3,
              duration: 200
            });
          });
          
          this.time.delayedCall(1000, () => {
            circuitBox.statusText.setText('MATRIZ NEURAL...');
            circuitBox.statusText.setColor('#00ccff');
            this.showSequence();
          });
        } else if (userSequence.length === sequence.length) {
          // Completado con celebración
          circuitBox.statusText.setText('SINCRONIZADO');
          circuitBox.statusText.setColor('#66ff33');
          
          // Efecto de éxito en todos los botones
          colorButtons.forEach((btn, idx) => {
            this.time.delayedCall(idx * 100, () => {
              this.tweens.add({
                targets: [btn.innerCore, btn.outerRing],
                scaleX: 1.3,
                scaleY: 1.3,
                alpha: 1,
                duration: 300,
                yoyo: true
              });
            });
          });
          
          this.time.delayedCall(1500, () => {
            colorButtons.forEach(btn => btn.destroy());
            this.completeCircuitRepair('MEMORIA', index);
          });
        }
      });
    }

    this.showSequence = () => {
      showingSequence = true;
      userSequence.length = 0;
      let step = 0;

      const showStep = () => {
        if (step < sequence.length) {
          const buttonIndex = sequence[step];
          const button = colorButtons[buttonIndex];

          // Animación de demostración mejorada
          this.tweens.add({
            targets: button.innerCore,
            alpha: 1,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 400,
            yoyo: true,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: button.outerRing,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 1,
            duration: 400,
            yoyo: true,
            ease: 'Power2.easeOut'
          });
          
          // Activar LED durante demostración
          this.tweens.add({
            targets: button.ledIndicator,
            alpha: 1,
            scaleX: 2,
            scaleY: 2,
            duration: 400,
            yoyo: true
          });
          
          // Pulso en el patrón de circuito
          this.tweens.add({
            targets: button.circuitPattern,
            alpha: 1,
            duration: 400,
            yoyo: true
          });

          this.time.delayedCall(500, () => {
            step++;
            if (step < sequence.length) {
              this.time.delayedCall(300, showStep);
            } else {
              showingSequence = false;
              circuitBox.statusText.setText('REPLICA PATRÓN');
              circuitBox.statusText.setColor('#00d4ff');
            }
          });
        }
      };

      this.time.delayedCall(500, showStep);
    };

    this.showSequence();
  }

  startSequenceGame(index) {
    // Juego de secuencia: ordenar números
    const circuitBox = this.circuitBoxes[index];
    const numbers = [3, 1, 4, 2];
    const correctOrder = [1, 2, 3, 4];
    let currentOrder = [...numbers];

    circuitBox.statusText.setText('ORDENA 1-4');
    circuitBox.statusBg.clear()
      .fillGradientStyle(0xf39c12, 0xe67e22, 0xf39c12, 0xe67e22, 0.3)
      .fillRoundedRect(-95, 35, 120, 22, 11)
      .lineStyle(2, 0xf39c12, 0.9)
      .strokeRoundedRect(-95, 35, 120, 22, 11);

    // Crear botones de números
    const numberButtons = [];
    for (let i = 0; i < 4; i++) {
      const button = this.add.circle(
        circuitBox.container.x - 60 + (i * 40),
        circuitBox.container.y + 90,
        18,
        0x3498db,
        0.8
      ).setInteractive({ useHandCursor: true });

      const numberText = this.add.text(
        circuitBox.container.x - 60 + (i * 40),
        circuitBox.container.y + 90,
        currentOrder[i].toString(),
        {
          fontSize: '16px',
          fontFamily: 'Arial Bold',
          fill: '#ffffff'
        }
      ).setOrigin(0.5);

      button.numberValue = currentOrder[i];
      button.position = i;
      button.textObj = numberText;
      numberButtons.push(button);

      button.on('pointerdown', () => {
        // Intercambiar con el siguiente
        const nextIndex = (i + 1) % 4;
        const temp = currentOrder[i];
        currentOrder[i] = currentOrder[nextIndex];
        currentOrder[nextIndex] = temp;

        // Actualizar textos
        numberButtons[i].textObj.setText(currentOrder[i].toString());
        numberButtons[nextIndex].textObj.setText(currentOrder[nextIndex].toString());

        // Efecto visual
        this.tweens.add({
          targets: [button, numberButtons[nextIndex]],
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 100,
          yoyo: true
        });

        // Verificar si está correcto
        if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
          numberButtons.forEach(btn => {
            btn.destroy();
            btn.textObj.destroy();
          });
          this.completeCircuitRepair('SECUENCIA', index);
        }
      });
    }
  }

  completeCircuitRepair(circuitType, index) {
    const circuitBox = this.circuitBoxes[index];

    // Cambiar estado a reparado
    circuitBox.statusText.setText('REPARADO');
    circuitBox.statusBg.clear()
      .fillGradientStyle(0x27ae60, 0x2ecc71, 0x27ae60, 0x2ecc71, 0.3)
      .fillRoundedRect(-95, 35, 120, 22, 11)
      .lineStyle(2, 0x27ae60, 0.9)
      .strokeRoundedRect(-95, 35, 120, 22, 11);

    // Cambiar color del brillo
    circuitBox.glowEffect.clear()
      .lineStyle(4, 0x00ff88, 0.8)
      .strokeRoundedRect(-115, -75, 230, 150, 18);

    // Efecto de éxito
    this.tweens.add({
      targets: circuitBox.container,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 300,
      yoyo: true,
      ease: 'Power2'
    });

    // Partículas de éxito
    for (let i = 0; i < 10; i++) {
      const particle = this.add.circle(
        circuitBox.container.x + Phaser.Math.Between(-50, 50),
        circuitBox.container.y + Phaser.Math.Between(-50, 50),
        Phaser.Math.Between(3, 6),
        0x00ff88,
        1
      );

      this.tweens.add({
        targets: particle,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        y: particle.y - 50,
        duration: 1500,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }

    // Deshabilitar botón
    circuitBox.repairButton.container.removeInteractive();
    circuitBox.repairButton.container.setAlpha(0.5);
    circuitBox.repairButton.text.setAlpha(0.5);

    // Actualizar estado de reparación
    this.updateRepairStatus(circuitType, true);
  }

  initializeAIProgress() {
    // Sistema de progreso para IA ya implementado en startAIGame
  }

  initializeCompletionSystem() {
    // Inicializar estado de reparación
    this.repairStatus = {
      robotics: false,
      ai: false,
      memory: false,
      sequence: false
    };

    // Flag para evitar múltiples verificaciones
    this.completionChecked = false;
  }

  checkAllCircuitsRepaired() {
    // Evitar múltiples verificaciones
    if (this.completionChecked) return;

    const allRepaired = Object.values(this.repairStatus).every(status => status === true);

    if (allRepaired) {
      this.completionChecked = true;
      this.showCompletionMessage();
    }
  }

  updateRepairStatus(circuitType, isRepaired) {
    // Actualizar estado según el tipo de circuito
    switch(circuitType) {
      case 'ROBÓTICA':
        this.repairStatus.robotics = isRepaired;
        break;
      case 'IA':
        this.repairStatus.ai = isRepaired;
        break;
      case 'MEMORIA':
        this.repairStatus.memory = isRepaired;
        break;
      case 'SECUENCIA':
        this.repairStatus.sequence = isRepaired;
        break;
    }

    // Verificar si todos están reparados
    this.checkAllCircuitsRepaired();
  }

  showCompletionMessage() {
    // Crear overlay de fondo
    const overlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0)
      .setOrigin(0, 0)
      .setDepth(2000)
      .setInteractive();

    this.tweens.add({
      targets: overlay,
      alpha: { from: 0, to: 0.95 },
      duration: 800,
      ease: 'Power2.easeInOut'
    });

    // Crear partículas de celebración
    this.createCelebrationParticles();

    // Crear caja de mensaje con gradiente mejorado
    const messageBox = this.add.graphics()
      .fillGradientStyle(0x1e3c72, 0x2a5298, 0x27ae60, 0x2ecc71, 1)
      .fillRoundedRect(this.cameras.main.centerX - 400, this.cameras.main.centerY - 250, 800, 500, 25)
      .lineStyle(6, 0x00d4ff, 0.9)
      .strokeRoundedRect(this.cameras.main.centerX - 400, this.cameras.main.centerY - 250, 800, 500, 25)
      .setDepth(2001);

    // Efecto de brillo para la caja
    const glowBox = this.add.graphics()
      .lineStyle(8, 0x74b9ff, 0.4)
      .strokeRoundedRect(this.cameras.main.centerX - 410, this.cameras.main.centerY - 260, 820, 520, 30)
      .setDepth(2000);

    this.tweens.add({
      targets: glowBox,
      alpha: { from: 0.2, to: 0.8 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Título con sombra
    const titleShadow = this.add.text(this.cameras.main.centerX + 3, this.cameras.main.centerY - 153, '¡FELICITACIONES!', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: '#2c3e50',
      align: 'center'
    }).setOrigin(0.5).setDepth(2002);

    const title = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 150, '¡FELICITACIONES!', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5).setDepth(2003);

    // Mensaje principal
    const mainMessage = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 80,
      'Has reactivado todas las pruebas\nde la central superior', {
      fontSize: '28px',
      fontFamily: 'Arial Bold',
      fill: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 2,
      align: 'center'
    }).setOrigin(0.5).setDepth(2002);

    // Mensaje secundario
    const secondaryMessage = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 10,
      'Todos los sistemas están funcionando correctamente\ny listos para la siguiente fase', {
      fontSize: '20px',
      fontFamily: 'Arial',
      fill: '#ecf0f1',
      stroke: '#34495e',
      strokeThickness: 1,
      align: 'center'
    }).setOrigin(0.5).setDepth(2002);

    // Iconos de éxito
    const successIcon1 = this.add.text(this.cameras.main.centerX - 120, this.cameras.main.centerY + 60, '✅', {
      fontSize: '40px'
    }).setOrigin(0.5).setDepth(2002);

    const successIcon2 = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 60, '🎉', {
      fontSize: '40px'
    }).setOrigin(0.5).setDepth(2002);

    const successIcon3 = this.add.text(this.cameras.main.centerX + 120, this.cameras.main.centerY + 60, '✅', {
      fontSize: '40px'
    }).setOrigin(0.5).setDepth(2002);

    // Crear estrellas decorativas
    this.createDecorativeStars();

    // Botón de continuar con gradiente
    const continueButtonBg = this.add.graphics()
      .fillGradientStyle(0x3498db, 0x2980b9, 0x3498db, 0x2980b9, 1)
      .fillRoundedRect(this.cameras.main.centerX - 120, this.cameras.main.centerY + 140, 240, 60, 30)
      .lineStyle(4, 0x74b9ff, 0.8)
      .strokeRoundedRect(this.cameras.main.centerX - 120, this.cameras.main.centerY + 140, 240, 60, 30)
      .setDepth(2001)
      .setInteractive(new Phaser.Geom.Rectangle(this.cameras.main.centerX - 120, this.cameras.main.centerY + 140, 240, 60), Phaser.Geom.Rectangle.Contains, { useHandCursor: true });

    const continueText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'CONTINUAR', {
      fontSize: '22px',
      fontFamily: 'Arial Bold',
      fill: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(2002);

    // Efectos hover del botón
    continueButtonBg.on('pointerover', () => {
      this.tweens.add({
        targets: [continueButtonBg, continueText],
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2'
      });
    });

    continueButtonBg.on('pointerout', () => {
      this.tweens.add({
        targets: [continueButtonBg, continueText],
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      });
    });

    continueButtonBg.on('pointerdown', () => {
      this.transitionToNextScene();
    });

    // Animaciones de entrada
    this.tweens.add({
      targets: messageBox,
      scaleX: { from: 0, to: 1 },
      scaleY: { from: 0, to: 1 },
      rotation: { from: 0.2, to: 0 },
      duration: 800,
      ease: 'Elastic.easeOut'
    });

    this.tweens.add({
      targets: [titleShadow, title],
      alpha: { from: 0, to: 1 },
      y: { from: '+=80', to: '+=0' },
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 1000,
      delay: 400,
      ease: 'Elastic.easeOut'
    });

    this.tweens.add({
      targets: [mainMessage, secondaryMessage],
      alpha: { from: 0, to: 1 },
      y: { from: '+=50', to: '+=0' },
      duration: 800,
      delay: 800,
      ease: 'Power2.easeOut'
    });

    this.tweens.add({
      targets: [successIcon1, successIcon2, successIcon3],
      alpha: { from: 0, to: 1 },
      scaleX: { from: 0, to: 1.5 },
      scaleY: { from: 0, to: 1.5 },
      rotation: { from: Math.PI, to: 0 },
      duration: 800,
      delay: 1200,
      ease: 'Elastic.easeOut',
      stagger: 150
    });

    this.tweens.add({
      targets: [continueButtonBg, continueText],
      alpha: { from: 0, to: 1 },
      y: { from: '+=40', to: '+=0' },
      scaleX: { from: 0.8, to: 1 },
      scaleY: { from: 0.8, to: 1 },
      duration: 600,
      delay: 1800,
      ease: 'Back.easeOut'
    });

    // Animaciones continuas
    this.tweens.add({
      targets: title,
      scaleX: { from: 1, to: 1.05 },
      scaleY: { from: 1, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: [successIcon1, successIcon3],
      scaleX: { from: 1.5, to: 1.7 },
      scaleY: { from: 1.5, to: 1.7 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: successIcon2,
      rotation: { from: 0, to: Math.PI * 2 },
      scaleX: { from: 1.5, to: 1.8 },
      scaleY: { from: 1.5, to: 1.8 },
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });

    // Sonido de éxito
    if (this.sound.get('success')) {
      this.sound.play('success', { volume: 0.7 });
    }

    // Efectos de sonido adicionales
    this.time.delayedCall(800, () => {
      if (this.sound.get('cheer')) {
        this.sound.play('cheer', { volume: 0.5 });
      }
    });

    this.time.delayedCall(1600, () => {
      if (this.sound.get('applause')) {
        this.sound.play('applause', { volume: 0.4 });
      }
    });
  }

  createCelebrationParticles() {
    // Crear partículas de celebración que caen
    for (let i = 0; i < 50; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.cameras.main.width),
        -20,
        Phaser.Math.Between(3, 8),
        Phaser.Math.RND.pick([0xffd700, 0xff6b7d, 0x74b9ff, 0x00d4ff, 0x27ae60])
      ).setDepth(1999);

      this.tweens.add({
        targets: particle,
        y: this.cameras.main.height + 50,
        x: particle.x + Phaser.Math.Between(-100, 100),
        rotation: Math.PI * 4,
        alpha: { from: 1, to: 0 },
        duration: Phaser.Math.Between(3000, 5000),
        delay: Phaser.Math.Between(0, 2000),
        ease: 'Power2.easeIn',
        onComplete: () => particle.destroy()
      });
    }
  }

  createDecorativeStars() {
    // Crear estrellas decorativas alrededor del mensaje
    const starPositions = [
      { x: -300, y: -200 }, { x: 300, y: -200 },
      { x: -350, y: 0 }, { x: 350, y: 0 },
      { x: -300, y: 200 }, { x: 300, y: 200 }
    ];

    starPositions.forEach((pos, index) => {
      const star = this.add.text(
        this.cameras.main.centerX + pos.x,
        this.cameras.main.centerY + pos.y,
        '⭐',
        { fontSize: '30px' }
      ).setOrigin(0.5).setDepth(1998).setAlpha(0);

      this.tweens.add({
        targets: star,
        alpha: { from: 0, to: 1 },
        scaleX: { from: 0, to: 1.2 },
        scaleY: { from: 0, to: 1.2 },
        rotation: Math.PI * 2,
        duration: 1000,
        delay: 2000 + (index * 200),
        ease: 'Elastic.easeOut'
      });

      this.tweens.add({
        targets: star,
        scaleX: { from: 1.2, to: 1.4 },
        scaleY: { from: 1.2, to: 1.4 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  transitionToNextScene() {
    // Crear overlay de transición
    const transitionOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0)
      .setOrigin(0, 0)
      .setDepth(3000);

    this.tweens.add({
      targets: transitionOverlay,
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Power2.easeInOut',
      onComplete: () => {
        this.scene.start('scenaVideo4');
      }
    });

    // Sonido de transición
    if (this.sound.get('defense')) {
      this.sound.play('defense', { volume: 0.4 });
    }
  }

  // Métodos de efectos ambientales
  createAmbientEffects() {
    this.createAmbientParticles();
    this.createAmbientLights();
    this.createEnergyWaves();
  }

  createAmbientParticles() {
    // Crear partículas ambientales flotantes
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.cameras.main.width),
        Phaser.Math.Between(0, this.cameras.main.height),
        Phaser.Math.Between(1, 3),
        Phaser.Math.RND.pick([0x74b9ff, 0x00d4ff, 0x3498db]),
        0.6
      );

      // Movimiento flotante lento
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-200, 200),
        y: particle.y + Phaser.Math.Between(-150, 150),
        alpha: { from: 0.6, to: 0.2 },
        duration: Phaser.Math.Between(8000, 12000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Parpadeo sutil
      this.tweens.add({
        targets: particle,
        alpha: { from: 0.2, to: 0.8 },
        duration: Phaser.Math.Between(4000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createAmbientLights() {
    // Crear luces ambientales pulsantes
    const lightPositions = [
      { x: 100, y: 100 },
      { x: this.cameras.main.width - 100, y: 100 },
      { x: 100, y: this.cameras.main.height - 100 },
      { x: this.cameras.main.width - 100, y: this.cameras.main.height - 100 }
    ];

    lightPositions.forEach((pos, index) => {
      const light = this.add.circle(pos.x, pos.y, 40, 0x74b9ff, 0.1);

      this.tweens.add({
        targets: light,
        alpha: { from: 0.05, to: 0.2 },
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        duration: 3000 + (index * 500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  createEnergyWaves() {
    // Crear ondas de energía periódicas
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const createWave = () => {
      const wave = this.add.circle(centerX, centerY, 5, 0x00d4ff, 0.3);

      this.tweens.add({
        targets: wave,
        scaleX: 20,
        scaleY: 20,
        alpha: 0,
        duration: 4000,
        ease: 'Power2.easeOut',
        onComplete: () => {
          wave.destroy();
        }
      });
    };

    // Crear ondas cada 6 segundos
    this.time.addEvent({
      delay: 6000,
      callback: createWave,
      loop: true
    });

    // Crear primera onda inmediatamente
    createWave();
  }

  createRoboticsGameContent(container, width, isMobile, systemIndex) {
    // Título del juego con efecto de gradiente
    const title = this.add.text(0, -140, '🤖 QUIZ DE ROBÓTICA', {
      fontSize: isMobile ? '20px' : '26px',
      fontFamily: 'Arial Black',
      fill: '#00d4ff',
      align: 'center',
      stroke: '#003d5c',
      strokeThickness: 2
    }).setOrigin(0.5);
    container.add(title);

    // Preguntas y respuestas de robótica
    const questions = [
      {
        question: "¿Cuál es el componente principal que permite el movimiento en un robot?",
        options: ["Sensor", "Actuador", "Procesador", "Batería"],
        correct: 1
      },
      {
        question: "¿Qué tipo de sensor permite a un robot detectar obstáculos?",
        options: ["Giroscopio", "Acelerómetro", "Ultrasonido", "Magnetómetro"],
        correct: 2
      },
      {
        question: "¿Cuál es la función principal de un servomotor en robótica?",
        options: ["Generar energía", "Controlar posición", "Procesar datos", "Emitir sonidos"],
        correct: 1
      }
    ];

    let currentQuestion = 0;
    let correctAnswers = 0;

    // Contenedor de la pregunta con diseño mejorado
    const questionBg = this.add.graphics()
      .fillStyle(0x1a252f, 0.95)
      .fillRoundedRect(-width/2 + 30, -100, width - 60, 80, 15)
      .lineStyle(3, 0x00d4ff, 0.8)
      .strokeRoundedRect(-width/2 + 30, -100, width - 60, 80, 15);
    
    // Efecto de brillo en el borde
    const glowEffect = this.add.graphics()
      .lineStyle(1, 0x74b9ff, 0.4)
      .strokeRoundedRect(-width/2 + 28, -102, width - 56, 84, 17);
    
    container.add([questionBg, glowEffect]);

    const questionText = this.add.text(0, -60, '', {
      fontSize: isMobile ? '13px' : '15px',
      fontFamily: 'Arial Bold',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: width - 80 }
    }).setOrigin(0.5);
    container.add(questionText);

    // Contenedor de opciones con diseño mejorado
    const optionButtons = [];
    const optionTexts = [];

    for (let i = 0; i < 4; i++) {
      const yPos = 20 + (i * 45);
      
      // Fondo de opción con gradiente visual
      const optionBg = this.add.graphics()
        .fillStyle(0x2c3e50, 0.9)
        .fillRoundedRect(-width/2 + 40, yPos - 15, width - 80, 35, 10)
        .lineStyle(2, 0x3498db, 0.6)
        .strokeRoundedRect(-width/2 + 40, yPos - 15, width - 80, 35, 10);

      // Efecto hover sutil
      const hoverEffect = this.add.graphics()
        .fillStyle(0x3498db, 0.1)
        .fillRoundedRect(-width/2 + 40, yPos - 15, width - 80, 35, 10)
        .setVisible(false);

      const optionButton = this.add.rectangle(0, yPos, width - 80, 35, 0x000000, 0)
        .setInteractive({ useHandCursor: true });

      const optionText = this.add.text(-width/2 + 60, yPos, '', {
        fontSize: isMobile ? '12px' : '14px',
        fontFamily: 'Arial',
        fill: '#ecf0f1',
        align: 'left'
      }).setOrigin(0, 0.5);

      // Efectos de hover mejorados
      optionButton.on('pointerover', () => {
        hoverEffect.setVisible(true);
        optionBg.clear()
          .fillStyle(0x34495e, 0.9)
          .fillRoundedRect(-width/2 + 40, yPos - 15, width - 80, 35, 10)
          .lineStyle(2, 0x00d4ff, 0.8)
          .strokeRoundedRect(-width/2 + 40, yPos - 15, width - 80, 35, 10);
        optionText.setTint(0x00d4ff);
      });

      optionButton.on('pointerout', () => {
        hoverEffect.setVisible(false);
        optionBg.clear()
          .fillStyle(0x2c3e50, 0.9)
          .fillRoundedRect(-width/2 + 40, yPos - 15, width - 80, 35, 10)
          .lineStyle(2, 0x3498db, 0.6)
          .strokeRoundedRect(-width/2 + 40, yPos - 15, width - 80, 35, 10);
        optionText.clearTint();
      });

      container.add([optionBg, hoverEffect, optionButton, optionText]);
      optionButtons.push({ button: optionButton, bg: optionBg, text: optionText, hover: hoverEffect });
    }

    // Función para mostrar pregunta
    const showQuestion = () => {
      const q = questions[currentQuestion];
      questionText.setText(`Pregunta ${currentQuestion + 1}/3:\n${q.question}`);
      
      q.options.forEach((option, index) => {
        optionButtons[index].text.setText(`${String.fromCharCode(65 + index)}. ${option}`);
        
        // Configurar evento de clic
        optionButtons[index].button.off('pointerdown');
        optionButtons[index].button.on('pointerdown', () => {
          handleAnswer(index);
        });
      });
    };

    // Variable para rastrear opciones incorrectas marcadas
    let incorrectOptions = new Set();
    let feedbackText = null;

    // Función para manejar respuesta
    const handleAnswer = (selectedIndex) => {
      const q = questions[currentQuestion];
      const isCorrect = selectedIndex === q.correct;
      
      if (isCorrect) {
        correctAnswers++;
        
        // Efecto de respuesta correcta
        optionButtons[selectedIndex].bg.clear()
          .fillStyle(0x27ae60, 0.9)
          .fillRoundedRect(-width/2 + 40, 20 + (selectedIndex * 45) - 15, width - 80, 35, 10)
          .lineStyle(2, 0x2ecc71, 1)
          .strokeRoundedRect(-width/2 + 40, 20 + (selectedIndex * 45) - 15, width - 80, 35, 10);
        optionButtons[selectedIndex].text.setTint(0x2ecc71);

        // Mostrar mensaje de éxito
        if (feedbackText) feedbackText.destroy();
        feedbackText = this.add.text(0, 200, '✅ ¡CORRECTO!', {
          fontSize: isMobile ? '16px' : '18px',
          fontFamily: 'Arial Bold',
          fill: '#00ff00',
          align: 'center'
        }).setOrigin(0.5);
        container.add(feedbackText);

        // Desactivar todos los botones después de respuesta correcta
        optionButtons.forEach(opt => opt.button.off('pointerdown'));

        // Continuar al siguiente después de un breve delay
        this.time.delayedCall(1500, () => {
          currentQuestion++;
          incorrectOptions.clear(); // Limpiar opciones incorrectas para la siguiente pregunta
          
          if (currentQuestion < questions.length) {
            // Resetear colores y reactivar botones
            optionButtons.forEach((opt, index) => {
              const yPos = 20 + (index * 45);
              opt.bg.clear()
                .fillStyle(0x2c3e50, 0.9)
                .fillRoundedRect(-width/2 + 40, yPos - 15, width - 80, 35, 10)
                .lineStyle(2, 0x3498db, 0.6)
                .strokeRoundedRect(-width/2 + 40, yPos - 15, width - 80, 35, 10);
              opt.text.clearTint();
              
              // Reactivar el botón
              opt.button.on('pointerdown', () => handleAnswer(index));
            });
            
            if (feedbackText) {
              feedbackText.destroy();
              feedbackText = null;
            }
            showQuestion();
          } else {
            // Finalizar quiz
            const score = Math.round((correctAnswers / questions.length) * 100);
            questionText.setText(`¡Quiz completado!\nPuntuación: ${correctAnswers}/${questions.length} (${score}%)`);
            
            // Limpiar opciones
            optionButtons.forEach(opt => {
              opt.bg.setVisible(false);
              opt.text.setVisible(false);
              opt.button.setVisible(false);
              opt.hover.setVisible(false);
            });

            if (feedbackText) {
              feedbackText.destroy();
              feedbackText = null;
            }

            // Completar reparación si aprobó
            if (correctAnswers >= 2) {
              this.time.delayedCall(2000, () => {
                this.completeCircuitRepair('ROBÓTICA', systemIndex);
                this.closeModal();
              });
            } else {
              // Reiniciar si no aprobó
              const retryText = this.add.text(0, 100, 'Necesitas al menos 2 respuestas correctas.\n¡Inténtalo de nuevo!', {
                fontSize: isMobile ? '12px' : '14px',
                fontFamily: 'Arial',
                fill: '#e74c3c',
                align: 'center'
              }).setOrigin(0.5);
              container.add(retryText);
              
              this.time.delayedCall(3000, () => {
                currentQuestion = 0;
                correctAnswers = 0;
                incorrectOptions.clear();
                retryText.setVisible(false);
                optionButtons.forEach(opt => {
                  opt.bg.setVisible(true);
                  opt.text.setVisible(true);
                  opt.button.setVisible(true);
                });
                showQuestion();
              });
            }
          }
        });
      } else {
        // Marcar opción como incorrecta permanentemente
        incorrectOptions.add(selectedIndex);
        
        // Efecto de respuesta incorrecta - mantener rojo
        optionButtons[selectedIndex].bg.clear()
          .fillStyle(0xe74c3c, 0.9)
          .fillRoundedRect(-width/2 + 40, 20 + (selectedIndex * 45) - 15, width - 80, 35, 10)
          .lineStyle(2, 0xc0392b, 1)
          .strokeRoundedRect(-width/2 + 40, 20 + (selectedIndex * 45) - 15, width - 80, 35, 10);
        optionButtons[selectedIndex].text.setTint(0xe74c3c);

        // Desactivar solo el botón incorrecto
        optionButtons[selectedIndex].button.off('pointerdown');

        // Animación de error
        this.tweens.add({
          targets: [optionButtons[selectedIndex].bg, optionButtons[selectedIndex].text],
          x: optionButtons[selectedIndex].text.x + 10,
          duration: 100,
          yoyo: true,
          repeat: 2,
          ease: 'Power2.easeOut'
        });

        // Mostrar mensaje de error
        if (feedbackText) feedbackText.destroy();
        feedbackText = this.add.text(0, 200, '❌ INCORRECTO - Intenta de nuevo', {
          fontSize: isMobile ? '14px' : '16px',
          fontFamily: 'Arial Bold',
          fill: '#ff4444',
          align: 'center'
        }).setOrigin(0.5);
        container.add(feedbackText);

        // El juego continúa, el usuario puede seguir intentando con las opciones restantes
      }
    };

    // Iniciar el quiz
    showQuestion();
  }

  createRepairParticles(x, y) {
    // Crear partículas de chispas para el efecto de reparación
    for (let i = 0; i < 5; i++) {
      const particle = this.add.circle(
        x + Phaser.Math.Between(-20, 20),
        y + Phaser.Math.Between(-20, 20),
        Phaser.Math.Between(2, 4),
        0x00d4ff,
        0.8
      );

      this.tweens.add({
        targets: particle,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 500,
        onComplete: () => particle.destroy()
      });
    }
  }

  createAIGameContent(container, width, isMobile, systemIndex) {
    // Título del juego con efecto mejorado
    const title = this.add.text(0, -140, '🧠 SISTEMA DE IA', {
      fontSize: isMobile ? '20px' : '26px',
      fontFamily: 'Arial Black',
      fill: '#00d4ff',
      align: 'center',
      stroke: '#003d5c',
      strokeThickness: 2
    }).setOrigin(0.5);
    container.add(title);

    // Contenedor de información con diseño mejorado
    const infoBg = this.add.graphics()
      .fillStyle(0x1a252f, 0.95)
      .fillRoundedRect(-width/2 + 30, -110, width - 60, 60, 15)
      .lineStyle(3, 0x9b59b6, 0.8)
      .strokeRoundedRect(-width/2 + 30, -110, width - 60, 60, 15);
    
    // Efecto de brillo
    const glowEffect = this.add.graphics()
      .lineStyle(1, 0xd63031, 0.4)
      .strokeRoundedRect(-width/2 + 28, -112, width - 56, 64, 17);
    
    container.add([infoBg, glowEffect]);

    // Descripción del proceso
    const description = this.add.text(0, -80, 'La IA está analizando patrones de datos\ny optimizando algoritmos automáticamente', {
      fontSize: isMobile ? '12px' : '14px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    container.add(description);

    // Estado del procesamiento con diseño mejorado
    const statusBg = this.add.graphics()
      .fillStyle(0x2c3e50, 0.9)
      .fillRoundedRect(-width/2 + 40, -35, width - 80, 30, 10)
      .lineStyle(2, 0xf39c12, 0.8)
      .strokeRoundedRect(-width/2 + 40, -35, width - 80, 30, 10);
    container.add(statusBg);

    const statusText = this.add.text(0, -20, 'PROCESANDO...', {
      fontSize: isMobile ? '14px' : '16px',
      fontFamily: 'Arial Bold',
      fill: '#f39c12'
    }).setOrigin(0.5);
    container.add(statusText);

    // Barra de progreso con diseño mejorado
    const progressContainer = this.add.graphics()
      .fillStyle(0x34495e, 0.8)
      .fillRoundedRect(-125, 15, 250, 25, 12)
      .lineStyle(2, 0x00d4ff, 0.6)
      .strokeRoundedRect(-125, 15, 250, 25, 12);
    container.add(progressContainer);

    const progressFill = this.add.graphics();
    container.add(progressFill);

    const progressText = this.add.text(0, 27, '0%', {
      fontSize: '14px',
      fontFamily: 'Arial Bold',
      fill: '#ffffff'
    }).setOrigin(0.5);
    container.add(progressText);

    // Indicador de actividad de IA mejorado
    const aiContainer = this.add.graphics()
      .fillStyle(0x3498db, 0.2)
      .fillCircle(0, 70, 35)
      .lineStyle(3, 0x74b9ff, 0.8)
      .strokeCircle(0, 70, 35);
    container.add(aiContainer);

    const aiText = this.add.text(0, 70, '🧠', {
      fontSize: '28px'
    }).setOrigin(0.5);
    container.add(aiText);

    // Partículas de procesamiento
    const particles = [];
    for (let i = 0; i < 6; i++) {
      const particle = this.add.circle(
        Math.cos(i * Math.PI / 3) * 50,
        70 + Math.sin(i * Math.PI / 3) * 50,
        3,
        0x00d4ff,
        0.8
      );
      container.add(particle);
      particles.push(particle);
    }

    // Animaciones mejoradas
    this.tweens.add({
      targets: aiContainer,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: aiText,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });

    // Animación de partículas orbitales
    particles.forEach((particle, index) => {
      this.tweens.add({
        targets: particle,
        angle: 360,
        duration: 2000 + (index * 200),
        repeat: -1,
        ease: 'Linear'
      });
    });

    // Progreso automático mejorado
    let progress = 0;
    const progressTimer = this.time.addEvent({
      delay: 100,
      callback: () => {
        progress += Math.random() * 3 + 1;
        if (progress > 100) progress = 100;

        // Actualizar barra de progreso con gradiente
        progressFill.clear();
        const fillWidth = (progress / 100) * 246;
        progressFill.fillGradientStyle(0x00d4ff, 0x74b9ff, 0x0984e3, 0x6c5ce7, 1);
        progressFill.fillRoundedRect(-123, 17, fillWidth, 21, 10);

        progressText.setText(`${Math.floor(progress)}%`);

        // Cambiar color del texto según progreso
        if (progress < 30) {
          statusText.setTint(0xf39c12);
        } else if (progress < 70) {
          statusText.setTint(0xe17055);
        } else {
          statusText.setTint(0x00b894);
        }

        if (progress >= 100) {
          progressTimer.destroy();
          statusText.setText('¡PROCESAMIENTO COMPLETO!');
          statusText.setTint(0x00b894);
          
          // Efecto de finalización
          this.tweens.add({
            targets: [aiContainer, aiText],
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 300,
            yoyo: true,
            ease: 'Back.easeOut'
          });

          // Completar reparación
          this.time.delayedCall(1500, () => {
            this.completeCircuitRepair('IA', systemIndex);
            this.closeModal();
          });
        }
      },
      loop: true
    });
  }

  createMemoryGameContent(container, width, isMobile, systemIndex) {
    // Título del juego
    const title = this.add.text(0, -120, 'SISTEMA DE MEMORIA', {
      fontSize: isMobile ? '18px' : '24px',
      fontFamily: 'Arial Bold',
      fill: '#00d4ff',
      align: 'center'
    }).setOrigin(0.5);
    container.add(title);

    // Descripción del juego
    const description = this.add.text(0, -90, 'Memoriza y repite la secuencia de colores', {
      fontSize: isMobile ? '12px' : '14px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    container.add(description);

    // Estado del juego
    const statusText = this.add.text(0, -60, 'MEMORIZA...', {
      fontSize: isMobile ? '14px' : '16px',
      fontFamily: 'Arial Bold',
      fill: '#f39c12'
    }).setOrigin(0.5);
    container.add(statusText);

    // Variables del juego
    const colors = [0xff6b7d, 0x74b9ff, 0x00d4ff, 0x27ae60];
    const sequence = [];
    const userSequence = [];
    let showingSequence = false;

    // Generar secuencia aleatoria
    for (let i = 0; i < 4; i++) {
      sequence.push(Phaser.Math.Between(0, 3));
    }

    // Crear botones de colores
    const colorButtons = [];
    for (let i = 0; i < 4; i++) {
      const button = this.add.circle(
        -60 + (i * 40),
        -10,
        18,
        colors[i],
        0.7
      ).setInteractive({ useHandCursor: true });

      button.colorIndex = i;
      colorButtons.push(button);
      container.add(button);

      button.on('pointerdown', () => {
        if (showingSequence) return;

        // Efecto visual
        this.tweens.add({
          targets: button,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 150,
          yoyo: true
        });

        userSequence.push(i);

        if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
          // Error - reiniciar
          statusText.setText('¡ERROR! Reiniciando...');
          statusText.setFill('#e74c3c');
          userSequence.length = 0;
          this.time.delayedCall(1000, () => {
            statusText.setText('MEMORIZA...');
            statusText.setFill('#f39c12');
            showSequence();
          });
        } else if (userSequence.length === sequence.length) {
          // Completado
          statusText.setText('¡SECUENCIA CORRECTA!');
          statusText.setFill('#27ae60');
          
          // Completar el circuito
          this.time.delayedCall(1000, () => {
            this.completeCircuitRepair('MEMORIA', systemIndex);
            this.closeModal();
          });
        }
      });
    }

    // Función para mostrar la secuencia
    const showSequence = () => {
      showingSequence = true;
      userSequence.length = 0;
      let step = 0;

      const showStep = () => {
        if (step < sequence.length) {
          const buttonIndex = sequence[step];
          const button = colorButtons[buttonIndex];

          this.tweens.add({
            targets: button,
            alpha: 1,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 400,
            yoyo: true,
            onComplete: () => {
              step++;
              if (step < sequence.length) {
                this.time.delayedCall(300, showStep);
              } else {
                showingSequence = false;
                statusText.setText('REPITE LA SECUENCIA');
                statusText.setFill('#00d4ff');
              }
            }
          });
        }
      };

      this.time.delayedCall(500, showStep);
    };

    // Iniciar el juego
    showSequence();
  }

  createSequenceGameContent(container, width, isMobile, systemIndex) {
    // Título del juego con efecto mejorado
    const title = this.add.text(0, -140, '⚡ SISTEMA DE SECUENCIA', {
      fontSize: isMobile ? '20px' : '26px',
      fontFamily: 'Arial Black',
      fill: '#9b59b6',
      align: 'center',
      stroke: '#4a148c',
      strokeThickness: 2
    }).setOrigin(0.5);
    container.add(title);

    // Contenedor de información con diseño mejorado
    const infoBg = this.add.graphics()
      .fillStyle(0x1a0d2e, 0.95)
      .fillRoundedRect(-width/2 + 30, -110, width - 60, 60, 15)
      .lineStyle(3, 0x9b59b6, 0.8)
      .strokeRoundedRect(-width/2 + 30, -110, width - 60, 60, 15);
    
    // Efecto de brillo
    const glowEffect = this.add.graphics()
      .lineStyle(1, 0xd63031, 0.4)
      .strokeRoundedRect(-width/2 + 28, -112, width - 56, 64, 17);
    
    container.add([infoBg, glowEffect]);

    // Descripción del juego
    const description = this.add.text(0, -80, 'Conecta los nodos en el orden correcto\npara restablecer la secuencia', {
      fontSize: isMobile ? '12px' : '14px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
    container.add(description);

    // Estado del juego con diseño mejorado
    const statusBg = this.add.graphics()
      .fillStyle(0x2c3e50, 0.9)
      .fillRoundedRect(-width/2 + 40, -35, width - 80, 30, 10)
      .lineStyle(2, 0xf39c12, 0.8)
      .strokeRoundedRect(-width/2 + 40, -35, width - 80, 30, 10);
    container.add(statusBg);

    const statusText = this.add.text(0, -20, 'CONECTA LOS NODOS', {
      fontSize: isMobile ? '14px' : '16px',
      fontFamily: 'Arial Bold',
      fill: '#f39c12'
    }).setOrigin(0.5);
    container.add(statusText);

    // Variables del juego
    const correctSequence = [0, 2, 1, 3]; // Secuencia correcta
    const userSequence = [];
    let isGameActive = true;

    // Contenedor para los nodos con diseño mejorado
    const nodeContainer = this.add.graphics()
      .fillStyle(0x1a252f, 0.8)
      .fillRoundedRect(-140, 10, 280, 120, 15)
      .lineStyle(2, 0x636e72, 0.6)
      .strokeRoundedRect(-140, 10, 280, 120, 15);
    container.add(nodeContainer);

    // Crear nodos con diseño mejorado
    const nodes = [];
    const nodeNumbers = [];
    const nodePositions = [
      { x: -80, y: 40 },
      { x: 80, y: 40 },
      { x: -80, y: 90 },
      { x: 80, y: 90 }
    ];

    for (let i = 0; i < 4; i++) {
      // Fondo del nodo con efecto de brillo
      const nodeBg = this.add.graphics()
        .fillStyle(0x2d3436, 0.9)
        .fillCircle(nodePositions[i].x, nodePositions[i].y, 25)
        .lineStyle(3, 0x9b59b6, 0.8)
        .strokeCircle(nodePositions[i].x, nodePositions[i].y, 25);
      container.add(nodeBg);

      // Nodo principal
      const node = this.add.circle(
        nodePositions[i].x,
        nodePositions[i].y,
        20,
        0x2c3e50,
        0.9
      ).setStrokeStyle(2, 0x00d4ff, 0.8).setInteractive({ useHandCursor: true });

      // Efecto de brillo interno
      const innerGlow = this.add.circle(
        nodePositions[i].x,
        nodePositions[i].y,
        15,
        0xffffff,
        0.1
      );

      // Número del nodo con mejor estilo
      const nodeNumber = this.add.text(
        nodePositions[i].x,
        nodePositions[i].y,
        (i + 1).toString(),
        {
          fontSize: isMobile ? '18px' : '20px',
          fontFamily: 'Arial Black',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 1
        }
      ).setOrigin(0.5);

      node.nodeIndex = i;
      node.nodeBg = nodeBg;
      node.innerGlow = innerGlow;
      node.nodeNumber = nodeNumber;
      nodes.push(node);
      nodeNumbers.push(nodeNumber);
      container.add([node, innerGlow, nodeNumber]);

      // Efectos hover
      node.on('pointerover', () => {
        if (isGameActive) {
          this.tweens.add({
            targets: [node, innerGlow],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            ease: 'Back.easeOut'
          });
          
          // Efecto de pulso en el borde
          this.tweens.add({
            targets: nodeBg,
            alpha: 0.7,
            duration: 300,
            yoyo: true,
            repeat: -1
          });
        }
      });

      node.on('pointerout', () => {
        if (isGameActive) {
          this.tweens.add({
            targets: [node, innerGlow],
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.easeOut'
          });
          
          // Detener efecto de pulso
          this.tweens.killTweensOf(nodeBg);
          nodeBg.setAlpha(1);
        }
      });

      node.on('pointerdown', () => {
        if (!isGameActive) return;

        // Efecto visual mejorado
        this.tweens.add({
          targets: [node, innerGlow],
          scaleX: 1.4,
          scaleY: 1.4,
          duration: 150,
          yoyo: true,
          ease: 'Back.easeOut'
        });

        // Efecto de partículas
        this.createSequenceParticles(nodePositions[i].x, nodePositions[i].y);

        userSequence.push(i);

        // Cambiar color del nodo seleccionado con gradiente
        node.setFillStyle(0x27ae60);
        innerGlow.setFillStyle(0x00ff88, 0.3);
        nodeNumber.setTint(0x000000);

        if (userSequence[userSequence.length - 1] !== correctSequence[userSequence.length - 1]) {
          // Error - reiniciar
          statusText.setText('¡SECUENCIA INCORRECTA!');
          statusText.setFill('#e74c3c');
          isGameActive = false;

          // Efecto de error en todos los nodos
          nodes.forEach(n => {
            this.tweens.add({
              targets: n,
              tint: 0xff0000,
              duration: 200,
              yoyo: true,
              repeat: 2
            });
          });

          this.time.delayedCall(1500, () => {
            // Resetear nodos
            nodes.forEach((n, idx) => {
              n.setFillStyle(0x2c3e50);
              n.clearTint();
              n.innerGlow.setFillStyle(0xffffff, 0.1);
              nodeNumbers[idx].clearTint();
            });
            userSequence.length = 0;
            isGameActive = true;
            statusText.setText('CONECTA LOS NODOS');
            statusText.setFill('#f39c12');
          });
        } else if (userSequence.length === correctSequence.length) {
          // Completado
          statusText.setText('¡SECUENCIA CORRECTA!');
          statusText.setFill('#27ae60');
          isGameActive = false;

          // Efecto de éxito en todos los nodos
          nodes.forEach(n => {
            this.tweens.add({
              targets: n,
              tint: 0x00ff00,
              scaleX: 1.2,
              scaleY: 1.2,
              duration: 300,
              yoyo: true
            });
          });

          // Crear líneas de conexión con efectos
          for (let j = 0; j < correctSequence.length - 1; j++) {
            const startNode = nodePositions[correctSequence[j]];
            const endNode = nodePositions[correctSequence[j + 1]];

            const line = this.add.line(
              0, 0,
              startNode.x, startNode.y,
              endNode.x, endNode.y,
              0x27ae60
            ).setLineWidth(4).setAlpha(0);
            container.add(line);

            // Animar la aparición de la línea
            this.tweens.add({
              targets: line,
              alpha: 1,
              duration: 300,
              delay: j * 200
            });

            // Efecto de brillo en la línea
            this.tweens.add({
              targets: line,
              scaleX: 1.1,
              scaleY: 1.1,
              duration: 500,
              yoyo: true,
              repeat: -1,
              delay: j * 200
            });
          }

          // Completar el circuito
          this.time.delayedCall(2000, () => {
            this.completeCircuitRepair('SECUENCIA', systemIndex);
            this.closeModal();
          });
        }
      });
    }

    // Contenedor para la pista con diseño mejorado
    const hintBg = this.add.graphics()
      .fillStyle(0x34495e, 0.8)
      .fillRoundedRect(-100, 140, 200, 30, 10)
      .lineStyle(2, 0x74b9ff, 0.6)
      .strokeRoundedRect(-100, 140, 200, 30, 10);
    container.add(hintBg);

    // Mostrar pista de la secuencia correcta
    const hintText = this.add.text(0, 155, '💡 Pista: 1 → 3 → 2 → 4', {
      fontSize: isMobile ? '12px' : '14px',
      fontFamily: 'Arial Bold',
      fill: '#74b9ff',
      align: 'center'
    }).setOrigin(0.5);
    container.add(hintText);

    // Efecto de parpadeo en la pista
    this.tweens.add({
      targets: hintText,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  // Función auxiliar para crear partículas de secuencia
  createSequenceParticles(x, y) {
    for (let i = 0; i < 10; i++) {
      const particle = this.add.circle(x, y, 2, 0x9b59b6, 0.8);
      
      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-40, 40),
        y: y + Phaser.Math.Between(-40, 40),
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: 800,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }
}