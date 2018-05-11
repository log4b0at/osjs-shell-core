const Utils = require('./Utils');

class Writable {
    constructor(){
        this.element = document.createElement('span');
        this.renderer;
    }

    setValue(value){
        this.value = value;
        if(this.renderer){
            this.element.innerHTML = this.renderer( value );
        }
        else{
            this.element.innerHTML = value;
        }
    }

    getValue(){
        return this.value;
    }
}

module.exports = Writable;