class NoteHitController implements NoteController {

    public note:Note;
    public now:boolean = false;

    constructor(note:Note){
        this.note = note;
        window.addEventListener("keydown", () => {this.PlayCheck(event, DOMHelper.getKeyFromFretId(this.note.fretID))}, false);
    }

    //can the note be played?
    checkPosition():void{
        this.now = this.note.now;
    }

    /**
     * is the correct button pressed when a note is on it
     * 
     * @param event
     * @param keycode
     */
    PlayCheck(event:Event, keycode:number):void {
        if(event instanceof KeyboardEvent) {
            //is the note on the button and is the matching button pressed
            if(this.now && event.keyCode === keycode) {
                this.register();
                this.now = false;
                Game.getInstance().streak ++;
            }
        }
    }

    //register a succesfull note hit
    register():void {
        if (this.note.stop){
            return;
        }

        this.note.stopNote();

        //increase the score because a note was hit, using the notes own method
        this.note.registerScore();
    }
}