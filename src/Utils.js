module.exports = {
    htmlEntities(htmlCode){
        return String(htmlCode).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/ /g, '&nbsp;');
    }
};