"use strict";
module.exports = {
  findMovie: function findMovie(search) {
    imdb
      .search(
        {
          title: search
        },
        { apiKey: imdbKey }
      )
      .then(result => {
        let movieArray = result.results;
        for (let searchResult of movieArray) {
          if (searchResult.title.toLowerCase() === search.toLowerCase()) {
            console.log(searchResult.title + " " + searchResult.year);
          }
        }
      })
      .catch(console.log);
  },
  confirmEntry: function confirm(array, input) {
    for (let i = 0; i < 3; i++) {
      if (array[i].name.toLowerCase() === input.toLowerCase()) {
        console.log(array[0].name);
      } else {
        console.log("Not found");
      }
    }
  }
};
