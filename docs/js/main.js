"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Creator {
    constructor(song) {
        this.addToList = (index) => {
            const time = Date.now() - this.start;
            const beat = this.getBeat(time);
            console.log("note", beat);
            this._noteList.notes.push({
                id: this._last_id,
                beat: beat,
                fret: index
            });
            this._last_id++;
        };
        this._song = song;
        this._last_id = 0;
        this._noteList = new NoteList(this._song.id, this._song.name);
        window.addEventListener("keydown", () => { this.checkKeyDown(event); }, false);
    }
    checkKeyDown(event) {
        if (event instanceof KeyboardEvent) {
            switch (event.keyCode) {
                case 65:
                    this.addToList(0);
                    break;
                case 83:
                    this.addToList(1);
                    break;
                case 68:
                    this.addToList(2);
                    break;
                case 70:
                    this.addToList(3);
                    break;
                case 13:
                    DOMHelper.downloadList(JSON.stringify(this._noteList.getJSON()), this._song.name + '.json', 'application/json');
            }
        }
    }
    getBeat(time) {
        const step = (60 / this._song.bpm) * 500;
        return Math.floor(time / step);
    }
}
class Game {
    constructor() {
        this._fps = 30;
        this._score = 0;
        this.streak = 0;
        this._fpsInterval = 1000 / this._fps;
        this._then = Date.now();
        this.gameLoop();
        let songSelector = SongSelector.getInstance();
        songSelector.show();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new Game();
        }
        return this._instance;
    }
    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());
        let now = Date.now();
        let elapsed = now - this._then;
        if (elapsed > this._fpsInterval) {
            if (Game.level) {
                Game.level.update();
            }
            if (Game.notes) {
                Game.notes.forEach(note => {
                    note.update();
                });
            }
            this._then = now - (elapsed % this._fpsInterval);
        }
    }
    increaseScore(score) {
        this._score += score;
    }
    decreaseScore(score) {
        this._score -= score;
    }
    get score() {
        return this._score;
    }
    get fps() {
        return this._fps;
    }
}
Game.notes = [];
window.addEventListener("load", () => {
    Game.getInstance();
});
class Level {
    constructor(song, creator = true) {
        this._observers = [];
        this._song = song;
        this.view();
        if (creator) {
            this._creator = new Creator(song);
        }
    }
    view() {
        let songselector = SongSelector.getInstance();
        songselector.hide();
        this._level = document.createElement('div');
        this._level.classList.add('level');
        this._score = document.createElement('div');
        this._score.id = 'Score';
        this._score.innerText = 'Score:' + Game.getInstance().score;
        this._fretBoard = document.createElement('div');
        this._fretBoard.id = 'FretBoard';
        this._fretBoard.appendChild(this._score);
        this._level.appendChild(this._fretBoard);
        for (let i = 0; i < 4; i++) {
            let fret = document.createElement('div');
            fret.classList.add('Fret');
            fret.id = 'fret_' + i;
            this._fretBoard.appendChild(fret);
        }
        document.body.appendChild(this._level);
        this._startScreen = DOMHelper.getStartScreen(this);
        this._level.appendChild(this._startScreen);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this._startScreen.remove();
            Game.level = this;
            this._startTime = Date.now() - 1800;
            this._noteList = NoteList.createFromJSON(yield Fetcher.fetchJSONFile("songs/notelists/" + this._song.id + ".json"));
            let audio = DOMHelper.createAudioElement('song_' + this._song.id, 'audio/' + this._song.id + ".mp3");
            document.body.appendChild(audio);
            audio.play();
            if (this._creator) {
                this._creator.start = Date.now();
            }
            console.log('playing' + this._song.name);
        });
    }
    update() {
        this.notifyObservers();
        const step = (60 / this._song.bpm) * 500;
        if (this._noteList.notes.length !== 0) {
            if ((Date.now() - this._startTime) > (this._noteList.notes[0].beat * step)) {
                Game.notes.push(this.createNote(this._noteList.notes[0].fret));
                this._noteList.notes.shift();
            }
        }
        this.updateScore();
    }
    createNote(fret) {
        return new GameNote(fret, this);
    }
    registerObserver(observer) {
        this._observers.push(observer);
    }
    removeObserver(observer) {
        const index = this._observers.indexOf(observer);
        this._observers.splice(index, 1);
    }
    notifyObservers() {
        for (let observer of this._observers) {
            if (observer instanceof Note) {
                if (observer.y > 600 && observer.y < 900) {
                    observer.now = true;
                }
                else {
                    observer.now = false;
                }
            }
        }
    }
    updateScore() {
        this._score.innerText = 'Score: ' + Game.getInstance().score;
    }
    get song() {
        return this._song;
    }
}
class NoteList {
    constructor(id, name) {
        this._notes = [];
        this._id = id;
        this._name = name;
    }
    getJSON() {
        return {
            id: this._id,
            name: this._name,
            notes: this._notes
        };
    }
    static createFromJSON(json) {
        let nl = new NoteList(json.id, json.name);
        nl._notes = json.notes;
        return nl;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get notes() {
        return this._notes;
    }
}
class Song {
    constructor(id, name, duration, bpm, difficulty) {
        this._id = id;
        this._name = name;
        this._duration = duration;
        this._bpm = bpm;
        this._difficulty = difficulty;
    }
    static createSongs(songs) {
        let s = [];
        for (let i = 0; i < songs.length; i++) {
            s.push(new Song(songs[i].id, songs[i].name, songs[i].duration, songs[i].bpm, songs[i].difficulty));
        }
        return s;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get duration() {
        return this._duration;
    }
    get bpm() {
        return this._bpm;
    }
    get difficulty() {
        return this._difficulty;
    }
}
class SongSelector {
    constructor() {
        this._songs = [];
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SongSelector();
        }
        return this.instance;
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            this._songSelector = document.createElement('div');
            this._songSelector.classList.add('SongSelector');
            let html = '<h1>Pick a Song</h1>';
            html += yield this.getSongList();
            this._songSelector.innerHTML = html;
            document.body.appendChild(this._songSelector);
            this.setListeners();
        });
    }
    hide() {
        document.body.removeChild(this._songSelector);
    }
    getSongList() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield Fetcher.fetchJSONFile('songs/songs.json');
            this._songs = Song.createSongs(json);
            let html = '<div id="SongsSelector">';
            this._songs.forEach(song => {
                html += '<button class="SelectSongButton" id="song_' + song.id + '">' + song.name + '</button>';
            });
            html += '</div>';
            return html;
        });
    }
    setListeners() {
        this._songs.forEach(song => {
            let button = document.getElementById("song_" + song.id);
            button.addEventListener("click", () => {
                new Level(song);
            }, false);
        });
    }
}
class NoteHitController {
    constructor(note) {
        this.now = false;
        this.note = note;
        window.addEventListener("keydown", () => { this.PlayCheck(event, DOMHelper.getKeyFromFretId(this.note.fretID)); }, false);
    }
    checkPosition() {
        this.now = this.note.now;
    }
    PlayCheck(event, keycode) {
        if (event instanceof KeyboardEvent) {
            if (this.now && event.keyCode === keycode) {
                this.register();
                this.now = false;
                Game.getInstance().streak++;
            }
        }
    }
    register() {
        if (this.note.stop) {
            return;
        }
        this.note.stopNote();
        this.note.registerScore();
    }
}
class NoteHitStreakController extends NoteHitController {
    constructor(note) {
        super(note);
    }
    register() {
        if (this.note.stop) {
            return;
        }
        this.note.multiplier++;
        this.note.registerScore();
    }
}
class DOMHelper {
    static getStartScreen(level) {
        this._startScreen = document.createElement('div');
        this._startScreen.classList.add('StartScreen');
        const wrapper = document.createElement('button');
        wrapper.id = 'SongSelector';
        this._startScreen.appendChild(wrapper);
        this._startButton = document.createElement('button');
        this._startButton.classList.add('SelectSongButton');
        this._startButton.innerText = 'Start';
        this._startButton.addEventListener("click", () => {
            level.start();
        }, false);
        wrapper.appendChild(this._startButton);
        return this._startScreen;
    }
    static getKeyFromFretId(fretID) {
        switch (fretID) {
            case 0:
                return 65;
            case 1:
                return 83;
            case 2:
                return 68;
            case 3:
                return 70;
            default:
                break;
        }
    }
    static removeNote(note) {
        note.element.remove();
        let index = Game.notes.indexOf(note);
        if (index !== -1) {
            Game.notes.splice(index, 1);
        }
    }
    static createAudioElement(id, source) {
        let audio = document.createElement('audio');
        audio.id = id;
        audio.src = source;
        return audio;
    }
    static downloadList(content, fileName, contentType) {
        let dl = document.createElement("a");
        let list = new Blob([content], { type: contentType });
        dl.href = URL.createObjectURL(list);
        dl.download = fileName;
        dl.click();
    }
}
class Fetcher {
    static fetchJSONFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(path);
            return yield response.json();
        });
    }
}
class Note {
    constructor(fretID, level) {
        this._y = 0;
        this._gravity = 9;
        this._stop = false;
        this.now = false;
        this.multiplier = 1;
        this.subject = level;
        level.registerObserver(this);
        this._element = document.createElement('div');
        this._fretID = fretID;
    }
    update() {
        if (Game.getInstance().streak > 8) {
            this._noteController = new NoteHitStreakController(this);
        }
        else {
            this._noteController = new NoteHitController(this);
        }
        if (this._y < (this._fret.getBoundingClientRect().height - this._element.getBoundingClientRect().height)) {
            this._y += this._gravity;
            this.element.style.transform = 'translate(0px. ${this._y}px)';
        }
        else {
            Game.getInstance().decreaseScore(5);
            this.subject.removeObserver(this);
            DOMHelper.removeNote(this);
            Game.getInstance().streak = 0;
        }
        this.checkPosition();
    }
    checkPosition() {
        this._noteController.checkPosition();
    }
    stopNote() {
        this._gravity = 0;
        this._stop = true;
    }
    registerScore() {
    }
    controllerChanger(controller) {
        this._noteController = controller;
    }
    get element() {
        return this._element;
    }
    get y() {
        return this._y;
    }
    get fretID() {
        return this._fretID;
    }
    get stop() {
        return this._stop;
    }
}
class GameNote extends Note {
    constructor(fretID, level) {
        super(fretID, level);
        let e = this._element;
        e.style.backgroundImage = "url('images/note.png')";
        e.classList.add('Note');
        this._fret = document.getElementById('fret_' + this._fretID);
        this._fret.appendChild(e);
    }
    registerScore() {
        Game.getInstance().increaseScore(10 * this.multiplier);
    }
}
//# sourceMappingURL=main.js.map