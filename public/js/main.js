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

  // Get current tab
  var currentTab = posSystem.openTabs[posSystem.currentTabID-1];
  getCurrentTab(currentTab);

  // Function to display tab orders
  function displayTabOrders(currentTab) {
    var totalPrice = 0;
    var mainDiv = $(".main-page-left");
    $(mainDiv).empty();
   
    if (currentTab.items_ordered.length > 0) {
      var currentItems = currentTab.items_ordered.split(";");
      console.log(currentItems);
      for (var i = 0; i < currentItems.length; i++) {
        var itemObj = currentItems[i].split(":");
        var itemDiv = $("<div class='main-item-detail cfix'>");
        var leftSpan = $("<span class='main-left-side'>");
        var rightSpan = $("<span class='main-right-side'>");
        $(leftSpan).text(itemObj[0]);
        $(rightSpan).text(itemObj[1]);
        $(itemDiv).append(leftSpan);
        $(itemDiv).append(rightSpan);
        $(mainDiv).append(itemDiv);
      }
    }
   
    // Display tab totals
    totalPrice += parseInt(currentTab.total);
    displayTabTotals(mainDiv, totalPrice);

  }
  
  // Function to display tab totals
  function displayTabTotals(mainDiv, totalPrice) {

    itemDiv = $("<div class='main-item-detail cfix'>");
    leftSpan = $("<span class='main-left-side'>");
    rightSpan = $("<span class='main-right-side' id='tab-subTotal'>");
    $(leftSpan).text("Subtotal");
    $(rightSpan).text(totalPrice);
    $(itemDiv).append(leftSpan);
    $(itemDiv).append(rightSpan);
    $(mainDiv).append(itemDiv);

    itemDiv = $("<div class='main-item-detail cfix'>");
    leftSpan = $("<span class='main-left-side'>");
    rightSpan = $("<span class='main-right-side' id='tab-total'>");
    $(leftSpan).text("Total");
    $(rightSpan).text(totalPrice);
    $(itemDiv).append(leftSpan);
    $(itemDiv).append(rightSpan);
    $(mainDiv).append(itemDiv);

    itemDiv = $("<div class='main-item-detail cfix'>");
    leftSpan = $("<span class='main-left-side'>");
    rightSpan = $("<span class='main-right-side' id='tab-balance-due'>");
    $(leftSpan).text("Balance Due");
    $(rightSpan).text(totalPrice);
    $(itemDiv).append(leftSpan);
    $(itemDiv).append(rightSpan);
    $(mainDiv).append(itemDiv);
  }

  // Function to get current tab
  function getCurrentTab(tab) {

    $.ajax("/api/gettab/"+ tab.id, {
      type: "GET",
      success: function(resp) {
        console.log(resp);

        // Display tab orders
        displayTabOrders(resp);

        // Get drink Items
        getDrinkItems();
      },
      error: function(req, status, err) {
        console.log("Something went wrong: ", status, err);
      }
    });
  }

  // Get the current list of drink items
  function getDrinkItems() {
    console.log("getDrinkItems:entered!!!");
    $.ajax("/api/drinks", {
      type: "GET",
      success: function(resp) {
        console.log(resp);
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
        console.log("Something went wrong: ", status, err);
      }
    });
  }

  // Get the current list of food items
  function getFoodItems() {
    $.ajax("/api/food", {
      type: "GET",
      success: function(resp) {
        console.log(resp);
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
       console.log("Something went wrong: ", status, err);
      }
    });
  }

  // Function to update a tab
  function updateTab(tab) {
    
    var tabUpdate = {
      items_ordered : tab.items_ordered,
      sub_total : tab.sub_total,
      total: tab.total,
      updatedAt: new Date()
    };

    $.ajax("/api/updatetab/"+ tab.id, {
      type: "PUT",
      data: tabUpdate,
      success: function(resp) {
        console.log(resp);
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

  // Call back function when a drink button is clicked
  function drinkButtonClicked(event) {
    var totalPrice = 0;
    var drinkId = parseInt($(this).data("drink-id")) - 1;
    var drink = drinkItems[parseInt(drinkId)];
    var currentTab = posSystem.openTabs[posSystem.currentTabID-1];
    var mainDiv = $(".main-page-left");    

    // Display current tab orders
    console.log(mainDiv);
    $(mainDiv).empty();
    $(".main-item-detail" ).remove();
    displayTabOrders(currentTab);

    if (currentTab.items_ordered.length > 0)
    currentTab.items_ordered += ";";
      currentTab.items_ordered += (drink.drink_name + ":" + drink.price);
    currentTab.total += parseInt(drink.price);
    currentTab.sub_total = totalPrice;

    var itemDiv = $("<div class='main-item-detail cfix'>");
    var leftSpan = $("<span class='main-left-side'>");
    var rightSpan = $("<span class='main-right-side'>");
    $(leftSpan).text(drink.drink_name);
    $(rightSpan).text(drink.price);
    $(itemDiv).append(leftSpan);
    $(itemDiv).append(rightSpan);
    $(mainDiv).append(itemDiv);

    $("#tab-subTotal").text(currentTab.total);
    $("#tab-total").text(currentTab.total);
    $("#tab-balance-due").text(currentTab.total);

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
    var currentTab = posSystem.openTabs[posSystem.currentTabID-1];
    updateTab(currentTab);
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
