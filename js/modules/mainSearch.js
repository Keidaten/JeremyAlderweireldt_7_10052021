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
const advancedSearchTagsSelected = [];

const searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('input', (e) => {
	const textInput = e.target.value.toLowerCase().replace(/\s+/g, '');
	if (textInput.length >= 3) {
		displayDataByserInput(textInput);
	} else {
		displayRecipes(recipes);
		displayIngredients(recipes, '');
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
		displayIngredients(recipesToDisplay, '');
		displayAppliances(recipesToDisplay, '');
	}
	if (recipesToDisplay.length == 0) {
		resultSection.innerHTML = '<p>Désolé, aucune recette ne correspond à votre recherche</p>';
	}
};
// console.log(sessionStorage.getItem('myCat'));

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

// Display appliances for advanced search
function displayAppliances(arr, string) {
	const arrayOfAppliances = arr.flatMap((element) => element.appliance);
	// console.log(arrayOfAppliances);
	if (string !== '') {
		const arrayOfAppliancesFiltered = arrayOfAppliances.filter((element) => {
			const elementNormalized = normalizeString(element);
			return elementNormalized.includes(string);
		});
		const applianceSearchResultWithoutDuplicate = removeDuplicate(arrayOfAppliancesFiltered);
		const resultDisplayed = applianceSearchResultWithoutDuplicate.map((element) => `<li class='search__filter__list__item  --Appliance'>${element}</li>`).join('');
		if (resultDisplayed.length > 0) {
			const listAppliance = document.querySelector('.filters__list.--Appliance');
			listAppliance.innerHTML = resultDisplayed;
			const result = document.querySelectorAll('.filters__list__item.--Appliance');
			selectIngredientTag(result);
		} else {
			const listAppliance = document.querySelector('.filters__list.--Appliance');
			listAppliance.innerHTML = `<li class="filters__list__item__error --Appliance">
				Pas de résultats
			  </li>`;
		}
	} else {
		arrayOfAppliances.map((element) => element);
		const applianceSearchResultWithoutDuplicate = removeDuplicate(arrayOfAppliances);
		const resultDisplayed = applianceSearchResultWithoutDuplicate.map((element) => `<li class='search__filter__list__item  --Appliance'>${element}</li>`).join('');

		// console.log(resultDisplayed);
		const listAppliance = document.querySelector('.filters__list.--Appliance');
		// console.log(listAppliance);
		listAppliance.innerHTML = resultDisplayed;
		const result = document.querySelectorAll('.search__filter__list__item.--Appliance');
		selectIngredientTag(result);
	}
}
displayAppliances(recipes, '');

// Display ustensils for advanced search
function displayUstensils(arr, string) {
	const arrayOfUstensils = arr.flatMap((element) => element.ustensils);
	console.log(arrayOfUstensils);
	if (string !== '') {
		const arrayOfUstensilsFiltered = arrayOfUstensils.filter((element) => {
			const elementNormalized = normalizeString(element);
			return elementNormalized.includes(string);
		});
		const ustensilSearchResultWithoutDuplicate = removeDuplicate(arrayOfUstensilsFiltered);
		const resultDisplayed = ustensilSearchResultWithoutDuplicate.map((element) => `<li class='filters__list__item  --Ustensils'>${element}</li>`).join('');
		if (resultDisplayed.length > 0) {
			const listDevice = document.querySelector('.filters__list.--Ustensils');
			listDevice.innerHTML = resultDisplayed;
			const result = document.querySelectorAll('.filters__list__item.--Ustensils');
			selectIngredientTag(result);
		} else {
			const listDevice = document.querySelector('.filters__list.--Ustensils');
			listDevice.innerHTML = `<li class="filters__list__item__error --Ustensils">
				Pas de résultats
			  </li>`;
		}
	} else {
		arrayOfUstensils.map((element) => element);
		const ustensilSearchResultWithoutDuplicate = removeDuplicate(arrayOfUstensils);
		const resultDisplayed = ustensilSearchResultWithoutDuplicate.map((element) => `<li class='filters__list__item  --Ustensils'>${element}</li>`).join('');

		const listDevice = document.querySelector('.filters__list.--Ustensils');
		listDevice.innerHTML = resultDisplayed;
		const result = document.querySelectorAll('.filters__list__item.--Ustensils');
		selectIngredientTag(result);
	}
}
displayUstensils(recipes, '');

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
const mainInput = document.querySelector('#searchInput');
// const searchInput = document.querySelector('.input');
// searchInput.value = 'hello';
// mainInput.value = 'hello';

// Listen ingredient input
const searchInputIngredient = document.querySelector('#IngredientsInput');
searchInputIngredient.addEventListener('input', (e) => {
	const input = e.target.value;
	console.log(input);
	const inputNormalized = normalizeString(input);
	displayIngredients(recipes, inputNormalized);
});

// Listen appliance input
const searchInputAppliance = document.querySelector('#ApplianceInput');
searchInputAppliance.addEventListener('input', (e) => {
	const input = e.target.value;
	console.log(input);
	const inputNormalized = normalizeString(input);
	displayAppliances(recipes, inputNormalized);
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

// console.log(recipesCurrentlyDisplayed[0].children[2].innerText);

// recipesCurrentlyDisplayed.forEach((element) => {
// 	const ustensils = element.children[5].innerText;
// 	const ingredients = element.children[2].innerText;
// 	if element
// });

const searchByTag = (tag) => {
	for (let i = 0; i < recipesCurrentlyDisplayed.length; i++) {
		// const tag = document.querySelectorAll('.tags__element');
		if (recipesCurrentlyDisplayed[i].children[2].innerText.includes(tag)) {
			console.log('coucou');
		}
	}
};
