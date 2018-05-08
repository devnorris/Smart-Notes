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
          console.log("resulte: ", result);
          // result.results[0].title
          if (result.keyword === "eat" || result.keyword === "manger chez") {
            $(".foodDisplay")
              .append(
                $(
                  `<li class="foodResults">${result.keyword} ${
                    result.value
                  }</li>`
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
          } else if (result.keyword === "buy") {
            $(".merchDisplay")
              .append($(`<li>${result.keyword} ${result.value}</li>`))
              .hide()
              .fadeIn(800, function() {});
          } else if (result.keyword === "read") {
            $(".bookDisplay")
              .append($(`<li>${result.keyword} ${result.value}</li>`))
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
    $(".watchDisplay").slideToggle();
  });

  $(".toggleEat").click(function() {
    $(".displayEat").slideToggle();
  });

  $(".toggleBuy").click(function() {
    $(".displayBuy").slideToggle();
  });

  $(".toggleRead").click(function() {
    $(".displayRead").slideToggle();
  });
}); //doc ready
