const EventEmitter = require('events');
const Utils = require('./Utils');

class Input extends EventEmitter {
    constructor(){
        super();
        let element = document.createElement('div');
        element.className = 'shell-input';

        let inputElement = document.createElement('div');
        inputElement.className = 'shell-input-inputElement';
        inputElement.setAttribute('tabIndex', '1');

        let cursorElement = document.createElement('div');
        cursorElement.className = 'shell-input-cursor';
        inputElement.appendChild(cursorElement);

        let rendererElement = document.createElement('div');
        rendererElement.className = 'shell-input-renderer';
        inputElement.appendChild(rendererElement);

        let messageElement = document.createElement('div');
        messageElement.className = 'shell-input-before';


        this.element = element;
        this.inputElement = inputElement;
        this.cursorElement = cursorElement;
        this.rendererElement = rendererElement;
        this.messageElement = messageElement;

        this.element.appendChild(messageElement);
        this.element.appendChild(inputElement);

        this.setCursor(0);
        this.initEmitting();
    }

    setMessage(htmlCode){
        this.messageElement.innerHTML = htmlCode;
    }

    clear(){
        this.setMessage('');
        this.setValue('');
        this.setCursor(0);
    }

    setValue(value){
        this.value = value;
        this.rendererElement.innerHTML = this.renderText( Utils.htmlEntities(value) );
    }

    getValue(){
        return this.value || '';
    }

    renderText(text){
        if(this.textRenderer) return this.textRenderer(text);
        else return text;
    }

    setCursor(position) {

        let max = this.getValue().length;

        if(position > max) position = max;
        if(position < 0) position = 0;

        if(position != this.cursorPosition){
            this.emit('cursorActivity', this.cursorPosition, position);

            let positionInPixel = this.getFontCharHeight() * position;
            this.cursorPosition = position;
            this.cursorElement.style.left = positionInPixel+"px";
            this.cursorElement.scrollIntoViewIfNeeded();
        }

    }

    getCursor(){
        return this.cursorPosition;
    }

    getFontCharHeight(){
        var fontSizeText = window.getComputedStyle(this.element, null).getPropertyValue('font-size');
        return parseFloat(fontSizeText) - 5.2; 
    }

    initEmitting(){
        let inputElement = this.inputElement;

        inputElement.addEventListener('click', (event) => {
            this.focus();
        });

        inputElement.addEventListener('keydown', (event) => {
            this.keydownListener(event);
        })
    }

    keydownListener(event){
        let keyCode = event.keyCode;

        if(event.ctrlKey){
            this.ctrlCommand(event.key);
        }
        else{
            switch(keyCode) {
                case 13:
                    this.enter();
                    break;
                case 8: // Backspace
                    this.removeCharAtCursor();
                    break;
                case 46: // Supr
                    this.removeCharAtCursor(true);
                    break;
                case 37: 
                    this.left();
                    break;
                case 39:
                    this.right();
                    break;
                case 38:
                    this.up();
                    break;
                case 40:
                    this.down();
                    break;
                default:
                    this.addCharAtCursor(event.key);
                break;
            }
        }
    }

    focus(){
        this.inputElement.focus();
    }

    blur(){
        this.inputElement.blur();
    }

    enter(){
        this.emit('enter');
    }

    left(){
        this.emit('left');
        this.setCursor( this.cursorPosition - 1 );
    }

    right(){
        this.emit('right');
        this.setCursor( this.cursorPosition + 1 );
    }

    up(){
        this.emit('up');
    }

    down(){
        this.emit('down');
    }

    addCharAtCursor(char){

        this.emit('addCharAtCursor', char);

        if(char){
            if(char.length == 1){
                let cursor = this.getCursor();
                let value = this.getValue();
                let firstPart = value.substring(0, cursor);
                let lastPart = value.substring(cursor, value.length);

                this.setValue( firstPart + char + lastPart );
                this.right();
            }
        }
    }

    removeCharAtCursor(rightRemoving) {
        this.emit('removeCharAtCursor', rightRemoving);
        let cursor = this.getCursor(),
            value = this.getValue(),
            firstPart,
            lastPart;

        if(rightRemoving){
            firstPart = value.substring(0, cursor);
            lastPart = value.substring(cursor + 1, value.length);
        }
        else{
            firstPart = value.substring(0, cursor - 1);
            lastPart = value.substring(cursor, value.length);

            // A left removing move the cursor, because its a Right-To-Left text input
            this.left();
        }

        this.setValue( firstPart + lastPart );
    }

    ctrlCommand(char){
        this.emit('ctrlCommand', char);
    }
}

module.exports = Input;