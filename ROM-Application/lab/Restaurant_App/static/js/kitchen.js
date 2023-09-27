function moveOrder(restaurantId, orderId, orderStatus) {
  console.log("Move order");  

  fetch('/move_order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ restaurant_id: restaurantId, order_id: orderId, order_status: orderStatus }),
  })
  .then(response => {
    if (response.ok) {
        location.reload(); // Refresh the page
    } else {
      // Handle error response
      console.error('Failed to move item.');
    }
  })
    .catch(error => {
      console.error('Error:', error);
    });
}


function loadMenuPage(restaurantId) {
  const url = `http://staff_menu:8004/staff/${restaurantId}/menu`;
  window.location.href = url;
}

function loadKitchenPage(restaurantId) {
  const url = `http://kitchen:8001/staff/${restaurantId}/kitchen`;
  window.location.href = url;
}

function loadChartPage(restaurantId) {
  const url = `http://charts:8002/staff/${restaurantId}/chart`;
  window.location.href = url;
}

function loadTokenPage(restaurantId) {
  const url = `http://auth:8003/staff/${restaurantId}/token`;
  window.location.href = url;
}


function loadLoginPage() {
  const url = `http://auth:8003/staff/login`;
  window.location.href = url;
}