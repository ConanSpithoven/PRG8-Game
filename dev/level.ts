class Level implements Subject{

    private _level:HTMLElement;

    private _score:HTMLElement;

    private _fretBoard:HTMLElement;

    private _song:Song;

    private _startScreen:HTMLElement;

    private _noteList:NoteList;

    private _startTime:number;

    private _creator:Creator;

    private _observers:Observer[] = [];

    constructor(song:Song, creator:boolean = true){
        this._song = song;
        this.view();
        if (creator) {
            this._creator = new Creator(song);
        }
    }

    //create all DOM elements
    view():void {
        //hide the song selector after a song has been chosen
        let songselector = SongSelector.getInstance();
        songselector.hide();

        //create a div for the level class
        this._level = document.createElement('div');
        this._level.classList.add('level');

        //create a div for the score
        this._score = document.createElement('div');
        this._score.id = 'Score';
        this._score.innerText = 'Score:' + Game.getInstance().score;

        //create a div for the fretboard
        this._fretBoard = document.createElement('div');
        this._fretBoard.id = 'FretBoard';
        this._fretBoard.appendChild(this._score);
        this._level.appendChild(this._fretBoard);

        //create four frets for the buttons in the board
        //To-Do figure out how to recolor each button to match the original piano hero along with the corresponding notes
        for(let i = 0; i < 4; i++){
            let fret = document.createElement('div');
            fret.classList.add('Fret');
            fret.id = 'fret_' + i;
            this._fretBoard.appendChild(fret);
        }

        document.body.appendChild(this._level);
        this._startScreen = DOMHelper.getStartScreen(this);
        this._level.appendChild(this._startScreen);
    }

    public async start(){
        //remove startScreen
        this._startScreen.remove();
        Game.level = this;

        //make the notes fall before their beat, so that they reach the buttons on beat
        this._startTime = Date.now() - 1800;

        this._noteList = NoteList.createFromJSON(await Fetcher.fetchJSONFile("songs/notelists/" + this._song.id + ".json"));

        //start audio
        let audio = DOMHelper.createAudioElement('song_' + this._song.id, 'audio/' + this._song.id + ".mp3");
        document.body.appendChild(audio);
        audio.play();

        if(this._creator){
            this._creator.start = Date.now();
        }

        console.log('playing' + this._song.name);
    }

    update() {
        this.notifyObservers();

        //get the notes from the notelist and create them at the right time
        const step = (60 / this._song.bpm) * 500;

        if(this._noteList.notes.length !== 0){
            if ((Date.now() - this._startTime) > (this._noteList.notes[0].beat * step)){
                Game.notes.push(this.createNote(this._noteList.notes[0].fret));
                this._noteList.notes.shift();
            }
        }
        this.updateScore();
    }

    private createNote(fret:number):Note {
        return new GameNote(fret, this);
    }

    /**
     * add an observer to the observers array
     * @param {Observer} observer
     */
    public registerObserver(observer:Observer):void {
        this._observers.push(observer);
    }

    /**
     * remove an observer from the observers array
     * @param {Observer} observer
     */
    public removeObserver(observer:Observer):void {
        const index = this._observers.indexOf(observer);
        this._observers.splice(index, 1);
    }

    public notifyObservers(){
        for (let observer of this._observers) {
            if(observer instanceof Note) {
                if(observer.y > 600 && observer.y < 900){
                    observer.now = true;
                } else {
                    observer.now = false;
                }
            }
        }
    }

    private updateScore():void{
        this._score.innerText = 'Score: ' + Game.getInstance().score;
    }

    public get song():Song{
        return this._song;
    }
}