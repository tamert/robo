window.address = window.location.href;
window.myID = '';


console.log('burası youtube ' + browser.runtime.id);

function getPageContent(user) {

	console.log('getPageContent');

    xytspf = retrieveWindowVariables('ytspf');

    //console.log(ytspf.config['request-headers']['X-YouTube-Identity-Token']);
    //console.log(user);
    $.ajax({
        url: "https://www.youtube.com/results",
        method: "GET",
        data: {
            'search_query': user.keyword,
            'sp': user.sp,
			'spf': 'navigate'
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-Youtube-Identity-Token', xytspf.config['request-headers']['X-YouTube-Identity-Token']);
            xhr.setRequestHeader('X-SPF-Previous', document.URL);
            xhr.setRequestHeader('X-SPF-Referer', document.URL);
            xhr.setRequestHeader('Accept', '*/*');
        }

    }).done(function(data) {

    	

		var doc = new DOMParser().parseFromString(data[1].body.content, "text/html");

		if(!$(".branded-page-box", doc).exists()) {
			//console.log('branded-page-box bulunamadı');
			var sp = user.fp;
		} else {
			if($(".branded-page-box", doc).children().last().is('button')) {
				//console.log('son elemannn  ');
	 			var sp = user.fp;
			} else {
				next_url = $(".branded-page-box a:last-child", doc).attr('href');
				var sp = url.parse(next_url).get.sp;
				//console.log('sıradaki : '+ sp);
			}
		}
		

		
		//var xq = url.parse(next_url).get.q.replace(/\+/g, " ");

		videotime = $(".yt-lockup-video", doc);

		keywordslist = [];
		keylist = [];
		
		

		$.each(videotime, function(key, value) {

			channel = '';
			title = '';
			video = '';
			img = '';

			if($(value).find('.yt-uix-sessionlink').length!=0) {
			
				if($(value).find('.yt-thumb-simple').length!=0) {
					img = $(value).find('.yt-thumb-simple img').attr('src');	
				}
				
				$.each($(value).find('.yt-uix-sessionlink'), function(key, value) {
					href = $(value).attr('href');

					if($(value).hasClass('g-hovercard')) {
						if(href.search("/channel/")!='-1') {
							channel = href.replace("/channel/", '');
							
						}
					} else {
						title = $(value).html();
						video = href.replace('/watch?v=', '');
					}

				});

				if(channel!='' && channel!= undefined) {
					if($.inArray( channel, keylist ) ) {
						keywordslist.push({ 'key' : channel, 'video' : video, 'title' : title, 'img' : img });
						keylist.push(channel);
					}
				}	
			}

		});
		

		console.log('sp :'+sp+' user.sp'+user.sp);

		user.sp = sp;
		browser.runtime.sendMessage(null, { 'keywordChange' :  { 'keywordslist' : keywordslist, 'keyword' : user,  'myID' : window.myID }}, null);
		//console.log(keywordslist);

    }, 'JSON').fail(function (jqXHR, exception) {
    	console.log('fail');
    	user.sp = user.fp;
    	browser.runtime.sendMessage(null, { 'keywordChange' :  { 'keywordslist' : [], 'keyword' : user,  'myID' : window.myID }}, null);
    });

    console.log('- ajax -');

}


function getChannelContent(user) {

	console.log('getChannelContent:start');

	xytspf = retrieveWindowVariables('ytspf');

    $.ajax({
        url: "https://www.youtube.com/channel/"+ user.channel_id,
        method: "GET",
        data: {
            'spf': 'navigate'
        },

        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-Youtube-Identity-Token', xytspf.config['request-headers']['X-YouTube-Identity-Token']);
            xhr.setRequestHeader('X-SPF-Previous', document.URL);
            xhr.setRequestHeader('X-SPF-Referer', document.URL);
            xhr.setRequestHeader('Accept', '*/*');
        }
    	}).done(function(data) {


    		

			var doc = new DOMParser().parseFromString(data.body.content, "text/html");
	     	

			if($(".yt-uix-button-subscribe-branded", doc).exists()) {



				clicktracking = $(".yt-uix-button-subscribe-branded", doc).attr('data-clicktracking');

				ei = $.urlParam('ei', '?'+clicktracking);
				feature = $.urlParam('feature', '?'+clicktracking);
				ved = $.urlParam('ved', '?'+clicktracking);
				session_token = $('input[name=session_token]').eq(0).val();

	 			xytspf = retrieveWindowVariables('ytspf');
	    		xytplayer = retrieveWindowVariables('ytplayer');
	   
	    		var res = $('body').html().substr(($('body').html().indexOf("PAGE_CL")-1), 130).split(",");

			   	cl = '';
			   	bl = '';
			   	vc = '';

			    if(res.length!=0) {
					$.each( res, function( key, value ) {

						ls = value.split(":");

						if(ls.length==2) {

							if(myTrim(ls[0])=="'PAGE_CL'"){
								cl = replaceAll(myTrim(ls[1]), '"', '');
							}				

							if(myTrim(ls[0])=="'PAGE_BUILD_LABEL'"){
								bl = replaceAll(myTrim(ls[1]), '"', '');
							}
											
							if(myTrim(ls[0])=="'VARIANTS_CHECKSUM'"){
								vc = replaceAll(myTrim(ls[1]), '"', '');
							}

						}

					});
			    } 

			    if(cl=='' && bl=='' && vc=='') {
			    	alert('Error... Try later..');
			    	return;
			    }
	  
			    $.ajax({
			        url: "https://www.youtube.com/subscription_ajax/?action_create_subscription_to_channel=1&c="+user.channel_id,
			        method: "POST",
			        data: {
			            'ei': ei,
			            'feature': feature,
			            'ved' : ved,
			            'session_token' : session_token
			        },
			        beforeSend: function(xhr) {
			            xhr.setRequestHeader('X-YouTube-Client-Name', '1');
			            xhr.setRequestHeader('X-YouTube-Client-Version', xytplayer.config.args.cver);
			            xhr.setRequestHeader('X-Youtube-Identity-Token', xytspf.config['request-headers']['X-YouTube-Identity-Token']);
			            xhr.setRequestHeader('X-YouTube-Page-CL', cl);
			            xhr.setRequestHeader('X-YouTube-Page-Label', bl);
			            xhr.setRequestHeader('X-YouTube-Variants-Checksum', vc);
			        }
			    	}).done(function(data) {

			    		 /**
						 * @todo:  log'a geçir
						 */
						
						browser.runtime.sendMessage(null, { 'channelFollow' :  {  'channel' : user,  'success' : true, 'note' : '', 'myID' : window.myID }}, null);
		

			    	}, 'JSON').fail(function (jqXHR, exception) {

			    		browser.runtime.sendMessage(null, { 'channelFollow' :  {  'channel' : user,  'success' : false, 'note' : 'Connection failed', 'myID' : window.myID }}, null);

			   	});


			}  else {

				console.log("--- \n channelFollow :  " + user.channel_id+"\n ----");

				browser.runtime.sendMessage(null, { 'channelFollow' :  {  
					'channel' : user,  
					'success' : false, 
					'note' : 'Duplicate record', 
					'myID' : window.myID }}, null);

			}



    	}, 'JSON').fail(function (jqXHR, exception) {

	    	browser.runtime.sendMessage(null, { 'channelFollow' :  {  'channel' : user,  'success' : false, 'note' : 'Connection failed', 'myID' : window.myID }}, null);

   	});

    console.log('getChannelContent:end');

}



var theme_navigation = '<div id="nav" style="display:none;" class="pure-u navigation extention-firefox">' +
        '<br><br><br>' +
		'' +
        '<div class="nav-inner">' +
           
			'<a class="pure-menu-heading" href="#">roboyoutube</a>' +
			'<div class="pure-menu">' +
                '<ul class="pure-menu-list">' +
                    '<li class="pure-menu-heading">'+browser.i18n.getMessage("lcl_search_word")+'</li>' +
                    '<li class="pure-menu-item"><a href="#" class="pure-menu-link"><span class="email-label-personal"></span> <span class="title"></span></a></li>' +
                '</ul>' +
               
            '</div>' +
             '<button class="primary-button pure-button add-link">+ '+browser.i18n.getMessage("lcl_add")+'</button>' +
            '<div class="pure-menu">' +
                '<ul class="pure-menu-list keywords">' +
                	'<li class="pure-menu-heading">'+browser.i18n.getMessage("lcl_menu")+'</li>' +
                    '<li class="pure-menu-item"><a href="#" class="pure-menu-link">'+browser.i18n.getMessage("lcl_no_records")+'</a></li>' +
                '</ul>' +   
            '</div>' +
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
	} else {
		console.log('start : '+ window.myID);
		browser.runtime.sendMessage(null, { 'run' :  { 'myID' : window.myID }}, null);
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

			browser.runtime.sendMessage(null, { 'getkeywords' :  { 'myID' : window.myID }}, null);

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
 * [Sayfaya Gelenler]
 * @param  {[type]} request       [description]
 * @param  {[type]} sender        [description]
 * @param  {[type]} sendResponse) {	if(request.type [description]
 * @param  {String} keywords      );			if(is_key!    [description]
 * @return {[type]}               [description]
 */
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if(request.type=='debug') {
		console.log('debug');
		console.log(request);
	}	
 
	if(request.type=='get-keywords') {

		if(request.results.length!=0) {

			$('.extention-firefox .keywords').find('.pure-menu-item').remove();
			keywords = [];
			$.each(request.results, function(key, value){
				keywords.push(value['keyword']);
				$('.extention-firefox .keywords').append('<li class="pure-menu-item"><a href="#" data-id="'+value['last_use']+'" class="delete-item pure-menu-link"><span class="email-label-travel" style="padding:2px 0px 4px 8px; background:rgb(204, 24, 30);"> X </span> <span class="title">'+value['keyword']+'</span></a></li>');
			});

			is_key = $.inArray( getUrl().keyword, keywords );

			if(is_key!='-1') {
				$('.extention-firefox .add-link').removeClass('add-link').removeClass('primary-button').addClass('pure-button-disabled');
			}
			
		} 
	}

	if(request.type=='reflesh_nav') {
		console.log(request.results);
		browser.runtime.sendMessage(null, { 'getkeywords' :  { 'myID' : window.myID }}, null);
	}

	if(request.type=='get-page') {
		var getResult = getPageContent(request.results);
		return;
	}	

	if(request.type=='get-channel') {
		var getResult = getChannelContent(request.results);
		return;
	}

	if(request.type=='reflesh') {
		console.log('reflesh');
		runSearch(true);
	}

});




/**
 * [ready]
 */
$(function() {


	var youtubeId = $('.guide-my-channel-icon').closest('.guide-item').data('external-id');
	window.myID = md5(youtubeId);

	runSearch(true);
	
	/**
	 * [Sol Menu Trap]
	 */
  	window.setInterval(function () {
        runSearch(false);
    }, 1000);
	
	/**
	 * [Havuz Ekle]
	 */
	$('body').on('click', '.add-link', function(e){
		e.preventDefault();
		keyword = getUrl().keyword;
	
		fp = $.urlParam('sp', $('.search-pager button').eq(0).data('redirect-url').replace('&amp;','&'));
		console.log('ekleniyor...');
		browser.runtime.sendMessage(null, { 'addItem' :  { 'myID' : window.myID, 'keyword': keyword, 'sp' : fp, 'fp' : fp}}, null);
	});

	/**
	 * [Havuz Sil]
	 */
	$('body').on('click', '.delete-item', function(e){
		e.preventDefault();
		key = $(this).data('id');
		console.log('siliniyor :' + key);
		browser.runtime.sendMessage(null, { 'deleteItem' :  { 'myID' : window.myID, 'key': key}}, null);
	});

});