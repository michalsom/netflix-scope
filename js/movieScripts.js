function searchNetflix(netID){
    $('.loader').addClass('active');
    var data = {
          netID: netID
        };
        $.ajax({
          url: '/movie/send',
          data: data,
          method: 'POST'
        }).then((response) => {
          
          if (response.RESULT== null){
            if( $('.loader').hasClass('active')){
              $('.loader').removeClass('active');
              var emptyResponse = `
                <div class="container results-title"> <span>Not available on Netflix <span> </div>
              `;
              $('#countries').html(emptyResponse);
              $('.netflix').css("margin-top","auto");
              $("html, body").animate({ scrollTop: $('#countries').offset().top }, 'fast');
            }
          }
          else {
            var flags = response.RESULT.country;
          $('.loader').removeClass('active');
          $('.netflix').css("margin-top","auto");
          $('.netflix p').text('Availability results below.');
          $("html, body").animate({ scrollTop: $('#countries').offset().top }, 'fast');
      
          var htmlFlags="";
          var htmlCountries= `
            <div class="container results-title"> <span>Available in: ${flags.length} countries</span><span class="amount"> <span> </div>
          `;
      
          $.each(flags, (index, flag) => {
      
            if (typeof flag.ccode != ""){
              if(flag.seasons=== "1 seasons"){
                flag.seasons = '1 season'
              }
              htmlFlags += `
            <div class="col-6 col-sm-4 col-md-3 col-lg-2 single-country">
              <div class="inside">
                <h6> ${flag.country} </h6><p>${flag.seasons}  </p><p class="since">from ${flag.new.split("-").reverse().join("/")}  </p>
              </div>
            </div>
            `
            }
          })
          $('#countries').html(htmlCountries + htmlFlags);
         
          }
        }).catch((err) => {
          console.error(err);
        });
        $(".netflix").prop("onclick", null).off("click");
      };
  