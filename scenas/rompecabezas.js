class Rompecabezas extends Phaser.Scene {
  constructor() {
    super({ key: "Rompecabezas" });
    this.currentStep = 0;
    this.codeLines = [];
    this.explanations = [];
  }

  preload() {
    // Cargar assets necesarios
        this.load.image('background', 'assets/background.svg');
        
        // El archivo de audio está vacío, por lo que se omite para evitar errores
        // this.load.audio('success', 'assets/sounds/success.mp3');
  }

  create() {
    // Configurar dimensiones de la pantalla según game.js (1000x500)
    const width = 1000;
    const height = 500;
    
    // Fondo con gradiente mejorado y más moderno
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x0d1117, 0x161b22, 0x21262d, 0x30363d, 1);
    graphics.fillRect(0, 0, width, height);

    // Agregar textura sutil al fondo
    const backgroundTexture = this.add.graphics();
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      backgroundTexture.fillStyle(0x58a6ff, Math.random() * 0.1 + 0.05);
      backgroundTexture.fillCircle(x, y, size);
    }

    // Título con efecto de sombra mejorado y gradiente
    const titleShadow = this.add.text(width/2 + 2, 52, 'Sistema de Monitoreo Arduino', {
      fontSize: '28px',
      fontFamily: 'SF Pro Display, -apple-system, Arial, sans-serif',
      fill: '#000000',
      align: 'center',
      fontWeight: '700'
    }).setOrigin(0.5);

    const title = this.add.text(width/2, 50, 'Sistema de Monitoreo Arduino', {
      fontSize: '28px',
      fontFamily: 'SF Pro Display, -apple-system, Arial, sans-serif',
      fill: '#f0f6fc',
      align: 'center',
      fontWeight: '700'
    }).setOrigin(0.5);

    // Línea decorativa bajo el título
    const titleLine = this.add.graphics();
    titleLine.lineStyle(2, 0x58a6ff, 0.8);
    titleLine.lineBetween(width/2 - 150, 70, width/2 + 150, 70);
    
    // Puntos decorativos en la línea
    titleLine.fillStyle(0x58a6ff, 1);
    titleLine.fillCircle(width/2 - 150, 70, 4);
    titleLine.fillCircle(width/2, 70, 4);
    titleLine.fillCircle(width/2 + 150, 70, 4);

    // Definir las líneas de código y sus explicaciones
    this.setupCodeAndExplanations();

    // Crear partículas flotantes para ambiente
    this.createFloatingParticles(width, height);

    // Crear contenedor del código (lado izquierdo) - Subido y más grande
    this.createCodeContainer(width * 0.25, height * 0.45);

    // Crear contenedor de explicación (lado derecho) - Subido y más grande
    this.createExplanationContainer(width * 0.75, height * 0.45);

    // Crear contenedores para código y explicación
    this.createCodeSection();
    this.createExplanationSection();
    // Crear botones de navegación centrados en la parte inferior
    this.createNavigationButtons(width, height);

    // Mostrar el primer paso
    this.showStep(0);

    // Agregar partículas de fondo
    this.createBackgroundParticles();
  }

  setupCodeAndExplanations() {
    this.codeLines = [
      'int sensorAmenaza = A1;',
      'int sistemaDefensa = 8;',
      '',
      'void setup() {',
      '  pinMode(sensorAmenaza, INPUT);',
      '  pinMode(sistemaDefensa, OUTPUT);',
      '}',
      '',
      'void loop() {',
      '  int amenaza = analogRead(sensorAmenaza);',
      '  ',
      '  if (amenaza > 700) {',
      '    digitalWrite(sistemaDefensa, HIGH);',
      '  } else {',
      '    digitalWrite(sistemaDefensa, LOW);',
      '  }',
      '}'
    ];

    this.explanations = [
      {
        title: '🔧 Declaración de Variables Globales',
        content: '📍 CONFIGURACIÓN INICIAL:\n\n🚨 int sensorAmenaza = A1;\n   → Pin analógico A1 detecta amenazas\n   → Entrada analógica (0-1023 valores)\n\n🛡️ int sistemaDefensa = 8;\n   → Pin digital #8 controla defensa\n   → Salida digital (0V = OFF, 5V = ON)\n\n💡 CONCEPTO CLAVE:\nLas variables globales se declaran fuera de las funciones para ser accesibles en todo el programa.',
        icon: '🔧'
      },
      {
        title: '⚙️ Función setup() - Inicialización',
        content: '🚀 CONFIGURACIÓN INICIAL:\n\n📥 pinMode(sensorAmenaza, INPUT);\n   → Configura A1 como entrada\n   → Lee señales analógicas (0-1023)\n\n📤 pinMode(sistemaDefensa, OUTPUT);\n   → Configura pin 8 como salida\n   → Controla sistema de defensa\n\n⏰ setup() se ejecuta UNA VEZ al inicio.',
        icon: '⚙️'
      },
      {
        title: '🔄 Función loop() - Monitoreo',
        content: '📡 LECTURA CONTINUA:\n\n🔍 int amenaza = analogRead(sensorAmenaza);\n   → Lee valor del pin A1\n   → Convierte señal a digital (0-1023)\n\n📈 VALORES DE REFERENCIA:\n   • 0 = Sin amenaza\n   • 512 = Amenaza media\n   • 1023 = Amenaza máxima\n\n🔁 loop() se repite infinitamente.',
        icon: '🔄'
      },
      {
        title: '⚠️ Evaluación de Condición',
        content: '🚨 DETECCIÓN DE AMENAZA:\n\n⚡ if (amenaza > 700) {\n   → Umbral: 700 ≈ 3.42V\n   → Si amenaza > 3.42V → PELIGRO\n   → Activa sistema de defensa\n\n📊 ANÁLISIS:\n   • Seguro: < 600 (2.93V)\n   • Alerta: 600-700 (2.93-3.42V)\n   • Crítico: > 700 (3.42V)\n\n💡 Valor 700 = umbral de activación.',
        icon: '⚠️'
      },
      {
        title: '🛡️ Sistema de Defensa',
        content: '⚡ RESPUESTA AUTOMÁTICA:\n\n🟢 digitalWrite(sistemaDefensa, HIGH);\n   → Activa defensa (5V)\n   → Sistema de protección ON\n\n🔴 digitalWrite(sistemaDefensa, LOW);\n   → Desactiva defensa (0V)\n   → Sistema de protección OFF\n\n🔄 El sistema responde instantáneamente a las amenazas detectadas.',
        icon: '🛡️'
      }
    ];
  }

  createCodeSection() {
    // Crear contenedor del código mejor posicionado para evitar colisiones
    const codeContainer = this.add.container(250, 220);
    
    // Sombra exterior profunda
    const outerShadow = this.add.graphics();
    outerShadow.fillStyle(0x000000, 0.3);
    outerShadow.fillRoundedRect(-228, -158, 456, 316, 20);
    codeContainer.add(outerShadow);
    
    // Gradiente de fondo principal
    const gradientBackground = this.add.graphics();
    gradientBackground.fillGradientStyle(0x0d1117, 0x0d1117, 0x161b22, 0x21262d, 1);
    gradientBackground.fillRoundedRect(-220, -150, 440, 300, 18);
    codeContainer.add(gradientBackground);
    
    // Borde principal con efecto neón más claro
    const mainBorder = this.add.graphics();
    mainBorder.lineStyle(3, 0x00d4aa, 1);
    mainBorder.strokeRoundedRect(-220, -150, 440, 300, 18);
    codeContainer.add(mainBorder);
    
    // Borde interior sutil
    const innerBorder = this.add.graphics();
    innerBorder.lineStyle(1, 0x30363d, 0.8);
    innerBorder.strokeRoundedRect(-215, -145, 430, 290, 15);
    codeContainer.add(innerBorder);

    // Barra superior decorativa más pequeña
    const topBar = this.add.graphics();
    topBar.fillStyle(0x21262d, 0.9);
    topBar.fillRoundedRect(-220, -150, 440, 45, 18, 18, 0, 0);
    topBar.lineStyle(1, 0x30363d, 0.5);
    topBar.strokeRoundedRect(-220, -150, 440, 45, 18, 18, 0, 0);
    codeContainer.add(topBar);

    // Círculos decorativos estilo terminal
    const redCircle = this.add.circle(-190, -127, 6, 0xff5f56);
    const yellowCircle = this.add.circle(-170, -127, 6, 0xffbd2e);
    const greenCircle = this.add.circle(-150, -127, 6, 0x27ca3f);
    codeContainer.add([redCircle, yellowCircle, greenCircle]);

    // Título del código con mejor tipografía
    this.codeTitle = this.add.text(0, -127, '💻 Arduino IDE', {
      fontSize: '16px',
      fontFamily: 'SF Mono, Monaco, Consolas, monospace',
      fill: '#f0f6fc',
      align: 'center',
      fontWeight: '600'
    }).setOrigin(0.5);
    codeContainer.add(this.codeTitle);

    // Línea separadora elegante
    const separatorLine = this.add.graphics();
    separatorLine.lineStyle(1, 0x30363d, 0.8);
    separatorLine.lineBetween(-200, -105, 200, -105);
    codeContainer.add(separatorLine);

    // Inicializar array para objetos de texto del código
    this.codeTextObjects = [];
    
    // Crear texto del código con colores específicos
    this.createColoredCodeText(codeContainer, '', []);

    this.codeContainer = codeContainer;
  }

  createExplanationSection() {
    // Crear contenedor de explicación mejor posicionado y con nuevo color
    const explanationContainer = this.add.container(750, 220);
    
    // Sombra exterior más sutil
    const outerShadow = this.add.graphics();
    outerShadow.fillStyle(0x000000, 0.2);
    outerShadow.fillRoundedRect(-222, -152, 444, 304, 16);
    explanationContainer.add(outerShadow);
    
    // Gradiente de fondo principal con nuevo color verde suave
    const gradientBackground = this.add.graphics();
    gradientBackground.fillGradientStyle(0xe8f5e8, 0xe8f5e8, 0xd4f1d4, 0xc1ecc1, 1);
    gradientBackground.fillRoundedRect(-220, -150, 440, 300, 15);
    explanationContainer.add(gradientBackground);
    
    // Borde principal con color verde
    const mainBorder = this.add.graphics();
    mainBorder.lineStyle(2, 0x28a745, 0.8);
    mainBorder.strokeRoundedRect(-220, -150, 440, 300, 15);
    explanationContainer.add(mainBorder);
    
    // Borde interior sutil
    const innerBorder = this.add.graphics();
    innerBorder.lineStyle(1, 0x6f9f6f, 0.6);
    innerBorder.strokeRoundedRect(-215, -145, 430, 290, 12);
    explanationContainer.add(innerBorder);

    // Barra superior más compacta con color verde
    const topBar = this.add.graphics();
    topBar.fillStyle(0xd4f1d4, 0.95);
    topBar.fillRoundedRect(-220, -150, 440, 40, 15, 15, 0, 0);
    topBar.lineStyle(1, 0x6f9f6f, 0.4);
    topBar.strokeRoundedRect(-220, -150, 440, 40, 15, 15, 0, 0);
    explanationContainer.add(topBar);

    // Icono principal más pequeño
    const mainIcon = this.add.text(-190, -130, '📚', {
      fontSize: '16px',
      align: 'center'
    }).setOrigin(0.5);
    explanationContainer.add(mainIcon);

    // Título de la explicación mejor posicionado
    this.explanationTitle = this.add.text(0, -130, 'Explicación Técnica', {
      fontSize: '14px',
      fontFamily: 'SF Pro Display, -apple-system, Arial, sans-serif',
      fill: '#155724',
      align: 'center',
      fontWeight: '600'
    }).setOrigin(0.5);
    explanationContainer.add(this.explanationTitle);

    // Línea separadora más sutil
    const separatorLine = this.add.graphics();
    separatorLine.lineStyle(1, 0x6f9f6f, 0.6);
    separatorLine.lineBetween(-200, -110, 200, -110);
    explanationContainer.add(separatorLine);

    // Área de contenido más compacta
    const contentArea = this.add.graphics();
    contentArea.fillStyle(0xffffff, 0.9);
    contentArea.fillRoundedRect(-200, -90, 400, 220, 8);
    contentArea.lineStyle(1, 0xc3e6c3, 0.6);
    contentArea.strokeRoundedRect(-200, -90, 400, 220, 8);
    explanationContainer.add(contentArea);

    // Texto de explicación con mejor espaciado y posición corregida
    this.explanationText = this.add.text(0, 10, '', {
      fontSize: '12px',
      fontFamily: 'SF Pro Text, -apple-system, Arial, sans-serif',
      fill: '#155724',
      align: 'center',
      wordWrap: { width: 360 },
      lineSpacing: 5,
      padding: { x: 10, y: 10 }
    }).setOrigin(0.5);
    explanationContainer.add(this.explanationText);

    // Icono de explicación más pequeño y mejor posicionado
    this.explanationIcon = this.add.text(0, 110, '', {
      fontSize: '18px',
      align: 'center'
    }).setOrigin(0.5);
    explanationContainer.add(this.explanationIcon);

    this.explanationContainer = explanationContainer;
  }

  createNavigationButtons(width, height) {
    // Botón Anterior con diseño más elegante
    const backButtonBg = this.add.graphics();
    backButtonBg.fillGradientStyle(0x6c757d, 0x6c757d, 0x495057, 0x495057, 1);
    backButtonBg.fillRoundedRect(width/2 - 260, height - 80, 140, 45, 22);
    backButtonBg.lineStyle(2, 0x343a40, 0.8);
    backButtonBg.strokeRoundedRect(width/2 - 260, height - 80, 140, 45, 22);
    
    this.backButton = this.add.rectangle(width/2 - 190, height - 57, 140, 45, 0x000000, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.previousStep());

    this.add.text(width/2 - 190, height - 57, '← Anterior', {
      fontSize: '14px',
      fontFamily: 'SF Pro Display, -apple-system, Arial, sans-serif',
      fill: '#ffffff',
      fontWeight: '600'
    }).setOrigin(0.5);

    // Botón Siguiente con diseño más elegante
    const nextButtonBg = this.add.graphics();
    nextButtonBg.fillGradientStyle(0x0d6efd, 0x0d6efd, 0x0a58ca, 0x0a58ca, 1);
    nextButtonBg.fillRoundedRect(width/2 + 120, height - 80, 140, 45, 22);
    nextButtonBg.lineStyle(2, 0x084298, 0.8);
    nextButtonBg.strokeRoundedRect(width/2 + 120, height - 80, 140, 45, 22);
    
    this.nextButton = this.add.rectangle(width/2 + 190, height - 57, 140, 45, 0x000000, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.nextStep());

    this.add.text(width/2 + 190, height - 57, 'Siguiente →', {
      fontSize: '14px',
      fontFamily: 'SF Pro Display, -apple-system, Arial, sans-serif',
      fill: '#ffffff',
      fontWeight: '600'
    }).setOrigin(0.5);

    // Indicador de progreso más compacto
    const progressBg = this.add.graphics();
    progressBg.fillStyle(0x21262d, 0.95);
    progressBg.fillRoundedRect(width/2 - 65, height - 80, 130, 45, 22);
    progressBg.lineStyle(2, 0x30363d, 0.8);
    progressBg.strokeRoundedRect(width/2 - 65, height - 80, 130, 45, 22);

    // Icono de progreso más pequeño
    this.add.text(width/2 - 30, height - 57, '📊', {
      fontSize: '16px'
    }).setOrigin(0.5);

    this.progressText = this.add.text(width/2 + 10, height - 57, '', {
      fontSize: '12px',
      fontFamily: 'SF Pro Display, -apple-system, Arial, sans-serif',
      fill: '#f0f6fc',
      fontWeight: '500'
    }).setOrigin(0.5);
  }

  showStep(step) {
    if (step < 0 || step >= this.explanations.length) return;

    this.currentStep = step;

    // Actualizar código con resaltado mejorado
    this.updateCodeDisplay(step);

    // Actualizar explicación con icono
    const explanation = this.explanations[step];
    this.explanationTitle.setText(explanation.title);
    this.explanationText.setText(explanation.content);
    
    // Actualizar icono dinámico
    if (this.explanationIcon) {
      this.explanationIcon.setText(explanation.icon);
    }

    // Actualizar progreso con animación
    this.progressText.setText(`Paso ${step + 1} de ${this.explanations.length}`);

    // Actualizar estado de botones con efectos
    if (step > 0) {
      this.backButton.setAlpha(1);
      this.backButton.setInteractive();
    } else {
      this.backButton.setAlpha(0.5);
      this.backButton.disableInteractive();
    }

    if (step < this.explanations.length - 1) {
      this.nextButton.setAlpha(1);
      this.nextButton.setInteractive();
    } else {
      this.nextButton.setAlpha(0.8);
      // En el último paso, usar nextStep() para mostrar felicitaciones
      this.nextButton.removeAllListeners();
      this.nextButton.on('pointerdown', () => this.nextStep());
    }

    // Efecto de transición suave
    this.tweens.add({
      targets: [this.codeContainer, this.explanationContainer],
      alpha: { from: 0.7, to: 1 },
      duration: 300,
      ease: 'Power2'
    });
  }

  updateCodeDisplay(step) {
    const highlightMap = {
      0: [0, 1], // Declaraciones de variables
      1: [3, 4, 5, 6], // Configuración de pines
      2: [8, 9], // Función loop
      3: [11], // Condición if
      4: [12, 13, 14] // Sistema de carga
    };
    
    const linesToHighlight = highlightMap[step] || [];
    
    // Actualizar el texto del código con colores
    this.createColoredCodeText(this.codeContainer, '', linesToHighlight);
  }

  highlightLines(highlightIndices) {
    // Crear el texto del código con formato HTML-like para Phaser
    let formattedCode = '';
    
    this.codeLines.forEach((line, index) => {
      if (highlightIndices.includes(index)) {
        // Líneas resaltadas con colores específicos
        if (line.includes('int ') || line.includes('void ')) {
          formattedCode += line + '\n'; // Líneas de declaración resaltadas
        } else if (line.includes('pinMode') || line.includes('analogRead') || line.includes('digitalWrite')) {
          formattedCode += line + '\n'; // Funciones resaltadas
        } else if (line.includes('if') || line.includes('{') || line.includes('}')) {
          formattedCode += line + '\n'; // Estructuras resaltadas
        } else if (line.includes('delay') || line.includes('//')) {
          formattedCode += line + '\n'; // Comentarios resaltados
        } else {
          formattedCode += line + '\n'; // Otras líneas resaltadas
        }
      } else {
        // Líneas no resaltadas (más tenues)
        formattedCode += line + '\n';
      }
    });
    
    return formattedCode.trim();
  }

  // Función para crear texto con colores específicos
  createColoredCodeText(container, codeText, highlightIndices) {
    // Limpiar texto anterior
    if (this.codeTextObjects) {
      this.codeTextObjects.forEach(obj => obj.destroy());
    }
    this.codeTextObjects = [];

    let yOffset = -95; // Posición inicial más arriba
    const lineHeight = 12; // Espaciado entre líneas muy compacto
    const leftMargin = -200; // Margen izquierdo más hacia la izquierda
    const maxWidth = 380; // Ancho máximo que se ajuste al contenedor (440px - márgenes)

    this.codeLines.forEach((line, index) => {
      // Crear número de línea más pequeño
      const lineNumber = this.add.text(leftMargin, yOffset, `${index + 1}`.padStart(2, ' '), {
        fontSize: '9px',
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
        fill: '#7d8590',
        align: 'right',
        fontWeight: '500'
      });
      container.add(lineNumber);
      this.codeTextObjects.push(lineNumber);

      // Sistema de cambio de color simple
      let color = '#ffffff'; // Color blanco por defecto
      
      if (highlightIndices.includes(index)) {
        color = '#00ff88'; // Verde brillante para líneas explicadas
      }

      // Crear texto del código con dimensiones muy ajustadas
      const lineText = this.add.text(leftMargin + 25, yOffset, line, {
        fontSize: '9px',
        fontFamily: 'SF Mono, Monaco, Consolas, monospace',
        fill: color,
        align: 'left',
        wordWrap: { width: maxWidth, useAdvancedWrap: true }
      });

      container.add(lineText);
      this.codeTextObjects.push(lineText);
      yOffset += lineHeight;
    });
  }

  createFloatingParticles(width, height) {
    // Crear partículas flotantes optimizadas para 1000x500
    for (let i = 0; i < 25; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 4),
        0x00ff88,
        0.4
      );

      // Animación flotante vertical
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(30, 80),
        alpha: { from: 0.4, to: 0.1 },
        duration: Phaser.Math.Between(4000, 8000),
        ease: 'Power1',
        repeat: -1,
        yoyo: true
      });

      // Animación flotante horizontal
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-50, 50),
        duration: Phaser.Math.Between(3000, 6000),
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
      });
    }
  }

  createCodeContainer(x, y) {
    // Placeholder for code container creation
  }

  createExplanationContainer(x, y) {
    // Placeholder for explanation container creation
  }

  createBackgroundParticles() {
    // Crear partículas flotantes de fondo
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600),
        Phaser.Math.Between(1, 3),
        0x00ff88,
        0.3
      );

      // Animación flotante
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(50, 150),
        alpha: { from: 0.3, to: 0 },
        duration: Phaser.Math.Between(3000, 6000),
        ease: 'Power1',
        repeat: -1,
        yoyo: true
      });

      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-30, 30),
        duration: Phaser.Math.Between(2000, 4000),
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
      });
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  nextStep() {
    if (this.currentStep < this.explanations.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      // Al completar el paso 5, mostrar mensaje de felicitaciones
      this.showCongratulationsMessage();
    }
  }

  showCongratulationsMessage() {
    // Ocultar elementos existentes
    this.codeContainer.setVisible(false);
    this.explanationContainer.setVisible(false);
    this.backButton.setVisible(false);
    this.nextButton.setVisible(false);
    this.progressText.setVisible(false);

    const { width, height } = this.scale;

    // Crear fondo semi-transparente
    const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8);

    // Mensaje principal de felicitaciones
    const congratsText = this.add.text(width/2, height/2 - 80, '¡FELICITACIONES!', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      fill: '#00ff00',
      stroke: '#ffffff',
      strokeThickness: 2,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000000',
        blur: 5,
        fill: true
      }
    }).setOrigin(0.5);

    // Texto secundario
    const successText = this.add.text(width/2, height/2 - 20, 'Has entendido el código', {
      fontSize: '32px',
      fontFamily: 'Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Instrucción para continuar
    const continueText = this.add.text(width/2, height/2 + 40, 'Haz click en cualquier lado de la pantalla para avanzar', {
      fontSize: '24px',
      fontFamily: 'Arial',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Animación de entrada
    this.tweens.add({
      targets: [congratsText, successText, continueText],
      alpha: { from: 0, to: 1 },
      scale: { from: 0.5, to: 1 },
      duration: 800,
      ease: 'Back.easeOut'
    });

    // Efecto de parpadeo en el texto de felicitaciones
    this.tweens.add({
      targets: congratsText,
      alpha: { from: 1, to: 0.7 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Hacer toda la pantalla clickeable para avanzar
    overlay.setInteractive();
    overlay.on('pointerdown', () => {
      this.scene.start('CircuitosQuemados');
    });
  }
}