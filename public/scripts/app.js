$(document).ready(function () {

// $("form").on('submit', function(event) {
//     event.preventDefault();
//     console.log('submission');
//   $.ajax({
//     method: "POST",
//     url: "/smart",

//   }).done(function(result) {
//     $(formData).appendTo('.foodDisplay')
//       //$("<div>").text(user.name).appendTo($("body"));
//     });
//   });




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
