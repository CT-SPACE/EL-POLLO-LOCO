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
    statusBarPepe = new StatusBarPepe();
    statusBarCoin = new StatusBarCoin();
    statusBarChilli = new StatusBarChilli();
    statusBarEndboss = new StatusBarEndboss();
    throwableObjects = new ThrowableObject();


    constructor(canvas, keyboard){
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
      
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld(){
        this.character.keyboard = this.keyboard;
        this.character.world = this;
        this.statusBarPepe.world = this.statusBar;

    }   

  draw(){
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.ctx.translate(this.cameraX, 0);
    this.addToMap(this.background_static);
   
    this.addObjects(this.level.clouds);
    this.addObjects(this.level.background_moving);
   this.addToMap(this.throwableObjects);
    this.addObjects(this.level.enemies);
    this.addToMap(this.endboss);
    
    this.addToMap(this.character);
    this.ctx.translate(-this.cameraX, 0);
    this.addToMap(this.statusBarPepe);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarChilli);
    if (this.character.x > 3200){
    this.addToMap(this.statusBarEndboss);
  }
   
    

   self = this;   // This is a trick to access the "this" object inside the function. Die This-Information wird in self gespeichert, weil this in der Funktion nicht mehr verfügbar ist.
    requestAnimationFrame(() => self.draw());
        }
run(){
    setInterval(() => {
        this.checkThrowObjects();
        this.checkCollisions();
    },1000); 
}

checkThrowObjects(){
    if(keyboard.THROW){
        let bottle = new ThrowableObject(this.character.x + this.character.width, this.character.y + this.character.height / 2);
        this.throwableObjects.push(bottle);
    }
}

checkCollisions(){
    setInterval(() => {
this.level.enemies.forEach((enemy) => {
if(this.character.isColliding(enemy) && this.character.energy > 0){
    this.character.hit();
    this.statusBarPepe.setPercentage(this.character.energy);
    
//console.log('Energy after Collision', (this.character.energy).toFixed(2));
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