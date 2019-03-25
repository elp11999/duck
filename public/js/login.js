//
// Let the dust settle before getting started.
//
$(document).ready(function() {
  // Create callback for click on the exit button
  $("#button-exit").click(function(event) {
    console.log("button-exit: entered.");
    // Load the splash page
    location.href = "/";
  });
});
