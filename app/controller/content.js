console.log('burası youtube ' + browser.runtime.id);
//browser.runtime.sendMessage({ 'option' : 'test' });
var sending = browser.runtime.sendMessage(null, { 'test' :  'tamer'}, null);

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);
});

$(function() {

	var youtubeId = $('.guide-my-channel-icon').closest('.guide-item').data('external-id');
	var myID = md5(youtubeId);

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