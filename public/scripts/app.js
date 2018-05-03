$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done(users => {
    for (user of users) {
      $("<div>")
        .text(user.name)
        .appendTo($("body"));
    }
  });
});

$(document).ready(function() {
  console.log("knex", knex.development.connection.database);
  //we will use variables in this  event listener to fill in every paragraph(which will contain
  //the new entries)
  $(".categories").on("click", ".movies", function() {
    let displayTodos = `<div class="movieList">
  <p>latest entry to this category<p>
  </div>`;
    // $(".movies").toggle(displayTodos); trying ot make the list slide down, doesnt work.
    $(".movies").append(displayTodos);
  });

  $(".categories").on("click", ".food", function() {
    let displayTodos = `<div class="foodList">
<p>latest entry to this category<p>
</div>`;
    $(".food").append(displayTodos);
  });

  $(".categories").on("click", ".merch", function() {
    let displayTodos = `<div class="merchList">
<p>latest entry to this category<p>
</div>`;
    $(".merch").append(displayTodos);
  });

  $(".categories").on("click", ".books", function() {
    let displayTodos = `<div class="booksList">
<p>latest entry to this category<p>
</div>`;
    $(".books").append(displayTodos);
  });
}); //document ready function
