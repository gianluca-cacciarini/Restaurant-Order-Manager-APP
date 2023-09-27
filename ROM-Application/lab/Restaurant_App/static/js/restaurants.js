  ////////////////////////////////////////////////////////////
  ////////////////////  EDIT POPUP    //////////////////////
  ////////////////////////////////////////////////////////////
function openEditPopup(itemName, restaurantId) {
    // Pass the restaurantId to the confirmEdit function
    document.getElementById('edit-popup').dataset.restaurantId = restaurantId;
    document.getElementById('edit-popup').dataset.itemName = itemName;
    
    // Get the item details from the DOM
    const itemButton = document.querySelector(`button[data-item-name="${itemName}"]`);
    const itemCard = itemButton.closest('.item-card');
    const itemPrice = itemCard.querySelector('.item-price').textContent.replace('€', '');
    const itemAllergens = itemCard.querySelector('.allergens').textContent.replace('Allergens: ', '');
    const itemCategory = itemCard.querySelector('.category').textContent.replace('Category: ', '');
    const itemDescription = itemCard.querySelector('.description').textContent.replace('Description: ', '');
    itemCard.querySelector('.item-name').textContent
  
    // Set the item details in the edit popup form
    document.getElementById('edit-item-name').value = itemName;
    document.getElementById('edit-item-price').value = itemPrice;
    document.getElementById('edit-item-allergens').value = itemAllergens;
    document.getElementById('edit-item-category').value = itemCategory;
    document.getElementById('edit-item-description').value = itemDescription;
  
    // Show the edit popup
    document.getElementById('edit-popup').style.display = 'block';
  }
  
  function cancelEdit() {
    // Hide the edit popup
    document.getElementById('edit-popup').style.display = 'none';
  }
  
  function confirmEdit() {
    // Retrieve the restaurantId from the edit popup dataset
    const restaurantId = document.getElementById('edit-popup').dataset.restaurantId;
    const itemName = document.getElementById('edit-popup').dataset.itemName;

    // Get the edited item details from the form
    const editedItemName = document.getElementById('edit-item-name').value;
    const editedItemPrice = document.getElementById('edit-item-price').value;
    const editedItemAllergens = document.getElementById('edit-item-allergens').value;
    const editedItemCategory = document.getElementById('edit-item-category').value;
    const editedItemDescription = document.getElementById('edit-item-description').value;
  
    // Perform AJAX request to update the item on the server
    fetch(`/${restaurantId}/items/${itemName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item_name: editedItemName,
        price: editedItemPrice,
        allergens: editedItemAllergens,
        category: editedItemCategory,
        item_description: editedItemDescription
      })
    })
      .then(response => {
        if (response.ok) {
            location.reload(); // Refresh the page
        } else {
          // Handle error response
          console.error('Failed to update item.');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
  }
    
    
  ////////////////////////////////////////////////////////////
  ////////////////////  DELETE POPUP    //////////////////////
  ////////////////////////////////////////////////////////////
  function openDeletePopup(deleteItemName, deleteRestaurantId) {
    // Pass the restaurantId to the confirmEdit function
    document.getElementById('delete-popup').dataset.deleteRestaurantId = deleteRestaurantId;
    document.getElementById('delete-popup').dataset.deleteItemName = deleteItemName;

    // Show the delete popup
    document.getElementById('delete-popup').style.display = 'block';
  }
  
  function cancelDelete() {
    // Hide the delete popup
    document.getElementById('delete-popup').style.display = 'none';
  }
  
  function confirmDelete() {
    // Retrieve the restaurantId from the edit popup dataset
    const deleteRestaurantId = document.getElementById('delete-popup').dataset.deleteRestaurantId;
    const deleteItemName = document.getElementById('delete-popup').dataset.deleteItemName;
  
    // Perform AJAX request to delete the item on the server
    // You can use your preferred method or framework for making AJAX requests
    // Here's an example using the Fetch API:
    fetch(`/${deleteRestaurantId}/items/${deleteItemName}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
            location.reload(); // Refresh the page
        } else {
          // Handle error response
          console.error('Failed to delete item.');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
  }


  ////////////////////////////////////////////////////////////
  ////////////////////  ADD POPUP    //////////////////////
  ////////////////////////////////////////////////////////////
function openAddPopup(restaurantId) {
    var addPopup = document.getElementById("add-popup");
    document.getElementById('add-popup').dataset.restaurantId = restaurantId;
    addPopup.style.display = "block";
  }
  
  // Function to close the add item popup
  function cancelAdd() {
    var addPopup = document.getElementById("add-popup");
    addPopup.style.display = "none";
  }
  
  // Function to handle the submit event of the add form
  function confirmAdd() {
    const restaurantId = document.getElementById('add-popup').dataset.restaurantId;
  
    // Collect the form data
    var itemName = document.getElementById("item-name").value;
    var itemDescription = document.getElementById("item-description").value;
    var itemPrice = document.getElementById("item-price").value;
    var itemAllergens = document.getElementById("item-allergens").value;
    var itemCategory = document.getElementById("item-category").value;
  
    // Create an object with the form data
    var formData = {
      restaurant_id: restaurantId,
      item_description: itemDescription,
      item_name: itemName,
      price: itemPrice,
      allergens: itemAllergens,
      category: itemCategory
    };
  
    // Make an AJAX request to the backend
    fetch(`/${restaurantId}/items/add`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            location.reload(); // Refresh the page
        } else {
          // Handle error response
          console.error('Failed to add item.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle any errors that occur during the AJAX request
      });
  }

  function loadStaffMenu(restaurantId) {
    const url = `http://webpage:8002/${restaurantId}`;
    window.location.href = url;
  }
  

function loadStaffPage() {
  const url = `http://auth:8003/staff/login`;
  window.location.href = url;
}
  
  
  
  