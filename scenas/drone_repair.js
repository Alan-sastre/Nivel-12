class DroneRepairScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DroneRepairScene' });
        this.blocks = [];
        this.codeBlocks = [];
        this.generatedCode = '';
        this.isDragging = false;
        this.draggedBlock = null;
        this.particles = [];
        this.scanLines = [];
        this.selectedBlocks = [];
        this.currentStep = 0;
        this.codeSteps = [
            'int sensorAmenaza = A1;',
            'int sistemaDefensa = 8;',
            'pinMode(sensorAmenaza, INPUT);',
            'pinMode(sistemaDefensa, OUTPUT);',
            'int amenaza = analogRead(sensorAmenaza);',
            'if (amenaza > 700) {',
            'digitalWrite(sistemaDefensa, HIGH);',
            '} else {',
            'digitalWrite(sistemaDefensa, LOW);',
            '}'
        ];
        this.currentOptions = []; // Opciones actuales mostradas
        this.allBlockData = []; // Todos los datos de bloques disponibles
    }

    preload() {
        // Cargar el personaje IA desde assets
        this.load.image('ai_character', 'assets/ai_character.svg');
    }

    create() {
        // Obtener dimensiones de pantalla
        const width = this.scale.width;
        const height = this.scale.height;

        // Fondo futurista con gradiente
        this.createFuturisticBackground(width, height);

        // Efectos de partículas de fondo
        this.createBackgroundEffects(width, height);

        // Título principal con efectos
        this.createMainTitle(width);

        // Crear las secciones principales sin área de construcción
        this.createAISection(width, height);
        this.createCodeDisplay(width, height);
        this.createBlocksPalette(width, height);

        // Añadir efectos de escaneo
        this.createScanEffects(width, height);

        // Añadir sistema de alertas
        this.createAlertSystem(width, height);

        // Mostrar las primeras opciones
        this.showNextOptions();
    }

    createFuturisticBackground(width, height) {
        // Fondo con gradiente más suave y profesional
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0a0f, 0x0f0f1a, 0x0a0a0f, 0x0f0f1a, 1);
        bg.fillRect(0, 0, width, height);

        // Patrón de circuitos más sutil
        this.createCircuitPattern(width, height);

        // Líneas de energía
        this.createEnergyLines(width, height);
    }

    createCircuitPattern(width, height) {
        const circuit = this.add.graphics();
        circuit.lineStyle(1, 0x2a2a3a, 0.4); // Líneas más sutiles

        // Líneas horizontales más espaciadas
        for (let y = 0; y < height; y += 80) {
            circuit.moveTo(0, y);
            circuit.lineTo(width, y);
        }

        // Líneas verticales más espaciadas
        for (let x = 0; x < width; x += 80) {
            circuit.moveTo(x, 0);
            circuit.lineTo(x, height);
        }

        circuit.strokePath();
    }

    createEnergyLines(width, height) {
        // Líneas de energía animadas más grandes
        for (let i = 0; i < 8; i++) {
            const line = this.add.rectangle(
                Math.random() * width,
                Math.random() * height,
                Math.random() * 300 + 150,
                3,
                0x00ffff,
                0.4
            );

            this.tweens.add({
                targets: line,
                alpha: { from: 0.2, to: 0.9 },
                duration: 2500,
                yoyo: true,
                repeat: -1,
                delay: i * 300
            });
        }
    }

    createBackgroundEffects(width, height) {
        // Partículas flotantes más sutiles para no competir con el contenido principal
        for (let i = 0; i < 20; i++) { // Reducir cantidad de partículas
            const particle = this.add.circle(
                Math.random() * width,
                Math.random() * height,
                Math.random() * 3 + 1, // Partículas más pequeñas
                0x00ffff,
                0.3 // Más transparentes para mejor jerarquía visual
            );

            this.tweens.add({
                targets: particle,
                y: particle.y - 150,
                duration: 8000 + Math.random() * 4000, // Movimiento más lento
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });

            this.particles.push(particle);
        }
    }

    createMainTitle(width) {
        // Título principal con efectos mejorados - ULTRA COMPACTO
        const titleContainer = this.add.container(width / 2, 35); // Mucho más arriba

        // Fondo del título mucho más pequeño
        const titleBg = this.add.graphics();
        titleBg.fillGradientStyle(0x001122, 0x002244, 0x001133, 0x003366, 0.8);
        titleBg.fillRoundedRect(-250, -20, 500, 40, 12); // Mucho más compacto
        titleBg.lineStyle(2, 0x0088cc, 0.9);
        titleBg.strokeRoundedRect(-250, -20, 500, 40, 12);

        // Título principal mejorado para evitar pixelado
        const mainTitle = this.add.text(0, -5, '🛡️ DEFENSA CIBERNÉTICA', {
            fontSize: '22px', // Aumentar tamaño para mejor calidad
            fill: '#00ccff',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#001122',
            strokeThickness: 2,
            resolution: 2 // Añadir resolución para texto más nítido
        }).setOrigin(0.5);

        // Subtítulo mejorado para evitar pixelado
        const subtitle = this.add.text(0, 12, 'Seguridad Avanzada', {
            fontSize: '14px', // Aumentar tamaño para mejor calidad
            fill: '#88ccff',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'italic',
            resolution: 2 // Añadir resolución para texto más nítido
        }).setOrigin(0.5);

        titleContainer.add([titleBg, mainTitle, subtitle]);

        // Texto "Sistema seguro" mejorado para evitar pixelado
        this.systemStatusText = this.add.text(width / 2, 85, '✅ SISTEMA SEGURO', { // Mucho más arriba
            fontSize: '18px', // Aumentar tamaño para mejor calidad
            fill: '#00ff00',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            stroke: '#003300',
            strokeThickness: 1, // Reducir grosor del borde
            resolution: 2 // Añadir resolución para texto más nítido
        }).setOrigin(0.5);

        // Animación de entrada más suave
        titleContainer.setAlpha(0);
        titleContainer.setScale(0.8);
        this.systemStatusText.setAlpha(0);
        this.systemStatusText.setScale(0.8);

        this.tweens.add({
            targets: titleContainer,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 1000,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: this.systemStatusText,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 1000,
            delay: 300,
            ease: 'Back.easeOut'
        });
    }

    createAISection(width, height) {
        // Reducir más el ancho y crear más espacio - VERSIÓN COMPACTA
        const sectionWidth = width * 0.18; // Reducir aún más el ancho
        const sectionHeight = height * 0.4; // Reducir altura significativamente
        const x = 100 + sectionWidth / 2; // Menos margen izquierdo
        const y = height * 0.45; // Subir más para compactar

        this.add.text(x, y - 180, '🤖 NÚCLEO IA', {
            fontSize: '22px', // Aumentar tamaño para mejor calidad
            fill: '#00ffff',
            fontFamily: 'Arial, sans-serif', // Cambiar fuente para mejor renderizado
            fontStyle: 'bold',
            resolution: 2 // Añadir resolución para texto más nítido
        }).setOrigin(0.5);

        // Crear la IA avanzada centrada en la sección
        this.aiEntity = this.createAdvancedAI(x, y - 120);

        // Inicializar sistema de malware/virus
        this.initializeMalwareSystem(x, y, sectionWidth);

        // Inicializar timer de infección
        this.infectionTimer = 0;
        this.maxInfectionTime = 60000; // 60 segundos
        this.isInfected = false;

        // Referencias para actualización de estado - COMPACTO
        this.aiStatus = this.add.text(x, y + 40, '⏳ Esperando...', {
            fontSize: '14px', // Aumentar tamaño para mejor calidad
            fill: '#ffaa00',
            fontFamily: 'Arial, sans-serif', // Cambiar fuente para mejor renderizado
            fontStyle: 'bold',
            resolution: 2 // Añadir resolución para texto más nítido
        }).setOrigin(0.5);

        // Indicador de amenazas - COMPACTO
        this.threatIndicator = this.add.circle(x + sectionWidth/2 - 15, y - 160, 6, 0x00ff00);

        // Barra de integridad de la IA - COMPACTA
        const integrityY = y - 20;

        // Marco exterior con efecto de brillo (COMPACTO)
        this.integrityFrame = this.add.graphics();
        this.integrityFrame.lineStyle(2, 0x00aaff, 0.8);
        this.integrityFrame.fillStyle(0x001122, 0.3);
        this.integrityFrame.fillRoundedRect(x - 80, integrityY - 8, 160, 24, 8);
        this.integrityFrame.strokeRoundedRect(x - 80, integrityY - 8, 160, 24, 8);

        // Fondo de la barra con gradiente (COMPACTO)
        this.corruptionBarBg = this.add.graphics();
        this.corruptionBarBg.fillGradientStyle(0x222222, 0x333333, 0x111111, 0x222222, 1);
        this.corruptionBarBg.fillRoundedRect(x - 70, integrityY - 2, 140, 12, 4);

        // Barra de integridad con efecto visual mejorado
        this.corruptionBar = this.add.graphics();

        // Texto de integridad con mejor estilo (COMPACTO)
        this.corruptionText = this.add.text(x, integrityY + 18, 'INTEGRIDAD: 100%', {
            fontSize: '12px',
            fill: '#00ff88',
            fontFamily: 'Courier New',
            fontStyle: 'bold',
            stroke: '#003322',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Ahora sí podemos llamar updateIntegrityBarStyle (COORDENADAS CORREGIDAS)
        this.updateIntegrityBarStyle(x - 70, integrityY - 2, 140, 12);

        // Guardar las coordenadas correctas para futuras actualizaciones
        this.integrityBarX = x - 70;
        this.integrityBarY = integrityY - 2;
        this.integrityBarWidth = 140;
        this.integrityBarHeight = 12;

        // Variables de corrupción
        this.aiCorruption = 0;
        this.maxCorruption = 100;

        // Actualizar la barra de integridad inmediatamente después de la inicialización
        this.updateCorruptionBar();
    }

    createAdvancedAI(x, y, sectionWidth) {
        // Contenedor principal de la IA
        const aiContainer = this.add.container(x, y);

        // Halo de energía exterior
        const outerGlow = this.add.graphics();
        outerGlow.fillGradientStyle(0x001144, 0x001144, 0x003388, 0x003388, 0.3);
        outerGlow.fillCircle(0, 0, 85);

        // Cuerpo principal con diseño más sofisticado
        const hexBody = this.add.graphics();
        hexBody.fillGradientStyle(0x001133, 0x003366, 0x001155, 0x004488, 1);
        hexBody.lineStyle(4, 0x00aaff, 1);

        // Dibujar hexágono con esquinas redondeadas
        const hexRadius = 65;
        hexBody.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const nextAngle = ((i + 1) * Math.PI) / 3;
            const hx = Math.cos(angle) * hexRadius;
            const hy = Math.sin(angle) * hexRadius;
            const nextHx = Math.cos(nextAngle) * hexRadius;
            const nextHy = Math.sin(nextAngle) * hexRadius;

            if (i === 0) hexBody.moveTo(hx, hy);
            else hexBody.lineTo(hx, hy);
        }
        hexBody.closePath();
        hexBody.fillPath();
        hexBody.strokePath();

        // Paneles internos hexagonales
        const innerPanels = this.add.graphics();
        innerPanels.lineStyle(2, 0x0088cc, 0.8);
        for (let layer = 1; layer <= 3; layer++) {
            const radius = 20 + layer * 12;
            innerPanels.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
                const px = Math.cos(angle) * radius;
                const py = Math.sin(angle) * radius;
                if (i === 0) innerPanels.moveTo(px, py);
                else innerPanels.lineTo(px, py);
            }
            innerPanels.closePath();
            innerPanels.strokePath();
        }

        // Núcleo central con efecto holográfico
        const coreGlow = this.add.graphics();
        coreGlow.fillGradientStyle(0x00ffff, 0x0088ff, 0x00aaff, 0x0066cc, 0.8);
        coreGlow.fillCircle(0, 0, 30);

        const core = this.add.graphics();
        core.fillGradientStyle(0x00ffff, 0x0099ff, 0x00ccff, 0x0077bb, 1);
        core.fillCircle(0, 0, 22);
        core.lineStyle(3, 0x00ffff, 1);
        core.strokeCircle(0, 0, 22);

        // Cristal central
        const crystal = this.add.graphics();
        crystal.fillStyle(0x88ffff, 0.9);
        crystal.lineStyle(2, 0x00ffff, 1);
        crystal.beginPath();
        crystal.moveTo(0, -15);
        crystal.lineTo(10, -5);
        crystal.lineTo(10, 5);
        crystal.lineTo(0, 15);
        crystal.lineTo(-10, 5);
        crystal.lineTo(-10, -5);
        crystal.closePath();
        crystal.fillPath();
        crystal.strokePath();

        // Anillos orbitales mejorados
        const ring1 = this.add.graphics();
        ring1.lineStyle(3, 0x00aaff, 0.9);
        ring1.strokeCircle(0, 0, 45);
        // Marcadores en el anillo
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const x1 = Math.cos(angle) * 42;
            const y1 = Math.sin(angle) * 42;
            const x2 = Math.cos(angle) * 48;
            const y2 = Math.sin(angle) * 48;
            ring1.moveTo(x1, y1);
            ring1.lineTo(x2, y2);
        }
        ring1.strokePath();

        const ring2 = this.add.graphics();
        ring2.lineStyle(2, 0x0066aa, 0.7);
        ring2.strokeCircle(0, 0, 58);

        // Sensores laterales
        const leftSensor = this.add.graphics();
        leftSensor.fillGradientStyle(0x00ff88, 0x00aa66, 0x00ff88, 0x00aa66, 1);
        leftSensor.fillRect(-75, -5, 15, 10);
        leftSensor.lineStyle(2, 0x00ff88, 1);
        leftSensor.strokeRect(-75, -5, 15, 10);

        const rightSensor = this.add.graphics();
        rightSensor.fillGradientStyle(0x00ff88, 0x00aa66, 0x00ff88, 0x00aa66, 1);
        rightSensor.fillRect(60, -5, 15, 10);
        rightSensor.lineStyle(2, 0x00ff88, 1);
        rightSensor.strokeRect(60, -5, 15, 10);

        // Ojos más expresivos con iris detallado
        const leftEyeBase = this.add.graphics();
        leftEyeBase.fillStyle(0x001122, 1);
        leftEyeBase.fillCircle(-15, -12, 10);
        leftEyeBase.lineStyle(2, 0x00aaff, 1);
        leftEyeBase.strokeCircle(-15, -12, 10);

        const leftEyeIris = this.add.graphics();
        leftEyeIris.fillGradientStyle(0x00ffff, 0x0088ff, 0x00aaff, 0x0066cc, 1);
        leftEyeIris.fillCircle(-15, -12, 7);

        const leftEyePupil = this.add.graphics();
        leftEyePupil.fillStyle(0x003366, 1);
        leftEyePupil.fillCircle(-15, -12, 4);

        const rightEyeBase = this.add.graphics();
        rightEyeBase.fillStyle(0x001122, 1);
        rightEyeBase.fillCircle(15, -12, 10);
        rightEyeBase.lineStyle(2, 0x00aaff, 1);
        rightEyeBase.strokeCircle(15, -12, 10);

        const rightEyeIris = this.add.graphics();
        rightEyeIris.fillGradientStyle(0x00ffff, 0x0088ff, 0x00aaff, 0x0066cc, 1);
        rightEyeIris.fillCircle(15, -12, 7);

        const rightEyePupil = this.add.graphics();
        rightEyePupil.fillStyle(0x003366, 1);
        rightEyePupil.fillCircle(15, -12, 4);

        // Conexiones neuronales más complejas
        const neural = this.add.graphics();
        neural.lineStyle(1, 0x00ff88, 0.7);
        for (let i = 0; i < 20; i++) {
            const startAngle = Math.random() * Math.PI * 2;
            const endAngle = Math.random() * Math.PI * 2;
            const startRadius = 25 + Math.random() * 15;
            const endRadius = 40 + Math.random() * 20;

            const startX = Math.cos(startAngle) * startRadius;
            const startY = Math.sin(startAngle) * startRadius;
            const endX = Math.cos(endAngle) * endRadius;
            const endY = Math.sin(endAngle) * endRadius;

            neural.moveTo(startX, startY);
            neural.lineTo(endX, endY);

            // Nodos en las conexiones
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            neural.fillStyle(0x00ff88, 0.8);
            neural.fillCircle(midX, midY, 1);
        }
        neural.strokePath();

        // Partículas de datos flotantes mejoradas
        const particles = [];
        for (let i = 0; i < 12; i++) {
            const particle = this.add.graphics();
            const colors = [0x00ffaa, 0x00aaff, 0x88ffaa, 0xaaffff];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.fillStyle(color, 0.9);
            particle.fillCircle(0, 0, 2 + Math.random() * 2);

            const angle = (i * Math.PI * 2) / 12;
            const radius = 35 + Math.random() * 25;
            particle.x = Math.cos(angle) * radius;
            particle.y = Math.sin(angle) * radius;

            particles.push(particle);
            aiContainer.add(particle);
        }

        // Agregar todos los elementos al contenedor en orden correcto
        aiContainer.add([
            outerGlow, hexBody, innerPanels, neural, coreGlow, core, crystal,
            ring2, ring1, leftSensor, rightSensor,
            leftEyeBase, leftEyeIris, leftEyePupil,
            rightEyeBase, rightEyeIris, rightEyePupil
        ]);

        // Animaciones mejoradas
        // Rotación de anillos con diferentes velocidades
        this.tweens.add({
            targets: ring1,
            rotation: Math.PI * 2,
            duration: 5000,
            repeat: -1,
            ease: 'Linear'
        });

        this.tweens.add({
            targets: ring2,
            rotation: -Math.PI * 2,
            duration: 8000,
            repeat: -1,
            ease: 'Linear'
        });

        // Pulsación del núcleo más suave
        this.tweens.add({
            targets: [coreGlow, core],
            scaleX: { from: 1, to: 1.15 },
            scaleY: { from: 1, to: 1.15 },
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Rotación del cristal
        this.tweens.add({
            targets: crystal,
            rotation: Math.PI * 2,
            duration: 6000,
            repeat: -1,
            ease: 'Linear'
        });

        // Movimiento orbital de partículas
        particles.forEach((particle, index) => {
            this.tweens.add({
                targets: particle,
                rotation: Math.PI * 2,
                duration: 4000 + index * 300,
                repeat: -1,
                ease: 'Linear'
            });

            // Pulsación individual de partículas
            this.tweens.add({
                targets: particle,
                scaleX: { from: 1, to: 1.5 },
                scaleY: { from: 1, to: 1.5 },
                duration: 1500 + index * 100,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Parpadeo de ojos más natural
        this.time.addEvent({
            delay: 2500 + Math.random() * 3000,
            callback: () => {
                this.tweens.add({
                    targets: [leftEyeIris, rightEyeIris, leftEyePupil, rightEyePupil],
                    scaleY: { from: 1, to: 0.1 },
                    duration: 120,
                    yoyo: true,
                    ease: 'Power2'
                });
            },
            loop: true
        });

        // Efecto de respiración en el halo exterior
        this.tweens.add({
            targets: outerGlow,
            alpha: { from: 0.3, to: 0.6 },
            scaleX: { from: 1, to: 1.1 },
            scaleY: { from: 1, to: 1.1 },
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Actividad en sensores
        this.tweens.add({
            targets: [leftSensor, rightSensor],
            alpha: { from: 1, to: 0.5 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Efecto de procesamiento mejorado para evitar pixelado
        this.aiProcessingEffect = this.add.text(0, 35, '◉ PROCESANDO...', {
            fontSize: '14px', // Aumentar tamaño para mejor calidad
            fill: '#00ffff',
            fontFamily: 'Arial, sans-serif', // Cambiar fuente para mejor renderizado
            alpha: 0,
            resolution: 2 // Añadir resolución para texto más nítido
        }).setOrigin(0.5);

        aiContainer.add(this.aiProcessingEffect);

        return aiContainer;
    }

    createBlocksPalette(width, height) {
        // Aumentar ancho para que el código no se salga - VERSIÓN ALARGADA
        const sectionWidth = width * 0.35; // Aumentar el ancho para más espacio
        const sectionHeight = height * 0.5; // Aumentar altura también
        const x = width - sectionWidth / 2 - 100; // Revertir posición original del cuadro
        const y = height * 0.45; // Mantener alineación

        // Terminal/VSCode style container
        const terminalBg = this.add.rectangle(x, y, sectionWidth, sectionHeight, 0x1e1e1e, 0.98);
        terminalBg.setStrokeStyle(2, 0x3c3c3c);

        // Terminal header bar
        const headerBar = this.add.rectangle(x, y - sectionHeight/2 + 15, sectionWidth, 30, 0x2d2d30, 1);
        headerBar.setStrokeStyle(1, 0x3c3c3c);

        // Terminal buttons (close, minimize, maximize)
        const buttonY = y - sectionHeight/2 + 15;
        this.add.circle(x - sectionWidth/2 + 20, buttonY, 6, 0xff5f56);
        this.add.circle(x - sectionWidth/2 + 40, buttonY, 6, 0xffbd2e);
        this.add.circle(x - sectionWidth/2 + 60, buttonY, 6, 0x27ca3f);

        // Terminal title mejorado para evitar pixelado
        this.add.text(x, buttonY, '● drone_defense.ino', {
            fontSize: '11px', // Aumentar tamaño para mejor calidad
            fill: '#cccccc',
            fontFamily: 'Arial, sans-serif', // Cambiar fuente para mejor renderizado
            resolution: 2 // Añadir resolución para texto más nítido
        }).setOrigin(0.5);

        // Line numbers background - oculto
        // const lineNumBg = this.add.rectangle(x - sectionWidth/2 + 25, y + 15, 50, sectionHeight - 50, 0x252526, 1);

        // Code area background - CORREGIDO: alineado con el contenedor principal
        const codeAreaBg = this.add.rectangle(x, y + 15, sectionWidth - 20, sectionHeight - 50, 0x1e1e1e, 1);

        // Área para mostrar el código generado (estilo IDE) - CORREGIDO: centrado en el área
        this.codeDisplay = this.add.text(x - sectionWidth/2 + 15, y - sectionHeight/2 + 50, '// Selecciona comandos...\n// Código aquí', {
            fontSize: '14px', // Aumentar tamaño para mejor legibilidad y evitar pixelado
            fill: '#d4d4d4',
            fontFamily: 'Arial, sans-serif', // Cambiar fuente para mejor renderizado
            align: 'left',
            wordWrap: { width: sectionWidth - 50 }, // Ajustar ancho para que no se salga
            resolution: 2 // Añadir resolución para texto más nítido
        }).setOrigin(0, 0);

        // Line numbers eliminados
        // this.lineNumbers = this.add.text(x - sectionWidth/2 + 15, y - sectionHeight/2 + 70, '1\n2', {
        //     fontSize: '16px', // Reducido para que coincida
        //     fill: '#858585',
        //     fontFamily: 'Consolas, Monaco, monospace',
        //     align: 'right'
        // }).setOrigin(0, 0);
    }

    createCodeDisplay(width, height) {
        // Definir todos los datos de bloques disponibles
        this.allBlockData = [
            { text: 'int sensorAmenaza = A1;', type: 'variable', color: 0xff6600, icon: '📊', desc: 'Declarar sensor de amenazas' },
            { text: 'int sistemaDefensa = 8;', type: 'variable', color: 0xff6600, icon: '📊', desc: 'Declarar sistema de defensa' },
            { text: 'pinMode(sensorAmenaza, INPUT);', type: 'setup', color: 0x9966ff, icon: '⚙️', desc: 'Configurar entrada del sensor' },
            { text: 'pinMode(sistemaDefensa, OUTPUT);', type: 'setup', color: 0x9966ff, icon: '⚙️', desc: 'Configurar salida de defensa' },
            { text: 'int amenaza = analogRead(sensorAmenaza);', type: 'read', color: 0x0099ff, icon: '📡', desc: 'Leer nivel de amenaza' },
            { text: 'if (amenaza > 700) {', type: 'condition', color: 0xffaa00, icon: '❓', desc: 'Evaluar si hay amenaza crítica' },
            { text: 'digitalWrite(sistemaDefensa, HIGH);', type: 'action', color: 0x00ff66, icon: '🔥', desc: 'Activar sistema de defensa' },
            { text: '} else {', type: 'condition', color: 0xffaa00, icon: '❓', desc: 'Si no hay amenaza crítica' },
            { text: 'digitalWrite(sistemaDefensa, LOW);', type: 'action', color: 0xff3366, icon: '❄️', desc: 'Desactivar defensa' },
            { text: '}', type: 'condition', color: 0xffaa00, icon: '❓', desc: 'Cerrar estructura de control' },
            // Bloques incorrectos adicionales
            { text: 'delay(1000);', type: 'action', color: 0x888888, icon: '⏱️', desc: 'Esperar un segundo' },
            { text: 'Serial.begin(9600);', type: 'setup', color: 0x888888, icon: '📺', desc: 'Inicializar comunicación serial' },
            { text: 'int ledPin = 13;', type: 'variable', color: 0x888888, icon: '💡', desc: 'Declarar pin LED' },
            { text: 'digitalWrite(ledPin, HIGH);', type: 'action', color: 0x888888, icon: '💡', desc: 'Encender LED' },
            { text: 'analogWrite(sistemaDefensa, 255);', type: 'action', color: 0x888888, icon: '⚡', desc: 'Escribir valor analógico' }
        ];

        // Mostrar los primeros 3 bloques
        this.showNextOptions();
    }

    showNextOptions() {
        // Limpiar bloques anteriores
        this.blocks.forEach(block => {
            if (block.blockText) block.blockText.destroy();
            if (block.blockIcon) block.blockIcon.destroy();
            if (block.blockDesc) block.blockDesc.destroy();
            block.destroy();
        });
        this.blocks = [];

        if (this.currentStep >= this.codeSteps.length) {
            this.showMessage('¡Programación completada con éxito!', '#00ff00');
            this.showSuccessEffects();
            return;
        }

        // Obtener el comando correcto para este paso
        const correctCommand = this.codeSteps[this.currentStep];

        // Encontrar el bloque correcto
        const correctBlock = this.allBlockData.find(block => block.text === correctCommand);

        // Seleccionar 2 bloques incorrectos aleatorios
        const incorrectBlocks = this.allBlockData.filter(block =>
            block.text !== correctCommand &&
            !this.selectedBlocks.includes(block.text)
        );

        // Mezclar y tomar 2 incorrectos
        const shuffledIncorrect = incorrectBlocks.sort(() => Math.random() - 0.5);
        const selectedIncorrect = shuffledIncorrect.slice(0, 2);

        // Combinar correcto + 2 incorrectos y mezclar
        this.currentOptions = [correctBlock, ...selectedIncorrect].sort(() => Math.random() - 0.5);

        // Crear los 3 bloques en una fila horizontal - VERSIÓN COMPACTA
         const containerWidth = this.cameras.main.width * 0.7; // Reducir más el ancho
         const containerHeight = 80; // Reducir altura significativamente
         const startX = this.cameras.main.width / 2; // Centrar horizontalmente
         const startY = this.cameras.main.height * 0.8; // Subir más para compactar

         this.currentOptions.forEach((data, index) => {
             const blockWidth = 240; // Reducir más el ancho de los botones
             const blockHeight = 60; // Reducir más la altura de los botones
             const spacing = 280; // Reducir espaciado para hacer botones más pequeños
             const blockX = startX - spacing + (index * spacing); // Distribución horizontal
             const blockY = startY;

             // Crear bloque como Rectangle interactivo con color basado en el tipo
             const blockColor = this.getBlockColor(data.type);
             const block = this.add.rectangle(blockX, blockY, blockWidth, blockHeight, blockColor, 0.9);
             const strokeColor = this.getBlockStrokeColor(data.type);
             block.setStrokeStyle(2, strokeColor, 0.8);
             block.setInteractive();

             // Guardar propiedades del bloque para uso posterior
             block.x = blockX;
             block.y = blockY;
             block.width = blockWidth;
             block.height = blockHeight;

             // Icono del bloque más pequeño
             const icon = this.add.text(blockX - blockWidth/2 + 15, blockY, data.icon, {
                 fontSize: '20px' // Reducir más el tamaño del icono
             });

             // Texto principal mejorado para evitar pixelado
             const text = this.add.text(blockX - blockWidth/2 + 45, blockY - 8, data.text, {
                 fontSize: '14px', // Aumentar tamaño para mejor calidad
                 fill: '#ffffff',
                 fontFamily: 'Arial, sans-serif', // Cambiar a Arial para mejor renderizado
                 fontStyle: 'bold',
                 stroke: '#000000',
                 strokeThickness: 1,
                 wordWrap: { width: blockWidth - 60 },
                 resolution: 2 // Aumentar resolución para texto más nítido
             }).setOrigin(0, 0.5);

             // Descripción mejorada para evitar pixelado
             const desc = this.add.text(blockX - blockWidth/2 + 45, blockY + 12, data.desc, {
                 fontSize: '11px', // Aumentar tamaño para mejor calidad
                 fill: '#ffff99',
                 fontFamily: 'Arial, sans-serif', // Cambiar a Arial para mejor renderizado
                 stroke: '#000000',
                 strokeThickness: 1,
                 wordWrap: { width: blockWidth - 110 },
                 resolution: 2 // Aumentar resolución para texto más nítido
             }).setOrigin(0, 0.5);

            block.blockData = data;
            block.blockText = text;
            block.blockIcon = icon;
            block.blockDesc = desc;
            block.isCorrect = (data.text === correctCommand);
            block.isSelected = false; // Inicializar como no seleccionado

            this.setupBlockClickEvents(block, text, icon, desc);
            this.blocks.push(block);

            // Animación de aparición
            block.setAlpha(0);
            icon.setAlpha(0);
            text.setAlpha(0);
            desc.setAlpha(0);

            this.tweens.add({
                targets: [block, icon, text, desc],
                alpha: 1,
                scaleX: { from: 0.8, to: 1 },
                scaleY: { from: 0.8, to: 1 },
                duration: 400,
                delay: index * 100,
                ease: 'Back.easeOut'
            });
        });
    }

    createScanEffects(width, height) {
        // Eliminar las líneas de escaneo azules molestas
        // Comentado para mejorar la experiencia visual
        /*
        for (let i = 0; i < 4; i++) {
            const scanLine = this.add.rectangle(0, height * 0.15 + i * height * 0.25, width, 3, 0x00ffff, 0.8);

            this.tweens.add({
                targets: scanLine,
                x: width,
                duration: 4000 + i * 1000,
                repeat: -1,
                ease: 'Linear'
            });

            this.scanLines.push(scanLine);
        }
        */
    }

    createAlertSystem(width, height) {
        // Sistema de alertas más grande
        this.alertPanel = this.add.rectangle(width - 200, 150, 360, 80, 0x440000, 0.95);
        this.alertPanel.setStrokeStyle(3, 0xff0000);
        this.alertPanel.setVisible(false);

        this.alertText = this.add.text(width - 200, 150, '', {
            fontSize: '16px',
            fill: '#ff0000',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    setupBlockClickEvents(block, text, icon, desc) {
        // Guardar el color original del bloque basado en su tipo
        const originalColor = this.getBlockColor(block.blockData.type);
        const originalStrokeColor = this.getBlockStrokeColor(block.blockData.type);

        block.on('pointerover', () => {
            if (!block.isSelected) {
                // Crear un color más claro para hover manteniendo el tono original
                const hoverColor = this.lightenColor(originalColor, 0.3);
                const hoverStrokeColor = this.lightenColor(originalStrokeColor, 0.3);

                block.setFillStyle(hoverColor, 0.9);
                block.setStrokeStyle(2, hoverStrokeColor, 0.9);

                this.tweens.add({
                    targets: [block, text, icon, desc],
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 200,
                    ease: 'Power2'
                });
            }
        });

        block.on('pointerout', () => {
            if (!block.isSelected) {
                // Restaurar colores originales basados en el tipo
                block.setFillStyle(originalColor, 0.9);
                block.setStrokeStyle(2, originalStrokeColor, 0.8);

                this.tweens.add({
                    targets: [block, text, icon, desc],
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Power2'
                });
            }
        });

        block.on('pointerdown', () => {
            if (block.isSelected) return;

            if (block.isCorrect) {
                // Comando correcto
                this.selectedBlocks.push(block.blockData.text);
                block.isSelected = true;

                // DESHABILITAR TODAS LAS OPCIONES INMEDIATAMENTE
                console.log('✅ Opción correcta seleccionada - deshabilitando todas las opciones');
                this.disableAllBlocks();

                // Efecto visual de éxito - color verde
                block.setFillStyle(0x00aa00, 0.9);
                block.setStrokeStyle(4, 0x00ff00, 1);

                this.tweens.add({
                    targets: [block, text, icon, desc],
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 300,
                    yoyo: true,
                    ease: 'Power2'
                });

                // Agregar al código generado
                this.addToGeneratedCode(block.blockData.text);

                // Avanzar al siguiente paso
                this.currentStep++;

                // Verificar si se completó el juego
                if (this.currentStep === 10) {
                    console.log('✅ CONDICIÓN CUMPLIDA: currentStep === 10');
                    
                    // Llamar automáticamente a generateCode cuando se completen los 10 pasos
                    console.log('🎯 Completados 10 pasos, llamando a generateCode...');
                    this.time.delayedCall(1000, () => {
                        console.log('🚀 Ejecutando generateCode...');
                        this.generateCode();
                    });
                } else {
                    console.log('❌ CONDICIÓN NO CUMPLIDA: currentStep =', this.currentStep, '!== 10');
                }

                // Mostrar mensaje de éxito
                this.showMessage('¡Correcto! Comando agregado', '#00ff00');

                // Mostrar las siguientes opciones después de un breve delay
                this.time.delayedCall(1000, () => {
                    this.showNextOptions();
                });

            } else {
                // Comando incorrecto
                this.showMessage('Comando incorrecto. Intenta de nuevo.', '#ff3366');

                // Efecto visual de error - color rojo
                block.setFillStyle(0xaa0000, 0.9);
                block.setStrokeStyle(4, 0xff0000, 1);

                this.tweens.add({
                    targets: [block, text, icon, desc],
                    x: block.x + 10,
                    duration: 100,
                    yoyo: true,
                    repeat: 2,
                    ease: 'Power2',
                    onComplete: () => {
                        // Restaurar color original después del error
                        block.setFillStyle(originalColor, 0.9);
                        block.setStrokeStyle(2, 0x666666, 0.8); // Restaurar gris sutil
                    }
                });
            }
        });
    }

    addToGeneratedCode(command) {
        this.generatedCode += command + '\n';

        // Ralentizar el timer de infección cuando el usuario progresa
        if (this.currentStep > 0) {
            this.infectionTimer = Math.max(0, this.infectionTimer - 5000); // Restar 5 segundos por cada comando
        }

        // Actualizar la visualización del código generado con formato IDE
        if (this.codeDisplay) {
            // Formatear el código con comentarios y estructura profesional
            let formattedCode = this.generatedCode;
            if (formattedCode.trim() === '') {
                formattedCode = '// Selecciona los comandos para programar el sistema...\n// Los bloques aparecerán aquí como código Arduino';
            }
            this.codeDisplay.setText(formattedCode);

            // Actualizar números de línea - eliminado
            // if (this.lineNumbers) {
            //     const lines = formattedCode.split('\n');
            //     let lineNumberText = '';
            //     for (let i = 1; i <= lines.length; i++) {
            //         lineNumberText += i + (i < lines.length ? '\n' : '');
            //     }
            //     this.lineNumbers.setText(lineNumberText);
            // }
        }

        // Comentario: Progreso actualizado automáticamente
    }

    // Método para deshabilitar todos los bloques después de seleccionar la opción correcta
    disableAllBlocks() {
        console.log('🚫 Deshabilitando todos los bloques...');
        this.blocks.forEach(block => {
            if (!block.isSelected) {
                // Deshabilitar interactividad
                block.disableInteractive();

                // Aplicar efecto visual de deshabilitado
                block.setAlpha(0.4);
                if (block.blockText) block.blockText.setAlpha(0.4);
                if (block.blockIcon) block.blockIcon.setAlpha(0.4);
                if (block.blockDesc) block.blockDesc.setAlpha(0.4);

                // Cambiar a color gris para indicar que está deshabilitado
                block.setFillStyle(0x666666, 0.6);
                block.setStrokeStyle(2, 0x444444, 0.6);

                console.log(`🔒 Bloque deshabilitado: ${block.blockData.text}`);
            }
        });
        console.log('✅ Todos los bloques no seleccionados han sido deshabilitados');
    }

    selectBlock(block, text, icon, desc) {
        block.setStrokeStyle(3, 0x00ff00);
        text.setTint(0x888888);
        icon.setTint(0x888888);
        desc.setTint(0x888888);

        // Efecto de confirmación
        this.tweens.add({
            targets: block,
            scaleX: { from: 1.2, to: 1 },
            scaleY: { from: 1.2, to: 1 },
            duration: 400,
            ease: 'Back.easeOut'
        });

        this.selectedBlocks.push(block);
    }

    showErrorEffect(block) {
        this.tweens.add({
            targets: block,
            x: { from: block.x - 10, to: block.x + 10 },
            duration: 100,
            yoyo: true,
            repeat: 3
        });
    }

    updateCodeDisplay() {
        let code = '// 🛡️ SISTEMA DE DEFENSA CIBERNÉTICA\n';
        for (let i = 0; i < this.currentStep; i++) {
            code += this.codeSteps[i] + '\n';
        }
        this.codeDisplay.setText(code);
    }

    setupButtonEvents(button, text, callback) {
        button.on('pointerdown', () => {
            callback();
            this.tweens.add({
                targets: [button, text],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true
            });
        });

        button.on('pointerover', () => {
            button.setFillStyle(button.fillColor + 0x002200);
            this.tweens.add({
                targets: button,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200
            });
        });

        button.on('pointerout', () => {
            button.setFillStyle(button.fillColor - 0x002200);
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 200
            });
        });
    }

    generateCode() {
        console.log('🔍 generateCode llamado, currentStep:', this.currentStep);
        if (this.currentStep === 10) {
            console.log('✅ Condición cumplida, completando sin mostrar código largo...');

            // NO actualizar el código display con el código largo
            // Mantener el código actual que ya está construido paso a paso

            this.aiStatus.setText('🔥 DEFENSA CIBERNÉTICA ACTIVA');
            this.aiStatus.setFill('#00ff00');

            this.simulateDefenseSystem();
            this.showSuccessEffects();

            // Mostrar mensaje de felicitaciones y pasar a siguiente escena
            console.log('🎉 Llamando a showCompletionMessage...');

            // Llamar inmediatamente sin delay
            this.showCompletionMessage();
        } else {
            console.log('❌ Condición no cumplida, currentStep:', this.currentStep);
            this.showMessage(`❌ SISTEMA INCOMPLETO: Faltan ${10 - this.currentStep} comandos`, '#ff0000');
            this.aiStatus.setText('⚠️ SISTEMA VULNERABLE');
            this.aiStatus.setFill('#ff0000');
            this.showErrorEffects();
        }
    }

    resetSystem() {
        this.currentStep = 0;
        this.selectedBlocks = [];
        this.generatedCode = '';

        // Reiniciar sistema de infección
        this.infectionTimer = 0;
        this.isInfected = false;

        // Actualizar código y reiniciar sistema de infección
        this.updateCodeDisplay();
        this.isInfected = false;

        // Restaurar todos los bloques
        this.blocks.forEach(block => {
            block.setFillStyle(block.blockData.color, 0.9);
            block.setStrokeStyle(3, 0xffffff);
            block.blockText.clearTint();
            block.blockIcon.clearTint();
            block.blockDesc.clearTint();
        });

        // Restaurar código inicial
        this.codeDisplay.setText('// Selecciona los comandos para programar el sistema...\n// Los bloques aparecerán aquí como código Arduino');

        // Restaurar números de línea - eliminado
        // if (this.lineNumbers) {
        //     this.lineNumbers.setText('1\n2');
        // }

        // Restaurar IA a estado normal
        if (this.aiEntity) {
            this.aiEntity.clearTint();
        }

        // Restaurar texto del sistema a seguro
        if (this.systemStatusText) {
            this.systemStatusText.setText('✅ SISTEMA SEGURO');
            this.systemStatusText.setFill('#00ff00');
            this.systemStatusText.setStroke('#003300', 2);
        }

        // Restaurar indicadores de amenaza y corrupción
        this.threatIndicator.setFillStyle(0x00ff00);
        this.aiCorruption = 0;
        this.updateCorruptionBar();

        // Ocultar partículas de malware
        if (this.malwareParticles) {
            this.malwareParticles.forEach(malware => malware.setVisible(false));
        }
        if (this.virusParticles) {
            this.virusParticles.forEach(virus => virus.setVisible(false));
        }
        if (this.malwareLabels) {
            this.malwareLabels.forEach(label => label.setVisible(false));
        }
        if (this.virusLabels) {
            this.virusLabels.forEach(label => label.setVisible(false));
        }

        this.aiStatus.setText('⚡ ESPERANDO CÓDIGO');
        this.aiStatus.setFill('#ffff00');

        this.showMessage('🔄 Sistema reiniciado - ¡Programa rápido antes de la infección!', '#00ff00');
    }

    showMessage(message, color) {
        // Eliminar mensajes anteriores si existen
        if (this.currentMessage) {
            this.currentMessage.destroy();
        }

        const msgText = this.add.text(this.scale.width/2, 200, message, {
            fontSize: '34px', // Aumentar tamaño para mejor calidad
            fill: color,
            fontFamily: 'Arial, sans-serif', // Cambiar fuente para mejor renderizado
            fontStyle: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: { x: 30, y: 15 },
            stroke: '#ffffff',
            strokeThickness: 2,
            resolution: 2 // Añadir resolución para texto más nítido
        }).setOrigin(0.5);

        // Guardar referencia del mensaje actual
        this.currentMessage = msgText;

        // Efecto de aparición más llamativo
        msgText.setScale(0);
        this.tweens.add({
            targets: msgText,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: msgText,
            alpha: 0,
            y: msgText.y - 50,
            duration: 2000,  // Reducido de 3000 a 2000 para que desaparezca más rápido
            delay: 800,      // Reducido de 1000 a 800
            onComplete: () => {
                msgText.destroy();
                if (this.currentMessage === msgText) {
                    this.currentMessage = null;
                }
            }
        });
    }

    showSuccessEffects() {
        // Efectos de éxito más grandes
        const width = this.scale.width;
        const height = this.scale.height;

        for (let i = 0; i < 15; i++) {
            const spark = this.add.circle(
                width/2 + (Math.random() - 0.5) * 300,
                height/2 + (Math.random() - 0.5) * 300,
                Math.random() * 8 + 3,
                0x00ff00
            );

            this.tweens.add({
                targets: spark,
                alpha: 0,
                scaleX: 3,
                scaleY: 3,
                duration: 1500,
                onComplete: () => spark.destroy()
            });
        }
    }

    showErrorEffects() {
        // Efectos de error
        this.alertPanel.setVisible(true);
        this.alertText.setText('🚨 SISTEMA COMPROMETIDO');

        this.tweens.add({
            targets: [this.alertPanel, this.alertText],
            alpha: { from: 1, to: 0.3 },
            duration: 500,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.alertPanel.setVisible(false);
            }
        });
    }

    simulateDefenseSystem() {
        this.time.addEvent({
            delay: 2500,
            callback: () => {
                const threat = Math.random() > 0.7;
                if (threat) {
                    this.threatIndicator.setFillStyle(0xff0000);

                    // Efecto de alerta más visible
                    this.tweens.add({
                        targets: this.threatIndicator,
                        scaleX: { from: 1, to: 2.5 },
                        scaleY: { from: 1, to: 2.5 },
                        duration: 400,
                        yoyo: true,
                        repeat: 4
                    });
                } else {
                    this.threatIndicator.setFillStyle(0x00ff00);
                }
            },
            loop: true
        });
    }

    initializeMalwareSystem(x, y, sectionWidth) {
        // Array para almacenar partículas de malware
        this.malwareParticles = [];
        this.virusParticles = [];
        this.malwareLabels = [];
        this.virusLabels = [];

        // Crear partículas de malware que intentan entrar (más grandes)
        for (let i = 0; i < 8; i++) {
            const malware = this.add.text(0, 0, '🦠', {
                fontSize: '48px'
            });
            malware.setVisible(false);
            this.malwareParticles.push(malware);

            // Crear etiqueta "MALWARE" para cada partícula mejorada
            const malwareLabel = this.add.text(0, 0, 'MALWARE', {
                fontSize: '14px', // Aumentar tamaño para mejor calidad
                fill: '#ff0000',
                fontFamily: 'Arial, sans-serif', // Cambiar fuente para mejor renderizado
                fontStyle: 'bold',
                resolution: 2 // Añadir resolución para texto más nítido
            });
            malwareLabel.setVisible(false);
            malwareLabel.setOrigin(0.5);
            this.malwareLabels.push(malwareLabel);
        }

        // Crear partículas de virus (más grandes)
        for (let i = 0; i < 6; i++) {
            const virus = this.add.text(0, 0, '💀', {
                fontSize: '42px'
            });
            virus.setVisible(false);
            this.virusParticles.push(virus);

            // Crear etiqueta "VIRUS" para cada partícula mejorada
            const virusLabel = this.add.text(0, 0, 'VIRUS', {
                fontSize: '14px', // Aumentar tamaño para mejor calidad
                fill: '#00ff00',
                fontFamily: 'Arial, sans-serif', // Cambiar fuente para mejor renderizado
                fontStyle: 'bold',
                resolution: 2 // Añadir resolución para texto más nítido
            });
            virusLabel.setVisible(false);
            virusLabel.setOrigin(0.5);
            this.virusLabels.push(virusLabel);
        }

        // Iniciar animación de malware
        this.startMalwareAnimation(x, y, sectionWidth);

        // Timer para actualizar el estado de infección
        this.time.addEvent({
            delay: 1000, // Cada segundo
            callback: this.updateInfectionStatus,
            callbackScope: this,
            loop: true
        });
    }

    startMalwareAnimation(x, y, sectionWidth) {
        // Animar malware intentando entrar desde diferentes direcciones
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                if (!this.isInfected) {
                    this.animateMalwareAttack(x, y, sectionWidth);
                }
            },
            callbackScope: this,
            loop: true
        });

        // Animar virus más agresivos
        this.time.addEvent({
            delay: 3500,
            callback: () => {
                if (!this.isInfected) {
                    this.animateVirusAttack(x, y, sectionWidth);
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    animateMalwareAttack(x, y, sectionWidth) {
        // Validar que existan partículas de malware
        if (!this.malwareParticles || this.malwareParticles.length === 0) {
            console.warn('⚠️ No hay partículas de malware disponibles para animar');
            return;
        }

        if (!this.malwareLabels || this.malwareLabels.length === 0) {
            console.warn('⚠️ No hay etiquetas de malware disponibles para animar');
            return;
        }

        const malwareIndex = Math.floor(Math.random() * this.malwareParticles.length);
        const malware = this.malwareParticles[malwareIndex];
        const malwareLabel = this.malwareLabels[malwareIndex];

        // Validar que las partículas específicas existan
        if (!malware || !malware.setPosition) {
            console.warn(`⚠️ Partícula de malware en índice ${malwareIndex} no existe o no tiene setPosition`);
            return;
        }

        if (!malwareLabel || !malwareLabel.setPosition) {
            console.warn(`⚠️ Etiqueta de malware en índice ${malwareIndex} no existe o no tiene setPosition`);
            return;
        }

        // Posición inicial aleatoria alrededor de la IA
        const angle = Math.random() * Math.PI * 2;
        const distance = 200;
        const startX = x + Math.cos(angle) * distance;
        const startY = y + Math.sin(angle) * distance;

        malware.setPosition(startX, startY);
        malware.setVisible(true);
        malware.setAlpha(1);

        // Posicionar etiqueta debajo del malware
        malwareLabel.setPosition(startX, startY + 30);
        malwareLabel.setVisible(true);
        malwareLabel.setAlpha(1);

        // Animar hacia la IA
        this.tweens.add({
            targets: malware,
            x: x + (Math.random() - 0.5) * 100,
            y: y + (Math.random() - 0.5) * 100,
            duration: 2000,
            ease: 'Power2',
            onUpdate: () => {
                // Validar que malwareLabel aún exista antes de actualizar posición
                if (malwareLabel && malwareLabel.setPosition) {
                    malwareLabel.setPosition(malware.x, malware.y + 30);
                }
            },
            onComplete: () => {
                // Efecto rojo en la IA cuando es tocada por malware
                this.flashAIRed();
                this.increaseCorruption(5);

                // Efecto de "rebote" al ser rechazado
                this.tweens.add({
                    targets: [malware, malwareLabel],
                    x: startX,
                    y: [startY, startY + 30],
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        if (malware && malware.setVisible) {
                            malware.setVisible(false);
                        }
                        if (malwareLabel && malwareLabel.setVisible) {
                            malwareLabel.setVisible(false);
                        }
                    }
                });
            }
        });
    }

    animateVirusAttack(x, y, sectionWidth) {
        // Validar que existan partículas de virus
        if (!this.virusParticles || this.virusParticles.length === 0) {
            console.warn('⚠️ No hay partículas de virus disponibles para animar');
            return;
        }

        if (!this.virusLabels || this.virusLabels.length === 0) {
            console.warn('⚠️ No hay etiquetas de virus disponibles para animar');
            return;
        }

        const virusIndex = Math.floor(Math.random() * this.virusParticles.length);
        const virus = this.virusParticles[virusIndex];
        const virusLabel = this.virusLabels[virusIndex];

        // Validar que las partículas específicas existan
        if (!virus || !virus.setPosition) {
            console.warn(`⚠️ Partícula de virus en índice ${virusIndex} no existe o no tiene setPosition`);
            return;
        }

        if (!virusLabel || !virusLabel.setPosition) {
            console.warn(`⚠️ Etiqueta de virus en índice ${virusIndex} no existe o no tiene setPosition`);
            return;
        }

        // Los virus son más agresivos y vienen desde los bordes
        const side = Math.floor(Math.random() * 4);
        let startX, startY;

        switch(side) {
            case 0: // Arriba
                startX = x + (Math.random() - 0.5) * sectionWidth;
                startY = y - 250;
                break;
            case 1: // Derecha
                startX = x + sectionWidth/2 + 100;
                startY = y + (Math.random() - 0.5) * 200;
                break;
            case 2: // Abajo
                startX = x + (Math.random() - 0.5) * sectionWidth;
                startY = y + 250;
                break;
            case 3: // Izquierda
                startX = x - sectionWidth/2 - 100;
                startY = y + (Math.random() - 0.5) * 200;
                break;
        }

        virus.setPosition(startX, startY);
        virus.setVisible(true);
        virus.setAlpha(1);

        // Posicionar etiqueta debajo del virus
        virusLabel.setPosition(startX, startY + 30);
        virusLabel.setVisible(true);
        virusLabel.setAlpha(1);

        // Movimiento errático hacia la IA
        this.tweens.add({
            targets: virus,
            x: x,
            y: y,
            duration: 1500,
            ease: 'Power1',
            onUpdate: () => {
                // Validar que virus aún exista antes de modificar posición
                if (virus && typeof virus.x !== 'undefined' && typeof virus.y !== 'undefined') {
                    // Movimiento errático
                    virus.x += (Math.random() - 0.5) * 10;
                    virus.y += (Math.random() - 0.5) * 10;

                    // Validar que virusLabel aún exista antes de actualizar posición
                    if (virusLabel && virusLabel.setPosition) {
                        virusLabel.setPosition(virus.x, virus.y + 30);
                    }
                }
            },
            onComplete: () => {
                // Efecto rojo en la IA cuando es tocada por virus
                this.flashAIRed();
                this.increaseCorruption(8);

                // Efecto de "destrucción" al ser rechazado
                this.tweens.add({
                    targets: [virus, virusLabel],
                    scaleX: 0,
                    scaleY: 0,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        // Validar que virus y virusLabel aún existan antes de modificarlos
                        if (virus && virus.setVisible && virus.setScale) {
                            virus.setVisible(false);
                            virus.setScale(1);
                        }
                        if (virusLabel && virusLabel.setVisible && virusLabel.setScale) {
                            virusLabel.setVisible(false);
                            virusLabel.setScale(1);
                        }
                    }
                });
            }
        });
    }

    updateInfectionStatus() {
        if (!this.isInfected && this.currentStep < 10) {
            this.infectionTimer += 1000;

            // Calcular progreso de infección
            const infectionProgress = this.infectionTimer / this.maxInfectionTime;

            // Cambiar colores y mensajes según el progreso
            if (infectionProgress > 0.8) {
                this.threatIndicator.setFillStyle(0xff0000);

                // Infectar la IA
                if (infectionProgress >= 1.0) {
                    this.infectAI();
                }
            } else if (infectionProgress > 0.6) {
                this.threatIndicator.setFillStyle(0xff6600);
            } else if (infectionProgress > 0.3) {
                this.threatIndicator.setFillStyle(0xffaa00);
            }
        }
    }

    infectAI() {
        this.isInfected = true;

        // Cambiar apariencia de la IA con texto más corto
        this.aiStatus.setText('💀 IA INFECTADA');
        this.aiStatus.setFill('#ff0000');

        // Cambiar el texto del sistema a comprometido con texto más corto
        if (this.systemStatusText) {
            this.systemStatusText.setText('❌ COMPROMETIDO');
            this.systemStatusText.setFill('#ff0000');
            this.systemStatusText.setStroke('#330000', 2);
        }

        // Efecto visual de infección
        this.tweens.add({
            targets: this.aiEntity,
            tint: 0xff0000,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Ocultar todas las partículas de malware
        this.malwareParticles.forEach(malware => malware.setVisible(false));
        this.virusParticles.forEach(virus => virus.setVisible(false));

        // Mostrar mensaje de game over o reinicio
        this.showMessage('', '#ff0000');

        // Congelar la pantalla y mostrar botón de reinicio después del mensaje
        this.time.delayedCall(3000, () => {
            this.showRestartButton();
        });
    }

    showRestartButton() {
        // Crear overlay semi-transparente
        this.gameOverOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.7
        ).setDepth(1000);

        // Crear panel de game over
        this.gameOverPanel = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            400,
            250,
            0x220000,
            0.95
        ).setDepth(1001);
        this.gameOverPanel.setStrokeStyle(3, 0xff0000);

        // Título de game over
        this.gameOverTitle = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 60,
            '💀 SISTEMA INFECTADO',
            {
                fontSize: '24px',
                fill: '#ff0000',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(1002);

        // Mensaje de game over
        this.gameOverMessage = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 20,
            'El malware ha comprometido la IA.\n¡Intenta programar más rápido!',
            {
                fontSize: '16px',
                fill: '#ffaaaa',
                fontFamily: 'Courier New',
                align: 'center'
            }
        ).setOrigin(0.5).setDepth(1002);

        // Botón de reinicio
        this.restartButton = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            200,
            50,
            0x006600,
            0.9
        ).setDepth(1002);
        this.restartButton.setStrokeStyle(2, 0x00ff00);

        this.restartButtonText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            '🔄 REINICIAR',
            {
                fontSize: '18px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(1003);

        // Hacer el botón interactivo
        this.restartButton.setInteractive();
        this.restartButton.on('pointerdown', () => {
            this.restartGame();
        });

        // Efecto hover para el botón
        this.restartButton.on('pointerover', () => {
            this.restartButton.setFillStyle(0x008800, 0.9);
            this.restartButtonText.setFill('#88ff88');
        });

        this.restartButton.on('pointerout', () => {
            this.restartButton.setFillStyle(0x006600, 0.9);
            this.restartButtonText.setFill('#00ff00');
        });

        // Animación de aparición
        [this.gameOverOverlay, this.gameOverPanel, this.gameOverTitle, this.gameOverMessage, this.restartButton, this.restartButtonText].forEach(element => {
            element.setAlpha(0);
            this.tweens.add({
                targets: element,
                alpha: element === this.gameOverOverlay ? 0.7 : 1,
                duration: 500,
                ease: 'Power2'
            });
        });
    }

    restartGame() {
        // Limpiar elementos de game over
        if (this.gameOverOverlay) this.gameOverOverlay.destroy();
        if (this.gameOverPanel) this.gameOverPanel.destroy();
        if (this.gameOverTitle) this.gameOverTitle.destroy();
        if (this.gameOverMessage) this.gameOverMessage.destroy();
        if (this.restartButton) this.restartButton.destroy();
        if (this.restartButtonText) this.restartButtonText.destroy();

        // Reiniciar completamente la escena
        this.scene.restart();
    }

    // Función para hacer que la IA parpadee en rojo cuando es atacada
    flashAIRed() {
        if (this.aiEntity) {
            // Aplicar efecto rojo a todos los elementos hijos del container
            this.aiEntity.list.forEach(child => {
                if (child.setTint) {
                    child.setTint(0xff0000);
                }
            });

            // Efecto de parpadeo
            this.tweens.add({
                targets: this.aiEntity,
                alpha: 0.3,
                duration: 150,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                    // Limpiar el tint de todos los elementos hijos
                    this.aiEntity.list.forEach(child => {
                        if (child.clearTint) {
                            child.clearTint();
                        }
                    });
                    this.aiEntity.setAlpha(1);
                }
            });
        }
    }

    // Función para aumentar la corrupción de la IA
    increaseCorruption(amount) {
        this.aiCorruption = Math.min(this.aiCorruption + amount, this.maxCorruption);
        this.updateCorruptionBar();

        // Si la corrupción llega al máximo, infectar completamente la IA
        if (this.aiCorruption >= this.maxCorruption) {
            this.infectAI();
        }
    }

    // Función para actualizar el estilo de la barra de integridad
    updateIntegrityBarStyle(x, y, maxWidth, height) {
        // Verificar que los elementos necesarios estén inicializados
        if (!this.corruptionBar || !this.corruptionText) {
            console.warn('Elementos de la barra de integridad no inicializados');
            return;
        }

        this.corruptionBar.clear();

        const percentage = this.aiCorruption / this.maxCorruption;
        const barWidth = maxWidth * percentage;

        // Determinar colores según el nivel de corrupción
        let barColor, glowColor, textColor;

        if (percentage > 0.7) {
            barColor = [0xff0000, 0xaa0000]; // Rojo intenso
            glowColor = 0xff3333;
            textColor = '#ff4444';
        } else if (percentage > 0.4) {
            barColor = [0xffaa00, 0xcc6600]; // Naranja
            glowColor = 0xffcc33;
            textColor = '#ffaa00';
        } else if (percentage > 0.1) {
            barColor = [0xffff00, 0xcccc00]; // Amarillo
            glowColor = 0xffff66;
            textColor = '#ffff00';
        } else {
            barColor = [0x00ff88, 0x00cc66]; // Verde
            glowColor = 0x44ffaa;
            textColor = '#00ff88';
        }

        // Dibujar barra con gradiente y efecto de brillo
        if (barWidth > 0) {
            this.corruptionBar.fillGradientStyle(barColor[0], barColor[1], barColor[0], barColor[1], 1);
            this.corruptionBar.fillRoundedRect(x, y, barWidth, height, 4);

            // Efecto de brillo interno
            this.corruptionBar.fillStyle(glowColor, 0.3);
            this.corruptionBar.fillRoundedRect(x, y, barWidth, height/2, 4);
        }

        // Actualizar texto
        const integrityPercentage = Math.round((1 - percentage) * 100);
        this.corruptionText.setText(`INTEGRIDAD IA: ${integrityPercentage}%`);
        this.corruptionText.setFill(textColor);

        // Efecto de parpadeo si la integridad es crítica
        if (percentage > 0.8) {
            this.tweens.add({
                targets: [this.corruptionBar, this.corruptionText, this.integrityFrame],
                alpha: 0.3,
                duration: 300,
                yoyo: true,
                repeat: 1
            });
        }
    }

    // Función para actualizar la barra de corrupción
    updateCorruptionBar() {
        // Usar las coordenadas guardadas correctas (CORREGIDO)
        this.updateIntegrityBarStyle(
            this.integrityBarX,
            this.integrityBarY,
            this.integrityBarWidth,
            this.integrityBarHeight
        );
    }

    // Función para aclarar un color hexadecimal
    lightenColor(color, factor) {
        // Extraer componentes RGB del color hexadecimal
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;

        // Aclarar cada componente
        const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
        const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
        const newB = Math.min(255, Math.floor(b + (255 - b) * factor));

        // Combinar de vuelta en hexadecimal
        return (newR << 16) | (newG << 8) | newB;
    }

    // Función para obtener el color de fondo del bloque según su tipo
    getBlockColor(type) {
        const colorMap = {
            'variable': 0xFF6600,    // Naranja para variables
            'setup': 0x9966FF,       // Púrpura para configuración
            'read': 0x0099FF,        // Azul para lectura de sensores
            'condition': 0xFFAA00,   // Amarillo para condiciones
            'action': 0x00FF66,      // Verde para acciones
            'default': 0x888888      // Gris para otros tipos
        };
        return colorMap[type] || colorMap['default'];
    }

    // Función para obtener el color del borde del bloque según su tipo
    getBlockStrokeColor(type) {
        const strokeColorMap = {
            'variable': 0xCC5500,    // Naranja más oscuro
            'setup': 0x7744CC,       // Púrpura más oscuro
            'read': 0x0077CC,        // Azul más oscuro
            'condition': 0xCC8800,   // Amarillo más oscuro
            'action': 0x00CC44,      // Verde más oscuro
            'default': 0x666666      // Gris más oscuro por defecto
        };
        return strokeColorMap[type] || strokeColorMap['default'];
    }

    showCompletionMessage() {
        console.log('🎊 showCompletionMessage iniciado - congelando escena...');
        console.log('🔍 Estado antes de limpiar:', {
            malwareParticles: this.malwareParticles ? this.malwareParticles.length : 0,
            virusParticles: this.virusParticles ? this.virusParticles.length : 0,
            malwareTimer: !!this.malwareTimer,
            virusTimer: !!this.virusTimer,
            aiCorruption: this.aiCorruption
        });

        // ELIMINAR TODOS LOS VIRUS Y MALWARES PRIMERO
        this.clearAllMalwareAndViruses();

        // Congelar la escena deshabilitando interacciones TEMPORALMENTE
        this.input.enabled = false;

        // Crear overlay semi-transparente
        this.completionOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.8
        ).setDepth(2000);

        // Crear panel de felicitaciones
        this.completionPanel = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            500,
            350,
            0x003300,
            0.95
        ).setDepth(2001);
        this.completionPanel.setStrokeStyle(3, 0x00ff00);

        // Título de felicitaciones
        this.completionTitle = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            '🎉 ¡FELICITACIONES!',
            {
                fontSize: '32px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(2002);

        // Mensaje de feedback
        this.completionMessage = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 30,
            'Has completado exitosamente el sistema\nde defensa cibernética del dron.\n\n¡Tu código está funcionando perfectamente\ny el sistema está protegido!',
            {
                fontSize: '18px',
                fill: '#88ff88',
                fontFamily: 'Courier New',
                align: 'center'
            }
        ).setOrigin(0.5).setDepth(2002);

        // Botón para continuar
        this.continueButton = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 80,
            300,
            50,
            0x006600,
            0.9
        ).setDepth(2002);
        this.continueButton.setStrokeStyle(2, 0x00ff00);

        this.continueButtonText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 80,
            '🚀 CLICK PARA CONTINUAR',
            {
                fontSize: '18px',
                fill: '#00ff00',
                fontFamily: 'Courier New',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5).setDepth(2003);

        // Hacer el botón interactivo
        this.continueButton.setInteractive();

        // REACTIVAR INPUT PARA EL BOTÓN
        this.input.enabled = true;
        console.log('🔄 Input reactivado para el botón continuar');

        this.continueButton.on('pointerdown', () => {
            console.log('🖱️ Botón continuar clickeado - iniciando transición...');
            console.log('🎯 Llamando a goToNextScene()...');
            this.goToNextScene();
        });

        // Efecto hover para el botón
        this.continueButton.on('pointerover', () => {
            this.continueButton.setFillStyle(0x008800, 0.9);
            this.continueButtonText.setFill('#88ff88');
        });

        this.continueButton.on('pointerout', () => {
            this.continueButton.setFillStyle(0x006600, 0.9);
            this.continueButtonText.setFill('#00ff00');
        });

        // Animación de aparición
        [this.completionOverlay, this.completionPanel, this.completionTitle, this.completionMessage, this.continueButton, this.continueButtonText].forEach(element => {
            element.setAlpha(0);
            this.tweens.add({
                targets: element,
                alpha: element === this.completionOverlay ? 0.8 : 1,
                duration: 800,
                ease: 'Power2'
            });
        });
    }

    clearAllMalwareAndViruses() {
        console.log('🧹 Eliminando todos los virus y malwares...');

        // Detener todas las animaciones de malware y virus
        if (this.malwareTimer) {
            this.malwareTimer.remove();
            this.malwareTimer = null;
            console.log('✅ Timer de malware eliminado');
        }

        if (this.virusTimer) {
            this.virusTimer.remove();
            this.virusTimer = null;
            console.log('✅ Timer de virus eliminado');
        }

        if (this.infectionStatusTimer) {
            this.infectionStatusTimer.remove();
            this.infectionStatusTimer = null;
            console.log('✅ Timer de infección eliminado');
        }

        // Ocultar y destruir todas las partículas de malware
        if (this.malwareParticles && this.malwareParticles.length > 0) {
            console.log(`🦠 Eliminando ${this.malwareParticles.length} partículas de malware`);
            this.malwareParticles.forEach(malware => {
                if (malware) {
                    malware.setVisible(false);
                    malware.destroy();
                    this.tweens.killTweensOf(malware);
                }
            });
            this.malwareParticles = [];
        }

        // Ocultar y destruir todas las partículas de virus
        if (this.virusParticles && this.virusParticles.length > 0) {
            console.log(`💀 Eliminando ${this.virusParticles.length} partículas de virus`);
            this.virusParticles.forEach(virus => {
                if (virus) {
                    virus.setVisible(false);
                    virus.destroy();
                    this.tweens.killTweensOf(virus);
                }
            });
            this.virusParticles = [];
        }

        // Ocultar todas las etiquetas de malware
        if (this.malwareLabels && this.malwareLabels.length > 0) {
            console.log(`🏷️ Eliminando ${this.malwareLabels.length} etiquetas de malware`);
            this.malwareLabels.forEach(label => {
                if (label) {
                    label.setVisible(false);
                    label.destroy();
                    this.tweens.killTweensOf(label);
                }
            });
            this.malwareLabels = [];
        }

        // Ocultar todas las etiquetas de virus
        if (this.virusLabels && this.virusLabels.length > 0) {
            console.log(`🏷️ Eliminando ${this.virusLabels.length} etiquetas de virus`);
            this.virusLabels.forEach(label => {
                if (label) {
                    label.setVisible(false);
                    label.destroy();
                    this.tweens.killTweensOf(label);
                }
            });
            this.virusLabels = [];
        }

        // Restaurar la integridad de la IA al 100%
        this.aiCorruption = 0;
        this.infectionTimer = 0;
        this.updateCorruptionBar();
        console.log('💚 Integridad de IA restaurada al 100%');

        // Restaurar el color normal de la IA
        if (this.aiCharacter) {
            this.aiCharacter.setTint(0xffffff);
            console.log('🎨 Color de IA restaurado');
        }

        console.log('✅ Todos los virus y malwares eliminados - Sistema limpio');
    }

    goToNextScene() {
        console.log('🚀 Transicionando a la escena Rompecabezas...');
        console.log('🎮 Verificando que la escena Rompecabezas existe...');

        try {
            // Ir a la escena Rompecabezas
            this.scene.start('Rompecabezas');
            console.log('✅ Transición exitosa a Rompecabezas');
        } catch (error) {
            console.error('❌ Error al cambiar a la escena Rompecabezas:', error);
        }
    }
}