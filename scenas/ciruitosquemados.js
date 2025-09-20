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

    if (circuitType === 'ROBÓTICA') {
      this.startRoboticsGame(index);
    } else if (circuitType === 'IA') {
      this.startAIGame(index);
    } else if (circuitType === 'MEMORIA') {
      this.startMemoryGame(index);
    } else if (circuitType === 'SECUENCIA') {
      this.startSequenceGame(index);
    }
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
          progressTimer.remove();
        }
      },
      loop: true
    });
  }

  startMemoryGame(index) {
    // Juego de memoria: secuencia de colores
    const circuitBox = this.circuitBoxes[index];
    const colors = [0xff6b7d, 0x74b9ff, 0x00d4ff, 0x27ae60];
    const sequence = [];
    const userSequence = [];
    let currentStep = 0;
    let showingSequence = false;

    // Generar secuencia aleatoria
    for (let i = 0; i < 4; i++) {
      sequence.push(Phaser.Math.Between(0, 3));
    }

    circuitBox.statusText.setText('MEMORIZA...');
    circuitBox.statusBg.clear()
      .fillGradientStyle(0xf39c12, 0xe67e22, 0xf39c12, 0xe67e22, 0.3)
      .fillRoundedRect(-95, 35, 120, 22, 11)
      .lineStyle(2, 0xf39c12, 0.9)
      .strokeRoundedRect(-95, 35, 120, 22, 11);

    // Crear botones de colores
    const colorButtons = [];
    for (let i = 0; i < 4; i++) {
      const button = this.add.circle(
        circuitBox.container.x - 60 + (i * 40),
        circuitBox.container.y + 90,
        15,
        colors[i],
        0.7
      ).setInteractive({ useHandCursor: true });

      button.colorIndex = i;
      colorButtons.push(button);

      button.on('pointerdown', () => {
        if (showingSequence) return;

        // Efecto visual
        this.tweens.add({
          targets: button,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 100,
          yoyo: true
        });

        userSequence.push(i);

        if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
          // Error - reiniciar
          userSequence.length = 0;
          this.showSequence();
        } else if (userSequence.length === sequence.length) {
          // Completado
          colorButtons.forEach(btn => btn.destroy());
          this.completeCircuitRepair('MEMORIA', index);
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

          this.tweens.add({
            targets: button,
            alpha: 1,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 300,
            yoyo: true,
            onComplete: () => {
              step++;
              if (step < sequence.length) {
                this.time.delayedCall(200, showStep);
              } else {
                showingSequence = false;
                circuitBox.statusText.setText('REPITE...');
              }
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
}