function loadData() {

    var $body = $('body');
    var $wikiHeaderElem = $("#wikipedia-header");
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $("#street").val();
    var cityStr = $("#city").val();
    var address = streetStr + ", " + cityStr;

    $greeting.text("So, you want to live at " + cityStr + "?");

    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';

    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // New York Time ajax request
    var NytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

    NytUrl += '?' + $.param({
        'q': cityStr,
        'sort': "newest",
        'api-key': "MyAPIkey"
    });

    $.ajax({
        url: NytUrl,
        method: 'GET',
    }).done(function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' +
                article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' + '</li>');
        };
    }).fail(function(err) {
        $nytHeaderElem.text("New York Times articles could not be loaded");
    });

    // Wikipedia ajax request
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia ressources");
    }, 8000);

    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityStr + "&format=json&callback=wikiCallback";

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        }).done(function(data) {
            console.log(data);
            var articleList = data[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +
                    articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
    });


    return false;
};

$('#form-container').submit(loadData);