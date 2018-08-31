/**
 * @class DOMHelper
 * used for helper functions for the DOM
 */
class DOMHelper{
    
    private static _startScreen:HTMLElement
    private static _startButton:HTMLElement

    /**
     * return the startscreen as a HTML element
     * @param {level} level
     * @returns {HTMLElement}
     */
    public static getStartScreen(level:Level):HTMLElement{

        //create a div for the startScreen
        this._startScreen = document.createElement('div');
        this._startScreen.classList.add('StartScreen');

        //create a wrapper to center the button
        const wrapper = document.createElement('button');
        wrapper.id = 'SongSelector';
        this._startScreen.appendChild(wrapper);

        //add startbutton
        this._startButton = document.createElement('button');
        this._startButton.classList.add('SelectSongButton');
        this._startButton.innerText = 'Start';

        //add the clicklistener
        this._startButton.addEventListener("click", () => {
            level.start();
        }, false)
        wrapper.appendChild(this._startButton);

        return this._startScreen;
    }

    /**
     * return the keycodes for the fretboard buttons
     * @param {number} fretID
     * @returns {number}
     */
    public static getKeyFromFretId(fretID:number):number{
        switch(fretID){
            case 0: //a
                return 65;
            case 1: //s
                return 83;
            case 2: //d
                return 68;
            case 3: //f
                return 70;
            default:
                break;
        }
    }

    /**
     * remove a note, to be used when a note is hit or goes past the bottom of the screen
     * @param {Note} note
     */
    public static removeNote(note:Note):void{
        note.element.remove();
        let index = Game.notes.indexOf(note);
        if(index !== -1){
            Game.notes.splice(index, 1);
        }
    }

    /**
     * 
     * @param {string} id
     * @param {string} source
     * 
     * @returns {HTMLAudioElement}
     */
    public static createAudioElement(id:string, source:string,):HTMLAudioElement {
        let audio = document.createElement('audio');
        audio.id = id;
        audio.src = source;
        return audio;
    }

    /**
     * download the newly made notelists from the creator
     * @param {string} content
     * @param {string} fileName
     * @param {string} contentType
     */
    public static downloadList(content:string, fileName:string, contentType:string){
        let dl = document.createElement("a");
        let list = new Blob([content], {type: contentType});
        dl.href = URL.createObjectURL(list);
        dl.download = fileName;
        dl.click();
    }
}