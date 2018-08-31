/**
 * @class SongSelector
 * display and handle song selection
 * Singleton
 */

class SongSelector{
    private static instance: SongSelector;

    private _songs:Song[] = [];

    private _songSelector:HTMLElement;

    private constructor(){}
    
    /**
     * there only needs to be one song selector
     * @returns {SongSelector}
     */

    public static getInstance(){
        if(!this.instance){
            this.instance = new SongSelector();
        }
        return this.instance;
    }

    //create song selection menu
    public async show(){
        //create a div for the song selector
        this._songSelector = document.createElement('div');
        this._songSelector.classList.add('SongSelector');

        //create the HTML for the menu
        let html = '<h1>Pick a Song</h1>';
        html += await this.getSongList();

        this._songSelector.innerHTML = html;

        document.body.appendChild(this._songSelector);

        this.setListeners();
    }

    //remove the DOM
    public hide():void {
        document.body.removeChild(this._songSelector);
    }

    /**create the html for the song list
     * @returns {string} 
     */
    private async getSongList(){
        /**@const Promise json */
        const json = await Fetcher.fetchJSONFile('songs/songs.json');

        this._songs = Song.createSongs(json);
        let html:string = '<div id="SongsSelector">';

        this._songs.forEach(song => {
            html += '<button class="SelectSongButton" id="song_'+ song.id +'">'+ song.name + '</button>'
        });

        html += '</div>';
        return html
    }
    
    //listen for a click on each button
    private setListeners(){
        this._songs.forEach(song =>{
            let button = document.getElementById("song_" + song.id);
            button.addEventListener("click", () => {
                new Level(song);
            }, false);
        });
    }
}