$(() => {
  $(".submitTodo").on("submit", function(event) {
    const formData = $("form").serialize();
    event.preventDefault();
    $.get("/smart", function(response) {
      $.ajax({
        url: "/smart",
        method: "POST",
        data: formData,
        success: function(result) {
          console.log("resulte: ", result.foodResults[0].url);
          // result.results[0].title
          if (result.keyword === "eat" || result.keyword === "manger chez") {
            $(".foodDisplay")
              .append(
                $(
                  `<li class="foodResults"><a href="${
                    result.foodResults[0].url
                  }">${result.foodResults[0].name}-(${
                    result.foodResults[0].location.address1
                  })</a></li>`
                )
              )
              .hide()
              .fadeIn(800, function() {});
          } else if (
            result.keyword === "watch" ||
            result.keyword === "regarder"
          ) {
            $(".watchDisplay")
              .append(
                $(
                  `<li class="watchResults"><a href="https://www.imdb.com/title/${
                    result.movieResult.results[0].imdbid
                  }/"">
                 ${result.movieResult.results[0].title}(${
                    result.movieResult.results[0].year
                  }).</a></li>`
                )
              )
              .hide()
              .fadeIn(800, function() {});
          } else if (result.keyword === "buy" || result.keyword === "acheter") {
            $(".merchDisplay")
              .append(
                $(
                  `<li class="merchResults"><a href="https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR0.TRC0.H0.X391665377317.TRS0&_nkw=${
                    result.merchResults[0].itemId
                  }&_sacat=0">${result.merchResults[0].title}, ${
                    result.merchResults[0].primaryCategory.categoryName
                  }</a></li>`
                )
              )
              .hide()
              .fadeIn(800, function() {});
          } else if (result.keyword === "read" || result.keyword === "lire") {
            $(".bookDisplay")
              .append(
                $(
                  `<li class="bookResults"><a href="https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR0.TRC0.H0.X391665377317.TRS0&_nkw=${
                    result.bookResults[0].itemId
                  }&_sacat=0">${result.bookResults[0].title} (${
                    result.bookResults[0].primaryCategory.categoryName
                  })</a></li>`
                )
              )
              .hide()
              .fadeIn(800, function() {});
          }
        },
        error: function(error) {
          console.log("ajax call fail");
        }
      });
      $("form").trigger("reset");
    });
  }); //api verification

  $(".toggleLogin").on("click", function() {
    $(".loginForm").slideToggle();
  });

  $(".toggleWatch").click(function() {
    $(".watchResults").slideToggle();
  });

  $(".toggleEat").click(function() {
    $(".foodResults").slideToggle();
  });

  $(".toggleMerch").click(function() {
    $(".merchResults").slideToggle();
  });

  $(".toggleRead").click(function() {
    $(".bookResults").slideToggle();
  });
}); //doc ready
