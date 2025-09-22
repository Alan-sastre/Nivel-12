class Rompecabezas extends Phaser.Scene {
  constructor() {
    super({ key: "Rompecabezas" });
    this.currentStep = 0;
    this.codeLines = [];
    this.explanations = [];
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
  }

  preload() {
    // Cargar assets necesarios
    this.load.image("background", "assets/background.svg");

    // El archivo de audio está vacío, por lo que se omite para evitar errores
    // this.load.audio('success', 'assets/sounds/success.mp3');
  }

  create() {
    // Configurar dimensiones de la pantalla según game.js (1000x500)
    const { width, height } = this.scale;

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

    // Título con efecto de sombra mejorado y gradiente - adaptado para móviles
    const titleSize = this.isMobile ? "16px" : "28px";
    const titleY = this.isMobile ? 20 : 50;

    const titleShadow = this.add
      .text(width / 2 + 2, titleY + 2, "Sistema de Monitoreo Arduino", {
        fontSize: titleSize,
        fontFamily: "SF Pro Display, -apple-system, Arial, sans-serif",
        fill: "#000000",
        align: "center",
        fontWeight: "700",
      })
      .setOrigin(0.5);

    const title = this.add
      .text(width / 2, titleY, "Sistema de Monitoreo Arduino", {
        fontSize: titleSize,
        fontFamily: "SF Pro Display, -apple-system, Arial, sans-serif",
        fill: "#f0f6fc",
        align: "center",
        fontWeight: "700",
      })
      .setOrigin(0.5);

    // Línea decorativa bajo el título - adaptada para móviles
    const lineWidth = this.isMobile ? 100 : 150;
    const lineY = this.isMobile ? 35 : 70;

    const titleLine = this.add.graphics();
    titleLine.lineStyle(2, 0x58a6ff, 0.8);
    titleLine.lineBetween(
      width / 2 - lineWidth,
      lineY,
      width / 2 + lineWidth,
      lineY
    );

    // Puntos decorativos en la línea
    titleLine.fillStyle(0x58a6ff, 1);
    titleLine.fillCircle(width / 2 - lineWidth, lineY, 4);
    titleLine.fillCircle(width / 2, lineY, 4);
    titleLine.fillCircle(width / 2 + lineWidth, lineY, 4);

    // Definir las líneas de código y sus explicaciones
    this.setupCodeAndExplanations();

    // Crear partículas flotantes para ambiente
    this.createFloatingParticles(width, height);

    // Crear contenedores para código y explicación - optimizado para móviles horizontales
    if (this.isMobile) {
      // En móviles horizontales, usar layout horizontal con contenedores más centrados
      this.createCodeContainer(width * 0.25, height * 0.55);
      this.createExplanationContainer(width * 0.75, height * 0.55);
    } else {
      // En desktop, usar layout horizontal estándar
      this.createCodeContainer(width * 0.25, height * 0.5);
      this.createExplanationContainer(width * 0.75, height * 0.5);
    }

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
    // Fragmentos de código específicos para cada paso
    this.codeFragments = [
      // Paso 1: Variables globales
      [
        "int sensorAmenaza = A1;",
        "int sistemaDefensa = 8;"
      ],
      // Paso 2: Función setup
      [
        "void setup() {",
        "  pinMode(sensorAmenaza, INPUT);",
        "  pinMode(sistemaDefensa, OUTPUT);",
        "}"
      ],
      // Paso 3: Inicio de loop y lectura
      [
        "void loop() {",
        "  int amenaza = analogRead(sensorAmenaza);"
      ],
      // Paso 4: Condición if
      [
        "  if (amenaza > 700) {"
      ],
      // Paso 5: Sistema de defensa completo
      [
        "    digitalWrite(sistemaDefensa, HIGH);",
        "  } else {",
        "    digitalWrite(sistemaDefensa, LOW);",
        "  }",
        "}"
      ]
    ];

    this.explanations = [
      {
        title: "🔧 Declaración de Variables Globales",
        content:
          "📍 CONFIGURACIÓN INICIAL:\n\n🚨 int sensorAmenaza = A1;\n   → Pin analógico A1 detecta amenazas\n   → Entrada analógica (0-1023 valores)\n\n🛡️ int sistemaDefensa = 8;\n   → Pin digital #8 controla defensa\n   → Salida digital (0V = OFF, 5V = ON)\n\n💡 CONCEPTO CLAVE:\nLas variables globales se declaran fuera de las funciones para ser accesibles en todo el programa.",
        icon: "🔧",
      },
      {
        title: "⚙️ Función setup() - Inicialización",
        content:
          "🚀 CONFIGURACIÓN INICIAL:\n\n📥 pinMode(sensorAmenaza, INPUT);\n   → Configura A1 como entrada\n   → Lee señales analógicas (0-1023)\n\n📤 pinMode(sistemaDefensa, OUTPUT);\n   → Configura pin 8 como salida\n   → Controla sistema de defensa\n\n⏰ setup() se ejecuta UNA VEZ al inicio.",
        icon: "⚙️",
      },
      {
        title: "🔄 Función loop() - Monitoreo",
        content:
          "📡 LECTURA CONTINUA:\n\n🔍 int amenaza = analogRead(sensorAmenaza);\n   → Lee valor del pin A1\n   → Convierte señal a digital (0-1023)\n\n📈 VALORES DE REFERENCIA:\n   • 0 = Sin amenaza\n   • 512 = Amenaza media\n   • 1023 = Amenaza máxima\n\n🔁 loop() se repite infinitamente.",
        icon: "🔄",
      },
      {
        title: "⚠️ Evaluación de Condición",
        content:
          "🚨 DETECCIÓN DE AMENAZA:\n\n⚡ if (amenaza > 700) {\n   → Umbral: 700 ≈ 3.42V\n   → Si amenaza > 3.42V → PELIGRO\n   → Activa sistema de defensa\n\n📊 ANÁLISIS:\n   • Seguro: < 600 (2.93V)\n   • Alerta: 600-700 (2.93-3.42V)\n   • Crítico: > 700 (3.42V)\n\n💡 Valor 700 = umbral de activación.",
        icon: "⚠️",
      },
      {
        title: "🛡️ Sistema de Defensa",
        content:
          "⚡ RESPUESTA AUTOMÁTICA:\n\n🟢 digitalWrite(sistemaDefensa, HIGH);\n   → Activa defensa (5V)\n   → Sistema de protección ON\n\n🔴 digitalWrite(sistemaDefensa, LOW);\n   → Desactiva defensa (0V)\n   → Sistema de protección OFF\n\n🔄 El sistema responde instantáneamente a las amenazas detectadas.",
        icon: "🛡️",
      },
    ];
  }

  createCodeSection() {
    // Posicionamiento para layout lado a lado en móviles - código a la izquierda
    const containerX = this.isMobile ? this.scale.width * 0.27 : 250; // Ajustado para contenedores más anchos
    const containerY = this.isMobile ? this.scale.height * 0.4 : 250; // Centro vertical
    const codeContainer = this.add.container(containerX, containerY);

    // Dimensiones optimizadas para layout lado a lado en móviles - contenedores más anchos
    const containerWidth = this.isMobile
      ? Math.min(this.scale.width * 0.52, 250)  // Más ancho para mejor legibilidad
      : 400; 
    const containerHeight = this.isMobile
      ? Math.min(this.scale.height * 0.6, 280)  // Más altura para mejor visualización
      : 200;

    // Sombra exterior profunda
    const outerShadow = this.add.graphics();
    outerShadow.fillStyle(0x000000, 0.3);
    outerShadow.fillRoundedRect(
      -containerWidth / 2 - 8,
      -containerHeight / 2 - 8,
      containerWidth + 16,
      containerHeight + 16,
      20
    );
    codeContainer.add(outerShadow);

    // Gradiente de fondo principal
    const gradientBackground = this.add.graphics();
    gradientBackground.fillGradientStyle(
      0x0d1117,
      0x0d1117,
      0x161b22,
      0x21262d,
      1
    );
    gradientBackground.fillRoundedRect(
      -containerWidth / 2,
      -containerHeight / 2,
      containerWidth,
      containerHeight,
      18
    );
    codeContainer.add(gradientBackground);

    // Borde principal con efecto neón más claro
    const mainBorder = this.add.graphics();
    mainBorder.lineStyle(3, 0x00d4aa, 1);
    mainBorder.strokeRoundedRect(
      -containerWidth / 2,
      -containerHeight / 2,
      containerWidth,
      containerHeight,
      18
    );
    codeContainer.add(mainBorder);

    // Borde interior sutil
    const innerBorder = this.add.graphics();
    innerBorder.lineStyle(1, 0x30363d, 0.8);
    innerBorder.strokeRoundedRect(
      -containerWidth / 2 + 5,
      -containerHeight / 2 + 5,
      containerWidth - 10,
      containerHeight - 10,
      15
    );
    codeContainer.add(innerBorder);

    // Barra superior decorativa optimizada para móviles
    const topBarHeight = this.isMobile ? 35 : 45;
    const topBar = this.add.graphics();
    topBar.fillStyle(0x21262d, 0.9);
    topBar.fillRoundedRect(
      -containerWidth / 2,
      -containerHeight / 2,
      containerWidth,
      topBarHeight,
      18,
      18,
      0,
      0
    );
    topBar.lineStyle(1, 0x30363d, 0.5);
    topBar.strokeRoundedRect(
      -containerWidth / 2,
      -containerHeight / 2,
      containerWidth,
      topBarHeight,
      18,
      18,
      0,
      0
    );
    codeContainer.add(topBar);

    // Círculos decorativos estilo terminal - optimizados para móviles
    const circleSize = this.isMobile ? 5 : 6;
    const circleY = this.isMobile ? -containerHeight / 2 + 18 : -127;
    const redCircle = this.add.circle(
      -containerWidth / 2 + 30,
      circleY,
      circleSize,
      0xff5f56
    );
    const yellowCircle = this.add.circle(
      -containerWidth / 2 + 50,
      circleY,
      circleSize,
      0xffbd2e
    );
    const greenCircle = this.add.circle(
      -containerWidth / 2 + 70,
      circleY,
      circleSize,
      0x27ca3f
    );
    codeContainer.add([redCircle, yellowCircle, greenCircle]);

    // Título del código optimizado para móviles
    const titleSize = this.isMobile ? "14px" : "16px";
    this.codeTitle = this.add
      .text(0, circleY, "💻 Arduino IDE", {
        fontSize: titleSize,
        fontFamily: "SF Mono, Monaco, Consolas, monospace",
        fill: "#f0f6fc",
        align: "center",
        fontWeight: "600",
      })
      .setOrigin(0.5);
    codeContainer.add(this.codeTitle);

    // Línea separadora elegante
    const separatorY = this.isMobile
      ? -containerHeight / 2 + topBarHeight + 5
      : -105;
    const separatorLine = this.add.graphics();
    separatorLine.lineStyle(1, 0x30363d, 0.8);
    separatorLine.lineBetween(
      -containerWidth / 2 + 20,
      separatorY,
      containerWidth / 2 - 20,
      separatorY
    );
    codeContainer.add(separatorLine);

    // Inicializar array para objetos de texto del código
    this.codeTextObjects = [];

    // Crear texto del código inicial con el primer fragmento
    this.createColoredCodeText(codeContainer, this.codeFragments[0] || [], []);

    this.codeContainer = codeContainer;
  }

  createExplanationSection() {
    // Posicionamiento para layout lado a lado en móviles - explicación a la derecha
    const containerX = this.isMobile ? this.scale.width * 0.73 : 750; // Ajustado para contenedores más anchos
    const containerY = this.isMobile ? this.scale.height * 0.4 : 250; // Centro vertical (mismo que código)
    const explanationContainer = this.add.container(containerX, containerY);

    // Dimensiones optimizadas para layout lado a lado en móviles - contenedores más anchos
    const containerWidth = this.isMobile
      ? Math.min(this.scale.width * 0.52, 250)  // Más ancho para mejor legibilidad
      : 440;
    const containerHeight = this.isMobile
      ? Math.min(this.scale.height * 0.6, 280)  // Más altura para mejor visualización
      : 300;

    // Sombra exterior más sutil
    const outerShadow = this.add.graphics();
    outerShadow.fillStyle(0x000000, 0.2);
    outerShadow.fillRoundedRect(
      -containerWidth / 2 - 2,
      -containerHeight / 2 - 2,
      containerWidth + 4,
      containerHeight + 4,
      16
    );
    explanationContainer.add(outerShadow);

    // Gradiente de fondo principal con nuevo color verde suave
    const gradientBackground = this.add.graphics();
    gradientBackground.fillGradientStyle(
      0xe8f5e8,
      0xe8f5e8,
      0xd4f1d4,
      0xc1ecc1,
      1
    );
    gradientBackground.fillRoundedRect(
      -containerWidth / 2,
      -containerHeight / 2,
      containerWidth,
      containerHeight,
      15
    );
    explanationContainer.add(gradientBackground);

    // Borde principal con color verde
    const mainBorder = this.add.graphics();
    mainBorder.lineStyle(2, 0x28a745, 0.8);
    mainBorder.strokeRoundedRect(
      -containerWidth / 2,
      -containerHeight / 2,
      containerWidth,
      containerHeight,
      15
    );
    explanationContainer.add(mainBorder);

    // Borde interior sutil
    const innerBorder = this.add.graphics();
    innerBorder.lineStyle(1, 0x6f9f6f, 0.6);
    innerBorder.strokeRoundedRect(
      -containerWidth / 2 + 5,
      -containerHeight / 2 + 5,
      containerWidth - 10,
      containerHeight - 10,
      12
    );
    explanationContainer.add(innerBorder);

    // Barra superior optimizada para móviles
    const topBarHeight = this.isMobile ? 35 : 40;
    const topBar = this.add.graphics();
    topBar.fillStyle(0xd4f1d4, 0.95);
    topBar.fillRoundedRect(
      -containerWidth / 2,
      -containerHeight / 2,
      containerWidth,
      topBarHeight,
      15,
      15,
      0,
      0
    );
    topBar.lineStyle(1, 0x6f9f6f, 0.4);
    topBar.strokeRoundedRect(
      -containerWidth / 2,
      -containerHeight / 2,
      containerWidth,
      topBarHeight,
      15,
      15,
      0,
      0
    );
    explanationContainer.add(topBar);

    // Icono principal optimizado para móviles
    const iconSize = this.isMobile ? "14px" : "16px";
    const iconY = this.isMobile ? -containerHeight / 2 + 18 : -130;
    const mainIcon = this.add
      .text(-containerWidth / 2 + 30, iconY, "📚", {
        fontSize: iconSize,
        align: "center",
      })
      .setOrigin(0.5);
    explanationContainer.add(mainIcon);

    // Título de la explicación optimizado para móviles
    const titleSize = this.isMobile ? "12px" : "14px";
    this.explanationTitle = this.add
      .text(0, iconY, "Explicación Técnica", {
        fontSize: titleSize,
        fontFamily: "SF Pro Display, -apple-system, Arial, sans-serif",
        fill: "#155724",
        align: "center",
        fontWeight: "600",
      })
      .setOrigin(0.5);
    explanationContainer.add(this.explanationTitle);

    // Línea separadora más sutil
    const separatorY = this.isMobile
      ? -containerHeight / 2 + topBarHeight + 3
      : -110;
    const separatorLine = this.add.graphics();
    separatorLine.lineStyle(1, 0x6f9f6f, 0.6);
    separatorLine.lineBetween(
      -containerWidth / 2 + 20,
      separatorY,
      containerWidth / 2 - 20,
      separatorY
    );
    explanationContainer.add(separatorLine);

    // Área de contenido optimizada
    const contentAreaHeight = containerHeight - topBarHeight - 20;
    const contentArea = this.add.graphics();
    contentArea.fillStyle(0xffffff, 0.9);
    contentArea.fillRoundedRect(
      -containerWidth / 2 + 10,
      separatorY + 5,
      containerWidth - 20,
      contentAreaHeight,
      8
    );
    contentArea.lineStyle(1, 0xc3e6c3, 0.6);
    contentArea.strokeRoundedRect(
      -containerWidth / 2 + 10,
      separatorY + 5,
      containerWidth - 20,
      contentAreaHeight,
      8
    );
    explanationContainer.add(contentArea);

    // Texto de explicación mejorado para móviles - mejor legibilidad y espaciado
    const textSize = this.isMobile ? "12px" : "12px";
    const textY = this.isMobile ? separatorY + contentAreaHeight / 2 - 5 : 10;
    const textWidth = this.isMobile ? containerWidth - 40 : 360; // Más margen en móviles

    this.explanationText = this.add
      .text(0, textY, "", {
        fontSize: textSize,
        fontFamily: "SF Pro Text, -apple-system, Arial, sans-serif",
        fill: "#155724",
        align: "center",
        wordWrap: { width: textWidth },
        lineSpacing: this.isMobile ? 6 : 5, // Mejor espaciado entre líneas para móviles
        padding: { x: 8, y: 6 }, // Más padding para mejor legibilidad
      })
      .setOrigin(0.5);
    explanationContainer.add(this.explanationText);

    // Icono de explicación optimizado para móviles
    const explanationIconSize = this.isMobile ? "16px" : "18px";
    const explanationIconY = this.isMobile ? containerHeight / 2 - 12 : 110;
    this.explanationIcon = this.add
      .text(0, explanationIconY, "", {
        fontSize: explanationIconSize,
        align: "center",
      })
      .setOrigin(0.5);
    explanationContainer.add(this.explanationIcon);

    this.explanationContainer = explanationContainer;
  }

  createNavigationButtons() {
    const { width, height } = this.scale;

    // Adaptaciones para layout lado a lado en móviles - botones bien posicionados
    const buttonWidth = this.isMobile ? 120 : 140;
    const buttonHeight = this.isMobile ? 45 : 55;
    const buttonSpacing = this.isMobile ? 40 : 20;
    const buttonY = this.isMobile ? height - 120 : height - 60; // Más arriba para no salirse de pantalla
    const buttonRadius = this.isMobile ? 10 : 12;
    const fontSize = this.isMobile ? "14px" : "16px";

    // Botón Anterior con diseño más elegante
    const backButtonBg = this.add.graphics();
    backButtonBg.fillGradientStyle(0x6c757d, 0x6c757d, 0x495057, 0x495057, 1);
    backButtonBg.fillRoundedRect(
      width / 2 - buttonWidth - buttonSpacing / 2,
      buttonY - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      buttonRadius
    );
    backButtonBg.lineStyle(3, 0x343a40, 1);
    backButtonBg.strokeRoundedRect(
      width / 2 - buttonWidth - buttonSpacing / 2,
      buttonY - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      buttonRadius
    );

    this.backButton = this.add
      .rectangle(
        width / 2 - buttonWidth / 2 - buttonSpacing / 2,
        buttonY,
        buttonWidth,
        buttonHeight,
        0x000000,
        0
      )
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.previousStep())
      .on("pointerover", () => backButtonBg.setAlpha(0.8))
      .on("pointerout", () => backButtonBg.setAlpha(1));

    this.add
      .text(width / 2 - buttonWidth / 2 - buttonSpacing / 2, buttonY, "← Anterior", {
        fontSize: fontSize,
        fontFamily: "SF Pro Display, -apple-system, Arial, sans-serif",
        fill: "#ffffff",
        fontWeight: "600",
      })
      .setOrigin(0.5);

    // Botón Siguiente con diseño más elegante
    const nextButtonBg = this.add.graphics();
    nextButtonBg.fillGradientStyle(0x0d6efd, 0x0d6efd, 0x0a58ca, 0x0a58ca, 1);
    nextButtonBg.fillRoundedRect(
      width / 2 + buttonSpacing / 2,
      buttonY - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      buttonRadius
    );
    nextButtonBg.lineStyle(3, 0x084298, 1);
    nextButtonBg.strokeRoundedRect(
      width / 2 + buttonSpacing / 2,
      buttonY - buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      buttonRadius
    );

    this.nextButton = this.add
      .rectangle(
        width / 2 + buttonWidth / 2 + buttonSpacing / 2,
        buttonY,
        buttonWidth,
        buttonHeight,
        0x000000,
        0
      )
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.nextStep())
      .on("pointerover", () => nextButtonBg.setAlpha(0.8))
      .on("pointerout", () => nextButtonBg.setAlpha(1));

    this.add
      .text(width / 2 + buttonWidth / 2 + buttonSpacing / 2, buttonY, "Siguiente →", {
        fontSize: fontSize,
        fontFamily: "SF Pro Display, -apple-system, Arial, sans-serif",
        fill: "#ffffff",
        fontWeight: "600",
      })
      .setOrigin(0.5);

    // Indicador de progreso más compacto y visible
    const progressY = this.isMobile ? buttonY + 35 : buttonY + 40;
    const progressText = this.add.text(
      width / 2,
      progressY,
      `Paso ${this.currentStep + 1} de ${this.explanations.length}`,
      {
        fontSize: this.isMobile ? "12px" : "14px",
        fontFamily: "Arial, sans-serif",
        fill: "#ffffff",
        fontWeight: "500",
        stroke: "#000000",
        strokeThickness: 1,
      }
    );
    progressText.setOrigin(0.5);

    this.progressText = progressText;
  }

  showStep(step) {
    if (step < 0 || step >= this.explanations.length) return;

    this.currentStep = step;

    // Actualizar código con resaltado mejorado
    this.updateCodeDisplay(step);

    // Actualizar explicación con icono
    const explanation = this.explanations[step];
    this.explanationTitle.setText(explanation.title);

    // Actualizar explicación con animación suave
    this.tweens.add({
      targets: this.explanationText,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        // Ajustar el texto de explicación para móviles
        const maxLength = this.isMobile ? 180 : 300;
        let explanationText = explanation.content;

        if (this.isMobile && explanationText.length > maxLength) {
          explanationText = explanationText.substring(0, maxLength) + "...";
        }

        this.explanationText.setText(explanationText);
        this.tweens.add({
          targets: this.explanationText,
          alpha: 1,
          duration: 300,
        });
      },
    });

    // Actualizar icono dinámico
    if (this.explanationIcon) {
      this.explanationIcon.setText(explanation.icon);
    }

    // Actualizar progreso con animación
    this.progressText.setText(
      `Paso ${step + 1} de ${this.explanations.length}`
    );

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
      this.nextButton.on("pointerdown", () => this.nextStep());
    }

    // Efecto de transición suave
    this.tweens.add({
      targets: [this.codeContainer, this.explanationContainer],
      alpha: { from: 0.7, to: 1 },
      duration: 300,
      ease: "Power2",
    });
  }

  updateCodeDisplay(step) {
    // Obtener el fragmento de código específico para este paso
    const currentFragment = this.codeFragments[step] || [];
    
    // Actualizar el texto del código con el fragmento específico
    this.createColoredCodeText(this.codeContainer, currentFragment, []);
  }

  highlightLines(highlightIndices) {
    // Crear el texto del código con formato HTML-like para Phaser
    let formattedCode = "";

    this.codeLines.forEach((line, index) => {
      // Truncar líneas largas forzosamente para evitar desbordamiento
      let truncatedLine = line;
      const maxChars = this.isMobile ? 20 : 50; // Reducir aún más el límite
      if (line.length > maxChars) {
        truncatedLine = line.substring(0, maxChars) + "...";
      }
      if (highlightIndices.includes(index)) {
        // Líneas resaltadas con colores específicos
        if (truncatedLine.includes("int ") || truncatedLine.includes("void ")) {
          formattedCode += truncatedLine + "\n"; // Líneas de declaración resaltadas
        } else if (
          truncatedLine.includes("pinMode") ||
          truncatedLine.includes("analogRead") ||
          truncatedLine.includes("digitalWrite")
        ) {
          formattedCode += truncatedLine + "\n"; // Funciones resaltadas
        } else if (
          truncatedLine.includes("if") ||
          truncatedLine.includes("{") ||
          truncatedLine.includes("}")
        ) {
          formattedCode += truncatedLine + "\n"; // Estructuras resaltadas
        } else if (truncatedLine.includes("delay") || truncatedLine.includes("//")) {
          formattedCode += truncatedLine + "\n"; // Comentarios resaltados
        } else {
          formattedCode += truncatedLine + "\n"; // Otras líneas resaltadas
        }
      } else {
        // Líneas no resaltadas (más tenues)
        formattedCode += truncatedLine + "\n";
      }
    });

    return formattedCode.trim();
  }

  // Función para crear texto con colores específicos
  createColoredCodeText(container, codeFragment, highlightIndices) {
    // Limpiar texto anterior
    if (this.codeTextObjects) {
      this.codeTextObjects.forEach((obj) => obj.destroy());
    }
    this.codeTextObjects = [];

    // Adaptaciones mejoradas para fragmentos en móviles - más espacio para números
    let yOffset = this.isMobile ? -35 : -95; // Mejor posición inicial
    const lineHeight = this.isMobile ? 14 : 20; // Espaciado más cómodo
    const leftMargin = this.isMobile ? -160 : -200; // Más margen izquierdo para números
    const maxWidth = this.isMobile ? 300 : 380; // Ancho más generoso para el texto
    const fontSize = this.isMobile ? "10px" : "14px"; // Tamaño de fuente más legible
    const lineNumberFontSize = this.isMobile ? "9px" : "12px";

    codeFragment.forEach((line, index) => {
      // Crear número de línea
      const lineNumber = this.add.text(
        leftMargin,
        yOffset,
        `${index + 1}`.padStart(2, " "),
        {
          fontSize: lineNumberFontSize,
          fontFamily: "SF Mono, Monaco, Consolas, monospace",
          fill: "#7d8590",
          align: "right",
          fontWeight: "500",
        }
      );
      container.add(lineNumber);
      this.codeTextObjects.push(lineNumber);

      // Crear texto del código con mejor legibilidad
      const lineText = this.add.text(leftMargin + 25, yOffset, line, {
        fontSize: fontSize,
        fontFamily: "SF Mono, Monaco, Consolas, monospace",
        fill: "#00ff88", // Verde brillante para mejor contraste
        align: "left",
        wordWrap: { width: maxWidth, useAdvancedWrap: true, breakWords: true },
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
        ease: "Power1",
        repeat: -1,
        yoyo: true,
      });

      // Animación flotante horizontal
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-50, 50),
        duration: Phaser.Math.Between(3000, 6000),
        ease: "Sine.easeInOut",
        repeat: -1,
        yoyo: true,
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
        ease: "Power1",
        repeat: -1,
        yoyo: true,
      });

      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-30, 30),
        duration: Phaser.Math.Between(2000, 4000),
        ease: "Sine.easeInOut",
        repeat: -1,
        yoyo: true,
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

    // Crear overlay semi-transparente
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, this.scale.width, this.scale.height);

    // Mensaje de felicitación con estilo mejorado
    const congratsTitle = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 80,
        "🎉 ¡Felicitaciones! 🎉",
        {
          fontSize: this.isMobile ? "24px" : "32px",
          fontFamily: "SF Pro Display, -apple-system, Arial, sans-serif",
          fill: "#00d4aa",
          fontWeight: "bold",
          align: "center",
        }
      )
      .setOrigin(0.5);

    const congratsText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 20,
        "Has completado exitosamente\nel tutorial de Arduino",
        {
          fontSize: this.isMobile ? "14px" : "18px",
          fontFamily: "SF Pro Display, -apple-system, Arial, sans-serif",
          fill: "#ffffff",
          align: "center",
          lineSpacing: this.isMobile ? 8 : 10,
        }
      )
      .setOrigin(0.5);

    // Botón para continuar con animación
    const continueButtonBg = this.add.graphics();
    continueButtonBg.fillGradientStyle(
      0x0d6efd,
      0x0d6efd,
      0x0a58ca,
      0x0a58ca,
      1
    );
    const buttonWidth = this.isMobile ? 180 : 220;
    const buttonHeight = this.isMobile ? 45 : 55;
    continueButtonBg.fillRoundedRect(
      this.scale.width / 2 - buttonWidth / 2,
      this.scale.height / 2 + 40,
      buttonWidth,
      buttonHeight,
      25
    );
    continueButtonBg.lineStyle(2, 0x084298, 0.8);
    continueButtonBg.strokeRoundedRect(
      this.scale.width / 2 - buttonWidth / 2,
      this.scale.height / 2 + 40,
      buttonWidth,
      buttonHeight,
      25
    );

    const continueButton = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2 + 62,
        buttonWidth,
        buttonHeight,
        0x000000,
        0
      )
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.start("MenuPrincipal");
      });

    const continueButtonText = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 62, "Continuar →", {
        fontSize: this.isMobile ? "14px" : "16px",
        fontFamily: "SF Pro Display, -apple-system, Arial, sans-serif",
        fill: "#ffffff",
        fontWeight: "600",
      })
      .setOrigin(0.5);

    // Animaciones de entrada
    this.tweens.add({
      targets: [congratsTitle, congratsText, continueButtonBg, continueButton, continueButtonText],
      alpha: { from: 0, to: 1 },
      y: { from: "+=50", to: "+=0" },
      duration: 800,
      ease: "Back.easeOut",
      stagger: 200,
    });
  }
}
