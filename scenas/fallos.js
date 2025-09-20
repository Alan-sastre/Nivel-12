class Fallos extends Phaser.Scene {
    constructor() {
        super({ key: 'Fallos' });
        this.particles = [];
        this.coreElements = [];
        this.energyRings = [];
        this.dataStreams = [];
        this.hologramElements = [];
    }

    // Premium particle effects for enhanced visual feedback
    createSuccessExplosion(x, y) {
        // Create multiple particle bursts with different colors
        const colors = [0x00ff88, 0x44ff44, 0x88ff00, 0xffff44, 0x44ffff];

        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(x, y, Phaser.Math.Between(3, 8), colors[i % colors.length]);
            const angle = (i / 15) * Math.PI * 2;
            const speed = Phaser.Math.Between(100, 500);

            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scaleX: 0.1,
                scaleY: 0.1,
                duration: 1000,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }

        // Add sparkle effect
        for (let i = 0; i < 8; i++) {
            const sparkle = this.add.star(x + Phaser.Math.Between(-50, 50),
                                        y + Phaser.Math.Between(-50, 50),
                                        5, 4, 8, 0xffffff);
            this.tweens.add({
                targets: sparkle,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                rotation: Math.PI * 2,
                duration: 800,
                delay: i * 100,
                ease: 'Power2.easeOut',
                onComplete: () => sparkle.destroy()
            });
        }
    }

    createHoverParticles(x, y) {
        // Create subtle floating particles on hover
        for (let i = 0; i < 5; i++) {
            const particle = this.add.circle(
                x + Phaser.Math.Between(-60, 60),
                y + Phaser.Math.Between(-30, 30),
                Phaser.Math.Between(2, 4),
                0x8b5cf6,
                0.6
            );

            this.tweens.add({
                targets: particle,
                y: particle.y - 50,
                alpha: 0,
                duration: 1500,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    createFloatingParticles() {
        // Create ambient floating particles for premium atmosphere
        const particles = [];

        for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Math.Between(1, 3),
                0x8b5cf6,
                Phaser.Math.FloatBetween(0.1, 0.3)
            );

            particles.push(particle);

            // Continuous floating animation
            this.tweens.add({
                targets: particle,
                y: particle.y - 100,
                x: particle.x + Phaser.Math.Between(-50, 50),
                duration: Phaser.Math.Between(3000, 6000),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: i * 200
            });
        }

        return particles;
    }

    preload() {
        this.createAdvancedTextures();
        this.createCoreTextures();
        this.createEnergyTextures();
    }

    create() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        // Create space background
        this.createSpaceBackground(gameWidth, gameHeight);

        // Create central energy core (the main focus)
        this.createEnergyCore(gameWidth, gameHeight);

        // Create holographic interface
        this.createHolographicInterface(gameWidth, gameHeight);

        // Create data streams
        this.createDataStreams(gameWidth, gameHeight);

        // Start all animations
        this.startCoreAnimations();
    }

    createAdvancedTextures() {
        // Deep space background
        const spaceGradient = this.add.graphics();
        spaceGradient.fillGradientStyle(0x000011, 0x001122, 0x000033, 0x002244, 1);
        spaceGradient.fillRect(0, 0, 1920, 1080);
        spaceGradient.generateTexture('spaceBackground', 1920, 1080);
        spaceGradient.destroy();

        // Holographic panel
        const holoPanel = this.add.graphics();
        holoPanel.lineStyle(2, 0x00ffff, 0.8);
        holoPanel.fillStyle(0x001133, 0.3);
        holoPanel.fillRoundedRect(0, 0, 400, 300, 10);
        holoPanel.strokeRoundedRect(0, 0, 400, 300, 10);
        holoPanel.generateTexture('holoPanel', 400, 300);
        holoPanel.destroy();

        // Energy button
        const energyBtn = this.add.graphics();
        energyBtn.lineStyle(2, 0x00ff88, 1);
        energyBtn.fillGradientStyle(0x003366, 0x006699, 0x0099cc, 0x00ccff, 0.8);
        energyBtn.fillRoundedRect(0, 0, 180, 45, 8);
        energyBtn.strokeRoundedRect(0, 0, 180, 45, 8);
        energyBtn.generateTexture('energyButton', 180, 45);
        energyBtn.destroy();
    }

    createCoreTextures() {
        // Central core orb
        const coreOrb = this.add.graphics();
        coreOrb.fillGradientStyle(0x00ffff, 0x0088ff, 0x0066cc, 0x004499, 1);
        coreOrb.fillCircle(60, 60, 60);
        coreOrb.lineStyle(3, 0x00ffff, 0.8);
        coreOrb.strokeCircle(60, 60, 60);
        coreOrb.generateTexture('coreOrb', 120, 120);
        coreOrb.destroy();

        // Energy ring
        const energyRing = this.add.graphics();
        energyRing.lineStyle(4, 0x00ff88, 0.6);
        energyRing.strokeCircle(40, 40, 40);
        energyRing.generateTexture('energyRing', 80, 80);
        energyRing.destroy();

        // Data node
        const dataNode = this.add.graphics();
        dataNode.fillStyle(0x00ffff, 0.8);
        dataNode.fillCircle(4, 4, 4);
        dataNode.lineStyle(1, 0x00ffff, 1);
        dataNode.strokeCircle(4, 4, 6);
        dataNode.generateTexture('dataNode', 8, 8);
        dataNode.destroy();
    }

    createEnergyTextures() {
        // Lightning effect
        const lightning = this.add.graphics();
        lightning.lineStyle(2, 0xffff00, 0.9);
        lightning.beginPath();
        lightning.moveTo(0, 20);
        lightning.lineTo(5, 10);
        lightning.lineTo(3, 5);
        lightning.lineTo(8, 0);
        lightning.strokePath();
        lightning.generateTexture('lightning', 8, 20);
        lightning.destroy();

        // Glow orb
        const glowOrb = this.add.graphics();
        glowOrb.fillGradientStyle(0x00ffff, 0x00ffff, 0x00ffff, 0x00ffff, 1, 0);
        glowOrb.fillCircle(15, 15, 15);
        glowOrb.generateTexture('glowOrb', 30, 30);
        glowOrb.destroy();
    }

    createSpaceBackground(gameWidth, gameHeight) {
        // Main space background
        this.background = this.add.image(gameWidth / 2, gameHeight / 2, 'spaceBackground');
        this.background.setDisplaySize(gameWidth, gameHeight);

        // Add stars
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, gameWidth),
                Phaser.Math.Between(0, gameHeight),
                Phaser.Math.Between(1, 3),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 1)
            );

            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Animated grid overlay
        this.createEnergyGrid(gameWidth, gameHeight);
    }

    createEnergyGrid(gameWidth, gameHeight) {
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0x003366, 0.3);

        const gridSize = 50;
        for (let x = 0; x <= gameWidth; x += gridSize) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, gameHeight);
        }
        for (let y = 0; y <= gameHeight; y += gridSize) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(gameWidth, y);
        }
        gridGraphics.strokePath();

        // Animate grid opacity
        this.tweens.add({
            targets: gridGraphics,
            alpha: 0.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
     }

    createEnergyCore(gameWidth, gameHeight) {
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

        // Main core container
        this.coreContainer = this.add.container(centerX, centerY);

        // Central orb (the main focus)
        this.centralOrb = this.add.image(0, 0, 'coreOrb');
        this.centralOrb.setScale(1.5);
        this.coreContainer.add(this.centralOrb);

        // Rotating energy rings
        for (let i = 0; i < 3; i++) {
            const ring = this.add.image(0, 0, 'energyRing');
            ring.setScale(1 + i * 0.5);
            ring.setAlpha(0.6 - i * 0.1);
            this.energyRings.push(ring);
            this.coreContainer.add(ring);

            // Rotate each ring at different speeds
            this.tweens.add({
                targets: ring,
                rotation: Math.PI * 2,
                duration: 3000 + i * 1000,
                repeat: -1,
                ease: 'Linear'
            });
        }

        // Pulsing glow effect
        const coreGlow = this.add.image(0, 0, 'glowOrb');
        coreGlow.setScale(4);
        coreGlow.setAlpha(0.3);
        this.coreContainer.add(coreGlow);

        this.tweens.add({
            targets: coreGlow,
            scaleX: 5,
            scaleY: 5,
            alpha: 0.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Core entrance animation
        this.coreContainer.setScale(0);
        this.tweens.add({
            targets: this.coreContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 1500,
            ease: 'Elastic.easeOut'
        });

        // Add energy particles around core
        this.createCoreParticles(centerX, centerY);
    }

    createCoreParticles(centerX, centerY) {
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 150;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            const particle = this.add.image(x, y, 'dataNode');
            particle.setScale(Phaser.Math.FloatBetween(0.5, 1.5));

            this.tweens.add({
                targets: particle,
                rotation: Math.PI * 2,
                duration: 4000,
                repeat: -1,
                ease: 'Linear'
            });

            this.tweens.add({
                targets: particle,
                alpha: 0.3,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Orbit around core
            this.tweens.add({
                targets: particle,
                x: centerX + Math.cos(angle + Math.PI * 2) * radius,
                y: centerY + Math.sin(angle + Math.PI * 2) * radius,
                duration: 8000,
                repeat: -1,
                ease: 'Linear'
            });
        }
    }

    createHolographicInterface(gameWidth, gameHeight) {
        // Title with holographic effect
        this.createHolographicTitle(gameWidth, gameHeight);

        // Code panel
        this.createCodePanel(gameWidth, gameHeight);

        // Question panel
        this.createQuestionPanel(gameWidth, gameHeight);
    }

    createHolographicTitle(gameWidth, gameHeight) {
        const titleY = gameHeight * 0.15;

        // Main title
        this.titleText = this.add.text(gameWidth / 2, titleY, 'SISTEMA DE ENERGÍA CRÍTICO', {
            fontSize: `${Math.min(gameWidth * 0.025, 30)}px`, // Tamaño aún más reducido
            fontFamily: 'Arial Black',
            fill: '#00ffff',
            stroke: '#003366',
            strokeThickness: 2,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ffff',
                blur: 10,
                stroke: true,
                fill: true
            }
        }).setOrigin(0.5);

        // Subtitle with typewriter effect
        this.subtitleText = this.add.text(gameWidth / 2, titleY + 40, '', { // Espaciado aún más reducido
            fontSize: `${Math.min(gameWidth * 0.015, 18)}px`, // Tamaño aún más reducido
            fontFamily: 'Arial',
            fill: '#00ff88',
            stroke: '#002244',
            strokeThickness: 1
        }).setOrigin(0.5);

        const subtitleContent = 'Detecta y corrige los fallos en el código';
        let charIndex = 0;

        const typewriterTimer = this.time.addEvent({
            delay: 100,
            callback: () => {
                this.subtitleText.text += subtitleContent[charIndex];
                charIndex++;
                if (charIndex >= subtitleContent.length) {
                    typewriterTimer.destroy();
                    this.addCursor();
                }
            },
            repeat: subtitleContent.length - 1
        });

        // Title entrance animation
        this.titleText.setAlpha(0);
        this.titleText.setScale(0.5);
        this.tweens.add({
            targets: this.titleText,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 1000,
            ease: 'Back.easeOut'
        });
    }

    addCursor() {
        this.cursor = this.add.text(
            this.subtitleText.x + this.subtitleText.width / 2 + 5,
            this.subtitleText.y,
            '|',
            {
                fontSize: `${Math.min(this.scale.width * 0.02, 24)}px`,
                fontFamily: 'Arial',
                fill: '#00ff88'
            }
        ).setOrigin(0, 0.5);

        this.tweens.add({
            targets: this.cursor,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    createCodePanel(gameWidth, gameHeight) {
        const panelX = gameWidth * 0.25;
        const panelY = gameHeight * 0.5; // Match diagnostic panel Y position

        // Code panel background
        this.codePanel = this.add.image(panelX, panelY, 'holoPanel');
        this.codePanel.setScale(1.1); // Tamaño aumentado para que el código no se salga
        this.codePanel.setAlpha(0);

        // Code title
        this.add.text(panelX, panelY - 110, 'CÓDIGO DEL SISTEMA', { // Posición ajustada para panel aún más pequeño
            fontSize: `${Math.min(gameWidth * 0.02, 22)}px`, // Tamaño aún más reducido
            fontFamily: 'Arial Bold',
            fill: '#00ffff',
            stroke: '#003366',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Code content with syntax highlighting
        const codeLines = [
          "int bateria = 9;",
          "int sensorVoltaje = A0;",
          "void setup() {",
          "  pinMode(bateria, OUTPUT);",
          "}",
          "void loop() {",
          "  int voltaje = analogRead(sensorVoltaje);",
          " ",
          "  if (voltaje < 500) {",
          "    digitalWrite(bateria, HIGH);",
          "   }",
          "}",
        ];

        this.codeElements = [];
        codeLines.forEach((line, index) => {
            const codeText = this.add.text(
                panelX - 120, // Posición ajustada para panel aún más pequeño
                panelY - 80 + index * 20, // Espaciado aún más reducido
                line,
                {
                    fontSize: `${Math.min(gameWidth * 0.01, 14)}px`, // Tamaño de fuente aún más reducido
                    fontFamily: 'Courier New',
                    fill: this.getCodeColor(line),
                    backgroundColor: 'rgba(0, 20, 40, 0.3)',
                    padding: { x: 5, y: 2 }, // Padding aún más reducido
                    wordWrap: { width: 240, useAdvancedWrap: true } // Ancho aún más reducido para panel más pequeño
                }
            );
            this.codeElements.push(codeText);
            codeText.setAlpha(0);
        });

        // Animate code panel entrance
        this.tweens.add({
            targets: this.codePanel,
            alpha: 1,
            x: panelX + 20,
            duration: 800,
            delay: 500,
            ease: 'Power2.easeOut'
        });

        // Animate code lines
        this.codeElements.forEach((element, index) => {
            this.tweens.add({
                targets: element,
                alpha: 1,
                x: element.x + 20,
                duration: 400,
                delay: 800 + index * 150,
                ease: 'Power2.easeOut'
            });
        });
    }

    getCodeColor(line) {
        // All code lines will be white - no special colors
        return '#ffffff';
    }

    createQuestionPanel(gameWidth, gameHeight) {
        const panelX = gameWidth * 0.75; // Centered better position
        const panelY = gameHeight * 0.5; // More centered vertically

        // Question panel background
        this.questionPanel = this.add.image(panelX, panelY, 'holoPanel');
        this.questionPanel.setScale(1.1); // Tamaño aumentado para que las opciones no se salgan
        this.questionPanel.setAlpha(0);

        // Question title
        this.add.text(panelX, panelY - 110, 'DIAGNÓSTICO', { // Posición ajustada para panel aún más pequeño
            fontSize: `${Math.min(gameWidth * 0.02, 22)}px`, // Tamaño aún más reducido
            fontFamily: 'Arial Bold',
            fill: '#00ff88',
            stroke: '#003366',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Question text
        this.questionText = this.add.text(
            panelX,
            panelY - 80, // Posición ajustada para panel aún más pequeño
            '¿Cuál es el error en este código?',
            {
                fontSize: `${Math.min(gameWidth * 0.015, 17)}px`, // Tamaño de fuente aún más reducido
                fontFamily: 'Arial',
                fill: '#ffffff',
                wordWrap: { width: 300 }, // Ancho aún más reducido para panel más pequeño
                align: 'center'
            }
        ).setOrigin(0.5);

        // Answer options
        const answers = [
            'Falta definir sensorVoltaje como entrada',
            'No hay un control para evitar sobrecarga en la batería',
            'Se debería usar digitalRead() en vez de analogRead()',
            'El código no regula la eficiencia energética'
        ];

        this.answerButtons = [];
        answers.forEach((answer, index) => {
            const buttonY = panelY - 30 + index * 50; // Espaciado aún más reducido para botones más compactos

            // Button background
            const buttonBg = this.add.image(panelX, buttonY, 'energyButton');
            buttonBg.setAlpha(0);
            buttonBg.setInteractive();
            buttonBg.setScale(1.4, 1.0); // Tamaño aún más reducido

            // Button text
            const buttonText = this.add.text(panelX, buttonY, answer, {
                fontSize: `${Math.min(gameWidth * 0.011, 13)}px`, // Tamaño de fuente aún más reducido
                fontFamily: 'Arial',
                fill: '#ffffff',
                wordWrap: { width: 250, useAdvancedWrap: true }, // Ancho aún más reducido
                align: 'center'
            }).setOrigin(0.5);
            buttonText.setAlpha(0);

            // Button hover effects - NO ANIMATIONS, only color change
            buttonBg.on('pointerover', () => {
                buttonText.setFill('#00ffff');
            });

            buttonBg.on('pointerout', () => {
                buttonText.setFill('#ffffff');
            });

            buttonBg.on('pointerdown', () => {
                this.checkAnswer(index, buttonBg, buttonText, gameWidth, gameHeight);
            });

            this.answerButtons.push({ bg: buttonBg, text: buttonText });
        });

        // Animate question panel entrance
        this.tweens.add({
            targets: this.questionPanel,
            alpha: 1,
            x: panelX - 20,
            duration: 800,
            delay: 1000,
            ease: 'Power2.easeOut'
        });

        // Animate question elements
        this.tweens.add({
            targets: this.questionText,
            alpha: 1,
            duration: 600,
            delay: 1200,
            ease: 'Power2.easeOut'
        });

        this.answerButtons.forEach((button, index) => {
            this.tweens.add({
                targets: [button.bg, button.text],
                alpha: 1,
                x: button.bg.x - 10,
                duration: 400,
                delay: 1400 + index * 200,
                ease: 'Power2.easeOut'
            });
        });
    }

    checkAnswer(selectedIndex, buttonBg, buttonText, gameWidth, gameHeight) {
        // Disable all buttons
        this.answerButtons.forEach(button => {
            button.bg.removeInteractive();
        });

        if (selectedIndex === 1) { // Correct answer (option B)
            this.showCorrectAnswer(buttonBg, buttonText, gameWidth, gameHeight);
        } else {
            this.showIncorrectAnswer(buttonBg, buttonText, gameWidth, gameHeight);
        }
    }

    showCorrectAnswer(buttonBg, buttonText, gameWidth, gameHeight) {
        // Success animation for button
        this.tweens.add({
            targets: [buttonBg, buttonText],
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 300,
            yoyo: true,
            ease: 'Power2.easeOut'
        });

        buttonText.setFill('#00ff00');

        // Hide incorrect answer buttons with fade out animation
        this.answerButtons.forEach(button => {
            if (button.bg !== buttonBg) {
                this.tweens.add({
                    targets: [button.bg, button.text],
                    alpha: 0,
                    duration: 500,
                    ease: 'Power2.easeOut',
                    onComplete: () => {
                        button.bg.destroy();
                        button.text.destroy();
                        // Also destroy red overlay if it exists
                        if (button.redOverlay) {
                            button.redOverlay.destroy();
                        }
                    }
                });
            }
        });

        // Core success animation
        this.tweens.add({
            targets: this.centralOrb,
            scaleX: 2,
            scaleY: 2,
            duration: 500,
            yoyo: true,
            ease: 'Power2.easeOut'
        });

        // Success particles explosion
        this.createSuccessExplosion(gameWidth / 2, gameHeight / 2);

        // Success message - ajustado para no salirse de la pantalla
        const successText = this.add.text(gameWidth / 2, gameHeight * 0.8, '¡CORRECTO! SISTEMA ESTABILIZADO', {
            fontSize: `${Math.min(gameWidth * 0.035, 32)}px`,
            fontFamily: 'Arial Black',
            fill: '#00ff00',
            stroke: '#003300',
            strokeThickness: 2,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ff00',
                blur: 15,
                stroke: true,
                fill: true
            },
            wordWrap: { width: gameWidth * 0.9 },
            align: 'center'
        }).setOrigin(0.5);

        successText.setAlpha(0);
        this.tweens.add({
            targets: successText,
            alpha: 1,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            ease: 'Elastic.easeOut'
        });

        // Create continue button after delay
        this.time.delayedCall(2000, () => {
            // Show the correct code view instead of just creating a button
            const correctedCode = `int bateria = 9;
int sensorVoltaje = A0;

void setup() {
  pinMode(bateria, OUTPUT);
}

void loop() {
  int voltaje = analogRead(sensorVoltaje);

  if (voltaje < 500) {
    digitalWrite(bateria, HIGH);
  }

  // ✅ Control de sobrecarga añadido
  if (voltaje > 860) {
    digitalWrite(bateria, LOW);
  }
}`;
            this.showCorrectCode(correctedCode);
        });
    }

    showIncorrectAnswer(buttonBg, buttonText, gameWidth, gameHeight) {
        // Create a red rectangle overlay for the button
        const redOverlay = this.add.rectangle(buttonBg.x, buttonBg.y, buttonBg.width * buttonBg.scaleX, buttonBg.height * buttonBg.scaleY, 0xff0000, 0.8);
        redOverlay.setDepth(buttonBg.depth + 1);

        // Store the red overlay reference in the button object for later removal
        this.answerButtons.forEach(button => {
            if (button.bg === buttonBg) {
                button.redOverlay = redOverlay;
            }
        });

        // Make sure text is above the red overlay
        buttonText.setDepth(redOverlay.depth + 1);

        // Error animation for button
        this.tweens.add({
            targets: [buttonBg, buttonText, redOverlay],
            x: buttonBg.x + 10,
            duration: 100,
            yoyo: true,
            repeat: 3,
            ease: 'Power2.easeOut'
        });

        buttonText.setFill('#ffffff'); // Keep text white for better contrast on red background

        // Core error animation
        this.tweens.add({
            targets: this.centralOrb,
            tint: 0xff0000,
            duration: 200,
            yoyo: true,
            repeat: 2
        });

        // Error message
        const errorText = this.add.text(gameWidth / 2, gameHeight * 0.8, 'INCORRECTO - SISTEMA INESTABLE', {
            fontSize: `${Math.min(gameWidth * 0.04, 42)}px`,
            fontFamily: 'Arial Black',
            fill: '#ff0000',
            stroke: '#330000',
            strokeThickness: 3
        }).setOrigin(0.5);

        errorText.setAlpha(0);
        this.tweens.add({
            targets: errorText,
            alpha: 1,
            duration: 500,
            ease: 'Power2.easeOut'
        });

        // Re-enable buttons after delay (but keep the incorrect one red)
        this.time.delayedCall(2000, () => {
            this.answerButtons.forEach(button => {
                // Only re-enable buttons that are not the incorrect one
                if (button.bg !== buttonBg) {
                    button.bg.setInteractive();
                    button.text.setFill('#ffffff');
                }
            });
            errorText.destroy();
        });
    }

    createSuccessExplosion(x, y) {
        for (let i = 0; i < 30; i++) {
            const particle = this.add.image(x, y, 'dataNode');
            particle.setTint(Phaser.Math.Between(0x00ff00, 0x00ffff));
            particle.setScale(Phaser.Math.FloatBetween(1, 2));

            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const speed = Phaser.Math.FloatBetween(100, 300);

            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scaleX: 0,
                scaleY: 0,
                duration: 1500,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    createContinueButton(gameWidth, gameHeight) {
        const buttonX = gameWidth / 2;
        const buttonY = gameHeight * 0.9;

        const continueButton = this.add.image(buttonX, buttonY, 'energyButton');
        continueButton.setScale(1.5);
        continueButton.setInteractive();

        const continueText = this.add.text(buttonX, buttonY, 'CONTINUAR', {
            fontSize: `${Math.min(gameWidth * 0.02, 22)}px`,
            fontFamily: 'Arial Bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Button animations
        continueButton.on('pointerover', () => {
            this.tweens.add({
                targets: [continueButton, continueText],
                scaleX: 1.7,
                scaleY: 1.7,
                duration: 200,
                ease: 'Power2.easeOut'
            });
        });

        continueButton.on('pointerout', () => {
            this.tweens.add({
                targets: [continueButton, continueText],
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 200,
                ease: 'Power2.easeOut'
            });
        });

        continueButton.on('pointerdown', () => {
            // Show the correct code before continuing
            const correctedCode = `int bateria = 9;
int sensorVoltaje = A0;

void setup() {
  pinMode(bateria, OUTPUT);
}

void loop() {
  int voltaje = analogRead(sensorVoltaje);

  if (voltaje < 500) {
    digitalWrite(bateria, HIGH);
  }

  // ✅ Control de sobrecarga añadido
  if (voltaje > 860) {
    digitalWrite(bateria, LOW);
  }
}`;
            this.showCorrectCode(correctedCode);
        });

        // Entrance animation
        continueButton.setAlpha(0);
        continueText.setAlpha(0);
        this.tweens.add({
            targets: [continueButton, continueText],
            alpha: 1,
            duration: 800,
            ease: 'Power2.easeOut'
        });
    }

    showCorrectCode(correctedCode) {
        // Clear existing scene elements
        this.clearCurrentScene();

        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        // Initialize codeViewElements array
        this.codeViewElements = [];

        // Create premium background for corrected code view
        this.createPremiumCodeBackground(gameWidth, gameHeight);

        // Create main code display area
        this.createCodeDisplayArea(gameWidth, gameHeight, correctedCode);

        // Create feedback panel instead of diagnostics
        this.createFeedbackPanel(gameWidth, gameHeight);

        // Create continue button
        this.createContinueButton(gameWidth, gameHeight);

        // Add entrance animations
        this.animateCodeViewEntrance();
    }

    clearCurrentScene() {
        // Clear all existing elements from the scene
        if (this.coreContainer) this.coreContainer.destroy();
        if (this.hologramElements) {
            this.hologramElements.forEach(element => element.destroy());
            this.hologramElements = [];
        }
        if (this.dataStreams) {
            this.dataStreams.forEach(element => element.destroy());
            this.dataStreams = [];
        }
        if (this.particles) {
            this.particles.forEach(element => element.destroy());
            this.particles = [];
        }
        if (this.energyRings) {
            this.energyRings.forEach(element => element.destroy());
            this.energyRings = [];
        }
        if (this.coreElements) {
            this.coreElements.forEach(element => element.destroy());
            this.coreElements = [];
        }

        // Clear background and grid
        if (this.background) this.background.destroy();

        // Stop all existing tweens
        this.tweens.killAll();
    }

    createPremiumCodeBackground(gameWidth, gameHeight) {
        // Create space-themed background with deep blues and cosmic feel
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0c0c1e, 0x1a1a2e, 0x16213e, 0x0f172a, 1);
        bg.fillRect(0, 0, gameWidth, gameHeight);

        // Add subtle starfield effect
        this.createStarField(gameWidth, gameHeight);

        // Add floating particles for cosmic ambiance
        this.createFloatingParticles();

        // Add subtle hexagonal grid pattern for futuristic feel
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x475569, 0.08);
        const gridSize = 60;
        for (let x = 0; x <= gameWidth; x += gridSize) {
            grid.moveTo(x, 0);
            grid.lineTo(x, gameHeight);
        }
        for (let y = 0; y <= gameHeight; y += gridSize) {
            grid.moveTo(0, y);
            grid.lineTo(gameWidth, y);
        }
        grid.strokePath();

        this.codeViewElements.push(bg, grid);
    }

    createStarField(gameWidth, gameHeight) {
        // No star field - completely clean background
    }

    createCodeDisplayArea(gameWidth, gameHeight, correctedCode) {
        // Main code container with space-themed glass effect - REDUCED SIZE
        const codeContainer = this.add.container(gameWidth / 2, gameHeight / 2);

        // Simple solid background - SMALLER DIMENSIONS
        const codeBg = this.add.graphics();
        codeBg.fillStyle(0x2d3748, 1.0); // Solid dark blue-gray background
        codeBg.fillRoundedRect(-gameWidth * 0.3, -gameHeight * 0.25, gameWidth * 0.6, gameHeight * 0.4, 20); // Reduced from 0.4/0.35/0.8/0.5
        codeBg.lineStyle(2, 0x4a5568, 1.0); // Simple gray border
        codeBg.strokeRoundedRect(-gameWidth * 0.3, -gameHeight * 0.25, gameWidth * 0.6, gameHeight * 0.4, 20); // Reduced dimensions
        codeContainer.add(codeBg);

        // Simple professional title - SMALLER FONT
        const title = this.add.text(0, -gameHeight * 0.30, '✅ CÓDIGO CORREGIDO', {
            fontSize: `${Math.min(gameWidth * 0.025, 24)}px`, // Reduced from 32px
            fontFamily: 'Arial',
            fill: '#ffffff', // Simple white text
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        codeContainer.add(title);

        // Code display with enhanced readability - SMALLER FONT AND SPACING
        const codeLines = correctedCode.split('\n');
        const startY = -gameHeight * 0.22; // Adjusted start position
        const lineHeight = Math.min(gameHeight * 0.018, 14); // Reduced from 0.025/20

        this.correctedCodeElements = [];

        codeLines.forEach((line, index) => {
            const y = startY + index * lineHeight;

            // Create more visible background for each line - SMALLER WIDTH
            const lineBg = this.add.graphics();
            lineBg.fillStyle(0x1e293b, 0.6); // Increased opacity from 0.2 to 0.6
            lineBg.fillRoundedRect(-gameWidth * 0.25, y - lineHeight/2, gameWidth * 0.5, lineHeight, 3); // Reduced width
            codeContainer.add(lineBg);

            // Apply enhanced syntax highlighting with better contrast - CRISP RENDERING
            const styledLine = this.applySyntaxHighlighting(line);
            const codeLine = this.add.text(-gameWidth * 0.22, y, styledLine.text, { // Adjusted position
                fontSize: `${Math.min(gameWidth * 0.012, 16)}px`, // Increased back to 16px for better clarity
                fontFamily: 'Consolas, "Courier New", monospace', // Better font for code readability
                fill: styledLine.color,
                backgroundColor: styledLine.bgColor || 'transparent',
                stroke: styledLine.strokeColor || '#000000', // Dynamic stroke color
                strokeThickness: 0.5, // Reduced stroke thickness for cleaner look
                resolution: 2, // Higher resolution for crisp rendering
                antialias: true, // Enable antialiasing for smooth text
                padding: { x: 2, y: 2 } // Add padding for better text rendering
            }).setOrigin(0, 0.5);

            codeContainer.add(codeLine);
            this.correctedCodeElements.push(lineBg);
            this.correctedCodeElements.push(codeLine);
        });

        this.codeViewElements.push(codeContainer);
        this.mainCodeContainer = codeContainer;
    }

    applySyntaxHighlighting(line) {
        // Simplified syntax highlighting - sin colores para mejor legibilidad
        const trimmedLine = line.trim();
        
        // Todos los elementos del código ahora usan el mismo color limpio
        return { 
            text: line, 
            color: '#f8f9fa', // Color blanco limpio para todo el código
            bgColor: 'rgba(248, 249, 250, 0.05)', // Fondo sutil uniforme
            strokeColor: '#495057' // Contorno gris sutil para definición
        };
    }

    createFeedbackPanel(gameWidth, gameHeight) {
        // Modern feedback panel with glass morphism effect
        const feedbackContainer = this.add.container(gameWidth / 2, gameHeight * 0.8);

        // Main panel with modern glass effect
        const feedbackBg = this.add.graphics();
        
        // Gradient background with glass effect
        feedbackBg.fillGradientStyle(0x1a202c, 0x2d3748, 0x4a5568, 0x2d3748, 1, 0.95, 0.9, 0.95);
        feedbackBg.fillRoundedRect(-gameWidth * 0.35, -gameHeight * 0.08, gameWidth * 0.7, gameHeight * 0.16, 25);
        
        // Glowing border effect
        feedbackBg.lineStyle(3, 0x00ff88, 0.8);
        feedbackBg.strokeRoundedRect(-gameWidth * 0.35, -gameHeight * 0.08, gameWidth * 0.7, gameHeight * 0.16, 25);
        
        // Inner glow effect
        feedbackBg.lineStyle(1, 0x66ffaa, 0.4);
        feedbackBg.strokeRoundedRect(-gameWidth * 0.34, -gameHeight * 0.075, gameWidth * 0.68, gameHeight * 0.15, 23);
        
        feedbackContainer.add(feedbackBg);

        // Success icon with glow effect
        const successIcon = this.add.text(-gameWidth * 0.25, -gameHeight * 0.02, '🎉', {
            fontSize: '36px',
            fill: '#00ff88'
        }).setOrigin(0.5);
        
        // Add glow effect to icon
        successIcon.setStroke('#ffffff', 2);
        successIcon.setShadow(0, 0, '#00ff88', 10, true, true);
        feedbackContainer.add(successIcon);

        // Modern success message with enhanced typography - ajustado para pantalla
        const feedbackTitle = this.add.text(0, -gameHeight * 0.05, '¡EXCELENTE TRABAJO!', {
            fontSize: `${Math.min(gameWidth * 0.018, 24)}px`,
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            stroke: '#00ff88',
            strokeThickness: 1,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 3,
                fill: true
            },
            wordWrap: { width: gameWidth * 0.6 },
            align: 'center'
        }).setOrigin(0.5);
        feedbackContainer.add(feedbackTitle);

        // Enhanced feedback message with modern styling - ajustado para pantalla
        const feedbackMessage = this.add.text(0, 0, 'Has identificado correctamente que faltaba el control de sobrecarga.\nEl código ahora protege la batería de voltajes peligrosos mayores a 860V.', {
            fontSize: `${Math.min(gameWidth * 0.012, 16)}px`,
            fontFamily: 'Arial',
            fill: '#e2e8f0',
            stroke: '#2d3748',
            strokeThickness: 1,
            align: 'center',
            wordWrap: { width: gameWidth * 0.55 }
        }).setOrigin(0.5);
        feedbackContainer.add(feedbackMessage);

        // Animated particles effect
        this.createSuccessParticles(feedbackContainer, gameWidth);

        this.codeViewElements.push(feedbackContainer);
        this.feedbackContainer = feedbackContainer;
    }

    createContinueButton(gameWidth, gameHeight) {
        // Enhanced continue button with modern design
        const buttonContainer = this.add.container(gameWidth / 2, gameHeight * 0.92);

        // Button background with gradient and glow
        const buttonBg = this.add.graphics();
        
        // Main gradient background
        buttonBg.fillGradientStyle(0x00ff88, 0x00cc66, 0x009944, 0x00ff88, 1, 0.9, 0.8, 0.9);
        buttonBg.fillRoundedRect(-120, -25, 240, 50, 25);
        
        // Outer glow effect
        buttonBg.lineStyle(3, 0x66ffaa, 0.6);
        buttonBg.strokeRoundedRect(-120, -25, 240, 50, 25);
        
        // Inner highlight
        buttonBg.lineStyle(1, 0xffffff, 0.3);
        buttonBg.strokeRoundedRect(-118, -23, 236, 46, 23);
        
        buttonContainer.add(buttonBg);

        // Button text with enhanced styling
        const buttonText = this.add.text(0, 0, 'CONTINUAR', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            stroke: '#004422',
            strokeThickness: 2,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 2,
                fill: true
            }
        }).setOrigin(0.5);
        buttonContainer.add(buttonText);

        // Interactive effects
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-120, -25, 240, 50), Phaser.Geom.Rectangle.Contains);
        
        // Hover effects
        buttonContainer.on('pointerover', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Power2.easeOut'
            });
            
            // Glow pulse effect
            this.tweens.add({
                targets: buttonBg,
                alpha: 0.8,
                duration: 300,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        buttonContainer.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2.easeOut'
            });
            
            // Stop glow pulse
            this.tweens.killTweensOf(buttonBg);
            buttonBg.alpha = 1;
        });

        buttonContainer.on('pointerdown', () => {
            // Click animation
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2.easeOut'
            });
            
            // Proceed to next level
            this.time.delayedCall(200, () => {
                this.scene.start('scenaVideo2');
            });
        });

        this.codeViewElements.push(buttonContainer);
        this.continueButton = buttonContainer;
    }

    createSuccessParticles(container, gameWidth) {
        // Create floating success particles around the feedback panel
        for (let i = 0; i < 12; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(-gameWidth * 0.3, gameWidth * 0.3),
                Phaser.Math.Between(-40, 40),
                Phaser.Math.Between(2, 5),
                0x00ff88,
                0.7
            );
            
            container.add(particle);
            
            // Floating animation
            this.tweens.add({
                targets: particle,
                y: particle.y - 30,
                alpha: 0,
                scaleX: 0.3,
                scaleY: 0.3,
                duration: Phaser.Math.Between(2000, 3000),
                delay: i * 100,
                ease: 'Power2.easeOut',
                repeat: -1
            });
        }
    }

    animateCodeViewEntrance() {
        // Set initial alpha and position for all elements
        this.codeViewElements.forEach(element => {
            element.setAlpha(0);
            if (element === this.mainCodeContainer) {
                element.y += 30; // Start slightly lower
            }
        });

        // Staggered entrance animation with elegant timing
        const animationDelay = 200;

        // 1. Background fade in
        this.tweens.add({
            targets: this.codeViewElements[0], // background
            alpha: 1,
            duration: 600,
            ease: 'Power2.easeOut'
        });

        // 2. Code container slides up and fades in
        this.tweens.add({
            targets: this.mainCodeContainer,
            alpha: 1,
            y: this.mainCodeContainer.y - 30,
            duration: 800,
            delay: animationDelay,
            ease: 'Back.easeOut'
        });

        // 3. Feedback panel fades in with scale effect
        this.tweens.add({
            targets: this.feedbackContainer,
            alpha: 1,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 600,
            delay: animationDelay * 2,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Return to normal scale
                this.tweens.add({
                    targets: this.feedbackContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 300,
                    ease: 'Power2.easeOut'
                });
            }
        });

        // 4. Continue button appears with subtle bounce
        this.tweens.add({
            targets: this.continueButton,
            alpha: 1,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 400,
            delay: animationDelay * 3,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Return to normal scale
                this.tweens.add({
                    targets: this.continueButton,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            }
        });
    }

    createDataStreams(gameWidth, gameHeight) {
        // No particles - completely clean background
    }

    startCoreAnimations() {
        // Gentle core pulse animation
        this.time.addEvent({
            delay: 4000,
            callback: () => {
                if (this.centralOrb) {
                    this.tweens.add({
                        targets: this.centralOrb,
                        scaleX: 1.6,
                        scaleY: 1.6,
                        alpha: 0.8,
                        duration: 800,
                        yoyo: true,
                        ease: 'Sine.easeInOut'
                    });
                }
            },
            loop: true
        });

        // Subtle energy ring effect
        this.time.addEvent({
            delay: 6000,
            callback: () => {
                this.energyRings.forEach((ring, index) => {
                    this.tweens.add({
                        targets: ring,
                        alpha: 0.6,
                        scaleX: ring.scaleX + 0.3,
                        scaleY: ring.scaleY + 0.3,
                        duration: 1000,
                        yoyo: true,
                        delay: index * 300,
                        ease: 'Power2.easeOut'
                    });
                });
            },
            loop: true
        });
    }

    update() {
        // Smooth particle rotation for ambient effect
        this.dataStreams.forEach(stream => {
            stream.rotation += 0.01; // Slower, more elegant rotation
        });
    }
}
