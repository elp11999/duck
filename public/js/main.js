//
// Let the dust settle before getting started.
//
$(document).ready(function() {
  // Local storage
  var posSystem = JSON.parse(localStorage.getItem("posSystem"));

  // Drink items
  var drinkItems = [];

  // Food items
  var foodItems = [];

  // Get drink Items
  getDrinkItems();

  // Get the current list of drink items
  function getDrinkItems() {
    $.ajax("/api/drinks", {
      type: "GET",
      success: function(resp) {
        drinkItems = [];
        var mainDiv = $(".main-page-right");
        for (var i = 0; i < resp.length; i++) {
          var button = $("<button class='btn btn-default main-right-drink-button'>");
          $(button).text(resp[i].drink_name);
          $(button).attr("data-drink-id", resp[i].id);
          $(mainDiv).append(button);
          drinkItems.push(resp[i]);
        }
        // Set click handler for the drink buttons
        $(".main-right-drink-button").mousedown(drinkButtonClicked);

        // Get food items
        getFoodItems();
      },
      error: function(req, status, err) {
        $("#message-area").text("Something went wrong: ", status, err);
      }
    });
  }

  // Get the current list of food items
  function getFoodItems() {
    $.ajax("/api/food", {
      type: "GET",
      success: function(resp) {
        foodItems = [];
        var mainDiv = $(".main-page-right");
        for (var i = 0; i < resp.length; i++) {
          var button = $("<button class='btn btn-default main-right-food-button'>");
          $(button).text(resp[i].food_name);
          $(button).attr("data-food-id", resp[i].id);
          $(mainDiv).append(button);
          foodItems.push(resp[i]);
        }
        // Set click handler for the good buttons
        $(".main-right-food-button").mousedown(foodButtonClicked);
      },
      error: function(req, status, err) {
        $("#message-area").text("Something went wrong: ", status, err);
      }
    });
  }

  // Create callback for click on the new tab button
  $("#top-button-new-order").click(function(event) {
    // Clear message area
    $("#message-area").text("");
    // Load the new tab page
    location.href = "/newtab";
  });

  /*
  <div class="main-page-left">
      <div class="main-item-detail cfix">                  
          <span class="main-left-side">Subtotal</span>                
          <span class="main-right-side">0.00</span> 
      </div>
  */

  // Call back function when a drink button is clicked
  function drinkButtonClicked(event) {
    var totalPrice = 0;
    var item = {};
    var drinkId = parseInt($(this).data("drink-id")) - 1;
    var drink = drinkItems[parseInt(drinkId)];
    var currentTab = posSystem.openTabs[posSystem.currentTabID-1];
    console.log(currentTab);
    var mainDiv = $(".main-page-left");
    $(mainDiv).empty();
   
    for (var i = 0; i < currentTab.items.length; i++) {
      var item = currentTab.items[i];
      console.log(item);

      var itemDiv = $("<div class='main-item-detail cfix'>");
      var leftSpan = $("<span class='main-left-side'>");
      var rightSpan = $("<span class='main-right-side'>");
      $(leftSpan).text(item.name);
      $(rightSpan).text(item.price);
      $(itemDiv).append(leftSpan);
      $(itemDiv).append(rightSpan);
      $(mainDiv).append(itemDiv);
      totalPrice += parseInt(item.price);
    }

    item.name = drink.drink_name;
    item.price = drink.price;
    currentTab.items.push(item);
    console.log(currentTab.items);

    var itemDiv = $("<div class='main-item-detail cfix'>");
    var leftSpan = $("<span class='main-left-side'>");
    var rightSpan = $("<span class='main-right-side'>");
    $(leftSpan).text(item.name);
    $(rightSpan).text(item.price);
    $(itemDiv).append(leftSpan);
    $(itemDiv).append(rightSpan);
    $(mainDiv).append(itemDiv);
    totalPrice += parseInt(item.price);

    itemDiv = $("<div class='main-item-detail cfix'>");
    leftSpan = $("<span class='main-left-side'>");
    rightSpan = $("<span class='main-right-side'>");
    $(leftSpan).text("Subtotal");
    $(rightSpan).text(totalPrice);
    $(itemDiv).append(leftSpan);
    $(itemDiv).append(rightSpan);
    $(mainDiv).append(itemDiv);

    itemDiv = $("<div class='main-item-detail cfix'>");
    leftSpan = $("<span class='main-left-side'>");
    rightSpan = $("<span class='main-right-side'>");
    $(leftSpan).text("Total");
    $(rightSpan).text(totalPrice);
    $(itemDiv).append(leftSpan);
    $(itemDiv).append(rightSpan);
    $(mainDiv).append(itemDiv);

    itemDiv = $("<div class='main-item-detail cfix'>");
    leftSpan = $("<span class='main-left-side'>");
    rightSpan = $("<span class='main-right-side'>");
    $(leftSpan).text("Balance Due");
    $(rightSpan).text(totalPrice);
    $(itemDiv).append(leftSpan);
    $(itemDiv).append(rightSpan);
    $(mainDiv).append(itemDiv);

    // Update local storage
    localStorage.setItem("posSystem", JSON.stringify(posSystem));
  }

  // Call back function when a food button is clicked
  function foodButtonClicked(event) {
    var foodId = parseInt($(this).data("food-id")) - 1;
    console.log("foodId=" + foodId);
  }

  // Create callback for click on the left button
  $("#top-button-left").click(function(event) {
    location.href = "/tablist";
  });

  // Create callback for click on the done button
  $("#top-button-done").click(function(event) {
    location.href = "/";
  });

  // Create callback for click on the close button
  $("#bottom-button-close").click(function(event) {
    location.href = "/tabclose";
  });
});
