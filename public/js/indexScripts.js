var filter;
var currentSearch;
$(document).ready(() => {
    flagsSlider();
    setInterval(flagsSlider,2000)
    $('#searchForm').on('submit', executeSearch);
    $('input[type=radio][name=typeFilter]').on('change', function() {
      filter = this.value;
      if (filter === '&type=Movie'){
        $('input:text#searchText').attr('placeholder','Type the name of the movie you want to watch...');
        }
      else if (filter === '&type=Series'){
        $('input:text#searchText').attr('placeholder','Type the name of the series you want to watch...');
        }
      else{
        $('input:text#searchText').attr('placeholder','Type the name of the title you want to watch...');
        }
    });
    if (sessionStorage.getItem('lastSearch')){
        $('.movies-wrap').html(sessionStorage.getItem('lastSearch'));
        $('#searchText').val(sessionStorage.getItem('searchedText'));
        if ($('body').hasClass('indexPage')){
            sessionStorage.removeItem('lastSearch');
        }
    }
});

var activeDiv = 1;
var count = $(".slider-countries .slider-item").length;

function flagsSlider(){
    $('.slider-item.passed').removeClass('passed');
    $('.slider-img-'+ activeDiv).addClass('passed').removeClass('active');
    activeDiv++;
    if (activeDiv === count){
      activeDiv = 1
    }
    $('.slider-img-'+ activeDiv).addClass('active');
}

function executeSearch(e){
    e.preventDefault();
    let searchText = $('#searchText').val();
    if (searchText !== ''){
        getMovies(searchText)
        $('.searchWrap').addClass('used');
        currentSearch = searchText;
        sessionStorage.setItem('searchedText', searchText);
    }
}


function loadPage(page){
    $('.loader').addClass('active');
    $('#movies').css('min-height', ($('#movies').height()));
    if( sessionStorage.getItem('searchedText') !== null) {
      currentSearch = sessionStorage.getItem('searchedText')
    }
      var data = {
        currentSearch: $.trim(currentSearch),
        filter: filter,
        page: page
      };
      $.ajax({
        url: '/send',
        data: data,
        method: 'POST'}).then((response) => {
        let movies = response.Search;
        let output = "";
        
        $.each(movies, (index, movie) => {
         
            let animationDelay = 'style="animation-delay:'+ index +'00ms"';
          if(movie.Poster === 'N/A'){
            movie.Poster = 'images/404.svg'
          }
          output += `
            <div onclick="movieSelected('${movie.imdbID}')" ${animationDelay} class="col-sm-6 col-md-4 col-lg-3 item-movie">
              <div class="well text-center">
                <div class="poster-frame">
                  <img alt="poster of ${movie.Title}" class="shadow lazyload" src="images/def.svg" data-src="${movie.Poster}">
                </div>  
                <h5>${movie.Title}</h5>
                <div class="floating-button">
                  <a class="btn btn-primary" href="#">Learn more details</a>
                </div>
              </div>
            </div>
          `;
        });
        $('.item-movie').children().fadeOut();
        $('#movies').html('');
        $('#movies').html(output);
        $('.loader, .link').removeClass('active');
        $('#link'+page).addClass('active');
        $('html,body').animate({ scrollTop: $('#wrap-title').offset().top }, 'medium');
    })
      .catch((err) => {
        console.log(err);
      });
    };

function getMovies(searchText){
    $('.loader').addClass('active');
    var data = {
        currentSearch: $.trim(searchText),
        filter: filter,
        page: '1'
    };
    $.ajax({
        url: '/send',
        data: data,
        method: 'POST'}).then((response) => {
        let movies = response.Search;
        let totalResults = (parseInt(response.totalResults) > 200 ? '200' : response.totalResults);
        let pages = Math.round(response.totalResults / 10);
        let pagination = '';
        let outputTitle = `
        <div class="results-title"> <span>Results for: '${searchText}'</span><span class="amount"> (${totalResults})<span> </div>
        `;
        if(!totalResults){
            outputTitle = `
        <div class="results-title"> <span>Nothing found for: '${searchText}'</span><p>check for errors and try again</p></div>
        `;
        }
        let output = "";
        var i;
        $.each(movies, (index, movie) => {
            let animationDelay = 'style="animation-delay:'+ index +'00ms"';
            if(movie.Poster=== 'N/A'){
            movie.Poster = 'images/404.svg'
            }
            output += `
            <div onclick="movieSelected('${movie.imdbID}')" ${animationDelay} class="col-sm-6 col-md-4 col-lg-3 item-movie">
                <div class="well text-center">
                    <div class="poster-frame">
                        <img alt="poster of ${movie.Title}" class="shadow lazyload" src="images/def.svg" data-src="${movie.Poster}">
                    </div>  
                    <h5>${movie.Title}</h5>
                    <div class="floating-button">
                        <a class="btn btn-primary" href="#">Learn more details</a>
                    </div>
                </div>
            </div>
            `;
        });
        if(pages > 30){
            pages = 20;
        }
        for(i = 0; i < pages ; i++){
            pagination += `
            <div class="page page${i + 1}">
            <a onclick="loadPage('${i + 1}')" id="link${i+1}"class="link"> ${i + 1}</a>
            </div>
        `;
        }
        $('#wrap-title').html(outputTitle);
        $('#movies').html(output);
        $('#pagination').html(pagination);
        $('html,body').animate({ scrollTop: $('#wrap-title').offset().top }, 'medium');
        $('.loader').removeClass('active');
        $('#link1').addClass('active');
        })
        .catch((err) => {
        console.log(err);
    });
}

function movieSelected(id){
    sessionStorage.setItem('movieId', id);
    window.location = '/movie/'+ id;
    sessionStorage.setItem('lastSearch',$('.movies-wrap').html());
    sessionStorage.setItem('searchedText', searchText.value);
    sessionStorage.setItem('searchedFilter', filter);
    return false;
}
