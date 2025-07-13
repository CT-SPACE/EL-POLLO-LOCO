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

  /**
   * Loads the image for the status bar Pepe and initializes its position and dimensions.
   */
  constructor() {
    super().loadImage("./img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png");
    this.loadImages(StatusBarPepe.IMAGES_SALUD_PEPE);
    this.x = 40;
    this.y = 20;
    this.width = 128;
    this.height = 34;
  }

  /**
   * This function sets the percentage of the Pepe health and updates the image based on the current percentage.
   * It uses the resolveImagePercent function to determine which image to use based on the percentage.
   * The img property is updated with the corresponding image from the imgCache.
   * @param {Number} percentage 
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path =
      StatusBarPepe.IMAGES_SALUD_PEPE[this.resolveImagePercent(percentage)];
    this.img = imgCache[path];
  }

  /**
   * This function represents the logic to resolve which image to use based on the Pepe health percentage.
   * It returns an index based on the percentage, which corresponds to the images in the IMAGES_SALUD_PEPE array.
   * The images are displayed in a range from 0 to 5, depending on the Pepe health percentage.
   * @param {Number} percentage 
   * @returns 
   */
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
