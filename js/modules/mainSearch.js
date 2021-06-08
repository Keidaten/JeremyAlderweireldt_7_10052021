import { recipes } from './recipes.js';
import { displayRecipes } from './displayRecipes.js';

//Class advanced search
class AdvancedSearchField {
	constructor() {
		this.createAdvancedSearchField = function (string) {
			return `
		<div class="fitler${string}">
		  <div class="filters__search --${string}">
			  <span class="filters__label" id="currentFilter"
				>${string}</span
			  >
			  <input
				id="${string}Input"
				type="text"
				class="filters__input --${string}"
				placeholder="${string}"
			  />
			  <div class="arrow"></div>
			</div>
			<ul
			id="list${string}"
			  class="filters__list --${string}"
			></ul>
			</div>`;
		};
	}
}

// Create advanced search
const displayElements = () => {
	const resultSection = document.querySelector('.result');
	const form = document.querySelector('#form');
	const searchFilter = document.querySelector('.filters');
	/// DISPLAY SEARCH BUTTON///
	const advancedSearchField = new AdvancedSearchField();

	const deviceAdvancedSearch = advancedSearchField.createAdvancedSearchField('Ustensils');
	searchFilter.insertAdjacentHTML('afterbegin', deviceAdvancedSearch);

	const applianceAdvancedSearch = advancedSearchField.createAdvancedSearchField('Appliance');
	searchFilter.insertAdjacentHTML('afterbegin', applianceAdvancedSearch);

	const ingredientsAdvancedSearch = advancedSearchField.createAdvancedSearchField('Ingredients');
	searchFilter.insertAdjacentHTML('afterbegin', ingredientsAdvancedSearch);

	// Display all recipes
	resultSection.innerHTML = displayRecipes(recipes);
	form.reset();
};
displayElements();

//Listen main input
// const advancedSearchTagsSelected = [];

const searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('input', (e) => {
	const textInput = e.target.value.toLowerCase().replace(/\s+/g, '');
	if (textInput.length >= 3) {
		displayDataByserInput(textInput);
	} else {
		displayRecipes(recipes);
		// displayIngredients(recipes, '');
	}
});

//Filter by tags
// const searchAdvanced = () => {
// 	const searchTags = document.querySelector('.tags');
// 	console.log(searchTags);
// 	searchInput.addEventListener('input', (e) => {
// 		const textInput = e.target.value.toLowerCase().replace(/\s+/g, '');
// 		if (textInput.length >= 3) {
// 			displayDataByserInput(textInput);
// 		} else {
// 			displayRecipes(recipes);
// 			displayIngredients(recipes, '');
// 		}
// 	});
// };

let IngredientsToDisplay;
let ApplianceToDisplay;
let UstensilsToDisplay;

//Display data using user input
const displayDataByserInput = (input) => {
	const recipesToDisplay = [];
	//tableau contenant toutes les recettes ayant la chaine de caractères contenue dans l'input
	//Boucle sur les recettes
	const resultSection = document.querySelector('.result');
	for (let i = 0; i < recipes.length; i++) {
		const name = normalizeString(recipes[i].name);
		const description = normalizeString(recipes[i].description);
		const recipeIngredients = [];
		//Boucle sur les ingredients de la recette
		for (let y = 0; y < recipes[i].ingredients.length; y++) {
			recipeIngredients.push(recipes[i].ingredients[y].ingredient.toLocaleLowerCase());
		}
		if (name.includes(input) || description.includes(input) || normalizeString(recipeIngredients.toString()).includes(input)) {
			recipesToDisplay.push(recipes[i]);
		}
		resultSection.innerHTML = displayRecipes(recipesToDisplay);
		IngredientsToDisplay = recipesToDisplay.flatMap((element) => element.ingredients);
		displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', '', 'Ingredients');
		ApplianceToDisplay = recipesToDisplay;
		displayAdvancedSearchListOfElement(ApplianceToDisplay, 'appliance', '', 'Appliance');
		UstensilsToDisplay = recipesToDisplay;
		displayAdvancedSearchListOfElement(UstensilsToDisplay, 'ustensils', '', 'Ustensils');
	}
	if (recipesToDisplay.length == 0) {
		resultSection.innerHTML = '<p>Désolé, aucune recette ne correspond à votre recherche</p>';
	}
};

//Tag ingredients selection
function selectIngredientTag(arr) {
	for (const element of arr) {
		// au click sur un ingredient de la recherche avancée, ajoute un tag avec cet ingredient
		element.addEventListener('click', () => {
			const tagSection = document.querySelector('.tags');
			const tag = document.createElement('span');
			tag.classList = 'tags__element --Ingredients';
			tag.innerHTML = element.innerHTML;
			// console.log(tag.innerHTML);
			tag.insertAdjacentHTML('beforeend', '<i id="close" class="far fa-times-circle"></i>');
			tagSection.insertAdjacentElement('afterbegin', tag);
			const closeButton = document.getElementById('close');
			closeButton.addEventListener('click', () => {
				tag.remove();
			});
			advancedSearchTagsSelected.push(tag.innerText);
			console.log(advancedSearchTagsSelected);
		});
	}
}

function displayAdvancedSearchListOfElement(arr, type, input, name) {
	//tableau des éléments de liste
	const arrayOfElements = arr.flatMap((element) => element[type]);
	if (input !== '') {
		//si l'input existe, on filtre les éléments et on ne retourne que ceux contenant l'input
		const arrayOfElementsFiltered = arrayOfElements.filter((element) => {
			const elementNormalized = normalizeString(element);
			return elementNormalized.includes(input);
		});
		const elementReturnedWithoutDuplicate = removeDuplicate(arrayOfElementsFiltered);
		const resultDisplayed = elementReturnedWithoutDuplicate.map((element) => `<li class='filters__list__item  --${name}'>${element}</li>`).join('');
		if (resultDisplayed.length > 0) {
			const elementList = document.querySelector(`.filters__list.--${name}`);
			elementList.innerHTML = resultDisplayed;
		} else {
			const elementList = document.querySelector(`.filters__list.--${name}`);
			elementList.innerHTML = `<li class="filters__list__item__error --${name}">
              Pas de résultats
            </li>`;
		}
	} else {
		arrayOfElements.map((element) => element);
		const elementReturnedWithoutDuplicate = removeDuplicate(arrayOfElements);
		const resultDisplayed = elementReturnedWithoutDuplicate.map((element) => `<li class='filters__list__item  --${name}'>${element}</li>`).join('');
		const elementList = document.querySelector(`.filters__list.--${name}`);
		elementList.innerHTML = resultDisplayed;
	}
}

IngredientsToDisplay = recipes.flatMap((element) => element.ingredients);
displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', '', 'Ingredients');
displayAdvancedSearchListOfElement(recipes, 'appliance', '', 'Appliance');
displayAdvancedSearchListOfElement(recipes, 'ustensils', '', 'Ustensils');

// Listen ingredient input
const searchInputIngredient = document.querySelector('#IngredientsInput');
searchInputIngredient.addEventListener('input', (e) => {
	const input = e.target.value;
	console.log(input);
	const inputNormalized = normalizeString(input);
	displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', inputNormalized, 'Ingredients');
});

// Listen appliance input
const searchInputAppliance = document.querySelector('#ApplianceInput');
searchInputAppliance.addEventListener('input', (e) => {
	const input = e.target.value;
	console.log(input);
	const inputNormalized = normalizeString(input);
	displayAdvancedSearchListOfElement(recipes, 'appliance', inputNormalized, 'Appliance');
});

// Listen unstensils input
const searchInputDevice = document.querySelector('#UstensilsInput');
searchInputDevice.addEventListener('input', (e) => {
	const input = e.target.value;
	const inputNormalized = normalizeString(input);
	displayAdvancedSearchListOfElement(recipes, 'ustensils', inputNormalized, 'Ustensils');
});

// const articleIngredient = document.querySelector('.filters__search');
// // Listen ingredient input click
// const filterElementIngredient = document.querySelector('.filters__search.--Ingredients');
// filterElementIngredient.addEventListener('click', () => {
// 	const listIngr = document.querySelectorAll('.filters__list__element.--Ingredients');
// 	if (listIngr.length > 0) {
// 		articleIngredient.classList.toggle('larger');
// 		filterElementIngredient.classList.toggle('open');
// 		searchInputIngredient.value = '';
// 		searchInputIngredient.focus();
// 		displayIngredients(recipes, '');
// 	}
// });

// console.log(document.querySelectorAll('.recipe__time'));

//Remove doublon
function removeDuplicate(array) {
	const duplicateElements = [];
	const noDuplicate = array.filter((element) => {
		if (element in duplicateElements) {
			return false;
		}
		duplicateElements[element] = true;
		return true;
	});
	return noDuplicate;
}
//Normalize string
const normalizeString = (string) => {
	return string.toLocaleLowerCase().replace(/\s+/g, '');
};
