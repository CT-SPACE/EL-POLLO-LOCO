class World {
    ctx;
    canvas;
    level = level01;
    character = new Pepe();
    background_static = new staticBackground();
    endboss = new Endboss();
    energy;
    keyboard;
    cameraX = 0;


    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
      
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld(){
        this.character.keyboard = this.keyboard;
        this.character.world = this;
    }   

  draw(){
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.ctx.translate(this.cameraX, 0);
    this.addToMap(this.background_static);
    this.addObjects(this.level.clouds);
    this.addObjects(this.level.background_moving);
  
    this.addObjects(this.level.enemies);
    this.addToMap(this.endboss);
    this.addToMap(this.character);
    this.ctx.translate(-this.cameraX, 0);

   self = this;   // This is a trick to access the "this" object inside the function. Die This-Information wird in self gespeichert, weil this in der Funktion nicht mehr verfügbar ist.
    requestAnimationFrame(() => self.draw());
        }
checkCollisions(){
    setInterval(() => {
this.level.enemies.forEach((enemy) => {
if(this.character.isColliding(enemy) && this.character.energy > 0){
    this.character.hit();
    // this.character.energy -= 0.02;
console.log('Energy after Collision', (this.character.energy).toFixed(2));
}
})
    },200)
}



addObjects(objects)  {
   objects.forEach(object => {
       this.addToMap(object);
   });      
}    
addToMap(Obj) {
    if(Obj.otherDirection){
        this.flipImage(Obj);
    } ;
    
    if (Obj !== staticBackground){
        Obj.drawFrames(this.ctx);
    }
    
    Obj.drawObject(this.ctx);

    if(Obj.otherDirection){
        this.flipImageBack(Obj);
    }
}

flipImage(Obj){
    this.ctx.save();
    this.ctx.translate(Obj.width, 0);
    this.ctx.scale(-1,1);
    Obj.x = Obj.x * -1;
}
flipImageBack(Obj){
    Obj.x = Obj.x * -1;
    this.ctx.restore();
}


}