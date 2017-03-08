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

window.address = window.location.href;

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
 *  @todo : uyarlanacak alanlar
 */

console.log('burası youtube ' + browser.runtime.id);


//browser.runtime.sendMessage({ 'option' : 'test' });
var sending = browser.runtime.sendMessage(null, { 'test' :  'tamer'}, null);

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if(request.type=='debug') {
		console.log('debug');
		console.log(request);
	}	

	if(request.type=='get-keywords') {

		if(request.results.length!=0) {

			$('.extention-firefox .keywords').find('.pure-menu-item').remove();

			$.each(request.results, function(key, value){

				$('.extention-firefox .keywords').append('<li class="pure-menu-item"><a href="#" data-id="'+request.keys[key]+'" class="delete-item pure-menu-link"><span class="email-label-travel" style="padding:2px 0px 4px 8px; background:rgb(204, 24, 30);"> X </span> '+value+'</a></li>');
			});

			is_key = $.inArray( getUrl().keyword, request.results );

			if(is_key!='-1') {
				$('.extention-firefox .add-link').removeClass('add-link').removeClass('primary-button').addClass('pure-button-disabled');
			}
		}

		console.log('get-keywords');
		console.log( request );

	}


});


//<a href="#" class="pure-menu-link">Kelimeler <span class="email-count">(2)</span></a>
var theme_navigation = '<div id="nav" style="display:none;" class="pure-u navigation extention-firefox">' +
        '<br><br><br>' +
		'' +
        '<div class="nav-inner">' +
           
			'<a class="pure-menu-heading" href="#">roboyoutube</a>' +
            '<div class="pure-menu">' +
                '<ul class="pure-menu-list keywords">' +
                	'<li class="pure-menu-heading">Menü</li>' +
                    '<li class="pure-menu-item"><a href="#" class="pure-menu-link">Kayıt Yok</a></li>' +
                '</ul>' +   
                '<ul class="pure-menu-list">' +
                    '<li class="pure-menu-heading">Aranan Kelime</li>' +
                    '<li class="pure-menu-item"><a href="#" class="pure-menu-link"><span class="email-label-personal"></span> <span class="title"></span></a></li>' +
                '</ul>' +
               
            '</div>' +
             '<button class="primary-button pure-button add-link">+ Ekle</button>' +
        '</div>' +
    '</div>';



/**
 * [runSearch her sayfa değişikliğinde yapılacak alan]
 * @return {[type]} [description]
 */
function runSearch(control) {


	if(control==false) {
		if(window.location.href!=window.address) {
			window.address = window.location.href;
		} else {
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
			console.log('test');
			browser.runtime.sendMessage(null, { 'getkeywords' :  true}, null);

			$('.extention-firefox').fadeIn(300);

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

	var youtubeId = $('.guide-my-channel-icon').closest('.guide-item').data('external-id');
	var myID = md5(youtubeId);

	i = true;
  	window.setInterval(function () {
        runSearch(i);
        i = false;
    }, 1000);
	

	$('body').on('click', '.delete-item', function(e){
		e.preventDefault();
		key = $(this).data('id');
		console.log('siliniyor :' + key);
		browser.runtime.sendMessage(null, { 'deleteItem' :  { 'key': key}}, null);

	});


	$('body').on('click', '.add-link', function(e){
		e.preventDefault();
		keyword = getUrl().keyword;
		sp = getUrl().sp;
		console.log('gönderiyor');
		browser.runtime.sendMessage(null, { 'addItem' :  { 'keyword': keyword, 'sp' : sp}}, null);
	});


	console.log('Test ------------------------  ');

	//console.log(address.search('results'));

    ytspf = retrieveWindowVariables('ytspf');

    console.log(ytspf.config['request-headers']['X-YouTube-Identity-Token']);

	console.log('Test 2  ');

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

    	console.log(data);
    	console.log('data yukarıda');

		var doc = new DOMParser().parseFromString(data[1].body.content, "text/html");

		
		//console.log(data[1].body.content);

		//console.log(doc);
		//console.log($('a', doc));
		//console.log($(".branded-page-box a:last-child", doc).attr('href'));

		/*
		

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
		*/

    }, 'JSON');

    console.log('Test 3  ');

});