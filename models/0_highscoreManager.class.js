class HighscoreManager {
    currentScore;
    world;
    finalScore;
    savedHighscore;
    pepeHealthLoss;
    chickenSquashed;
    startTime;
    collectedCoins;
    bottlesUsed;
    timeBonus;
    
    static POINTS = {
        PEPE_HEALTH_LOSS: -5,      
        CHICKEN_SQUASH: 25,         
        COIN_COLLECT: 10,           
        BOTTLE_PENALTY: -5,         
        GAME_COMPLETION: 500,       
        TIME_BONUS: 1               
    };
    
    constructor(world) {
        this.resetScore();
        this.world = world;
        this.finalScore = 0;
        this.savedHighscore = this.getHighscore();

    }
    
    /**
     * Setzt den aktuellen Score zurück
     */
    resetScore() {
        this.currentScore = 0;
        this.collectedCoins = 0;
        this.pepeHealthLoss = 0;
        this.chickenSquashed = 0;
        this.bottlesUsed = 0 ;
        this.startTime = new Date().getTime();
        this.timeBonus = this.getTimeBonus();

    }
    
    /**
     * Aktualisiert den Score basierend auf Spielereignissen
     * @param {World} world - Die aktuelle Spielwelt
     */
    updateScore(world) {
        const pepeDamageTaken = (1 - world.statusBarPepe.percentage) * 100;
        this.pepeHealthLoss = pepeDamageTaken;
        this.calculateCurrentScore();
    }
    
    /**
     * Berechnet den finalen Score am Ende des Spiels
     * @returns {number} - Der finale Score
     */
    calculateFinalScore() {
        this.calculateCurrentScore();
     
        return this.currentScore;
    }
    
    /**
     * Berechnet den aktuellen Score basierend auf den gesammelten Daten
     */
    calculateCurrentScore() {
        let score = 0;

        score += this.pepeHealthLoss * HighscoreManager.POINTS.PEPE_HEALTH_LOSS;
        score += this.chickenSquashed * HighscoreManager.POINTS.CHICKEN_SQUASH;
        score += this.collectedCoins * HighscoreManager.POINTS.COIN_COLLECT;
            if (this.bottlesUsed > 10) {
            score += (this.bottlesUsed - 10) * HighscoreManager.POINTS.BOTTLE_PENALTY;
        }
        score += HighscoreManager.POINTS.GAME_COMPLETION; 
        score += this.timeBonus * HighscoreManager.POINTS.TIME_BONUS;

       this.currentScore = Math.max(0, Math.floor(score));
    }

    getTimeBonus(){
        const elapsedTime = (new Date().getTime() - this.startTime) / 1000; 
        const timeBonus = Math.max(0, 30 - elapsedTime); 
        return Math.floor(timeBonus);
    }
    
    /**
     * Speichert den Highscore im localStorage, wenn er höher als der bisherige ist
     */
    saveHighscore() {
        const storedData = JSON.parse(localStorage.getItem('elPolloLocoHighscore')) || {};
    this.savedHighscore = parseInt(storedData.score) || 0;
    
    if (this.currentScore > this.savedHighscore) {
        const scoreData = {
            score: this.currentScore,
            date: new Date().toLocaleString() 
        };
        localStorage.setItem('elPolloLocoHighscore', JSON.stringify(scoreData));
    }
}



    /**
     * When Game is over and Pepe won, this function is called to show the end screen with the final score and highscore.
     * @param {Number} finalScore - The final score of the game.    
     * @param {Number} highscore - The highscore of the game.
     */
      checkHighscore() {
           const stats = [
      `Chicken zerquetscht: ${this.chickenSquashed}`,
      `Münzen gesammelt: ${this.collectedCoins}`,
      `Flaschen benutzt: ${this.bottlesUsed}`,
      `Pepe-Schaden: ${this.pepeHealthLoss}%`
    ];
        finalScore = this.calculateFinalScore();
        savedHighscore = this.getHighscore();
    }
    
    /**
     * Gibt den aktuellen Highscore zurück
     * @returns {number} Der aktuelle Highscore
     */
getHighscore() {
    const data = localStorage.getItem('elPolloLocoHighscore');
    if (!data) return 0;
        const parsed = JSON.parse(data);
        return parsed.score || 0;
}

    /**
     * Registriert eine Chicken-Eliminierung
     */
    addSquashedChicken() {
        this.chickenSquashed++;
    }
    
    /**
     * Registriert einen gesammelten Coin
     */
    addCollectedCoin() {

         this.collectedCoins++;
    }
    
    /**
     * Registriert eine benutzte Flasche
     */
    addBottleUsed() {
        this.bottlesUsed++;
    }


}