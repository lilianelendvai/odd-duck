'use strict';

// ******** GLOBAL VARIABLES **************
let votesCountDown = 10;
let allProducts = [];
let numberOfImages = 3;
let allImages = [];

// ********* DOM REFERENCES ****************
let productsImageContainer = document.getElementById('product-container');

for (let i = 0; i < numberOfImages; i++){
  allImages.push(document.getElementById(`img-${i}`));
}

let resultsBtn  = document.getElementById('results-btn');
// let productList = document.getElementById('list-of-products');

// ********* CONSTRUCTOR FUNCTION *************

function Product(name, imageExtension = 'jpg'){
  this.name = name;
  this.photo = `img/${name}.${imageExtension}`;
  this.views = 0;
  this.votes = 0;
  allProducts.push(this);
}

// ********* OBJECT CREATION ******************
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

// *********** HELPER FUNCTIONS ***************

function randomIndexGenerator(){
  let number = Math.floor(Math.random() * allProducts.length);
  if (number === allProducts.length) {
    number = allProducts.length-1;
  }
  return number;
}


let selectedProductHistoryQueue = [];

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
  } else {
    // ready for next vote
    renderImages();
  }
}

function handleClickOfViewResult(){
  resultsBtn.removeEventListener('click', handleClickOfViewResult);

  // Previous method to display result via an unordered list.
  // for(let i = 0; i < allProducts.length; i++){
  //   let liElem = document.createElement('li');
  //   liElem.textContent = `${allProducts[i].name}: views: ${allProducts[i].views}, votes: ${allProducts[i].votes}`;
  //   productList.appendChild(liElem);
  // }

  renderChart();

}

// To start the first vote.
renderImages();

// ********* EVENT LISTENERS *******************
resultsBtn.style.visibility = 'hidden';
productsImageContainer.addEventListener('click', handleClickOfImages);
