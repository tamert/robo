/**
 *  Page Functions 
 *  Tamer Agaoglu
 */

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
 *  @todo : uyarlanacak alanlar
 */

console.log('burası youtube ' + browser.runtime.id);
//browser.runtime.sendMessage({ 'option' : 'test' });
var sending = browser.runtime.sendMessage(null, { 'test' :  'tamer'}, null);

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);
});

window.address = window.location.href;

var theme_navigation = '<div id="nav" class="pure-u navigation extention-firefox">' +
        '<br><br><br>' +
		'' +
        '<div class="nav-inner">' +
           
			'<a class="pure-menu-heading" href="#">roboyoutube</a>' +
            '<div class="pure-menu">' +
                '<ul class="pure-menu-list">' +
                	'<li class="pure-menu-heading">Menü</li>' +
                    '<li class="pure-menu-item"><a href="#" class="pure-menu-link">Kelimeler <span class="email-count">(2)</span></a></li>' +
                   
                    '<li class="pure-menu-heading">Aranan Kelime</li>' +
                    '<li class="pure-menu-item"><a href="#" class="pure-menu-link"><span class="email-label-personal"></span> <span class="title"></span></a></li>' +
                '</ul>' +
               
            '</div>' +
             '<button class="primary-button pure-button add-link">+ Ekle</button>' +
        '</div>' +
    '</div>';

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

/**
 * [runSearch her sayfa değişikliğinde yapılacak alan]
 * @return {[type]} [description]
 */
function runSearch(control) {


	if(control==false) {
		if(window.location.href!=window.address) {
			window.address = window.location.href;
		} else {
			console.log('say');
			return true;
		}
	}
	

	console.log('--- runSearch ---');

	if($(location).attr('pathname')=='/results') {

		keyword = getUrl().keyword;
		thm = $( theme_navigation );
		thm.find('.title').html(keyword);

		if(keyword!=undefined) {
			if($('.extention-firefox').exists()) {
				$('.extention-firefox').remove();
				$('body').prepend(thm);	
			} else {
				$('body').prepend(thm);	
			}
		} else {
			$('.extention-firefox').remove();
		}
	} else {
		$('.extention-firefox').remove();	
	}

	return;
	
}

runSearch(true);

/**
 * [ready]
 */
$(function() {
	i = true;
  	window.setInterval(function () {
        runSearch(i);
        i = false;
    }, 1000);
	


	var youtubeId = $('.guide-my-channel-icon').closest('.guide-item').data('external-id');
	var myID = md5(youtubeId);


	$('body').on('click', '.add-link', function(e){
		e.preventDefault();
		keyword = getUrl().keyword;
		sp = getUrl().sp;
		console.log('gönderiyor');
		browser.runtime.sendMessage(null, { 'addItem' :  { 'keyword': keyword, 'sp' : sp}}, null);
	});

	//address = window.location + '';

	//console.log(address.search('results'));

    ytspf = retrieveWindowVariables('ytspf');

    console.log(ytspf.config['request-headers']['X-YouTube-Identity-Token']);

    $.ajax({
        url: "https://www.youtube.com/results",
        method: "GET",
        data: {
            'search_query': 'onur öztürk',
            'spf': 'navigate'
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-Youtube-Identity-Token', ytspf.config['request-headers']['X-YouTube-Identity-Token']);
            xhr.setRequestHeader('X-SPF-Previous', document.URL);
            xhr.setRequestHeader('X-SPF-Referer', document.URL);
        }

    }).done(function(data) {


		var doc = new DOMParser().parseFromString(data[1].body.content, "text/html");

		//console.log(doc);
		//console.log($('a', doc));
		//console.log($(".branded-page-box a:last-child", doc).attr('href'));

		next_url = $(".branded-page-box a:last-child", doc).attr('href');



		var sp = url.parse(next_url).get.sp;
		var xq = url.parse(next_url).get.q.replace(/\+/g, " ");
	
		$.ajax({
		        url: "https://www.youtube.com/results",
		        method: "GET",
		        data: {
		            'search_query': xq,
		            'sp': sp,
		            'spf': 'navigate'
		        },
		        beforeSend: function(xhr) {

		            xhr.setRequestHeader('X-Youtube-Identity-Token', ytspf.config['request-headers']['X-YouTube-Identity-Token']);
		            xhr.setRequestHeader('X-SPF-Previous', document.URL);
		            xhr.setRequestHeader('X-SPF-Referer', document.URL);

		        }

		    }).done(function(data) {


				var doc = new DOMParser().parseFromString(data[1].body.content, "text/html");


				console.log($(".branded-page-box a:last-child", doc).attr('href'));



		    }, 'JSON');

    }, 'JSON');



});