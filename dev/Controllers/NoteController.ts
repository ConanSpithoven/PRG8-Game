interface NoteController{
    //the controlled note
    note:Note;
    //if true, the note can be played
    now:boolean;
    //check if the note can currently be played
    checkPosition():void;
    //run if a note is played properly
    register():void;
}