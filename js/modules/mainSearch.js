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
const searchFilter = document.querySelector('.filters');
const advancedSearchField = new AdvancedSearchField();

const deviceAdvancedSearch = advancedSearchField.createAdvancedSearchField('Ustensils');
searchFilter.insertAdjacentHTML('afterbegin', deviceAdvancedSearch);

const applianceAdvancedSearch = advancedSearchField.createAdvancedSearchField('Appliance');
searchFilter.insertAdjacentHTML('afterbegin', applianceAdvancedSearch);

const ingredientsAdvancedSearch = advancedSearchField.createAdvancedSearchField('Ingredients');
searchFilter.insertAdjacentHTML('afterbegin', ingredientsAdvancedSearch);

//Listen main input
const searchInput = document.querySelector('.input');
searchInput.addEventListener('input', (e) => {
	const textInput = e.target.value.toLowerCase().replace(/\s+/g, '');
	if (textInput.length >= 3) {
		displayDataByserInput(textInput);
	} else {
		displayRecipes(recipes);
		displayIngredients(recipes, '');
	}
});

//Display data using user input
const displayDataByserInput = (input) => {
	//tableau contenant toutes les recettes ayant la chaine de caractères contenue dans l'input
	const recipesWithTheWord = [];
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
			recipesWithTheWord.push(recipes[i]);
		}
		resultSection.innerHTML = displayRecipes(recipesWithTheWord);
		displayIngredients(recipesWithTheWord, '');
	}
	if (recipesWithTheWord.length == 0) {
		resultSection.innerHTML = '<p>Désolé, aucune recette ne correspond à votre recherche</p>';
	}
};

// Display ingredients for advanced search
function displayIngredients(arr, string) {
	const arrayOfrecipes = arr.flatMap((element) => element.ingredients);
	const arrayOfIngredients = arrayOfrecipes.flatMap((element) => element.ingredient);
	const listIngredient = document.querySelector('.filters__list');
	if (string !== '') {
		//si l'input existe on récupères les ingrédients qui possèdent le string et on les affiche
		const arrayOfIngredient = arrayOfIngredients.filter((element) => {
			const elementNormalized = normalizeString(element);
			return elementNormalized.includes(string);
		});
		const ingredientsResult = removeDuplicate(arrayOfIngredient);
		const resultDisplay = ingredientsResult.map((element) => `<li class='filters__list__element  --Ingredients'>${element}</li>`).join('');
		if (resultDisplay.length > 0) {
			listIngredient.innerHTML = resultDisplay;
			const result = document.querySelectorAll('.filters__list__element.--Ingredients');
			selectIngredientTag(result);
		} else {
			listIngredient.innerHTML = `<li class='filters__list__element__error --Ingredients'>Pas de résultats</li>`;
		}
	} else {
		//sinon l'input on affiche les ingrédients sans prendre en compte le string
		const arrayOfIngredient = arrayOfIngredients.map((element) => element);
		const ingredientsResult = removeDuplicate(arrayOfIngredient);
		const resultDisplay = ingredientsResult.map((element) => `<li class='filters__list__element  --Ingredients'>${element}</li>`).join('');

		const listIngredient = document.querySelector('.filters__list.--Ingredients');
		listIngredient.innerHTML = resultDisplay;
		const result = document.querySelectorAll('.filters__list__element.--Ingredients');
		selectIngredientTag(result);
	}
}
displayIngredients(recipes, '');

//Tag ingredients
function selectIngredientTag(arr) {
	for (const element of arr) {
		// au click sur un ingredient de la recherche avancée, ajoute un tag avec cet ingredient
		element.addEventListener('click', () => {
			const tagSection = document.querySelector('.tags');
			const tag = document.createElement('span');
			tag.classList = 'tags__element --Ingredients';
			tag.innerHTML = element.innerHTML;
			tag.insertAdjacentHTML('beforeend', '<i id="close" class="far fa-times-circle"></i>');
			tagSection.insertAdjacentElement('afterbegin', tag);
			const closeButton = document.getElementById('close');
			closeButton.addEventListener('click', () => {
				tag.remove();
			});
		});
	}
}

/// /LISTEN TO THE INGREDIENT ADVANCED SEARCH INPUT/////
const searchInputIngredient = document.querySelector('#IngredientsInput');
searchInputIngredient.addEventListener('input', (e) => {
	const input = e.target.value;
	const inputNormalized = normalizeString(input);
	displayIngredients(recipes, inputNormalized);
});

const articleIngredient = document.querySelector('.filters__search');
/// /LISTEN TO THE INGREDIENT ADVANCED SEARCH BUTTON CLICK/////
const filterElementIngredient = document.querySelector('.filters__search.--Ingredients');

filterElementIngredient.addEventListener('click', () => {
	const listIngr = document.querySelectorAll('.filters__list__element.--Ingredients');
	if (listIngr.length > 0) {
		articleIngredient.classList.toggle('larger');
		filterElementIngredient.classList.toggle('open');
		searchInputIngredient.value = '';
		searchInputIngredient.focus();
		displayIngredients(recipes, '');
	}
});

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

const normalizeString = (string) => {
	return string.toLocaleLowerCase().replace(/\s+/g, '');
};
