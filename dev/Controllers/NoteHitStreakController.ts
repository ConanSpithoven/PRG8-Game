class NoteHitStreakController extends NoteHitController {

    note:Note;
    now:boolean;

    constructor(note:Note){
        super(note);
    }

    register() {
        if (this.note.stop){
            return;
        }
        
        //increase the multiplier
        this.note.multiplier ++;

        //increase the score using the notes own method
        this.note.registerScore();
    }
}