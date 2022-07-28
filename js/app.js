'use strict';

// ******** GLOBAL VARIABLES **************
let votesCountDown = 15;

let allProducts = [];
let numberOfImages = 3;
let allImages = [];
let selectedProductHistoryQueue = [];
let restoredFromLocalStorage = false;

// ********* DOM REFERENCES ****************
let productsImageContainer = document.getElementById('product-container');

for (let i = 0; i < numberOfImages; i++){
  allImages.push(document.getElementById(`img-${i}`));
}

let resultsBtn  = document.getElementById('results-btn');
let restartBtn  = document.getElementById('restart-btn');

// ********* LOCAL STORAGE SUPPORT ************
function storeToLocalStorage(){
  localStorage.setItem('allProducts',JSON.stringify(allProducts));
  localStorage.setItem('selectedProductHistoryQueue',JSON.stringify(selectedProductHistoryQueue));
  localStorage.setItem('votesCountDown',votesCountDown.toString());
}

function clearLocalStorage(){
  localStorage.removeItem('allProducts');
  localStorage.removeItem('selectedProductHistoryQueue');
  localStorage.removeItem('votesCountDown');
}

// ********* CONSTRUCTOR FUNCTION *************
function Product(name, imageExtension = 'jpg'){
  this.name = name;
  this.photo = `img/${name}.${imageExtension}`;
  this.views = 0;
  this.votes = 0;
  allProducts.push(this);
}

// ********* OBJECT CREATION or RECREATION ******************
let retreivedProducts = localStorage.getItem('allProducts');

if (retreivedProducts){
  restoredFromLocalStorage = true;
  let parsedProducts = JSON.parse(retreivedProducts);
  // we have saved information in the local storage
  for (let i = 0; i < parsedProducts.length; i++){
    let objectProduct = new Product(parsedProducts[i].name);
    objectProduct.photo = parsedProducts[i].photo;
    objectProduct.views = parsedProducts[i].views;
    objectProduct.votes = parsedProducts[i].votes;
  }
  votesCountDown = parseInt(localStorage.getItem('votesCountDown'));
  selectedProductHistoryQueue = JSON.parse(localStorage.getItem('selectedProductHistoryQueue'));

} else {
  new Product('bag');
  new Product('banana');
  new Product('bathroom');
  new Product('boots');
  new Product('breakfast');
  new Product('bubblegum');
  new Product('chair');
  new Product('cthulhu');
  new Product('dog-duck');
  new Product('dragon');
  new Product('pen');
  new Product('pet-sweep');
  new Product('scissors');
  new Product('shark');
  new Product('sweep','png');
  new Product('tauntaun');
  new Product('unicorn');
  new Product('water-can');
  new Product('wine-glass');
}

// *********** HELPER FUNCTIONS ***************

function randomIndexGenerator(){
  let number = Math.floor(Math.random() * allProducts.length);
  if (number === allProducts.length) {
    number = allProducts.length-1;
  }
  return number;
}

function renderImages(){
  for (let i = 0; i < numberOfImages; i++){
    let currentIndex = randomIndexGenerator();
    while(selectedProductHistoryQueue.includes(currentIndex)){
      currentIndex = randomIndexGenerator();
    }
    selectedProductHistoryQueue.push(currentIndex);
    let img = allImages[i];
    img.src = allProducts[currentIndex].photo;
    img.alt = allProducts[currentIndex].name;
    img.name = allProducts[currentIndex].name;
    allProducts[currentIndex].views++;
  }

  // Ensure only the last set of numbers are remembered for the next time we renderImages()
  while(selectedProductHistoryQueue.length > numberOfImages){
    selectedProductHistoryQueue.shift();
  }

  storeToLocalStorage();
}

let productsChartCanvas = document.getElementById('products-chart');

function renderChart(){
  let productNames = [];
  let productVotes = [];
  let productViews = [];

  // Prepare variables use in the chartSettings objects created below
  for(let i = 0; i < allProducts.length;i++){
    productNames.push(allProducts[i].name);
    productVotes.push(allProducts[i].votes);
    productViews.push(allProducts[i].views);
  }

  let chartSettings = {
    type: 'bar',
    data: {
      labels: productNames,
      datasets: [{
        label: '# of Votes',
        data: productVotes,
        backgroundColor: [
          '#ff7300'
        ],
        borderColor: [
          '#ff7300'
        ],
        borderWidth: 1
      },
      {
        label: '# of Views',
        data: productViews,
        backgroundColor: [
          '#ff0000'
        ],
        borderColor: [
          '#ff0000'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

  };

  // Constructor Call defined in the Chart.js library
  new Chart(productsChartCanvas,chartSettings);
}

// *********** EVENT HANDLERS  *****************

function handleClickOfImages(event){
  let imgClicked = event.target.name;
  for(let i=0; i < allProducts.length; i++){
    if(imgClicked === allProducts[i].name){
      allProducts[i].votes++;
      votesCountDown--;
      break;
    }
  }

  if(votesCountDown === 0){
    // No more votes can be done
    productsImageContainer.removeEventListener('click', handleClickOfImages);
    productsImageContainer.style.visibility = 'hidden';
    resultsBtn.addEventListener('click', handleClickOfViewResult);
    resultsBtn.style.visibility = 'visible';
    storeToLocalStorage(); // Just in case we want to display the final result
  } else {
    // ready for next vote
    renderImages();
  }
}

function handleClickOfViewResult(){
  resultsBtn.removeEventListener('click', handleClickOfViewResult);
  resultsBtn.style.visibility = 'hidden';

  restartBtn.addEventListener('click', handleClickOfRestart);
  restartBtn.style.visibility = 'visible';

  renderChart();
}

function handleClickOfRestart(){
  clearLocalStorage();
  location.reload(); // https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
}

// ********* SET EVENT LISTENERS / RESTORE PAGE STATE *******************
// We need to test on votesCountDown since we could have restored it from localstorage
if (restoredFromLocalStorage){
  if (votesCountDown > 0){
    // Still have votes to do.
    if (selectedProductHistoryQueue.length === 0){ //Did not vote yet
      renderImages();
    } else {
      //Redisplay the last rendered images
      for (let i = 0; i < numberOfImages; i++){
        let currentIndex = selectedProductHistoryQueue[i];
        let img = allImages[i];
        img.src = allProducts[currentIndex].photo;
        img.alt = allProducts[currentIndex].name;
        img.name = allProducts[currentIndex].name;
      }
    }

    resultsBtn.style.visibility = 'hidden';
    restartBtn.style.visibility = 'hidden';
    productsImageContainer.addEventListener('click', handleClickOfImages);

  } else {
    //Behave as if we clicked View Result and the image containers should not be visible
    productsImageContainer.style.visibility = 'hidden';
    handleClickOfViewResult();
  }

} else {
  resultsBtn.style.visibility = 'hidden';
  restartBtn.style.visibility = 'hidden';
  productsImageContainer.addEventListener('click', handleClickOfImages);
  renderImages();
}
