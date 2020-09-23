window.onload = searchNetflix(document.getElementById('movie-page').dataset.id)
function searchNetflix(netID) {
  $('.loader').addClass('active');
  $.ajax({
    url: '/movie/get/' + netID,
    method: 'POST'
  }).then((response) => {
    let flags = response.country;
    let htmlAboutMovie = `
          <li class="list-group-item"> ${response.imdbinfo.genre}</li>
          <li class="list-group-item">${response.imdbinfo.country}, ${response.nfinfo.released} </li>
          <li class="list-group-item"><strong>Director:</strong> ${response.people[2].director.join(',' + "\u00A0")}</li>
          <li class="list-group-item"><strong>Created by:</strong> ${response.people[1].creator.join(',' + "\u00A0")}</li>
          <li class="list-group-item"><strong>Starring:</strong> ${response.people[0].actor.join(',' + "\u00A0")}</li>
          <li class="list-group-item"><strong>Plot:</strong> ${response.nfinfo.synopsis} </li>   
          `;
    let htmlFlag;
    if (flags.length > 0) {
      $.each(flags, (index, flag) => {
        if (flag.seasons === "1 seasons") {
          flag.seasons = '1 season'
        }

        htmlFlag = `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2 single-country">
              <div class="inside">
                <h6> ${flag.country} </h6>
                <p>${flag.seasons}</p>
                <p class="since">from ${flag.new.split("-").reverse().join("/")}</p>
              </div>
            </div>
            `
        $('#countries').append(htmlFlag)
      })
    } else {
      htmlFlag = `
    <div class="alert alert-danger w-100" role="alert">
    <strong> Too bad! </strong> ${response.nfinfo.title} is currently not available on Netflix.
    </div>
    `
      $('#countries').append(htmlFlag)
    }
    $('#list-about').html(htmlAboutMovie);
    $('#imdb-rating').text(response.imdbinfo.rating);
    $('#poster').attr('src', response.nfinfo.image1);
    $('.loader').removeClass('active');
    $('.placeholder').removeClass('placeholder')
  }).catch((err) => {
    console.error(err);
  });
};
