class Song{
    private _id:number;
    private _name:string;
    private _duration:number;
    private _bpm:number;
    private _difficulty:number;

    constructor(id:number, name:string, duration:number, bpm:number, difficulty:number){
        this._id = id;
        this._name = name;
        this._duration = duration;
        this._bpm = bpm;
        this._difficulty = difficulty;
    }

    /**
     * create songs based on an JSON array with the songs in it.
     * 
     * @param songs
     */
    public static createSongs(songs:any):Song[]{
        let s:Song[] = [];
        for(let i = 0; i< songs.length; i++){

            s.push(new Song(songs[i].id, songs[i].name, songs[i].duration, songs[i].bpm, songs[i].difficulty))
        }
        return s;
    }

    public get id(){
        return this._id;
    }
    public get name(){
        return this._name;
    }
    public get duration(){
        return this._duration;
    }
    public get bpm(){
        return this._bpm;
    }
    public get difficulty(){
        return this._difficulty;
    }
}