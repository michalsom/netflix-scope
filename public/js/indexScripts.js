var filter = sessionStorage.getItem('searchedFilter') || 'titles';
var currentSearch;
$(document).ready(() => {
  flagsSlider();
  setInterval(flagsSlider, 2000)
  $('#searchForm').on('submit', executeSearch);
  $('input[type=radio][name=typeFilter]').on('change', function () {
    filter = this.value;
    if (filter === 'titles') {
      $('input:text#searchText').attr('placeholder', 'Type the name of movie or TV show ...');
    }
    else if (filter === 'people') {
      $('input:text#searchText').attr('placeholder', 'Type the name of the actor, director or creator...');
    }
  });
  if (sessionStorage.getItem('lastSearch')) {
    if (sessionStorage.getItem('searchedFilter') === 'people') {
      $('#radio-people').prop("checked", true);
      console.log('tried mark people')
    }
    $('.movies-wrap').html(sessionStorage.getItem('lastSearch'));
    $('#searchText').val(sessionStorage.getItem('searchedText'));
    if ($('body').hasClass('indexPage')) {
      sessionStorage.removeItem('lastSearch');
      sessionStorage.removeItem('searchedFilter');
      sessionStorage.removeItem('searchedText')
    }
  }
});

var activeDiv = 1;
var count = $(".slider-countries .slider-item").length;

function flagsSlider() {
  $('.slider-item.passed').removeClass('passed');
  $('.slider-img-' + activeDiv).addClass('passed').removeClass('active');
  activeDiv++;
  if (activeDiv === count) {
    activeDiv = 1
  }
  $('.slider-img-' + activeDiv).addClass('active');
}

function executeSearch(e) {
  e.preventDefault();
  let searchText = $('#searchText').val();
  if (searchText !== '') {
    if (filter == 'people') {
      getPeople(searchText, 0)
    }
    else {
      getMovies(searchText, 0)
    }
    currentSearch = searchText;
    sessionStorage.setItem('searchedText', searchText);
    sessionStorage.setItem('searchedFilter', filter)
  }
}


let totalResults;


function getPeople(searchText, page) {
  $('.loader').addClass('active');

  var data = {
    currentSearch: $.trim(searchText),
    page: page
  };
  $.ajax({
    url: '/searchPeople',
    data: data,
    method: 'POST'
  }).then((response) => {
    console.log(response);
    let movies = response.results;
    if (response) {
      totalResults = response.total;
    }
    let pagination = '';
    let outputTitle = `
          <div class="results-title"> <span>Netflix results for: '${searchText}'</span><span class="amount"> (${totalResults})<span> </div>
          `;
    if (totalResults === 0) {
      console.log('did')
      movies = 0;
      outputTitle = `
          <div class="results-title"> <span>Nothing found for: '${searchText}'</span><p>check for errors and try again</p></div>
          `;
    }
    let output = "";

    $.each(movies, (index, movie) => {

      output += `
              <div onclick='movieSelected("${movie.netflixid}","${movie.title}")'  class="col-sm-6 col-md-4 col-lg-3 item-movie ">
                <div class="well text-center result-bg">
                  <h3 class="person-name"> ${movie.fullname}</h3>
                  <h2 class="movie-name">${movie.title}</h2>
                </div>
              </div>
            `;
    });
    if (totalResults > movies.length) {
      console.log('more results available')
      pagination += `
            <div>
             <button onclick='getPeople("${data.currentSearch}",${data.page + 1})' class="button-more">Show more results</button>
            </div>
          `;
    }

    $('#wrap-title').html(outputTitle);
    if (data.page === 0) {
      $('#movies').html(output);
      $('html,body').animate({ scrollTop: $('#wrap-title').offset().top }, 'fast');
    }
    else {
      $('#movies').append(output)
    }
    $('#pagination').html(pagination);
    $('.loader').removeClass('active');
    $('#link1').addClass('active');
  })
}

function getMovies(searchText, page) {
  $('.loader').addClass('active');

  var data = {
    currentSearch: $.trim(searchText),
    filter: filter,
    page: page
  };
  $.ajax({
    url: '/searchTitles',
    data: data,
    method: 'POST'
  }).then((response) => {
    console.log(response);
    console.log(response.results);
    let movies = response.results;
    if (response.total) {
      totalResults = response.total;
    }
    let pagination = '';
    let outputTitle = `
          <div class="results-title"> <span>Netflix results for: '${searchText}'</span><span class="amount"> (${totalResults})<span> </div>
          `;
    if (!totalResults || totalResults == 0) {
      movies = 0;
      outputTitle = `
          <div class="results-title"> <span>Nothing found for: '${searchText}'</span><p>check for errors and try again</p></div>
          `;
    }
    let output = "";
    var i;
    $.each(movies, (index, movie) => {
      if (!movie.img || movie.img === 'N/A') {
        movie.img = 'img/404.svg'
      }

      output += `
              <div onclick='movieSelected("${movie.nfid}","${movie.title}")'  class="col-sm-6 col-md-4 col-lg-3 item-movie">
                <div class="well text-center">
                  <div class="poster-frame">
                    <div class="movie-rating-wrap">
                      <span class="movie-rating"> 
                      ${movie.imdbrating || '-'} 
                      </span>
                    </div>
                    <img alt="poster of ${movie.title}" class="lazyload poster-img" src="images/def.svg" data-src="${movie.img}" onerror="imgError(this);">
                  </div>  
                  <h2 class="movie-name">${movie.title}</h2>
                </div>
              </div>
            `;
    });
    if (totalResults > movies.length + 40 * page) {
      console.log('more results available ' + movies.length + ' ' + page)
      pagination += `
            <div>
             <button onclick='getMovies("${data.currentSearch}",${data.page + 1})' class="button-more">Show more results</button>
            </div>
          `;
    }

    $('#wrap-title').html(outputTitle);
    if (data.page === 0) {
      $('#movies').html(output);
      $('html,body').animate({ scrollTop: $('#wrap-title').offset().top }, 'fast');
    }
    else {
      $('#movies').append(output)
    }
    $('#pagination').html(pagination);
    $('.loader').removeClass('active');
    $('#link1').addClass('active');
  })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id, title) {
  sessionStorage.setItem('movieId', id);
  window.location = '/movie/' + id + '/' + title;
  sessionStorage.setItem('lastSearch', $('.movies-wrap').html());
  sessionStorage.setItem('searchedText', searchText.value);
  sessionStorage.setItem('searchedFilter', filter);
  return false;
}


