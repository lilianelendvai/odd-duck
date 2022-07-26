'use strict';

// ******** GLOBAL VARIABLES **************
let votesCountDown = 5;
let allProducts = [];
let numberOfImages = 3;
let allImages = [];

// ********* DOM REFERENCES ****************
let productsImageContainer = document.getElementById('product-container');

for (let i = 0; i < numberOfImages; i++){
  allImages.push(document.getElementById(`img-${i}`));
}

let resultsBtn  = document.getElementById('results-btn');
let productList = document.getElementById('list-of-products');

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
  if (number === allProducts.length) {number = allProducts.length-1;}
  return number;
}

function renderImages(){
  // https://www.freecodecamp.org/news/how-to-use-javascript-collections-map-and-set/
  let indexes = new Set();

  for (let i = 0; i < numberOfImages; i++){
    let currentIndex = randomIndexGenerator();
    while(indexes.has(currentIndex)){
      currentIndex = randomIndexGenerator();
    }
    indexes.add(currentIndex);
    let img = allImages[i];
    img.src = allProducts[currentIndex].photo;
    img.alt = allProducts[currentIndex].name;
    img.name = allProducts[currentIndex].name;
    allProducts[currentIndex].views++;
  }

}

renderImages();

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

  renderImages();

  if(votesCountDown === 0){
    productsImageContainer.removeEventListener('click', handleClickOfImages);

    resultsBtn.addEventListener('click', handleClickOfViewResult);
    resultsBtn.style.visibility = 'visible';
  }
}

function handleClickOfViewResult(){
  for(let i = 0; i < allProducts.length; i++){
    let liElem = document.createElement('li');
    liElem.textContent = `${allProducts[i].name}: views: ${allProducts[i].views}, votes: ${allProducts[i].votes}`;
    productList.appendChild(liElem);
  }
  resultsBtn.removeEventListener('click', handleClickOfViewResult);
}

// ********* EVENT LISTENERS *******************
resultsBtn.style.visibility = 'hidden';
productsImageContainer.addEventListener('click', handleClickOfImages);

