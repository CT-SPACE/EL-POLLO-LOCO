class StatusBarPepe extends StaticObject {
  x = 0;
  y = 0;

  energy = 1;
  percentage = 1;
  height = 50;
  width = 5000;
  img;

  static IMAGES_SALUD_PEPE = [
    "./img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  constructor() {
    super().loadImage("./img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png");
    this.loadImages(StatusBarPepe.IMAGES_SALUD_PEPE);
    this.x = 40;
    this.y = 20;
    this.width = 128;
    this.height = 34;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path =
      StatusBarPepe.IMAGES_SALUD_PEPE[this.resolveImagePercent(percentage)];
    this.img = imgCache[path];
  }

  resolveImagePercent(percentage) {
    if (percentage > 0.1 && percentage < 0.3) {
      return 1;
    } else if (percentage >= 0.3 && percentage < 0.5) {
      return 2;
    } else if (percentage >= 0.5 && percentage < 0.7) {
      return 3;
    } else if (percentage >= 0.7 && percentage < 0.95) {
      return 4;
    } else if (percentage >= 0.95) {
      return 5;
    } else {
      return 0;
    }
  }
}
