/** @class Game
 *
 * Singleton class 
 */

 class Game {

    private static _instance:Game;

    //set fps, 30 for stable visuals and performance
    private _fps:number = 30;

    private _fpsInterval:number;

    private _then:number;

    private _score:number = 0;

    public static notes:Note[] = [];

    public static level:Level;

    public streak:number = 0;

    private constructor(){
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.gameLoop();
        let songSelector = SongSelector.getInstance();
        songSelector.show();
    }

    /**there never needs to be more than one game instance
     *@returns {Game}
     */
    public static getInstance() {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        //check the elapsed time
        let now = Date.now();
        let elapsed = now - this._then;

        //draw the next frame, if the interval has passed
        if (elapsed > this._fpsInterval){
            if(Game.level){
                Game.level.update();
            }
            if(Game.notes){
                Game.notes.forEach(note => {
                    note.update();
                });
            }
            //prepare next frame
            this._then = now - (elapsed % this._fpsInterval);
        }
    }

    increaseScore(score:number):void {
        this._score += score;
    }
    decreaseScore(score:number):void {
        this._score -= score;
    }
    get score():number {
        return this._score;
    }

    get fps():number {
        return this._fps;
    }
 }

 window.addEventListener("load", () => {
    Game.getInstance()
 });