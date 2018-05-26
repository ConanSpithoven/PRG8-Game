class Player {
    leftSpeed : number = 0
    rightSpeed : number = 0
    downSpeed : number = 0
    upSpeed : number = 0
    private div: HTMLElement;

    constructor(){
        this.div = document.createElement("div");
        this.div.setAttribute("id", "player");
        document.body.appendChild(this.div);
        window.addEventListener("click", () => this.Shoot());
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e))
    }

    private Shoot(){
        //bang
    }

    onKeyDown(event:KeyboardEvent):void {
        switch(event.keyCode){
        case 87:
            this.upSpeed = 5
            break
        case 83:
            this.downSpeed = 5
            break
        case 65:
            this.leftSpeed = 5
            break
        case 68:
            this.rightSpeed = 5
            break
        }
    }
    
    onKeyUp(event:KeyboardEvent):void {
        switch(event.keyCode){
        case 87:
            this.upSpeed = 0
            break
        case 83:
            this.downSpeed = 0
            break
        case 65:
            this.leftSpeed = 0
            break
        case 86:
            this.rightSpeed = 0
            break
        }
    }
}