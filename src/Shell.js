const EventEmitter = require('events');

const Input = require('./Input.js');

const Writable = require('./Writable.js');


class Shell extends EventEmitter {
    constructor(){
        super();
        let build = this;
        this.element = document.createElement('div');
        this.element.className = 'shell-container';

        this.input = new Input();

        this.initInputListening();
    }

    initInputListening(){
        let input = this.input;
        let build = this;

        this.element.addEventListener('click', () => {
            this.input.focus();
        })

        //input.on('enter', () => this.enterListener() );
        //input.on('cursorActivity', () => this.cursorActivityListener() );
        // input.on('renderText', () => this.renderTextListener() );
    }
	
	setInputRenderer(renderer){
		this.input.textRenderer = renderer;
	}

    async stdin(message){
        var build = this;
        if(message) this.input.setMessage(message);
        this.element.appendChild(this.input.element);
        let newEntry = new Promise( 
                (resolve, reject) => {
                    build.input.on('enter', function(){
                        resolve( build.input.getValue() );
                        build.input.clear();
                        build.input.blur();
                        build.input.element.remove();
                    });
                }
            );

        return await newEntry;
    }

    print(htmlCode){
        let writable = new Writable();
        writable.setValue(htmlCode);
        this.pushWritable(writable);
        return writable;
    }

    println(htmlCode){
        this.print('\n'+htmlCode);
    }

    pushWritable(writable){
        this.element.appendChild(writable.element);
    }

    enterListener(){
        let input = this.input;
        let value = input.getValue();
    }

    cursorActivityListener(){
        let input = this.input;
        let cursor = input.getCursor();
    }


}

module.exports = Shell;