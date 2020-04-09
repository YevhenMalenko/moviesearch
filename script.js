const searchForm = document.querySelector('#search-form'),
      movie = document.querySelector('#movies'),
      urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
  event.preventDefault();
  let searchText = document.querySelector('#search-text').value;
  if (searchText.trim().length === 0) {
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Enter name, please</h2>';
    return;
  }
  const server = 'https://api.themoviedb.org/3/search/multi?api_key=fc4bdc70387d1db807b101b807d2f898&language=en-US&query=' + searchText;
  movie.innerHTML = '<div class="spinner"></div>';
  fetch(server)
  .then(function(value){
    if (value.status !==200) {
      return Promise.reject(new Error(value));
    }
    return value.json();
  })
  .then(function(output){
    console.log(output.results);
    let inner = '';
    if (output.results.length === 0) {
      inner = '<h2 class="col-12 text-center text-info">Movies not found</h2>';

    }
    
    output.results.forEach(function (item) {
      let nameItem = item.name || item.title;
      let poster = item.poster_path ? urlPoster + item.poster_path : './assets/images/noposter.jpg';
      let dataInfo = '';
      if(item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
      inner += `
        <div class="col-lg-3 col-md-3 col-sm-4 col-6">
          <div class="item">
            <img class="poster" src="${poster}" alt="${nameItem}" ${dataInfo}>
            <h4>${nameItem}</h4>
          </div>
        </div>
        `;
    });
    movie.innerHTML = inner;
    addEventMedia();
  })
  .catch(function(reason){
    movie.innerHTML = 'something goes wrong';
    console.error('error: ' + reason.status);
  });
}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
  const media = movie.querySelectorAll('img[data-id]');
  media.forEach(function(elem){
    elem.style.cursor = 'pointer';
    elem.addEventListener('click', showFullInfo);
  });

}

function showFullInfo(){
  let url = '';
  let id = this.dataset.id;
  let type = this.dataset.type;
  if(this.dataset.type === 'movie'){
    url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=fc4bdc70387d1db807b101b807d2f898&language=en-US';
  } else if(this.dataset.type === 'tv') {
    url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=fc4bdc70387d1db807b101b807d2f898&language=en-US';
  } else {
    movie.innerHTML = '<h2 class="col-12 text-center text-danger">Error, Please try later</h2>';
  }  

  fetch(url)
  .then(function(value){
    if (value.status !==200) {
      return Promise.reject(new Error(value));
    }
    return value.json();
  })
  .then(function(output){
    let poster = output.poster_path ? urlPoster + output.poster_path : './assets/images/noposter.jpg';
    movie.innerHTML = `
    <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
    <div class="col-4">
      <img src="${poster}" alt="${output.name || output.title}">
      ${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Official page</a></p>` : ''}
      ${(output.imdb_id) ? `<p class="text-center"><a href="https://www.imdb.com/title/${output.imdb_id}" target="_blank">IMDB</a></p>` : ''}

    </div>
    <div class="col-8">
      <p>Rate: ${output.vote_average}</p>
      <p>Status: ${output.status}</p>
      <p>Premiere: ${output.first_air_date || output.release_date}</p>
      ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} seasons ${output.last_episode_to_air.episode_number} series</p>` : ''}
      <p>Description: ${output.overview}</p>
    </div>
    <div class="col-12">
      <div class="row youtube"></div>
    </div>
    `;

    getVideo(type, id);
    
    // getVideo(this.dataset.type, this.dataset.id);

  })
  .catch(function(reason){
    movie.innerHTML = 'something goes wrong';
    console.error('error: ' + reason.status);
  });


}

document.addEventListener('DOMContentLoaded', function(){
  fetch('https://api.themoviedb.org/3/trending/all/week?api_key=fc4bdc70387d1db807b101b807d2f898')
  .then(function(value){
    if (value.status !==200) {
      return Promise.reject(new Error(value));
    }
    return value.json();
  })
  .then(function(output){
    console.log(output.results);
    let inner = '<h2 class="col-12 text-center text-info">Trending Movies</h2>';
    if (output.results.length === 0) {
      inner = '<h2 class="col-12 text-center text-info">Movies not found</h2>';
    }
    
    output.results.forEach(function (item) {
      let nameItem = item.name || item.title;
      let mediaType = item.title ? 'movie' : 'tv';
      let poster = item.poster_path ? urlPoster + item.poster_path : './assets/images/noposter.jpg';
      let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
      inner += `
        <div class="col-lg-3 col-md-3 col-sm-4 col-6">
          <div class="item">
            <img class="item__poster" src="${poster}" alt="${nameItem}" ${dataInfo}>
            <h4 class="item__title">${nameItem}</h4>
          </div>
        </div>
        `;
    });
    movie.innerHTML = inner;
    addEventMedia();
  })
  .catch(function(reason){
    movie.innerHTML = 'something goes wrong';
    console.error('error: ' + reason.status);
  });

});

function getVideo(type, id){
 
  let youtube = movie.querySelector('.youtube');
  fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=fc4bdc70387d1db807b101b807d2f898&language=en-US`)
  .then(function(value) {
    if (value.status !==200) {
      return Promise.reject(new Error(value));
    }
    return value.json();
  })
  .then(function(output) {
    let videoFrame = '<h4 class="col-12 text-info text-center">Video</h4>';
    
    if(output.results.length === 0) {
      videoFrame = '<p>Video not found</p>';
    }
    output.results.forEach((item)=> {
      videoFrame += '<div class="col-12 col-md-6"><iframe width="100%" height="315" src="https://www.youtube.com/embed/' + item.key + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
    });
    youtube.innerHTML = videoFrame;
  })
  .catch(function(reason) {
    youtube.innerHTML = 'Video not found';
    console.error('error: ' + reason.status);
  });

}