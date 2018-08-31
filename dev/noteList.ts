class NoteList {

    private _id: number;
    private _name: string;
    private _notes: any[] = [];

    constructor(id:number, name:string){

        this._id = id;
        this._name = name;
    }

    /**
     * make this instance a JSON object
     * 
     * @returns {object}
     */
     public getJSON():object {
         return {
             id : this._id,
             name : this._name,
            notes : this._notes
         }
     }

     /**
      * @param json
      * @returns {NoteList}
      */
     public static createFromJSON(json:any):NoteList {
         let nl = new NoteList(json.id, json.name);
         nl._notes = json.notes;
         return nl;
     }
     
     public get id():number{
        return this._id
    }
    public get name():string{
        return this._name
    }
    public get notes():any[] {
        return this._notes;
    }
}