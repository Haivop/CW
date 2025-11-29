const sanitizeHtml = require('sanitize-html');

module.exports.mergePatch = async (newData, oldData) => {
    for(let key in newData){
        if(oldData[key] === undefined) throw new Error("wrong key in put request body");
        else if(!newData[key]) continue;

        sanitizeHtml(newData[key]);
        oldData[key] = newData[key];
    };

    return oldData;
}