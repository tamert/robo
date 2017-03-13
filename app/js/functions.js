/**
 *  Page Functions 
 *  Tamer Agaoglu
 */

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

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

function runWindowVariables(variables) {
    var ret = "";

    var script = document.createElement('script');
    script.id = 'runTmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    ret = JSON.parse(localStorage.getItem(variables));
    localStorage.removeItem(variables);

    return ret;
}

function replaceAll(str, find, replace) { 
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace); 
}


$.fn.exists = function () {
    return this.length !== 0;
}

$.urlParam = function(name, url) {
    if (!url) {
     url = window.location.href;
    }
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
    if (!results) { 
        return undefined;
    }
    return results[1] || undefined;
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/**
 * [getUrl page url parser]
 * @return {[type]} [description]
 */
function getUrl() {
    var keyword = $.urlParam('search_query');
    var sp = '';

    if(keyword==undefined) {
        keyword = $.urlParam('q');
        sp = $.urlParam('sp');
    }       

    keyword = replaceAll(unescape(decodeURIComponent(keyword)), '\\+', ' ');

    return {'keyword':keyword, 'sp': sp}
}