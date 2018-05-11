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

        input.textRenderer = function(text){
            text = text.replace(/((?:["][^"\\]*(?:\\.[^"\\]*)*["]|['][^'\\]*(?:\\.[^'\\]*)*[']))/g, (entry) => {
                return '<span style="color:lightgreen;">'+entry+'</span>'
            });

            text = text.replace(/(npm|git|electron)/g, (entry) => {
                return '<span style="color:lightred; font-weight:bold">'+entry+'</span>'
            });

            return text;
        }

        this.element.addEventListener('click', () => {
            this.input.focus();
        })

        //input.on('enter', () => this.enterListener() );
        //input.on('cursorActivity', () => this.cursorActivityListener() );
        // input.on('renderText', () => this.renderTextListener() );
    }

    async stdin(message){
        var build = this;
        if(message) this.input.setMessage(message);
        this.element.appendChild(this.input.element);
        let newEntry = new Promise( 
                (resolve, reject) => {
                    console.log('Promising');
                    build.input.on('enter', function(){
                        resolve( build.input.getValue() );
                        console.log('Resolving');
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