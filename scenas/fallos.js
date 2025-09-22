class Fallos extends Phaser.Scene {
    constructor() {
        super({ key: 'Fallos' });
        this.particles = [];
        this.coreElements = [];
        this.energyRings = [];
        this.dataStreams = [];
        this.hologramElements = [];
        this.isMobile = this.checkMobileDevice();
    }

    // Función para detectar dispositivos móviles
    checkMobileDevice() {
        // Usar la misma función de detección que game.js para consistencia
        return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    }

    // Premium particle effects for enhanced visual feedback
    createSuccessExplosion(x, y) {
        // Optimizado para móviles: menos partículas y duraciones más cortas
        const colors = [0x00ff88, 0x44ff44, 0x88ff00, 0xffff44, 0x44ffff];
        const particleCount = this.isMobile ? 8 : 15;

        for (let i = 0; i < particleCount; i++) {
            const particle = this.add.circle(x, y, Phaser.Math.Between(3, 8), colors[i % colors.length]);
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = this.isMobile ? Phaser.Math.Between(80, 300) : Phaser.Math.Between(100, 500);

            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scaleX: 0.1,
                scaleY: 0.1,
                duration: this.isMobile ? 600 : 1000,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }

        // Efecto de destellos reducido para móviles
        const sparkleCount = this.isMobile ? 4 : 8;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = this.add.star(x + Phaser.Math.Between(-50, 50),
                                        y + Phaser.Math.Between(-50, 50),
                                        5, 4, 8, 0xffffff);
            this.tweens.add({
                targets: sparkle,
                alpha: 0,
                scaleX: this.isMobile ? 1.5 : 2,
                scaleY: this.isMobile ? 1.5 : 2,
                rotation: Math.PI * 2,
                duration: this.isMobile ? 500 : 800,
                delay: i * (this.isMobile ? 80 : 100),
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
        // Optimizado para móviles: menos partículas y animaciones más eficientes
        const particles = [];
        const particleCount = this.isMobile ? 10 : 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Math.Between(1, 3),
                0x8b5cf6,
                Phaser.Math.FloatBetween(0.1, 0.3)
            );

            particles.push(particle);

            // Animación flotante continua optimizada para móviles
            this.tweens.add({
                targets: particle,
                y: particle.y - 100,
                x: particle.x + Phaser.Math.Between(-50, 50),
                duration: this.isMobile ? Phaser.Math.Between(4000, 8000) : Phaser.Math.Between(3000, 6000),
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
                delay: i * (this.isMobile ? 300 : 200)
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

        // Debug logging para móviles
        if (this.isMobile) {
            console.log('🔍 FALLOS SCENE - Mobile Debug Info:', {
                gameWidth,
                gameHeight,
                scaleWidth: this.scale.width,
                scaleHeight: this.scale.height,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio || 1
            });
        }

        // Asegurar que las dimensiones sean válidas con valores mínimos más altos
        if (gameWidth <= 0 || gameHeight <= 0) {
            console.error('❌ FALLOS SCENE - Invalid game dimensions detected:', { gameWidth, gameHeight });
            console.log('🔧 Using emergency fallback dimensions...');

            // Usar dimensiones de emergencia más robustas
            const fallbackWidth = this.isMobile ? Math.max(window.innerWidth, 800) : 1200;
            const fallbackHeight = this.isMobile ? Math.max(window.innerHeight, 600) : 800;

            this.createEmergencyScene(fallbackWidth, fallbackHeight);
            return;
        }

        try {
            console.log('🚀 FALLOS SCENE - Starting scene creation...');

            // Force create a visible background first (critical for mobile)
            this.createFallbackBackground(gameWidth, gameHeight);

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

            console.log('✅ FALLOS SCENE - Scene creation completed successfully');

        } catch (error) {
            console.error('❌ FALLOS SCENE - Critical error during scene creation:', error);
            this.createEmergencyScene(gameWidth, gameHeight);
        }
    }

    // Escena de emergencia para casos críticos
    createEmergencyScene(width, height) {
        console.log('🚨 FALLOS SCENE - Creating emergency scene...');

        // Fondo sólido simple
        const emergencyBg = this.add.graphics();
        emergencyBg.fillStyle(0x001122, 1);
        emergencyBg.fillRect(0, 0, width, height);
        emergencyBg.setDepth(-100);

        // Texto de emergencia
        const emergencyText = this.add.text(width / 2, height / 2, 'SISTEMA DE ENERGÍA\nCARGANDO...', {
            fontSize: this.isMobile ? '24px' : '32px',
            fontFamily: 'Arial',
            fill: '#00ffff',
            align: 'center',
            stroke: '#003366',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Animación simple de carga
        this.tweens.add({
            targets: emergencyText,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Intentar recrear la escena después de un delay
        this.time.delayedCall(3000, () => {
            console.log('🔄 FALLOS SCENE - Attempting scene recreation...');
            this.scene.restart();
        });
    }

    createAdvancedTextures() {
        try {
            console.log('🎨 FALLOS SCENE - Creating advanced textures...');

            // Obtener dimensiones dinámicas basadas en el dispositivo
            const textureWidth = this.isMobile ? Math.max(this.scale.width, 800) : 1920;
            const textureHeight = this.isMobile ? Math.max(this.scale.height, 600) : 1080;

            console.log('📐 Texture dimensions:', { textureWidth, textureHeight, isMobile: this.isMobile });

            // Deep space background con dimensiones responsivas
            const spaceGradient = this.add.graphics();
            spaceGradient.fillGradientStyle(0x000011, 0x001122, 0x000033, 0x002244, 1);
            spaceGradient.fillRect(0, 0, textureWidth, textureHeight);

            // Verificar que la textura se puede generar
            if (textureWidth > 0 && textureHeight > 0) {
                spaceGradient.generateTexture('spaceBackground', textureWidth, textureHeight);
                console.log('✅ Space background texture created successfully');
            } else {
                console.error('❌ Invalid texture dimensions for spaceBackground');
            }
            spaceGradient.destroy();

            // Holographic panel con tamaño adaptativo
            const panelWidth = this.isMobile ? Math.min(300, this.scale.width * 0.8) : 400;
            const panelHeight = this.isMobile ? Math.min(250, this.scale.height * 0.6) : 300;

            const holoPanel = this.add.graphics();
            holoPanel.lineStyle(2, 0x00ffff, 0.8);
            holoPanel.fillStyle(0x001133, 0.3);
            holoPanel.fillRoundedRect(0, 0, panelWidth, panelHeight, 10);
            holoPanel.strokeRoundedRect(0, 0, panelWidth, panelHeight, 10);

            if (panelWidth > 0 && panelHeight > 0) {
                holoPanel.generateTexture('holoPanel', panelWidth, panelHeight);
                console.log('✅ Holo panel texture created successfully');
            }
            holoPanel.destroy();

            // Energy button con tamaño adaptativo
            const buttonWidth = this.isMobile ? 140 : 180;
            const buttonHeight = this.isMobile ? 35 : 45;

            const energyBtn = this.add.graphics();
            energyBtn.lineStyle(2, 0x00ff88, 1);
            energyBtn.fillGradientStyle(0x003366, 0x006699, 0x0099cc, 0x00ccff, 0.8);
            energyBtn.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 8);
            energyBtn.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 8);

            if (buttonWidth > 0 && buttonHeight > 0) {
                energyBtn.generateTexture('energyButton', buttonWidth, buttonHeight);
                console.log('✅ Energy button texture created successfully');
            }
            energyBtn.destroy();

            console.log('🎨 Advanced textures creation completed');

        } catch (error) {
            console.error('❌ FALLOS SCENE - Error creating advanced textures:', error);
            this.createFallbackTextures();
        }
    }

    // Texturas de respaldo simples
    createFallbackTextures() {
        console.log('🔧 FALLOS SCENE - Creating fallback textures...');

        try {
            // Fondo simple
            const simpleBg = this.add.graphics();
            simpleBg.fillStyle(0x001122, 1);
            simpleBg.fillRect(0, 0, 800, 600);
            simpleBg.generateTexture('spaceBackground', 800, 600);
            simpleBg.destroy();

            // Panel simple
            const simplePanel = this.add.graphics();
            simplePanel.fillStyle(0x003366, 0.8);
            simplePanel.fillRect(0, 0, 300, 200);
            simplePanel.generateTexture('holoPanel', 300, 200);
            simplePanel.destroy();

            // Botón simple
            const simpleBtn = this.add.graphics();
            simpleBtn.fillStyle(0x006699, 1);
            simpleBtn.fillRect(0, 0, 120, 30);
            simpleBtn.generateTexture('energyButton', 120, 30);
            simpleBtn.destroy();

            console.log('✅ Fallback textures created successfully');

        } catch (error) {
            console.error('❌ FALLOS SCENE - Critical error creating fallback textures:', error);
        }
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
        // Validar dimensiones antes de crear el fondo
        if (!gameWidth || !gameHeight || gameWidth <= 0 || gameHeight <= 0) {
            console.warn('Invalid dimensions for background creation');
            gameWidth = this.isMobile ? 800 : 1920;
            gameHeight = this.isMobile ? 600 : 1080;
        }

        // Crear fondo directamente con gráficos en lugar de textura
        console.log('🎨 Creating enhanced space background with graphics...');

        // Crear fondo de respaldo siempre (más confiable)
        this.createFallbackBackground(gameWidth, gameHeight);

        // Add enhanced stars con efectos mejorados
        const starCount = this.isMobile ? 60 : 120;
        for (let i = 0; i < starCount; i++) {
            const starSize = Phaser.Math.Between(1, this.isMobile ? 2 : 3);
            const star = this.add.circle(
                Phaser.Math.Between(0, gameWidth),
                Phaser.Math.Between(0, gameHeight),
                starSize,
                0xffffff,
                Phaser.Math.FloatBetween(0.4, 1)
            );

            // Animación de parpadeo mejorada
            const duration = this.isMobile ?
                Phaser.Math.Between(2500, 5000) :
                Phaser.Math.Between(1500, 4000);

            this.tweens.add({
                targets: star,
                alpha: 0.1,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: duration,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Phaser.Math.Between(0, 2000)
            });

            // Añadir brillo ocasional a algunas estrellas
            if (Math.random() < 0.3) {
                this.time.delayedCall(Phaser.Math.Between(1000, 10000), () => {
                    this.createStarBurst(star.x, star.y);
                });
            }
        }

        // Crear nebulosas de fondo
        this.createNebulae(gameWidth, gameHeight);

        // Animated grid overlay
        this.createEnergyGrid(gameWidth, gameHeight);

        // Añadir partículas flotantes ambientales
        this.createAmbientParticles(gameWidth, gameHeight);
    }

    createStarBurst(x, y) {
        // Crear efecto de destello en estrella
        const burst = this.add.circle(x, y, 8, 0xffffff, 0.8);

        this.tweens.add({
            targets: burst,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 800,
            ease: 'Power2.easeOut',
            onComplete: () => burst.destroy()
        });
    }

    createNebulae(gameWidth, gameHeight) {
        // Crear nebulosas de colores suaves en el fondo
        const nebulaCount = this.isMobile ? 3 : 5;
        const colors = [0x4a0e4e, 0x0e2a4a, 0x0e4a2a, 0x4a2a0e];

        for (let i = 0; i < nebulaCount; i++) {
            const nebula = this.add.graphics();
            const color = colors[i % colors.length];
            const size = this.isMobile ?
                Phaser.Math.Between(100, 200) :
                Phaser.Math.Between(150, 300);

            nebula.fillStyle(color, 0.1);
            nebula.fillCircle(
                Phaser.Math.Between(0, gameWidth),
                Phaser.Math.Between(0, gameHeight),
                size
            );

            nebula.setDepth(-50);

            // Animación suave de movimiento
            this.tweens.add({
                targets: nebula,
                x: nebula.x + Phaser.Math.Between(-50, 50),
                y: nebula.y + Phaser.Math.Between(-30, 30),
                duration: Phaser.Math.Between(15000, 25000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createAmbientParticles(gameWidth, gameHeight) {
        // Crear partículas ambientales flotantes
        const particleCount = this.isMobile ? 15 : 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, gameWidth),
                Phaser.Math.Between(0, gameHeight),
                1,
                0x8b5cf6,
                Phaser.Math.FloatBetween(0.2, 0.5)
            );

            particle.setDepth(-30);

            // Movimiento flotante continuo
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-100, 100),
                y: particle.y + Phaser.Math.Between(-80, 80),
                duration: Phaser.Math.Between(8000, 15000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * 300
            });

            // Pulsación de alpha
            this.tweens.add({
                targets: particle,
                alpha: 0.1,
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * 150
            });
        }
    }

    // Método de respaldo para crear un fondo básico
    createFallbackBackground(gameWidth, gameHeight) {
        // Ensure we have valid dimensions
        const width = gameWidth || this.scale.width || window.innerWidth || 800;
        const height = gameHeight || this.scale.height || window.innerHeight || 600;

        console.log('🎨 Creating fallback background:', { width, height });

        const fallbackBg = this.add.graphics();
        fallbackBg.fillGradientStyle(0x000011, 0x001122, 0x000033, 0x002244, 1);
        fallbackBg.fillRect(0, 0, width, height);
        fallbackBg.setDepth(-100);

        // Make sure it's visible
        fallbackBg.setVisible(true);
        fallbackBg.setAlpha(1);

        this.background = fallbackBg;

        console.log('✅ Fallback background created successfully');
    }

    createEnergyGrid(gameWidth, gameHeight) {
        // Crear grilla base con líneas más sutiles
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0x003366, 0.2);

        const gridSize = this.isMobile ? 60 : 50;

        // Líneas verticales
        for (let x = 0; x <= gameWidth; x += gridSize) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, gameHeight);
        }

        // Líneas horizontales
        for (let y = 0; y <= gameHeight; y += gridSize) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(gameWidth, y);
        }
        gridGraphics.strokePath();
        gridGraphics.setDepth(-40);

        // Animación de pulsación de la grilla
        this.tweens.add({
            targets: gridGraphics,
            alpha: 0.05,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Crear líneas de energía pulsantes ocasionales
        this.createEnergyPulses(gameWidth, gameHeight, gridSize);

        // Crear nodos brillantes en intersecciones
        this.createGridNodes(gameWidth, gameHeight, gridSize);
    }

    createEnergyPulses(gameWidth, gameHeight, gridSize) {
        // Crear pulsos de energía que viajan por la grilla
        const pulseCount = this.isMobile ? 3 : 5;

        for (let i = 0; i < pulseCount; i++) {
            this.time.delayedCall(Phaser.Math.Between(2000, 8000), () => {
                this.createSingleEnergyPulse(gameWidth, gameHeight, gridSize);
            });
        }

        // Repetir pulsos periódicamente
        this.time.addEvent({
            delay: this.isMobile ? 12000 : 8000,
            callback: () => {
                if (Math.random() < 0.7) {
                    this.createSingleEnergyPulse(gameWidth, gameHeight, gridSize);
                }
            },
            loop: true
        });
    }

    createSingleEnergyPulse(gameWidth, gameHeight, gridSize) {
        const isVertical = Math.random() < 0.5;
        const pulseGraphics = this.add.graphics();

        if (isVertical) {
            // Pulso vertical
            const x = Math.floor(Phaser.Math.Between(0, gameWidth) / gridSize) * gridSize;
            pulseGraphics.lineStyle(2, 0x00ffff, 0.8);
            pulseGraphics.moveTo(x, 0);
            pulseGraphics.lineTo(x, gameHeight);
            pulseGraphics.strokePath();
        } else {
            // Pulso horizontal
            const y = Math.floor(Phaser.Math.Between(0, gameHeight) / gridSize) * gridSize;
            pulseGraphics.lineStyle(2, 0x00ffff, 0.8);
            pulseGraphics.moveTo(0, y);
            pulseGraphics.lineTo(gameWidth, y);
            pulseGraphics.strokePath();
        }

        pulseGraphics.setDepth(-35);

        // Animación del pulso
        this.tweens.add({
            targets: pulseGraphics,
            alpha: 0,
            duration: 1500,
            ease: 'Power2.easeOut',
            onComplete: () => pulseGraphics.destroy()
        });
    }

    createGridNodes(gameWidth, gameHeight, gridSize) {
        // Crear nodos brillantes en algunas intersecciones
        const nodeCount = this.isMobile ? 8 : 15;

        for (let i = 0; i < nodeCount; i++) {
            const gridX = Math.floor(Phaser.Math.Between(1, gameWidth / gridSize - 1)) * gridSize;
            const gridY = Math.floor(Phaser.Math.Between(1, gameHeight / gridSize - 1)) * gridSize;

            const node = this.add.circle(gridX, gridY, 2, 0x00ffff, 0.6);
            node.setDepth(-30);

            // Animación de pulsación del nodo
            this.tweens.add({
                targets: node,
                scaleX: 2,
                scaleY: 2,
                alpha: 0.2,
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * 200
            });

            // Ocasionalmente crear ondas expansivas desde los nodos
            if (Math.random() < 0.3) {
                this.time.delayedCall(Phaser.Math.Between(3000, 10000), () => {
                    this.createNodeRipple(gridX, gridY);
                });
            }
        }
    }

    createNodeRipple(x, y) {
        // Crear onda expansiva desde un nodo
        const ripple = this.add.circle(x, y, 5, 0x00ffff, 0);
        ripple.setStrokeStyle(1, 0x00ffff, 0.8);
        ripple.setDepth(-25);

        this.tweens.add({
            targets: ripple,
            scaleX: 8,
            scaleY: 8,
            alpha: 0,
            duration: 2000,
            ease: 'Power2.easeOut',
            onComplete: () => ripple.destroy()
        });
    }

    createEnergyCore(gameWidth, gameHeight) {
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

        // Main core container
        this.coreContainer = this.add.container(centerX, centerY);

        // Crear elementos del core usando gráficos en lugar de texturas
        console.log('⚡ Creating energy core with graphics...');

        // Central orb usando gráficos
        const orbGraphics = this.add.graphics();
        orbGraphics.fillGradientStyle(0x00ffff, 0x0088ff, 0x0044ff, 0x002288, 1);
        orbGraphics.fillCircle(0, 0, 40);
        orbGraphics.lineStyle(2, 0x44ffff, 1);
        orbGraphics.strokeCircle(0, 0, 40);
        this.centralOrb = orbGraphics;
        this.coreContainer.add(this.centralOrb);

        // Rotating energy rings usando gráficos
        for (let i = 0; i < 3; i++) {
            const ringGraphics = this.add.graphics();
            const radius = 60 + i * 30;
            ringGraphics.lineStyle(3, 0x00ffaa, 0.6 - i * 0.1);
            ringGraphics.strokeCircle(0, 0, radius);

            this.energyRings.push(ringGraphics);
            this.coreContainer.add(ringGraphics);

            // Rotate each ring at different speeds
            this.tweens.add({
                targets: ringGraphics,
                rotation: Math.PI * 2,
                duration: 3000 + i * 1000,
                repeat: -1,
                ease: 'Linear'
            });
        }

        // Pulsing glow effect usando gráficos
        const glowGraphics = this.add.graphics();
        glowGraphics.fillGradientStyle(0x44ffff, 0x44ffff, 0x0088ff, 0x0088ff, 0.3);
        glowGraphics.fillCircle(0, 0, 120);
        this.coreContainer.add(glowGraphics);

        this.tweens.add({
            targets: glowGraphics,
            scaleX: 1.5,
            scaleY: 1.5,
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

        // Add energy particles around core usando gráficos
        this.createCoreParticles(centerX, centerY);
    }

    createCoreParticles(centerX, centerY) {
        // Reducir partículas para móviles
        const particleCount = this.isMobile ? 10 : 20;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 150;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // Crear partícula usando gráficos en lugar de textura
            const particleGraphics = this.add.graphics();
            particleGraphics.fillStyle(0x00ffaa, 0.8);
            particleGraphics.fillCircle(0, 0, 4);
            particleGraphics.lineStyle(1, 0x44ffff, 1);
            particleGraphics.strokeCircle(0, 0, 4);

            particleGraphics.x = x;
            particleGraphics.y = y;
            particleGraphics.setScale(Phaser.Math.FloatBetween(0.5, 1.5));

            this.tweens.add({
                targets: particleGraphics,
                rotation: Math.PI * 2,
                duration: 4000,
                repeat: -1,
                ease: 'Linear'
            });

            this.tweens.add({
                targets: particleGraphics,
                alpha: 0.3,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Orbit around core
            this.tweens.add({
                targets: particleGraphics,
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

        // Tamaños de fuente optimizados para la configuración 1000x500 del proyecto
        const titleFontSize = this.isMobile ? 
            Math.max(18, Math.min(gameWidth * 0.028, 24)) : 
            Math.max(24, Math.min(gameWidth * 0.022, 28));
        
        const subtitleFontSize = this.isMobile ? 
            Math.max(12, Math.min(gameWidth * 0.018, 16)) : 
            Math.max(14, Math.min(gameWidth * 0.013, 17));

        // Main title con efectos visuales mejorados
        this.titleText = this.add.text(gameWidth / 2, titleY, 'SISTEMA DE ENERGÍA CRÍTICO', {
            fontSize: `${titleFontSize}px`,
            fontFamily: 'Arial Black',
            fill: '#00ffff',
            stroke: '#003366',
            strokeThickness: this.isMobile ? 1 : 2,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ffff',
                blur: this.isMobile ? 8 : 15,
                stroke: true,
                fill: true
            },
            wordWrap: { width: gameWidth * 0.9, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(15);

        // Añadir efecto de parpadeo al título
        this.tweens.add({
            targets: this.titleText,
            alpha: 0.7,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle con efectos mejorados
        const subtitleY = this.isMobile ? titleY + 28 : titleY + 35;
        this.subtitleText = this.add.text(gameWidth / 2, subtitleY, '', {
            fontSize: `${subtitleFontSize}px`,
            fontFamily: 'Arial',
            fill: '#00ff88',
            stroke: '#002244',
            strokeThickness: this.isMobile ? 0.5 : 1,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#00ff88',
                blur: this.isMobile ? 3 : 5,
                stroke: false,
                fill: true
            },
            wordWrap: { width: gameWidth * 0.8, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(15);

        const subtitleContent = 'Detecta y corrige los fallos en el código';
        let charIndex = 0;

        const typewriterTimer = this.time.addEvent({
            delay: this.isMobile ? 120 : 80, // Velocidad optimizada
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

        // Animación de entrada del título mejorada y optimizada
        this.titleText.setAlpha(0);
        this.titleText.setScale(0.3);
        this.tweens.add({
            targets: this.titleText,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: this.isMobile ? 1000 : 800, // Duración reducida para móviles
            ease: 'Back.easeOut'
        });

        // Añadir partículas decorativas alrededor del título
        this.createTitleParticles(gameWidth / 2, titleY, gameWidth);
    }

    createTitleParticles(centerX, centerY, gameWidth) {
        // Crear partículas flotantes alrededor del título
        for (let i = 0; i < (this.isMobile ? 8 : 12); i++) {
            const angle = (i / (this.isMobile ? 8 : 12)) * Math.PI * 2;
            const radius = this.isMobile ? 80 : 120;

            const particle = this.add.circle(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius,
                this.isMobile ? 2 : 3,
                0x00ffff,
                0.6
            );

            // Animación orbital
            this.tweens.add({
                targets: particle,
                rotation: Math.PI * 2,
                duration: Phaser.Math.Between(8000, 12000),
                repeat: -1,
                ease: 'Linear'
            });

            // Animación de pulsación
            this.tweens.add({
                targets: particle,
                scaleX: 1.5,
                scaleY: 1.5,
                alpha: 0.3,
                duration: Phaser.Math.Between(1500, 2500),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: i * 200
            });
        }
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
        // Posicionamiento mejorado para evitar desbordamiento
        const minPanelX = this.isMobile ? 200 : 250;
        const maxPanelX = this.isMobile ? gameWidth - 200 : gameWidth - 250;
        const panelX = Math.max(minPanelX, Math.min(maxPanelX, this.isMobile ? gameWidth * 0.35 : gameWidth * 0.3));
        const panelY = gameHeight * 0.55; // Movido más abajo para evitar superposición con títulos

        // Code panel background con escala más pequeña
        this.codePanel = this.add.image(panelX, panelY, 'holoPanel');
        const panelScale = this.isMobile ?
            Math.min(0.7, gameWidth / 500) : // Reducido significativamente el tamaño
            Math.min(0.85, gameWidth / 700);
        this.codePanel.setScale(panelScale);
        this.codePanel.setAlpha(0);
        this.codePanel.setDepth(10); // Asegurar que esté por debajo de los títulos

        // Code title con posicionamiento ajustado
        const titleFontSize = this.isMobile ?
            Math.min(gameWidth * 0.035, 18) :
            Math.min(gameWidth * 0.016, 20);

        this.add.text(panelX, panelY - (this.isMobile ? 80 : 100), 'CÓDIGO DEL SISTEMA', {
            fontSize: `${titleFontSize}px`,
            fontFamily: 'Arial Bold',
            fill: '#00ffff',
            stroke: '#003366',
            strokeThickness: this.isMobile ? 1 : 1
        }).setOrigin(0.5).setDepth(11);

        // Code content with syntax highlighting
        const codeLines = [
          "int bateria = 9;",
          "int sensorVoltaje = A0;",
          "void setup() {",
          "  pinMode(bateria, OUTPUT);",
          "}",
          "void loop() {",
          "  int voltaje = analogRead(sensorVoltaje);",
          "",
          "  if (voltaje < 500) {",
          "    digitalWrite(bateria, HIGH);",
          "  }",
          "}",
        ];

        this.codeElements = [];

        // Configuración responsiva optimizada para el código
        const codeFontSize = this.isMobile ?
            Math.max(9, Math.min(gameWidth * 0.014, 11)) :
            Math.max(11, Math.min(gameWidth * 0.01, 12));

        const lineSpacing = this.isMobile ? 12 : 16; // Espaciado más compacto para móviles

        // Cálculo dinámico de offsets basado en el tamaño del panel más pequeño
        const panelWidth = this.codePanel.displayWidth * panelScale;
        const panelHeight = this.codePanel.displayHeight * panelScale;

        const leftOffset = -(panelWidth * 0.35); // Reducido el offset
        const topOffset = -(panelHeight * 0.3); // Reducido el offset superior
        const wrapWidth = panelWidth * 0.75; // Reducido el ancho del texto

        codeLines.forEach((line, index) => {
            const codeText = this.add.text(
                panelX + leftOffset,
                panelY + topOffset + index * lineSpacing,
                line,
                {
                    fontSize: `${codeFontSize}px`,
                    fontFamily: 'Courier New',
                    fill: this.getCodeColor(line),
                    backgroundColor: 'rgba(0, 20, 40, 0.3)',
                    padding: { x: this.isMobile ? 2 : 3, y: this.isMobile ? 1 : 2 },
                    wordWrap: { width: wrapWidth, useAdvancedWrap: true }
                }
            );

            this.codeElements.push(codeText);
            codeText.setAlpha(0);
            codeText.setDepth(12);
        });

        // Animación de entrada del panel de código optimizada
        this.tweens.add({
            targets: this.codePanel,
            alpha: 1,
            x: panelX + 5, // Reducido el desplazamiento
            duration: this.isMobile ? 600 : 800, // Más rápido en móviles
            delay: this.isMobile ? 300 : 500, // Delay reducido para móviles
            ease: 'Power2.easeOut'
        });

        // Animación de líneas de código optimizada
        this.codeElements.forEach((element, index) => {
            this.tweens.add({
                targets: element,
                alpha: 1,
                x: element.x + 5, // Reducido el desplazamiento
                duration: this.isMobile ? 300 : 400, // Más rápido en móviles
                delay: (this.isMobile ? 600 : 800) + index * (this.isMobile ? 80 : 100), // Delays reducidos
                ease: 'Power2.easeOut'
            });
        });
    }

    getCodeColor(line) {
        // All code lines will be white - no special colors
        return '#ffffff';
    }

    createQuestionPanel(gameWidth, gameHeight) {
        // Posicionamiento mejorado para evitar desbordamiento
        const minPanelX = this.isMobile ? 200 : 300;
        const maxPanelX = this.isMobile ? gameWidth - 200 : gameWidth - 300;
        const panelX = Math.max(minPanelX, Math.min(maxPanelX, this.isMobile ? gameWidth * 0.7 : gameWidth * 0.75));
        const panelY = gameHeight * 0.55; // Movido más abajo para evitar superposición con títulos

        // Question title con tamaño adaptativo optimizado
        const titleFontSize = this.isMobile ?
            Math.max(12, Math.min(gameWidth * 0.018, 15)) :
            Math.max(14, Math.min(gameWidth * 0.014, 16));

        this.add.text(panelX, panelY - (this.isMobile ? 70 : 85), 'DIAGNÓSTICO', {
            fontSize: `${titleFontSize}px`,
            fontFamily: 'Arial Bold',
            fill: '#ff6b6b',
            stroke: '#330000',
            strokeThickness: this.isMobile ? 0.5 : 1
        }).setOrigin(0.5).setDepth(11);

        // Question text con tamaño adaptativo optimizado
        const questionFontSize = this.isMobile ?
            Math.max(10, Math.min(gameWidth * 0.014, 13)) :
            Math.max(12, Math.min(gameWidth * 0.011, 13));

        this.add.text(panelX, panelY - (this.isMobile ? 40 : 50), '¿Cuál es el error en el código?', {
            fontSize: `${questionFontSize}px`,
            fontFamily: 'Arial',
            fill: '#ffffff',
            wordWrap: { width: this.isMobile ? 200 : 250, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(11);

        // Answer options con configuración mejorada
        const options = [
            'Falta punto y coma',
            'Variable mal declarada',
            'Error en la condición',
            'Función incorrecta'
        ];

        // Initialize answerButtons array
        this.answerButtons = [];

        const buttonFontSize = this.isMobile ?
            Math.max(9, Math.min(gameWidth * 0.012, 11)) :
            Math.max(10, Math.min(gameWidth * 0.009, 11));

        const buttonSpacing = this.isMobile ? 35 : 45; // Espaciado más compacto para móviles
        const startY = this.isMobile ? -15 : 0; // Posición inicial más alta para móviles

        options.forEach((option, index) => {
            const buttonY = panelY + startY + index * buttonSpacing;

            // Button background (recuadro individual) con tamaño más compacto
            const buttonBg = this.add.graphics();
            const bgWidth = this.isMobile ?
                Math.min(150, gameWidth * 0.35) : // Reducido el ancho
                Math.min(180, gameWidth * 0.22);
            const bgHeight = this.isMobile ? 28 : 32; // Reducido la altura

            // Crear recuadro con borde mejorado
            buttonBg.lineStyle(2, 0x00ffff, 0.8);
            buttonBg.fillStyle(0x001122, 0.3);
            buttonBg.fillRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 6);
            buttonBg.strokeRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 6);

            buttonBg.x = panelX;
            buttonBg.y = buttonY;
            buttonBg.setAlpha(0);
            buttonBg.setDepth(10);
            buttonBg.setInteractive(new Phaser.Geom.Rectangle(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight), Phaser.Geom.Rectangle.Contains);

            // Button text con wordWrap mejorado
            const buttonText = this.add.text(panelX, buttonY, option, {
                fontSize: `${buttonFontSize}px`,
                fontFamily: 'Arial',
                fill: '#ffffff',
                wordWrap: { width: bgWidth * 0.85, useAdvancedWrap: true }, // Reducido el ancho del texto
                align: 'center'
            }).setOrigin(0.5).setDepth(12);
            buttonText.setAlpha(0);

            // Hover effects mejorados para móviles con mejor feedback táctil
            if (this.isMobile) {
                // Para móviles, usar eventos de toque con feedback visual inmediato
                buttonBg.on('pointerdown', () => {
                    this.createHoverParticles(panelX, buttonY);
                    buttonBg.clear();
                    buttonBg.lineStyle(3, 0x44ff44, 1); // Borde más grueso para móviles
                    buttonBg.fillStyle(0x002200, 0.7); // Más opaco para mejor visibilidad
                    buttonBg.fillRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 8);
                    buttonBg.strokeRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 8);
                    
                    // Vibración táctil si está disponible
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                });

                buttonBg.on('pointerup', () => {
                    buttonBg.clear();
                    buttonBg.lineStyle(2, 0x00ffff, 0.8);
                    buttonBg.fillStyle(0x001122, 0.3);
                    buttonBg.fillRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 8);
                    buttonBg.strokeRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 8);
                });
            } else {
                // Para desktop, mantener hover tradicional
                buttonBg.on('pointerover', () => {
                    this.createHoverParticles(panelX, buttonY);
                    buttonBg.clear();
                    buttonBg.lineStyle(2, 0x44ff44, 1);
                    buttonBg.fillStyle(0x002200, 0.5);
                    buttonBg.fillRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 8);
                    buttonBg.strokeRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 8);
                });

                buttonBg.on('pointerout', () => {
                    buttonBg.clear();
                    buttonBg.lineStyle(2, 0x00ffff, 0.8);
                    buttonBg.fillStyle(0x001122, 0.3);
                    buttonBg.fillRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 8);
                    buttonBg.strokeRoundedRect(-bgWidth/2, -bgHeight/2, bgWidth, bgHeight, 8);
                });
            }

            buttonBg.on('pointerdown', () => {
                this.checkAnswer(index, buttonBg, buttonText, gameWidth, gameHeight);
            });

            // Store button references for later use
            this.answerButtons.push({
                bg: buttonBg,
                text: buttonText
            });

            // Store references
            this.questionElements = this.questionElements || [];
            this.questionElements.push(buttonBg, buttonText);

            // Entrance animation con timing mejorado
            const delay = this.isMobile ? index * 180 : index * 120;
            this.tweens.add({
                targets: [buttonBg, buttonText],
                alpha: 1,
                duration: this.isMobile ? 700 : 500,
                delay: delay,
                ease: 'Power2.easeOut'
            });
        });
    }

    checkAnswer(selectedIndex, buttonBg, buttonText, gameWidth, gameHeight) {
        // Disable all buttons
        this.answerButtons.forEach(button => {
            if (button.text) {
                button.text.removeInteractive();
            }
        });

        if (selectedIndex === 1) { // Correct answer (option B)
            this.showCorrectAnswer(buttonBg, buttonText, gameWidth, gameHeight);
        } else {
            this.showIncorrectAnswer(buttonBg, buttonText, gameWidth, gameHeight);
        }
    }

    showCorrectAnswer(buttonBg, buttonText, gameWidth, gameHeight) {
        // Success animation for button text only (no buttonBg)
        this.tweens.add({
            targets: buttonText,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 300,
            yoyo: true,
            ease: 'Power2.easeOut'
        });

        buttonText.setFill('#00ff00');

        // Hide incorrect answer buttons with fade out animation
        this.answerButtons.forEach(button => {
            if (button.text !== buttonText) {
                this.tweens.add({
                    targets: button.text,
                    alpha: 0,
                    duration: 500,
                    ease: 'Power2.easeOut',
                    onComplete: () => {
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

        // Crear animación de apagado y transición directa después del delay
        this.time.delayedCall(3000, () => {
            this.createShutdownAnimation();
        });
    }

    showIncorrectAnswer(buttonBg, buttonText, gameWidth, gameHeight) {
        // Create a red rectangle overlay behind the text (since no buttonBg)
        const redOverlay = this.add.rectangle(buttonText.x, buttonText.y, 200, 40, 0xff0000, 0.8);
        redOverlay.setDepth(buttonText.depth - 1);

        // Store the red overlay reference in the button object for later removal
        this.answerButtons.forEach(button => {
            if (button.text === buttonText) {
                button.redOverlay = redOverlay;
            }
        });

        // Make sure text is above the red overlay
        buttonText.setDepth(redOverlay.depth + 1);

        // Error animation for button text and overlay
        this.tweens.add({
            targets: [buttonText, redOverlay],
            x: buttonText.x + 10,
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
                if (button.text !== buttonText) {
                    button.text.setInteractive();
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
        // Escala más grande para móviles
        const buttonScale = this.isMobile ? 2.0 : 1.5;
        continueButton.setScale(buttonScale);
        continueButton.setInteractive();

        // Tamaño de fuente mejorado para móviles
        const buttonFontSize = this.isMobile ?
            Math.min(gameWidth * 0.035, 28) :
            Math.min(gameWidth * 0.02, 22);

        const continueText = this.add.text(buttonX, buttonY, 'CONTINUAR', {
            fontSize: `${buttonFontSize}px`,
            fontFamily: 'Arial Bold',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Button animations con escalas adaptativas y mejor feedback táctil
        const hoverScale = this.isMobile ? 2.2 : 1.7;

        if (this.isMobile) {
            // Para móviles, usar eventos táctiles con feedback inmediato
            continueButton.on('pointerdown', () => {
                this.tweens.add({
                    targets: [continueButton, continueText],
                    scaleX: hoverScale,
                    scaleY: hoverScale,
                    duration: 150, // Más rápido para móviles
                    ease: 'Power2.easeOut'
                });
                
                // Vibración táctil si está disponible
                if (navigator.vibrate) {
                    navigator.vibrate(30);
                }
            });

            continueButton.on('pointerup', () => {
                this.tweens.add({
                    targets: [continueButton, continueText],
                    scaleX: buttonScale,
                    scaleY: buttonScale,
                    duration: 150,
                    ease: 'Power2.easeOut'
                });
            });
        } else {
            // Para desktop, mantener hover tradicional
            continueButton.on('pointerover', () => {
                this.tweens.add({
                    targets: [continueButton, continueText],
                    scaleX: hoverScale,
                    scaleY: hoverScale,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            });

            continueButton.on('pointerout', () => {
                this.tweens.add({
                    targets: [continueButton, continueText],
                    scaleX: buttonScale,
                    scaleY: buttonScale,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            });
        }

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
        // Main code container with space-themed glass effect - AJUSTADO PARA EVITAR DESBORDAMIENTO
        const codeContainer = this.add.container(gameWidth / 2, gameHeight / 2);

        // Simple solid background - DIMENSIONES AUMENTADAS PARA EVITAR DESBORDAMIENTO
        const codeBg = this.add.graphics();
        codeBg.fillStyle(0x2d3748, 1.0); // Solid dark blue-gray background
        codeBg.fillRoundedRect(-gameWidth * 0.4, -gameHeight * 0.3, gameWidth * 0.8, gameHeight * 0.55, 20); // Aumentado significativamente
        codeBg.lineStyle(2, 0x4a5568, 1.0); // Simple gray border
        codeBg.strokeRoundedRect(-gameWidth * 0.4, -gameHeight * 0.3, gameWidth * 0.8, gameHeight * 0.55, 20); // Aumentado significativamente
        codeContainer.add(codeBg);

        // Simple professional title - POSICIÓN AJUSTADA
        const title = this.add.text(0, -gameHeight * 0.35, '✅ CÓDIGO CORREGIDO', {
            fontSize: `${Math.min(gameWidth * 0.025, 24)}px`,
            fontFamily: 'Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        codeContainer.add(title);

        // Code display with enhanced readability - AJUSTADO PARA EVITAR DESBORDAMIENTO
        const codeLines = correctedCode.split('\n');
        const startY = -gameHeight * 0.2; // Posición inicial corregida usando gameHeight
        const lineHeight = this.isMobile ?
            Math.min(gameHeight * 0.022, 16) :
            Math.min(gameHeight * 0.025, 18); // Altura de línea adaptativa

        this.correctedCodeElements = [];

        // Crear área de scroll si el contenido es muy largo
        const maxVisibleLines = this.isMobile ? 12 : 15;
        const visibleLines = Math.min(codeLines.length, maxVisibleLines);

        // Si hay más líneas de las que caben, implementar scroll
        if (codeLines.length > maxVisibleLines) {
            this.createScrollableCodeArea(codeContainer, gameWidth, gameHeight, codeLines, startY, lineHeight);
        } else {
            // Mostrar todas las líneas normalmente
            codeLines.forEach((line, index) => {
                const y = startY + index * lineHeight;

                // Create more visible background for each line - ANCHO AUMENTADO
                const lineBg = this.add.graphics();
                lineBg.fillStyle(0x1e293b, 0.6);
                lineBg.fillRoundedRect(-gameWidth * 0.35, y - lineHeight/2, gameWidth * 0.7, lineHeight, 3); // Ancho aumentado
                codeContainer.add(lineBg);

                // Apply enhanced syntax highlighting with better contrast
                const styledLine = this.applySyntaxHighlighting(line);
                const codeLine = this.add.text(-gameWidth * 0.32, y, styledLine.text, { // Posición ajustada
                    fontSize: `${Math.min(gameWidth * 0.014, 14)}px`, // Tamaño de fuente ajustado
                    fontFamily: 'Consolas, "Courier New", monospace',
                    fill: styledLine.color,
                    backgroundColor: styledLine.bgColor || 'transparent',
                    stroke: styledLine.strokeColor || '#000000',
                    strokeThickness: 0.5,
                    resolution: 2,
                    antialias: true,
                    padding: { x: 3, y: 2 },
                    wordWrap: { width: gameWidth * 0.6, useAdvancedWrap: true } // Ancho de wrap aumentado
                }).setOrigin(0, 0.5);

                codeContainer.add(codeLine);
                this.correctedCodeElements.push(lineBg);
                this.correctedCodeElements.push(codeLine);
            });
        }

        this.codeViewElements.push(codeContainer);
        this.mainCodeContainer = codeContainer;
    }

    // Nuevo método para crear área de código con scroll
    createScrollableCodeArea(container, gameWidth, gameHeight, codeLines, startY, lineHeight) {
        const maxVisibleLines = this.isMobile ? 12 : 15;
        let scrollOffset = 0;
        const maxScroll = Math.max(0, codeLines.length - maxVisibleLines);

        // Crear máscara para el área visible
        const maskGraphics = this.add.graphics();
        maskGraphics.fillStyle(0xffffff);
        maskGraphics.fillRect(-gameWidth * 0.35, startY - lineHeight, gameWidth * 0.7, maxVisibleLines * lineHeight);
        const mask = maskGraphics.createGeometryMask();

        // Contenedor para las líneas de código
        const codeContentContainer = this.add.container(0, 0);
        codeContentContainer.setMask(mask);
        container.add(codeContentContainer);

        // Función para renderizar líneas visibles
        const renderVisibleLines = () => {
            codeContentContainer.removeAll(true);

            for (let i = 0; i < codeLines.length; i++) {
                const line = codeLines[i];
                const y = startY + (i - scrollOffset) * lineHeight;

                // Solo renderizar líneas visibles
                if (y >= startY - lineHeight && y <= startY + maxVisibleLines * lineHeight) {
                    const lineBg = this.add.graphics();
                    lineBg.fillStyle(0x1e293b, 0.6);
                    lineBg.fillRoundedRect(-gameWidth * 0.35, y - lineHeight/2, gameWidth * 0.7, lineHeight, 3);
                    codeContentContainer.add(lineBg);

                    const styledLine = this.applySyntaxHighlighting(line);
                    const codeLine = this.add.text(-gameWidth * 0.32, y, styledLine.text, {
                        fontSize: `${Math.min(gameWidth * 0.014, 14)}px`,
                        fontFamily: 'Consolas, "Courier New", monospace',
                        fill: styledLine.color,
                        backgroundColor: styledLine.bgColor || 'transparent',
                        stroke: styledLine.strokeColor || '#000000',
                        strokeThickness: 0.5,
                        resolution: 2,
                        antialias: true,
                        padding: { x: 3, y: 2 },
                        wordWrap: { width: gameWidth * 0.6, useAdvancedWrap: true }
                    }).setOrigin(0, 0.5);

                    codeContentContainer.add(codeLine);
                    this.correctedCodeElements.push(lineBg);
                    this.correctedCodeElements.push(codeLine);
                }
            }
        };

        // Renderizar líneas iniciales
        renderVisibleLines();

        // Agregar controles de scroll si es necesario
        if (maxScroll > 0) {
            this.createScrollControls(container, gameWidth, gameHeight, () => {
                scrollOffset = Math.max(0, scrollOffset - 1);
                renderVisibleLines();
            }, () => {
                scrollOffset = Math.min(maxScroll, scrollOffset + 1);
                renderVisibleLines();
            });
        }
    }

    // Crear controles de scroll
    createScrollControls(container, gameWidth, gameHeight, scrollUp, scrollDown) {
        // Botón scroll up
        const scrollUpBtn = this.add.graphics();
        scrollUpBtn.fillStyle(0x4a5568, 0.8);
        scrollUpBtn.fillTriangle(gameWidth * 0.32, -gameHeight * 0.1,
                                gameWidth * 0.35, -gameHeight * 0.05,
                                gameWidth * 0.38, -gameHeight * 0.1);
        scrollUpBtn.setInteractive(new Phaser.Geom.Triangle(gameWidth * 0.32, -gameHeight * 0.1,
                                                           gameWidth * 0.35, -gameHeight * 0.05,
                                                           gameWidth * 0.38, -gameHeight * 0.1),
                                  Phaser.Geom.Triangle.Contains);
        scrollUpBtn.on('pointerdown', scrollUp);
        container.add(scrollUpBtn);

        // Botón scroll down
        const scrollDownBtn = this.add.graphics();
        scrollDownBtn.fillStyle(0x4a5568, 0.8);
        scrollDownBtn.fillTriangle(gameWidth * 0.32, gameHeight * 0.1,
                                  gameWidth * 0.35, gameHeight * 0.15,
                                  gameWidth * 0.38, gameHeight * 0.1);
        scrollDownBtn.setInteractive(new Phaser.Geom.Triangle(gameWidth * 0.32, gameHeight * 0.1,
                                                             gameWidth * 0.35, gameHeight * 0.15,
                                                             gameWidth * 0.38, gameHeight * 0.1),
                                    Phaser.Geom.Triangle.Contains);
        scrollDownBtn.on('pointerdown', scrollDown);
        container.add(scrollDownBtn);
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
        // Enhanced continue button with modern design adaptado para móviles
        const buttonContainer = this.add.container(gameWidth / 2, gameHeight * 0.92);

        // Button background with gradient and glow - tamaños adaptivos
        const buttonBg = this.add.graphics();

        // Dimensiones adaptativas para móviles
        const buttonWidth = this.isMobile ? 300 : 240;
        const buttonHeight = this.isMobile ? 70 : 50;
        const cornerRadius = this.isMobile ? 35 : 25;
        const halfWidth = buttonWidth / 2;
        const halfHeight = buttonHeight / 2;

        // Main gradient background
        buttonBg.fillGradientStyle(0x00ff88, 0x00cc66, 0x009944, 0x00ff88, 1, 0.9, 0.8, 0.9);
        buttonBg.fillRoundedRect(-halfWidth, -halfHeight, buttonWidth, buttonHeight, cornerRadius);

        // Outer glow effect
        buttonBg.lineStyle(3, 0x66ffaa, 0.6);
        buttonBg.strokeRoundedRect(-halfWidth, -halfHeight, buttonWidth, buttonHeight, cornerRadius);

        // Inner highlight
        buttonBg.lineStyle(1, 0xffffff, 0.3);
        buttonBg.strokeRoundedRect(-halfWidth + 2, -halfHeight + 2, buttonWidth - 4, buttonHeight - 4, cornerRadius - 2);

        buttonContainer.add(buttonBg);

        // Button text with enhanced styling - tamaño adaptativo
        const buttonFontSize = this.isMobile ? '28px' : '20px';
        const buttonText = this.add.text(0, 0, 'CONTINUAR', {
            fontSize: buttonFontSize,
            fontFamily: 'Arial Black',
            fill: '#ffffff',
            stroke: '#004422',
            strokeThickness: this.isMobile ? 3 : 2,
            shadow: {
                offsetX: 1,
                offsetY: 1,
                color: '#000000',
                blur: 2,
                fill: true
            }
        }).setOrigin(0.5);
        buttonContainer.add(buttonText);

        // Interactive effects - área adaptativa
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(-halfWidth, -halfHeight, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

        // Hover effects con escalas adaptativas y mejor feedback táctil
        const hoverScale = this.isMobile ? 1.08 : 1.05;

        if (this.isMobile) {
            // Para móviles, usar eventos táctiles con feedback inmediato
            buttonContainer.on('pointerdown', () => {
                this.tweens.add({
                    targets: buttonContainer,
                    scaleX: hoverScale,
                    scaleY: hoverScale,
                    duration: 150, // Más rápido para móviles
                    ease: 'Power2.easeOut'
                });

                // Glow pulse effect más intenso para móviles
                this.tweens.add({
                    targets: buttonBg,
                    alpha: 0.9,
                    duration: 200,
                    yoyo: true,
                    repeat: 2,
                    ease: 'Sine.easeInOut'
                });
                
                // Vibración táctil si está disponible
                if (navigator.vibrate) {
                    navigator.vibrate(40);
                }
            });

            buttonContainer.on('pointerup', () => {
                this.tweens.add({
                    targets: buttonContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 150,
                    ease: 'Power2.easeOut'
                });

                // Stop glow pulse
                this.tweens.killTweensOf(buttonBg);
                buttonBg.alpha = 1;
            });
        } else {
            // Para desktop, mantener hover tradicional
            buttonContainer.on('pointerover', () => {
                this.tweens.add({
                    targets: buttonContainer,
                    scaleX: hoverScale,
                    scaleY: hoverScale,
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
        }

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
        // No particles - completely clean background for better mobile performance
    }

    startCoreAnimations() {
        // Gentle core pulse animation con configuración adaptativa
        const pulseDelay = this.isMobile ? 6000 : 4000; // Menos frecuente en móviles

        this.time.addEvent({
            delay: pulseDelay,
            callback: () => {
                if (this.centralOrb) {
                    this.tweens.add({
                        targets: this.centralOrb,
                        scaleX: this.isMobile ? 1.4 : 1.6,
                        scaleY: this.isMobile ? 1.4 : 1.6,
                        alpha: 0.8,
                        duration: this.isMobile ? 1000 : 800,
                        yoyo: true,
                        ease: 'Sine.easeInOut'
                    });
                }
            },
            loop: true
        });

        // Subtle energy ring effect con menos intensidad en móviles
        const ringDelay = this.isMobile ? 8000 : 6000;

        this.time.addEvent({
            delay: ringDelay,
            callback: () => {
                this.energyRings.forEach((ring, index) => {
                    this.tweens.add({
                        targets: ring,
                        alpha: this.isMobile ? 0.4 : 0.6,
                        scaleX: ring.scaleX + (this.isMobile ? 0.2 : 0.3),
                        scaleY: ring.scaleY + (this.isMobile ? 0.2 : 0.3),
                        duration: this.isMobile ? 1200 : 1000,
                        yoyo: true,
                        delay: index * (this.isMobile ? 400 : 300),
                        ease: 'Power2.easeOut'
                    });
                });
            },
            loop: true
        });
    }

    update() {
        // Smooth particle rotation for ambient effect con menos carga en móviles
        if (!this.isMobile) {
            this.dataStreams.forEach(stream => {
                stream.rotation += 0.01; // Slower, more elegant rotation
            });
        }
    }

    createShutdownAnimation() {
        // Crear overlay de apagado
        const shutdownOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0
        );
        shutdownOverlay.setDepth(10000);

        // Crear efecto de línea de apagado (como TV antigua)
        const shutdownLine = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            2,
            0xffffff,
            0
        );
        shutdownLine.setDepth(10001);

        // Primero: Desvanecimiento suave de todos los elementos de la escena
        const allElements = [
            this.coreContainer,
            ...this.questionElements || [],
            ...this.hologramElements || [],
            ...this.dataStreams || [],
            ...this.particles || []
        ].filter(element => element && element.setAlpha);

        // Animación de desvanecimiento de elementos
        this.tweens.add({
            targets: allElements,
            alpha: 0,
            duration: 800,
            ease: 'Power2.easeOut',
            onComplete: () => {
                // Segundo: Animación de apagado estilo TV
                this.tweens.add({
                    targets: shutdownLine,
                    alpha: 1,
                    duration: 300,
                    ease: 'Power2.easeIn',
                    onComplete: () => {
                        // Contraer la línea horizontalmente
                        this.tweens.add({
                            targets: shutdownLine,
                            scaleX: 0,
                            duration: 500,
                            ease: 'Power2.easeIn',
                            onComplete: () => {
                                // Fade out completo con desvanecimiento más suave
                                this.tweens.add({
                                    targets: shutdownOverlay,
                                    alpha: 1,
                                    duration: 400,
                                    ease: 'Power2.easeInOut',
                                    onComplete: () => {
                                        // Transición a la siguiente escena
                                        this.scene.start('scenaVideo2');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}
