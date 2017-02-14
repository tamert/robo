function retrieveWindowVariables(variables) {
    var ret = "";

    var scriptContent = "if (typeof " + variables + " !== 'undefined') localStorage.setItem('" + variables + "', JSON.stringify(" + variables + ")) \n"
    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    ret = JSON.parse(localStorage.getItem(variables));
    localStorage.removeItem(variables);

    return ret;
}

function replaceAll(str, find, replace) { 
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace); 
}