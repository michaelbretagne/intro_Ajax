function loadData() {

    var $body = $('body');
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

    $greeting.text("So, you want to live at " + address + "?");

    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';

    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // New York Time ajax request
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

    url += '?' + $.param({
        'q': cityStr,
        'sort': "newest",
        'api-key': "MyAPIkey"
    });

    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        console.log(articles.length);
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' +
                article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' + '</li>');
        };
    }).fail(function(err) {
        throw err;
    });

    return false;
};

$('#form-container').submit(loadData);