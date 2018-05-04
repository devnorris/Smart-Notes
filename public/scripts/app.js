$(() => {
  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done(users => {
  //   for (user of users) {
  //     $("<div>")
  //       .text(user.name)
  //       .appendTo($("body"));
  //   }

  $("form").on("submit", function(event) {
    const formData = $("form").serialize();
    event.preventDefault();
    $.get("/smart", function(response) {
      $.ajax({
        url: "/smart",
        method: "POST",
        data: formData,
        success: function(result) {
          console.log("result: ", result);
          $(".bookDisplay").append(result);
        },
        error: function(error) {
          console.log("ajax call fail");
        }
      });
    });
  });
});
// });
