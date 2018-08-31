/// <reference path="./note" />

class GameNote extends Note {

    constructor(fretID:number, level:Subject){
        super(fretID, level);

        let e = this._element;

        //try to figure out how to have each collumn of notes to have their own color, like the original piano-hero
        e.style.backgroundImage = "url('images/note.png')";
        e.classList.add('Note');
        this._fret = document.getElementById('fret_' + this._fretID);
        this._fret.appendChild(e);
    }

    //add points, used when a note is hit
    registerScore():void {
        Game.getInstance().increaseScore(10*this.multiplier);
    }
}