class Ultima extends Phaser.Scene {
  constructor() {
    super({ key: "Ultima" });
    this.currentStep = 0;
    this.totalSteps = 4;
    this.feedbackElements = [];
  }

  preload() {
    // Cargar recursos necesarios
    this.load.image("ultimaa", "assets/Ultima/Ultimaa.jpg");
  }

  create() {
    // Enhanced background with overlay effects
    const background = this.add.image(0, 0, "ultimaa");
    background.setOrigin(0, 0);
    background.setDisplaySize(this.scale.width, this.scale.height);

    // Add animated overlay for depth
    const overlay = this.add.graphics();
    overlay.fillGradientStyle(0x000044, 0x000044, 0x000088, 0x000088, 0.4);
    overlay.fillRect(0, 0, this.scale.width, this.scale.height);

    // Add celebration particles
    this.createCelebrationParticles();

    // Calcular dimensiones adaptativas
    const isMobile = this.scale.width < 768;
    const titleSize = isMobile ? 42 : 56;
    const messageSize = isMobile ? 28 : 36;

    // Enhanced title with celebration effects
    const title = this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 80, "🎉 ¡FELICIDADES! 🎉", {
        font: `bold ${titleSize}px Arial`,
        fill: "#00ff88",
        stroke: "#004433",
        strokeThickness: 4,
        shadow: {
          offsetX: 0,
          offsetY: 0,
          color: "#00ff88",
          blur: 20,
          stroke: false,
          fill: true
        }
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Enhanced success message
    const successMessage = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 20,
        "✅ Has completado exitosamente el diagnóstico",
        {
          font: `bold ${messageSize}px Arial`,
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
          shadow: {
            offsetX: 2,
            offsetY: 2,
            color: "#000",
            blur: 4,
            stroke: true,
            fill: true
          }
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);

    // Add achievement message
    const achievementMessage = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 30,
        "🏆 Estructura Omega: Sistema Restaurado",
        {
          font: `${messageSize - 4}px Arial`,
          fill: "#88ccff",
          fontStyle: 'bold'
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);

    // Enhanced entrance animations
    this.tweens.add({
      targets: title,
      alpha: 1,
      y: this.scale.height / 2 - 100,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1200,
      ease: "Back.easeOut",
    });

    this.tweens.add({
      targets: successMessage,
      alpha: 1,
      y: this.scale.height / 2 - 40,
      duration: 1200,
      delay: 600,
      ease: "Power2",
    });

    this.tweens.add({
      targets: achievementMessage,
      alpha: 1,
      y: this.scale.height / 2 + 10,
      duration: 1200,
      delay: 1200,
      ease: "Power2",
    });

    // Add continuous pulsing to title
    this.tweens.add({
      targets: title,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 2000
    });

    // Add floating animation to messages
    this.tweens.add({
      targets: [successMessage, achievementMessage],
      y: "+=5",
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 2500
    });

    // Ajustar la escala si es necesario
    if (isMobile) {
      const scale = Math.min(this.scale.width / 800, this.scale.height / 600);
      title.setScale(scale);
      successMessage.setScale(scale);
      achievementMessage.setScale(scale);
    }
  }

  createCelebrationParticles() {
    // Create organic celebration elements (confetti, stars, hearts)
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57, 0xff9ff3];
    
    for (let i = 0; i < 20; i++) {
      const particle = this.add.graphics();
      const color = colors[Phaser.Math.Between(0, colors.length - 1)];
      const size = Phaser.Math.Between(6, 12);
      
      particle.fillStyle(color, 0.8);
      particle.lineStyle(1, color, 1);
      
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = this.scale.height + 50;
      
      const shapeType = Phaser.Math.Between(0, 2);
      
      if (shapeType === 0) {
        // Draw heart shape
        particle.beginPath();
        particle.arc(x - size/4, y - size/4, size/4, 0, Math.PI, true);
        particle.arc(x + size/4, y - size/4, size/4, 0, Math.PI, true);
        particle.lineTo(x + size/2, y);
        particle.lineTo(x, y + size/2);
        particle.lineTo(x - size/2, y);
        particle.closePath();
        particle.fillPath();
        particle.strokePath();
      } else if (shapeType === 1) {
        // Draw 6-pointed star
        particle.beginPath();
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI * 2) / 6;
          const outerRadius = size;
          const innerRadius = size / 2;
          
          const outerX = x + Math.cos(angle) * outerRadius;
          const outerY = y + Math.sin(angle) * outerRadius;
          const innerX = x + Math.cos(angle + Math.PI / 6) * innerRadius;
          const innerY = y + Math.sin(angle + Math.PI / 6) * innerRadius;
          
          if (j === 0) {
            particle.moveTo(outerX, outerY);
          } else {
            particle.lineTo(outerX, outerY);
          }
          particle.lineTo(innerX, innerY);
        }
        particle.closePath();
        particle.fillPath();
        particle.strokePath();
      } else {
        // Draw confetti rectangle with rounded corners
        particle.fillRoundedRect(x - size/2, y - size/4, size, size/2, size/8);
        particle.strokeRoundedRect(x - size/2, y - size/4, size, size/2, size/8);
      }
      
      // Add celebration animation (upward floating with rotation)
      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(300, 500),
        x: x + Phaser.Math.Between(-100, 100),
        rotation: Phaser.Math.Between(0, Math.PI * 4),
        alpha: 0,
        scaleX: Phaser.Math.FloatBetween(0.5, 1.5),
        scaleY: Phaser.Math.FloatBetween(0.5, 1.5),
        duration: Phaser.Math.Between(3000, 6000),
        delay: Phaser.Math.Between(0, 2000),
        ease: 'Power2',
        repeat: -1,
        yoyo: false,
        onRepeat: () => {
          particle.setPosition(
            Phaser.Math.Between(0, this.scale.width),
            this.scale.height + 50
          );
          particle.setAlpha(0.8);
          particle.setScale(1);
          particle.setRotation(0);
        }
      });
    }
  }

  update() {
    // Actualizar lógica si es necesario
  }
}

window.Ultima = Ultima;
