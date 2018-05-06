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
          if (result.keyword === "eat") {
            $(".foodDisplay")
              .append($(`<li>${result.keyword} ${result.value}</li>`))
              .hide()
              .fadeIn(800, function() {});
          } else if (result.keyword === "watch") {
            $(".watchDisplay")
              .append($(`<li>${result.keyword} ${result.value}</li>`))
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
}); //doc ready
