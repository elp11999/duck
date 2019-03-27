//
// Let the dust settle before getting started.
//
$(document).ready(function() {
  // Create callback for click on the new tab button
  $("#top-button-new-order").click(function(event) {
    // Clear message area
    $("#message-area").text("");
    console.log("button-new-order: clicked.");
    // Load the new tab page
    location.href = "/newtab";
  });
});
