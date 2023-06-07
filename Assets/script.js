document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const movieInfo = document.getElementById('movieInfo');
    const sourcesList = document.getElementById('sourcesList');
  
    searchInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchMovie();
      }
    });
  
    searchButton.addEventListener('click', searchMovie);
  
    function searchMovie() {
      const input = document.getElementById('searchInput');
      const query = input.value;
  
      // fetch through omdb api
      fetch(`https://www.omdbapi.com/?apikey=f26b11a3&t=${query}`)
        .then(response => response.json())
        .then(data => {
          if (data.Response === 'True') {
            const imdbId = data.imdbID;
            getSources(imdbId);
  
            let ratingsHTML = '';
            data.Ratings.forEach(rating => {
              ratingsHTML += `<p>${rating.Source}: ${rating.Value}</p>`;
            });
  
            movieInfo.innerHTML = `
              <h2>${data.Title}</h2>
              <p>Year: ${data.Year}</p>
              <p>Rating: ${data.Rated}</p>
              <p>Director: ${data.Director}</p>
              <p>Starring: ${data.Actors}</p>
              <p>Plot Synopsis: ${data.Plot}</p>
              ${ratingsHTML}
              <img src="${data.Poster}" alt="${data.Title} Poster">
            `;
          } else {
            movieInfo.innerHTML = `<p>Movie not found!</p>`;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  
    function getSources(titleId) {
      fetch(`https://api.watchmode.com/v1/title/${titleId}/details/?apiKey=WPmG7Zz5vHjq40wGf0WSfvoq2z6F38BSqO3r9xPe&append_to_response=sources`)
        .then(response => response.json())
        .then(data => {
          if (data.sources && data.sources.length > 0) {
            const sources = data.sources;
            const uniqueSources = Array.from(new Set(sources.map(source => source.name)))
              .map(name => sources.find(source => source.name === name));
  
            const sourcesHTML = uniqueSources.map(source => `<li>${source.name}</li>`).join('');
            sourcesList.innerHTML = `<ul>${sourcesHTML}</ul>`;
          } else {
            sourcesList.innerHTML = `<p>No sources found for this title ID.</p>`;
          }
        })
        .catch(error => {
          console.log(error);
          sourcesList.innerHTML = `<p>Error: ${error.message}</p>`;
        });
    }
  });
  