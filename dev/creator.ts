class Creator {

    public start:number;

    private _noteList:NoteList;

    private _last_id:number;

    private _song:Song;

    constructor(song:Song){
        this._song = song;
        this._last_id = 0;
        this._noteList = new NoteList(this._song.id, this._song.name);

        window.addEventListener("keydown", () => {this.checkKeyDown(event)}, false);
    }

    /**
     * check which key is being pressed and how to act
     * @param {Event} event
     */
    private checkKeyDown(event:Event){
        if (event instanceof KeyboardEvent){
            switch(event.keyCode){
                case 65: //a
                this.addToList(0);
                break;
                case 83: //s
                this.addToList(1);
                break;
                case 68: //d
                this.addToList(2);
                break;
                case 70: //f
                this.addToList(3);
                break;
                case 13: //enter
                    DOMHelper.downloadList(JSON.stringify(this._noteList.getJSON()), this._song.name + '.json', 'application/json')
            }
        }
    }

    /**
     * add the pressed note to the sheet
     * @param {number} index
     */
    private addToList = (index:number) =>{

        const time = Date.now() - this.start;
        const beat = this.getBeat(time);

        console.log("note", beat);

        this._noteList.notes.push({
            id: this._last_id,
            beat: beat,
            fret: index
        });
        this._last_id ++;
    }

    /**
     * convert the ms time to half-beats
     * @param {number} time
     */
    private getBeat(time:number):number {
        //check how far the time has progressed
        //round the time so that the beats are registered on beat
        
        const step = (60 / this._song.bpm) * 500;
        return Math.floor(time / step);
    }
}