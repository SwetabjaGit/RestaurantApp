let restaurantsList = [];
let likedRestaurants = [];

let restaurantsGrid = document.querySelector(".restaurants-grid");
let dropdowns = document.querySelectorAll('.restaurants-wrapper .dropdown-toggler');
let icon = document.querySelector('ion-icon');
let searchBar = document.querySelector(".search-box");
let sortbyRelevance = document.getElementById("relevance");
let sortbyAverageCost = document.getElementById("average-cost");
let sortbyDeliveryTime = document.getElementById("delivery-time");
let sortbyRating = document.getElementById("rating");
let filterAmerican = document.getElementById("american");
let filterMexican = document.getElementById("mexican");
let filterAsian = document.getElementById("asian");
let filterPizza = document.getElementById("pizza");


searchBar.addEventListener("keyup", (event) => {
  handleSearchChange(event.target.value);
});


let fetchdataFromAPI = () => {
  return new Promise(resolve => {
    fetch('https://60cff6e64a030f0017f6840b.mockapi.io/api/restaurants')
      .then(response => response.json())
      .then(json => resolve(json))
  });
}

fetchdataFromAPI().then(data => {
  console.log('Fetching Restaurants');
  restaurantsList = data.restaurants;
  // Add a liked field to eac restaurant
  restaurantsList.forEach(item => {
    item.liked = false;
  })
  console.log('restaurantsList', restaurantsList);
  showRestaurants(data.restaurants);
  // Store Restaurants in LocalStorage
  let getLocalStorage = localStorage.getItem("All_Restaurants");
  // if(getLocalStorage === null) {
  //   listArr = [];
  // } else {
  //   listArr = JSON.parse(getLocalStorage);
  // }
  // listArr.push(userData);
  localStorage.setItem("All_Restaurants", JSON.stringify(restaurantsList));
});



// Add the like icons to the cards
setTimeout(() => {
  restaurantsList.forEach((item, i) => {
    addLikeIcon(`likeicon_${i}`);
  });
}, 1500);

// Debouncing
const handleSearchChange = _.debounce((data) => {
  console.log(data);
  const lowercaseData = data.toLowerCase();
  showRestaurants(restaurantsList.filter(item => {
    return Object.keys(item).some(key =>
      typeof item[key] === "string" && item[key].toLowerCase().includes(lowercaseData)
    )
  }));
}, 700);


function addLikeIcon(element) {
  document.getElementById(element).onclick = function(){
    this.classList.toggle('active');
  }
}

function markFavourite(index) {
  let restaurant = restaurantsList[index];
  if(!restaurant.liked){
    console.log('Liked', index);
    restaurant.liked = true;
    likedRestaurants.push(restaurantsList[index]);
  } else {
    console.log('UnLiked', index);
    restaurant.liked = false;
    likedRestaurants = likedRestaurants.filter(item => item.id === restaurantsList[index].id);
    console.log(likedRestaurants);
  }
  localStorage.setItem("Liked_Restaurants", JSON.stringify(likedRestaurants));
}

function showRestaurants(restaurants) {
  let restaurantsHTMLStr = '';
  restaurants.forEach((item, index) => {
    restaurantsHTMLStr += `
    <div id="card" class="card">
      <div class="card-image">
        <img src="${item.photograph}" alt="" />
      </div>

      <div class="card-content">
        <header class="card-header">
          <div class="name">${item.name}</span>
          <div class="address">
            <i class="location-icon fas fa-map-marker-alt"></i>
            ${item.address}
          </div>
          <div class="price">Cusine: ${item.cuisine_type}</div>
        </header>

        <ul class="card-stats">
          <li>
            <i class="stats-icon fas fa-comment"></i>
            <div class="count">346</div>
            <div class="text">Reviews</div>
          </li>
          <li>
            <i class="stats-icon fas fa-camera"></i>
            <div class="count">165</div >
            <div class="text">Photos</div>
          </li>
          <li>
            <i class="stats-icon fas fa-utensils"></i>
            <div class="count">205</div >
            <div class="text">Dishes</div>
          </li>
          <li>
            <div class="large-font text-center" onclick="markFavourite(${index})">
              <ion-icon name="heart" id="likeicon_${index}">
                <div class="red-bg"></div>
              </ion-icon>
            </div>
            <div class="count">205</div>
            <div class="text">Likes</div>
          </li>
        </ul>
      </div>
    </div>`;
  });
  restaurantsGrid.innerHTML = restaurantsHTMLStr; 
}


const sortRestaurants = (keyword) => {
  console.log('Sorting by', keyword);
}

const filterRestaurants = (keyword) => {
  showRestaurants(restaurantsList.filter(
    item => item.cuisine_type === keyword
  ));
}


let dropdownIsOpen = false

// Handle dropdown menues
if (dropdowns.length) {
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener('click', (event) => {
      let target = document.querySelector('#' + event.target.dataset.dropdown)
      if (target) {
        if (target.classList.contains('show')) {
          target.classList.remove('show');
          dropdownIsOpen = false;
        } else {
          target.classList.add('show');
          dropdownIsOpen = true;
        }
      }
    })
  })
};

// Handle closing dropdowns if a user clicked the body
window.addEventListener('mouseup', (event) => {
  if (dropdownIsOpen) {
    dropdowns.forEach((dropdownButton) => {
      let dropdown = document.querySelector('#' + dropdownButton.dataset.dropdown)
      let targetIsDropdown = dropdown == event.target

      if (dropdownButton == event.target) {
        return;
      }

      if ((!targetIsDropdown) && (!dropdown.contains(event.target))) {
        dropdown.classList.remove('show')
      }
    })
  }
});

// Handle Dropdown Item Clicks (Event Bubbbling)
document.querySelector(".ops-container").addEventListener('click', (event) => {
  if(event.target === sortbyRelevance){
    sortRestaurants(event.target.id);
  }
  else if(event.target === sortbyAverageCost){
    sortRestaurants(event.target.id);
  }
  else if(event.target === sortbyDeliveryTime){
    sortRestaurants(event.target.id);
  }
  else if(event.target === sortbyRating){
    sortRestaurants(event.target.id);
  }
  else if(event.target === filterAmerican){
    console.log(event.target.id);
    filterRestaurants("American");
  }
  else if(event.target === filterMexican){
    console.log(event.target.id);
    filterRestaurants("Mexican");
  }
  else if(event.target === filterAsian){
    console.log(event.target.id);
    filterRestaurants("Asian");
  }
  else if(event.target === filterPizza){
    console.log(event.target.id);
    filterRestaurants("Pizza");
  }
});