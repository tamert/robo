window.address = window.location.href;

/**
 *  @todo : uyarlanacak alanlar
 */

console.log('burası youtube ' + browser.runtime.id);


//browser.runtime.sendMessage({ 'option' : 'test' });
//var sending = browser.runtime.sendMessage(null, { 'test' :  'tamer'}, null);

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
	}

});


var userLang = navigator.language || navigator.userLanguage;

if($.inArray( userLang, lang )) {
	translate = lang[userLang];
} else {
	translate = lang['en-EN'];
}

//<a href="#" class="pure-menu-link">Kelimeler <span class="email-count">(2)</span></a>
var theme_navigation = '<div id="nav" style="display:none;" class="pure-u navigation extention-firefox">' +
        '<br><br><br>' +
		'' +
        '<div class="nav-inner">' +
           
			'<a class="pure-menu-heading" href="#">roboyoutube</a>' +
            '<div class="pure-menu">' +
                '<ul class="pure-menu-list keywords">' +
                	'<li class="pure-menu-heading">'+translate.menu+'</li>' +
                    '<li class="pure-menu-item"><a href="#" class="pure-menu-link">'+translate.no_records+'</a></li>' +
                '</ul>' +   
                '<ul class="pure-menu-list">' +
                    '<li class="pure-menu-heading">'+translate.search_word+'</li>' +
                    '<li class="pure-menu-item"><a href="#" class="pure-menu-link"><span class="email-label-personal"></span> <span class="title"></span></a></li>' +
                '</ul>' +
               
            '</div>' +
             '<button class="primary-button pure-button add-link">+ '+translate.add+'</button>' +
             '<button class="primary-button pure-button test-link"> AJAX TEST ET</button>' +
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

/**
 * [ready]
 */
$(function() {

	var youtubeId = $('.guide-my-channel-icon').closest('.guide-item').data('external-id');
	var myID = md5(youtubeId);

	runSearch(true);
	
	/**
	 * [Sol Menu Trap]
	 */
  	window.setInterval(function () {
        runSearch(false);
    }, 1000);
	
  	/**
  	 * [Havuz Getir & İşle]
  	 */
	window.setInterval(function () {
        
    }, 9000);



	/**
	 * [Havuz Ekle]
	 */
	$('body').on('click', '.add-link', function(e){
		e.preventDefault();
		keyword = getUrl().keyword;
		sp = getUrl().sp;
		console.log('gönderiyor');
		browser.runtime.sendMessage(null, { 'addItem' :  { 'keyword': keyword, 'sp' : sp}}, null);
	});

	/**
	 * [Havuz Sil]
	 */
	$('body').on('click', '.delete-item', function(e){
		e.preventDefault();
		key = $(this).data('id');
		console.log('siliniyor :' + key);
		browser.runtime.sendMessage(null, { 'deleteItem' :  { 'key': key}}, null);
	});


	$('body').on('click', '.test-link', function(e){
		e.preventDefault();
		keyword = getUrl().keyword;
		sp = getUrl().sp;

	    ytspf = retrieveWindowVariables('ytspf');

	    console.log(ytspf.config['request-headers']['X-YouTube-Identity-Token']);

		alert(ytspf.config['request-headers']['X-YouTube-Identity-Token']);

	    $.ajax({
	        url: "https://www.youtube.com/results",
	        method: "GET",
	        data: {
	            'search_query': keyword,
	            'spf': 'navigate'
	        },
	        beforeSend: function(xhr) {
	            xhr.setRequestHeader('X-Youtube-Identity-Token', ytspf.config['request-headers']['X-YouTube-Identity-Token']);
	            xhr.setRequestHeader('X-SPF-Previous', document.URL);
	            xhr.setRequestHeader('X-SPF-Referer', document.URL);
	            xhr.setRequestHeader('Accept', '*/*');
	        }

	    }).done(function(data) {

			var doc = new DOMParser().parseFromString(data[1].body.content, "text/html");

			/*
				//console.log(data[1].body.content);
				//console.log(doc);
				//console.log($('a', doc));
				//console.log($(".branded-page-box a:last-child", doc).attr('href'));
			*/
			
				next_url = $(".branded-page-box a:last-child", doc).attr('href');
				as = $(".branded-page-box", doc);
				var sp = url.parse(next_url).get.sp;
				var xq = url.parse(next_url).get.q.replace(/\+/g, " ");

				videotime = $(".yt-lockup-video .yt-uix-sessionlink", doc);

				videolist = [];
				channellist = [];
				userlist = [];
				console.log(videotime);
				
				$.each(videotime, function(key, value) {
					href = $(value).attr('href');
					if($(value).hasClass('g-hovercard')) {
						if(href.search("/user/")!='-1') {
							userlist.push(href.replace("/user/", ''));
						}
						if(href.search("/channel/")!='-1') {
							channellist.push(href.replace("/channel/", ''));
						}
					} else {
						videolist.push(href.replace('/watch?v=', ''));
					}
				});

				console.log('Video List');
				console.log(videolist);

				console.log('Channel List');
				console.log(channellist);				

				console.log('User List');
				console.log(userlist);

				/*

				console.log(videolist);*/


				/*
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

	    console.log('Test 3  ------------------------');

	});

});