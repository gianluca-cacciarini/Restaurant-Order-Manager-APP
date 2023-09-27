var imgbase64;  
 
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
    const form = document.getElementById('edit-form');
    const formData = new FormData(form);
    const restaurantId = document.getElementById('edit-popup').dataset.restaurantId;
    const itemName = document.getElementById('edit-popup').dataset.itemName;
    //const imageFile = document.getElementById('edit-item-image').files[0];
	const imageFile = imgbase64;

    // Append the previous parameters to the FormData object
    formData.append('edit-item-name', document.getElementById('edit-item-name').value);
    formData.append('edit-item-price', document.getElementById('edit-item-price').value);
    formData.append('edit-item-allergens', document.getElementById('edit-item-allergens').value);
    formData.append('edit-item-category', document.getElementById('edit-item-category').value);
    formData.append('edit-item-description', document.getElementById('edit-item-description').value);
  
    // Append the image file to the FormData object
    formData.append('edit-item-image', imageFile);
  
    fetch(`/${restaurantId}/items/${itemName}`, {
      method: 'PUT',
      body: formData
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

    const form = document.getElementById('add-form');
    const formData = new FormData(form);
    //const imageFile = document.getElementById('item-image').files[0];
	const imageFile = imgbase64;
	//const imageFile = "ciao";
	//console.log("------------------------------------");
	//console.log(imageFile);
	//console.log("------------------------------------");
  
    // Append the previous parameters to the FormData object
    formData.append('item-name', document.getElementById('item-name').value);
    formData.append('item-price', document.getElementById('item-price').value);
    formData.append('item-allergens', document.getElementById('item-allergens').value);
    formData.append('item-category', document.getElementById('item-category').value);
    formData.append('item-description', document.getElementById('item-description').value);
  
    // Append the image file to the FormData object
    formData.append('item-image', imageFile);
  

    fetch(`/${restaurantId}/items/add`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Accept': 'application/json' // Set the Accept header to indicate the expected response format
      }
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
        console.error('An error occurred:', error);
      });
}

function convertImageToBase64(imgUrl, callback) {
	const image = new Image();
	image.crossOrigin='anonymous';
	image.onload = () => {
	  	const canvas = document.createElement('canvas');
	  	const ctx = canvas.getContext('2d');
	  	canvas.height = image.naturalHeight;
	  	canvas.width = image.naturalWidth;
	  	ctx.drawImage(image, 0, 0); 
	  	const dataUrl = canvas.toDataURL();
		imgbase64 = dataUrl;
	  	callback && callback(dataUrl);
	}
	image.src = imgUrl;
}

var loadImage = function(event){
	var img = document.getElementById('output_image');
	//console.log(event.target.files[0]);
	img.src = URL.createObjectURL(event.target.files[0]);
	//console.log("url: "+img.src);
	//console.log(event);
	convertImageToBase64(img.src, console.log);
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