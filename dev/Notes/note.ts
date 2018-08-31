abstract class Note implements Observer {

    //specifiers how the note plays
    protected _noteController : NoteController;

    protected _element:HTMLElement;

    protected _fretID:number;

    protected _fret:HTMLElement;

    protected _y:number = 0;

    protected _gravity:number = 9;

    protected _stop:boolean = false;

    public now:boolean = false;

    public subject:Subject;

    public multiplier:number = 1;

    constructor(fretID:number, level:Subject) {

        this.subject = level;
        level.registerObserver(this);

        this._element = document.createElement('div');
        this._fretID = fretID;
    }
    
    update():void {
        if (Game.getInstance().streak > 8){
            this._noteController = new NoteHitStreakController(this);
        } else {
            this._noteController = new NoteHitController(this);
        }

        //move the note
        if (this._y < (this._fret.getBoundingClientRect().height - this._element.getBoundingClientRect().height)){
            this._y += this._gravity;
            this.element.style.transform = 'translate(0px. ${this._y}px)';
        }
        // destroy the note if it goes offscreen(out of the fret)
        else{
            Game.getInstance().decreaseScore(5);

            //remove the observer
            this.subject.removeObserver(this);
            //remove the DOM and the reference
            DOMHelper.removeNote(this);
            //reset the hit streak because a note was missed
            Game.getInstance().streak = 0;
        }
        this.checkPosition();
    }

    //is the note on the button
    checkPosition():void{
        this._noteController.checkPosition();
    }

    //stop the note when it is being removed, when stopped it cant be hit extra for more points
    stopNote():void {
        this._gravity = 0;
        this._stop = true;
    }

    //increase the score
    registerScore():void {
        //handled in children
    }

    protected controllerChanger(controller:NoteController):void {
        this._noteController = controller;
    }

    get element():HTMLElement {
        return this._element;
    }

    get y():number {
        return this._y
    }

    get fretID():number {
        return this._fretID
    }
    get stop():boolean {
        return this._stop
    }
}