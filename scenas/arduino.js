class ArduinoGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "ArduinoGameScene" });
    this.currentStep = 0;
    this.totalSteps = 4;
    this.codeExplanations = [
      {
        title: "DECLARACIÓN DE VARIABLES",
        code: "int bateria = 9;\nint sensorVoltaje = A0;",
        explanation: "• Pin 9 para controlar la batería\n• Pin A0 para leer el sensor de voltaje"
      },
      {
        title: "CONFIGURACIÓN INICIAL",
        code: "void setup() {\n  pinMode(sensorVoltaje, INPUT);\n  pinMode(bateria, OUTPUT);\n}",
        explanation: "• Configura A0 como entrada\n• Configura pin 9 como salida\n• Se ejecuta una sola vez"
      },
      {
        title: "LECTURA DEL SENSOR",
        code: "int voltaje = analogRead(sensorVoltaje);",
        explanation: "• Lee valor analógico (0-1023)\n• Convierte voltaje a número digital\n• Monitoreo continuo"
      },
      {
        title: "CONTROL DE BATERÍA",
        code: "if (voltaje < 500) {\n  digitalWrite(bateria, HIGH);\n  delay(2000);\n  digitalWrite(bateria, LOW);\n}",
        explanation: "• Si voltaje < 2.44V activa alerta\n• Enciende indicador 2 segundos\n• Previene sobrecarga del sistema"
      }
    ];
  }

  preload() {
    // Assets will be created programmatically
  }

  create() {
    const { width, height } = this.scale;
    
    // Create space background
    this.createSpaceBackground(width, height);
    
    // Create main interface
    this.createMainInterface(width, height);
    
    // Create code display panel
    this.createCodePanel(width, height);
    
    // Create explanation panel
    this.createExplanationPanel(width, height);
    
    // Create navigation controls
    this.createNavigationControls(width, height);
    
    // Show first step
    this.showStep(0);
    
    // Create ambient effects
    this.createAmbientEffects();
  }

  createSpaceBackground(width, height) {
    // Dark space gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x000011, 0x000033, 0x001122, 0x000044);
    bg.fillRect(0, 0, width, height);

    // Animated stars
    this.stars = this.add.group();
    for (let i = 0; i < 100; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 1)
      );
      
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
      
      this.stars.add(star);
    }

    // Grid overlay
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00ffff, 0.1);
    
    for (let x = 0; x < width; x += 50) {
      grid.moveTo(x, 0);
      grid.lineTo(x, height);
    }
    
    for (let y = 0; y < height; y += 50) {
      grid.moveTo(0, y);
      grid.lineTo(width, y);
    }
    
    grid.strokePath();
  }

  createMainInterface(width, height) {
    // Main title
    this.titleText = this.add.text(width * 0.5, height * 0.08, 'ANÁLISIS DE CÓDIGO ARDUINO', {
      fontSize: '32px',
      fill: '#00ffff',
      fontFamily: 'Orbitron, monospace',
      stroke: '#003366',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Subtitle
    this.subtitleText = this.add.text(width * 0.5, height * 0.13, 'Sistema de Monitoreo de Batería', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Rajdhani, sans-serif',
      alpha: 0.8
    }).setOrigin(0.5);

    // Progress indicator
    this.createProgressIndicator(width * 0.5, height * 0.18);
  }

  createProgressIndicator(x, y) {
    this.progressContainer = this.add.container(x, y);
    
    // Progress bar background
    const progressBg = this.add.graphics();
    progressBg.fillStyle(0x003366, 0.5);
    progressBg.fillRoundedRect(-150, -10, 300, 20, 10);
    
    // Progress bar fill
    this.progressFill = this.add.graphics();
    this.progressFill.fillStyle(0x00ffff, 0.8);
    
    // Progress text
    this.progressText = this.add.text(0, 0, '1 / 4', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Orbitron, monospace'
    }).setOrigin(0.5);
    
    this.progressContainer.add([progressBg, this.progressFill, this.progressText]);
  }

  createCodePanel(width, height) {
    const panelX = width * 0.25;
    const panelY = height * 0.35;
    const panelWidth = width * 0.45;
    const panelHeight = height * 0.5;

    this.codeContainer = this.add.container(panelX, panelY);

    // Panel background with holographic effect
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x001122, 0.9);
    panelBg.lineStyle(2, 0x00ffff, 0.8);
    panelBg.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 15);
    panelBg.strokeRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 15);

    // Corner decorations
    this.createCornerDecorations(panelBg, -panelWidth/2, -panelHeight/2, panelWidth, panelHeight);

    // Title bar
    const titleBar = this.add.graphics();
    titleBar.fillStyle(0x00ffff, 0.2);
    titleBar.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, 40, {tl: 15, tr: 15, bl: 0, br: 0});

    this.codeTitleText = this.add.text(0, -panelHeight/2 + 20, 'CÓDIGO ARDUINO', {
      fontSize: '20px',
      fill: '#00ffff',
      fontFamily: 'Orbitron, monospace',
      fontWeight: 'bold',
      stroke: '#003333',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Code display area
    this.codeText = this.add.text(0, -panelHeight/2 + 80, '', {
      fontSize: '18px',
      fill: '#00ff00',
      fontFamily: 'Courier New, monospace',
      backgroundColor: '#001122',
      padding: { x: 25, y: 20 },
      wordWrap: { width: panelWidth - 50 },
      lineSpacing: 8,
      stroke: '#003300',
      strokeThickness: 1
    }).setOrigin(0.5, 0);

    this.codeContainer.add([panelBg, titleBar, this.codeTitleText, this.codeText]);

    // Scanning effect
    this.createScanningEffect(panelWidth, panelHeight);
  }

  createExplanationPanel(width, height) {
    const panelX = width * 0.75;
    const panelY = height * 0.35;
    const panelWidth = width * 0.45;
    const panelHeight = height * 0.5;

    this.explanationContainer = this.add.container(panelX, panelY);

    // Panel background
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x110022, 0.9);
    panelBg.lineStyle(2, 0xff00ff, 0.8);
    panelBg.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 15);
    panelBg.strokeRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 15);

    // Corner decorations
    this.createCornerDecorations(panelBg, -panelWidth/2, -panelHeight/2, panelWidth, panelHeight, 0xff00ff);

    // Title bar
    const titleBar = this.add.graphics();
    titleBar.fillStyle(0xff00ff, 0.2);
    titleBar.fillRoundedRect(-panelWidth/2, -panelHeight/2, panelWidth, 40, {tl: 15, tr: 15, bl: 0, br: 0});

    this.explanationTitleText = this.add.text(0, -panelHeight/2 + 20, 'EXPLICACIÓN', {
      fontSize: '20px',
      fill: '#ff00ff',
      fontFamily: 'Orbitron, monospace',
      fontWeight: 'bold',
      stroke: '#330033',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Explanation text area
    this.explanationText = this.add.text(0, -panelHeight/2 + 80, '', {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Rajdhani, sans-serif',
      backgroundColor: '#220011',
      padding: { x: 25, y: 20 },
      wordWrap: { width: panelWidth - 50 },
      lineSpacing: 10,
      stroke: '#330022',
      strokeThickness: 1
    }).setOrigin(0.5, 0);

    this.explanationContainer.add([panelBg, titleBar, this.explanationTitleText, this.explanationText]);
  }

  createCornerDecorations(graphics, x, y, width, height, color = 0x00ffff) {
    const cornerSize = 20;
    graphics.lineStyle(3, color, 1);
    
    // Top-left corner
    graphics.moveTo(x, y + cornerSize);
    graphics.lineTo(x, y);
    graphics.lineTo(x + cornerSize, y);
    
    // Top-right corner
    graphics.moveTo(x + width - cornerSize, y);
    graphics.lineTo(x + width, y);
    graphics.lineTo(x + width, y + cornerSize);
    
    // Bottom-right corner
    graphics.moveTo(x + width, y + height - cornerSize);
    graphics.lineTo(x + width, y + height);
    graphics.lineTo(x + width - cornerSize, y + height);
    
    // Bottom-left corner
    graphics.moveTo(x + cornerSize, y + height);
    graphics.lineTo(x, y + height);
    graphics.lineTo(x, y + height - cornerSize);
    
    graphics.strokePath();
  }

  createScanningEffect(panelWidth, panelHeight) {
    const scanLine = this.add.graphics();
    scanLine.lineStyle(2, 0x00ffff, 0.6);
    scanLine.moveTo(-panelWidth/2, 0);
    scanLine.lineTo(panelWidth/2, 0);
    scanLine.strokePath();
    
    this.codeContainer.add(scanLine);
    
    this.tweens.add({
      targets: scanLine,
      y: { from: -panelHeight/2 + 50, to: panelHeight/2 - 20 },
      duration: 2000,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createNavigationControls(width, height) {
    const buttonY = height * 0.85;
    
    // Previous button
    this.prevButton = this.createNavButton(width * 0.3, buttonY, '◀ ANTERIOR', false);
    
    // Next button
    this.nextButton = this.createNavButton(width * 0.7, buttonY, 'SIGUIENTE ▶', true);
    
    // Complete button (initially hidden)
    this.completeButton = this.createNavButton(width * 0.5, buttonY, '✓ COMPLETAR', true);
    this.completeButton.setVisible(false);
  }

  createNavButton(x, y, text, isNext = false) {
    const container = this.add.container(x, y);
    
    // Button background
    const bg = this.add.graphics();
    bg.fillStyle(0x003366, 0.8);
    bg.lineStyle(2, isNext ? 0x00ff00 : 0xff6600, 0.8);
    bg.fillRoundedRect(-80, -25, 160, 50, 25);
    bg.strokeRoundedRect(-80, -25, 160, 50, 25);
    
    // Button text
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Orbitron, monospace',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    container.add([bg, buttonText]);
    
    // Interactive setup with explicit hit area
    const hitArea = new Phaser.Geom.Rectangle(-80, -25, 160, 50);
    bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    
    // Hover effects
    bg.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x004488, 1);
      bg.lineStyle(3, isNext ? 0x00ff00 : 0xff6600, 1);
      bg.fillRoundedRect(-80, -25, 160, 50, 25);
      bg.strokeRoundedRect(-80, -25, 160, 50, 25);
      buttonText.setScale(1.1);
    });
    
    bg.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x003366, 0.8);
      bg.lineStyle(2, isNext ? 0x00ff00 : 0xff6600, 0.8);
      bg.fillRoundedRect(-80, -25, 160, 50, 25);
      bg.strokeRoundedRect(-80, -25, 160, 50, 25);
      buttonText.setScale(1);
    });
    
    // Click handlers
    if (text.includes('ANTERIOR')) {
      bg.on('pointerdown', () => this.previousStep());
    } else if (text.includes('SIGUIENTE')) {
      bg.on('pointerdown', () => this.nextStep());
    } else if (text.includes('COMPLETAR')) {
      bg.on('pointerdown', () => this.completeLesson());
    }
    
    return container;
  }

  createAmbientEffects() {
    // Floating particles
    this.particles = this.add.group();
    
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height),
        2,
        0x00ffff,
        0.3
      );
      
      this.tweens.add({
        targets: particle,
        y: particle.y - 100,
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        onRepeat: () => {
          particle.y = this.scale.height + 10;
          particle.x = Phaser.Math.Between(0, this.scale.width);
          particle.alpha = 0.3;
        }
      });
      
      this.particles.add(particle);
    }
  }

  showStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.codeExplanations.length) return;
    
    this.currentStep = stepIndex;
    const step = this.codeExplanations[stepIndex];
    
    // Update progress
    this.updateProgress();
    
    // Update title with animation
    this.tweens.add({
      targets: this.codeTitleText,
      alpha: 0,
      scaleX: 0.8,
      duration: 200,
      onComplete: () => {
        this.codeTitleText.setText(step.title);
        this.tweens.add({
          targets: this.codeTitleText,
          alpha: 1,
          scaleX: 1,
          duration: 300,
          ease: 'Back.easeOut'
        });
      }
    });
    
    // Animate code text with syntax highlighting effect
    this.tweens.add({
      targets: this.codeText,
      alpha: 0,
      y: this.codeText.y + 20,
      duration: 200,
      onComplete: () => {
        this.codeText.setText(this.applySyntaxHighlighting(step.code));
        this.codeText.y = this.codeText.y - 20;
        this.tweens.add({
          targets: this.codeText,
          alpha: 1,
          y: this.codeText.y,
          duration: 400,
          ease: 'Bounce.easeOut'
        });
      }
    });
    
    // Animate explanation text
    this.tweens.add({
      targets: this.explanationText,
      alpha: 0,
      x: this.explanationText.x + 30,
      duration: 200,
      onComplete: () => {
        this.explanationText.setText(step.explanation);
        this.explanationText.x = this.explanationText.x - 30;
        this.tweens.add({
          targets: this.explanationText,
          alpha: 1,
          x: this.explanationText.x,
          duration: 400,
          ease: 'Power2.easeOut'
        });
      }
    });
    
    // Update navigation buttons
    this.updateNavigationButtons();
  }

  applySyntaxHighlighting(code) {
    // Simple syntax highlighting for Arduino C++ code
    let highlightedCode = code;
    
    // Keywords
    const keywords = ['int', 'void', 'if', 'digitalWrite', 'analogRead', 'pinMode', 'delay'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlightedCode = highlightedCode.replace(regex, `[color=#00ffff]${keyword}[/color]`);
    });
    
    // Numbers
    highlightedCode = highlightedCode.replace(/\b\d+\b/g, '[color=#ffff00]$&[/color]');
    
    // Constants
    const constants = ['HIGH', 'LOW', 'INPUT', 'OUTPUT'];
    constants.forEach(constant => {
      const regex = new RegExp(`\\b${constant}\\b`, 'g');
      highlightedCode = highlightedCode.replace(regex, `[color=#ff8800]${constant}[/color]`);
    });
    
    // Comments (if any)
    highlightedCode = highlightedCode.replace(/\/\/.*$/gm, '[color=#888888]$&[/color]');
    
    return highlightedCode;
  }

  updateProgress() {
    const progress = (this.currentStep + 1) / this.totalSteps;
    
    this.progressFill.clear();
    this.progressFill.fillStyle(0x00ffff, 0.8);
    this.progressFill.fillRoundedRect(-150, -10, 300 * progress, 20, 10);
    
    this.progressText.setText(`${this.currentStep + 1} / ${this.totalSteps}`);
  }

  updateNavigationButtons() {
    // Previous button
    this.prevButton.setVisible(this.currentStep > 0);
    
    // Next/Complete button
    if (this.currentStep < this.totalSteps - 1) {
      this.nextButton.setVisible(true);
      this.completeButton.setVisible(false);
    } else {
      this.nextButton.setVisible(false);
      this.completeButton.setVisible(true);
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.showStep(this.currentStep + 1);
    }
  }

  completeLesson() {
    // Show completion message
    const { width, height } = this.scale;
    
    const completionContainer = this.add.container(width * 0.5, height * 0.5);
    
    // Background overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(-width/2, -height/2, width, height);
    
    // Completion panel
    const panel = this.add.graphics();
    panel.fillStyle(0x001122, 0.95);
    panel.lineStyle(3, 0x00ff00, 1);
    panel.fillRoundedRect(-200, -150, 400, 300, 20);
    panel.strokeRoundedRect(-200, -150, 400, 300, 20);
    
    // Success icon
    const successIcon = this.add.text(0, -80, '✓', {
      fontSize: '48px',
      fill: '#00ff00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    // Completion text
    const completionText = this.add.text(0, -20, 'LECCIÓN COMPLETADA', {
      fontSize: '24px',
      fill: '#00ffff',
      fontFamily: 'Orbitron, monospace',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    const summaryText = this.add.text(0, 20, 'Has aprendido sobre:\n• Declaración de variables\n• Configuración de pines\n• Lectura de sensores\n• Control de actuadores', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Rajdhani, sans-serif',
      align: 'center',
      lineSpacing: 5
    }).setOrigin(0.5);
    
    // Continue button
    const continueButton = this.createNavButton(0, 100, 'CONTINUAR', true);
    continueButton.list[0].on('pointerdown', () => {
      this.scene.start('Fallos');
    });
    
    completionContainer.add([overlay, panel, successIcon, completionText, summaryText, continueButton]);
    
    // Animate completion panel
    completionContainer.setScale(0);
    this.tweens.add({
      targets: completionContainer,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  update() {
    // Update any continuous animations here
  }
}
