$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});




$(() => {
  $.ajax({
    method: "GET",
    url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAHyZywwHyW7umKQ1ik2k_eX1091H5XTos&callback=initMap"type="text/javascript";
  }).done((users) => {
    // for(user of users) {
    //   $("<div>").text(user.name).appendTo($("body"));
    // }
  });;
});

