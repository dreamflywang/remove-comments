/*
    Description: nodejs tools lab
    Author     : owen
    mail       : wyhtalent@gmail.com
    
*/
function trim(str){
    return str.replace(/^[\s\n]*(.*?)[\s\n]*$/, '$1');
}
/* 
    This function is loosely based on the one found here:
    http://www.weanswer.it/blog/optimize-css-javascript-remove-comments-php/
*/
function removeJavascripComments(str) {
    str = ('__' + str + '__').split('');
    var mode = {
        singleQuote: false,
        doubleQuote: false,
        regex: false,
        blockComment: false,
        lineComment: false,
        condComp: false 
    };
    for (var i = 0, l = str.length; i < l; i++) {
 
        if (mode.regex) {
            if (str[i] === '/' && str[i-1] !== '\\') {
                mode.regex = false;
            }
            continue;
        }
 
        if (mode.singleQuote) {
            if (str[i] === "'" && str[i-1] !== '\\') {
                mode.singleQuote = false;
            }
            continue;
        }
 
        if (mode.doubleQuote) {
            if (str[i] === '"' && str[i-1] !== '\\') {
                mode.doubleQuote = false;
            }
            continue;
        }
 
        if (mode.blockComment) {
            if (str[i] === '*' && str[i+1] === '/') {
                if(str[i+1] != "\n"){
                    str[i+1] = '';
                }
                mode.blockComment = false;
            }
            if(str[i] != "\n"){
                str[i] = '';
            }
            continue;
        }
 
        if (mode.lineComment) {
            if (str[i+1] === '\n' || str[i+1] === '\r') {
                mode.lineComment = false;
            }
            if(str[i] != "\n"){
                str[i] = '';
            }
            continue;
        }
 
        if (mode.condComp) {
            if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
                mode.condComp = false;
            }
            continue;
        }
 
        mode.doubleQuote = str[i] === '"';
        mode.singleQuote = str[i] === "'";
 
        if (str[i] === '/') {
 
            if (str[i+1] === '*' && str[i+2] === '@') {
                mode.condComp = true;
                continue;
            }
            if (str[i+1] === '*') {
                if(str[i] != "\n"){
                    str[i] = '';
                }
                mode.blockComment = true;
                continue;
            }
            if (str[i+1] === '/') {
                if(str[i] != "\n"){
                    str[i] = '';
                }
                mode.lineComment = true;
                continue;
            }
            mode.regex = true;
 
        }
 
    }
    return str.join('').slice(2, -2);
}

function removeCssComments(str){
    var reg = /\/\*([\s\S]*?)\*\//g;

    return str.replace(reg, function(m, comment){
        return new Array(comment.split("\n").length).join("\n");
    });
}

function removeHtmlComments(str){
    var javascriptReg = /<script([\s\S]*?)>([\s\S]*?)<\/script>/gi,
        cssReg = /<style([\s\S]*?)>([\s\S]*?)<\/style>/gi,
        codeCache = {}, tempKey = "#__TEMP_PLACEHOLDER_{index}#", count = 0;

    function getCodeKey(){
        var key = tempKey.replace(/\{index\}/, count);
        count++;
        return key;
    }

    str = str.replace(javascriptReg, function(m, attr, text){
        var isJs = true;
        attr.split(" ").forEach(function(v,i){
            var _attr = v.split('=');
            if(trim(_attr[0]) == "type"){
                if(_attr[1].indexOf("text/javascript") == -1){
                    isJs = false;
                }
            }
        });
        if(isJs){
            text = removeJavascripComments(text);
            var key = getCodeKey();
            codeCache[key] = "<script" + attr + ">" + text + "</script>";
            return key; 
        }else{
            return "<script" + attr + ">" + text + "</script>";
        }
    });
    str = str.replace(cssReg, function(m, attr, text){
        text = removeCssComments(text);
        var key = getCodeKey();
        codeCache[key] = "<style" + attr + ">" + text + "</style>";
        return key;
    });

    str = str.replace(/<\!--([\s\S]*?)-->/g, function(m, text){
        return new Array(text.split("\n").length).join("\n");
    });

    for(var k in codeCache){
        str = str.replace(new RegExp(k,'g'), codeCache[k]);
    }

    return str;
}

module.exports = {
    "js"  : removeJavascripComments,
    "css" : removeCssComments,
    "html": removeHtmlComments
};
