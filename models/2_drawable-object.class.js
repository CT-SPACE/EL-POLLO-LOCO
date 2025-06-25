class DrawableObject {
    x;
    y;
    height;
    width;
    world;
    otherDirection = false;
    img;
    imgCache = {};
    audioCache = {};
    currentIMG = 0;
    itemCounter = 0;
    factor = 1;
    
    // loadImage(path) {
    //     this.img = new Image();
    //     this.img.src = path;
    // }


    loadImage(entry) {
    const path = typeof entry === "string" ? entry : entry.src;

    this.img = new Image();
    this.img.src = path;
}

  //     /**
  //  *
  //  * @param {Array} arr
  //  */
  // loadImages(arr) {
  //   arr.forEach((path) => {
  //     let img = new Image();
  //     img.src = path;
  //     this.imgCache[path] = img;
  //   });
  // }

  loadImages(arr) {
    arr.forEach((entry) => {
        const path = typeof entry === "string" ? entry : entry.src;

        if (!this.imgCache[path]) {
    let img = new Image();
    img.src = path;
    this.imgCache[path] = img;
}

        // let img = new Image();
        // img.src = path;
        // this.imgCache[path] = img;
    });
}


  loadAudio(arr) {
    arr.forEach((path) => {
      let audio = new Audio(path);
      this.audioCache[path] = audio;
    });
  }

drawObject(ctx) {
  if (!this.img) return;
    try { 
   ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error){
        console.log('Error drawing object:', ctx, this.img, this.x, this.y, this.width, this.height);
    }
    }


  // drawFrames(ctx) {
  //   if (this instanceof Pepe || this instanceof Chicken || this instanceof CollectableObject || this instanceof MiniChicken) {
      
  //     ctx.beginPath();
  //     ctx.lineWidth = "5";
  //     ctx.strokeStyle = "yellowgreen";
  //     ctx.rect(this.x, this.y, this.width, this.height);
  
  //     ctx.stroke();
  //   }
  // }

// drawOffset(ctx) {
//     if (
//         this instanceof Pepe ||
//         this instanceof Chicken ||
//         this instanceof CollectableObject ||
//         this instanceof Endboss ||
//         this instanceof MiniChicken
//     ) {
//         ctx.beginPath();
//         ctx.lineWidth = 0;
//         ctx.strokeStyle = "unset";
//         ctx.rect(
//             this.x + (this.offset?.left || 0),
//             this.y + (this.offset?.top || 0),
//             this.width - ((this.offset?.left || 0) + (this.offset?.right || 0)),
//             this.height - ((this.offset?.top || 0) + (this.offset?.bottom || 0))
//         );
//         ctx.stroke();
//     }
// }

drawOffset(ctx) {
    if (this.drawDebug) { // Nur wenn Debug-Modus aktiv ist
        if (
            this instanceof Pepe ||
            this instanceof Chicken ||
            this instanceof CollectableObject ||
            this instanceof Endboss ||
            this instanceof MiniChicken
        ) {
            ctx.beginPath();
            ctx.lineWidth = 0;
            ctx.strokeStyle = "orangered"; 
            ctx.rect(
                this.x + (this.offset?.left || 0),
                this.y + (this.offset?.top || 0),
                this.width - ((this.offset?.left || 0) + (this.offset?.right || 0)),
                this.height - ((this.offset?.top || 0) + (this.offset?.bottom || 0))
            );
            ctx.stroke();
        }
    }
}



}
