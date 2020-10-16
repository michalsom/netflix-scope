
var dataPoint = {
  currentFilter: 'titles',
  currentFlag: 0,
  totalFlags: document.getElementsByClassName('slider-item').length,
  searchBar: document.getElementById('searchText')
}
var previousSearchResults = {
  searchedText: "",
  searchedFilter: "",
  movieResults: HTMLElement,
}

document.addEventListener("DOMContentLoaded", function (event) {
  flagsSlider();
  loadLastResults();
});
dataPoint.searchBar.addEventListener("input", closeButton);
document.getElementById('searchForm').addEventListener("submit", executeSearch);
document.getElementById('radioWrap').addEventListener("change", changeFilter);

function changeFilter() {
  dataPoint.currentFilter = event.target.value;
  if (dataPoint.currentFilter === 'people') {
    $('input:text#searchText').attr('placeholder', 'Type the name of the actor, director or creator...');
  }
  else {
    $('input:text#searchText').attr('placeholder', 'Type the name of movie or TV show ...');
  }
}

function loadLastResults() {
  if (!sessionStorage.getItem('previousSearch')) {
    return
  }
  let loadedPreviousSearchResults = JSON.parse(sessionStorage.previousSearch);
  $('.movies-wrap').html(loadedPreviousSearchResults.movieResults);
  dataPoint.searchBar.value = loadedPreviousSearchResults.searchedText;
  dataPoint.currentFilter = loadedPreviousSearchResults.searchedFilter;
  dataPoint.searchBar.dispatchEvent(new Event('input'));

  if (dataPoint.currentFilter === 'people') {
    $('#radio-people').prop("checked", true);
  }
  sessionStorage.removeItem('previousSearch');
}

function closeButton() {
  const iconClose = document.getElementById('closeIcon');
  if (this.value.length > 0) {
    iconClose.classList.remove('hidden');
  }
  else {
    iconClose.classList.add('hidden');
  }
}

function executeSearch() {
  event.preventDefault();
  sessionStorage.removeItem('totalResults');
  let searchedText = $('#searchText').val();
  if (searchedText !== '') {
    if (dataPoint.currentFilter === 'people') {
      getResults(searchedText, 0, 'people')
    }
    else {
      getResults(searchedText, 0, 'titles')
    }
    sessionStorage.setItem('searchedText', searchedText);
    sessionStorage.setItem('searchedFilter', dataPoint.currentFilter)
  }
}

function getResults(searchText, page, filter) {
  document.getElementById('loader').classList.add('active');
  let requestURL = (filter==='titles' ? '/searchTitles' : '/searchPeople');
  let data = {
    currentSearch: $.trim(searchText),
    page: page
  };
  axios({
    url: requestURL,
    data: data,
    method: 'POST'
  }).then((response) => {
    let fetchedResults = response.data.results;
    let totalResults = response.data.total;

    let outputTitle = '';
    let outputItems = '';
    let outputPagination = '';

    totalResults ? sessionStorage.setItem('totalResults', totalResults) : totalResults = sessionStorage.getItem('totalResults');

    if (!fetchedResults) {
      fetchedResults = '';
      outputTitle = `
          <div class="results-title"> <span>Nothing found for: '${searchText}'</span><p>check for errors and try again</p></div>
          `;
    }
    else {
      outputTitle = `
          <div class="results-title"> <span>Netflix results for: '${searchText}'</span><span id="amount"> (${totalResults})<span> </div>
          `;
    }
    if (totalResults > fetchedResults.length + 40 * page) {
      outputPagination += `
            <div>
             <button onclick='getResults("${searchText}",${page+1}, "${filter}")' class="button-more">Show more results</button>
            </div>
          `;
    }
    outputItems += displayResults(fetchedResults, filter)

    document.getElementById('wrap-title').innerHTML = outputTitle;
    if (data.page === 0) {
      document.getElementById('movies').innerHTML = outputItems;
      $('html,body').animate({ scrollTop: $('#wrap-title').offset().top }, 'slow');
    }
    else {
      document.getElementById('movies').insertAdjacentHTML("beforeend", outputItems);
    }
    document.getElementById('pagination').innerHTML = outputPagination;
    document.getElementById('loader').classList.remove('active');
  })
    .catch((err) => {
      console.log(err);
    });
}

function displayResults(results, filter) {
  let outputItems = ""
  if (filter === 'titles') {
    for (let movie in results) {
      if (!results[movie].img || results[movie].img === 'N/A') {
        results[movie].img = 'img/404.svg'
      }
      outputItems += `
            <div onclick='movieSelected("${results[movie].nfid}","${results[movie].title}")'  class="col-sm-6 col-md-4 col-lg-3 item-movie">
              <div class="well text-center">
                <div class="poster-frame">
                  <div class="movie-rating-wrap">
                    <span class="movie-rating"> 
                    ${results[movie].imdbrating || '-'} 
                    </span>
                  </div>
                  <img alt="poster of ${results[movie].title}" class="lazyload poster-img" src="images/def.svg" data-src="${results[movie].img}" onerror="imgError(this);">
                </div>  
                <h2 class="movie-name">${results[movie].title}</h2>
              </div>
            </div>
          `;
    }
  }
  else {
    for (let movie in results) {
      outputItems += `
      <div onclick='movieSelected("${results[movie].netflixid}","${results[movie].title}")'  class="col-sm-6 col-md-4 col-lg-3 item-movie ">
        <div class="well text-center result-bg">
          <h3 class="person-name"> ${results[movie].fullname}</h3>
          <h2 class="movie-name">${results[movie].title}</h2>
        </div>
      </div>
    `;
    }
  }
  return outputItems
}

function movieSelected(id, title) {
  sessionStorage.setItem('movieId', id);
  window.location = '/movie/' + id + '=' + title;

  previousSearchResults = {
    searchedFilter: dataPoint.currentFilter,
    searchedText: document.getElementById('searchText').value,
    movieResults: document.getElementById('resultsWrap').innerHTML,
  }
  sessionStorage.setItem('previousSearch', JSON.stringify(previousSearchResults));
}

function clearSearch() {
  dataPoint.searchBar.value = '';
  dataPoint.searchBar.dispatchEvent(new Event('input'));

  document.getElementById('movies').innerHTML = "";
  document.getElementById('wrap-title').innerHTML = "";
  document.getElementById('pagination').innerHTML = "";
}

function flagsSlider() {
  $('.slider-item.passed').removeClass('passed');
  $('.slider-img-' + dataPoint.currentFlag).addClass('passed').removeClass('active');
  dataPoint.currentFlag++;

  if (dataPoint.currentFlag === dataPoint.totalFlags) {
    dataPoint.currentFlag = 0
  }
  $('.slider-img-' + dataPoint.currentFlag).addClass('active');
  setTimeout(flagsSlider, 2000);
}