<<<<<<< HEAD
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




// $("form").on("submit", function(event) {
//     const formData = $("form").serialize();
//     event.preventDefault();
//     $.post("/smart", function(response) {
//       $.ajax({
//         url: "/smart/books_list",
//         method: "GET",
//         data: formData,
//         success: function(result) {
//           console.log("result: ", result);
//           $(".book_list").append(result);
//         },
//         error: function(error) {
//           console.log("ajax call fail");
//         }
//       });
//     });
//   });

=======
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
    });
  });
>>>>>>> master
});
