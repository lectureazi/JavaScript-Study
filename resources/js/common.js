let $ = function(cssSelector, message){
    let htmlElements = this.document.querySelectorAll(cssSelector);

    if(message){
        htmlElements.forEach(e => {e.innerHTML += message + '<br>'});
    }

    if(cssSelector.startsWith('#')) return htmlElements[0];
    return htmlElements;
}


let createElement = (tag, props) => {
    let res = document.createElement(tag);

    if(!props) return res;

    for(key in props.prop){
        res[key] = props.prop[key];
    }

    for(key in props.style){
        res.style[key] = props.style[key];
    }

    if(props.text){
        let textNode = document.createTextNode(props.text);
        res.appendChild(textNode);
    }

    return res;
}