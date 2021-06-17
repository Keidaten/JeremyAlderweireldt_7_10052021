import { recipes } from './recipes.js';
import { displayRecipes } from './displayRecipes.js';

///////////////////
//Class advanced search
/////////////////
class AdvancedSearchField {
	constructor() {
		this.createAdvancedSearchField = function (string) {
			const placeholder = 'Rechercher un ' + normalizeString(string).slice(0, -1);
			return `
		<div class="fitler${string}">
		  <div class="filters__search --${string}">
			  <span class="filters__label"
				>${string}</span
			  >
			  <input
				id="${string}Input"
				type="text"
				class="filters__input --${string}"
				placeholder="${placeholder}"
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

///////////////////
//Remove doublons
/////////////////
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
///////////////////
//Normalize string
/////////////////
const normalizeString = (string) => {
	return string.toLocaleLowerCase().replace(/\s+/g, '');
};

///////////////////
//Create advanced search
/////////////////
const displayElements = () => {
	const resultSection = document.querySelector('.result');
	const searchFilter = document.querySelector('.filters');
	// Display advanced search elemnts
	const advancedSearchField = new AdvancedSearchField();

	const ustensilAdvancedSearch = advancedSearchField.createAdvancedSearchField('Ustenciles');
	searchFilter.insertAdjacentHTML('afterbegin', ustensilAdvancedSearch);

	const applianceAdvancedSearch = advancedSearchField.createAdvancedSearchField('Appareils');
	searchFilter.insertAdjacentHTML('afterbegin', applianceAdvancedSearch);

	const ingredientsAdvancedSearch = advancedSearchField.createAdvancedSearchField('Ingredients');
	searchFilter.insertAdjacentHTML('afterbegin', ingredientsAdvancedSearch);

	// Display all recipes
	resultSection.innerHTML = displayRecipes(recipes);
};
displayElements();

///////////////////
//Listen main input
/////////////////
const searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('input', (e) => {
	const textInput = e.target.value.toLowerCase().replace(/\s+/g, '');
	if (textInput.length >= 3) {
		//currentSearch prend la valeur des résultats de la recherche principale
		currentSearch = displayDataByserInput(recipes, textInput);
		resultSection.innerHTML = displayRecipes(currentSearch);
		if (currentSearch.length == 0) {
			resultSection.innerHTML = `<p>Désolé, aucune recette ne correspond à votre recherche</p>`;
		} else {
			//les variables des recherches avancées s'actualisent en s'appuyant sur currentSearch
			//ces variables sont réutilisées pour l'affichage des listes de recherche avancée
			IngredientsToDisplay = currentSearch.flatMap((element) => element.ingredients);
			displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', '', 'Ingredients');

			ApplianceToDisplay = currentSearch;
			displayAdvancedSearchListOfElement(ApplianceToDisplay, 'appliance', '', 'Appareils');

			UstensilsToDisplay = currentSearch;
			displayAdvancedSearchListOfElement(UstensilsToDisplay, 'ustensils', '', 'Ustenciles');
		}
	} else {
		resultSection.innerHTML = displayRecipes(recipes);
	}
});

const resultSection = document.querySelector('.result');

let currentSearch;
let IngredientsToDisplay;
let ApplianceToDisplay;
let UstensilsToDisplay;
let arrayOfIngredientsTags = [];
let arrayOfAppliancesTags = [];
let arrayOfUstensilsTags = [];

const displayDataByserInput = (arr, input) => {
	const recipesToDisplay = [];
	//tableau contenant toutes les recettes ayant la chaine de caractères contenue dans l'input
	//Boucle sur les recettes
	for (let i = 0; i < arr.length; i++) {
		const name = normalizeString(arr[i].name);
		const description = normalizeString(arr[i].description);
		const recipeIngredients = [];
		//Boucle sur les ingredients de la recette
		for (let y = 0; y < arr[i].ingredients.length; y++) {
			recipeIngredients.push(arr[i].ingredients[y].ingredient.toLocaleLowerCase());
		}
		if (name.includes(input) || description.includes(input) || normalizeString(recipeIngredients.toString()).includes(input)) {
			recipesToDisplay.push(arr[i]);
		}
	}
	return recipesToDisplay;
};

currentSearch = displayDataByserInput(recipes, '');

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

const displayAdvancedSearchListOfElements = () => {
	IngredientsToDisplay = recipes.flatMap((element) => element.ingredients);
	displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', '', 'Ingredients');
	ApplianceToDisplay = recipes;
	displayAdvancedSearchListOfElement(ApplianceToDisplay, 'appliance', '', 'Appareils');
	UstensilsToDisplay = recipes;
	displayAdvancedSearchListOfElement(UstensilsToDisplay, 'ustensils', '', 'Ustenciles');
};

///////////////////
// Listen ingredient input
/////////////////
const ingredientSearchInput = document.querySelector('#IngredientsInput');
ingredientSearchInput.addEventListener('input', (e) => {
	const input = e.target.value;
	// console.log(input);
	const normalizedInput = normalizeString(input);
	displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', normalizedInput, 'Ingredients');
});

///////////////////
// Listen appliance input
/////////////////
const applianceSearchInput = document.querySelector('#AppareilsInput');
applianceSearchInput.addEventListener('input', (e) => {
	const input = e.target.value;
	// console.log(input);
	const normalizedInput = normalizeString(input);
	displayAdvancedSearchListOfElement(ApplianceToDisplay, 'appliance', normalizedInput, 'Appareils');
});

///////////////////
// Listen ustensil input
/////////////////
const ustensilSearchInput = document.querySelector('#UstencilesInput');
ustensilSearchInput.addEventListener('input', (e) => {
	const input = e.target.value;
	const normalizedInput = normalizeString(input);
	displayAdvancedSearchListOfElement(UstensilsToDisplay, 'ustensils', normalizedInput, 'Ustenciles');
});

///////////////////
// Tags gestion
/////////////////
///////////////////
// Ingredients observer
/////////////////
const IngredientList = document.querySelector(`.filters__list.--Ingredients`);

//function appelée à chaque modifiction de IngredientList
const ingredientsListObserver = new MutationObserver(() => {
	// console.log("j'écoute");
	//récupération de tout les ingrédients affichées
	const ingredients = document.querySelectorAll(`.filters__list__item.--Ingredients`);
	for (const ingredient of ingredients) {
		ingredient.addEventListener('click', () => {
			//les ingredients à afficher seront les ingrédients déjà affiché, sauf ceux qui contiennent celui sur lequel on a cliqué => soustraction
			// IngredientsToDisplay = IngredientsToDisplay.filter((element) => element.ingredient !== ingredient.innerText);
			// console.log(IngredientsToDisplay);
			// l'ingrédient cliqué est envoyé dans un tableau
			arrayOfIngredientsTags.push(ingredient.innerText);
			arrayOfIngredientsTags = removeDuplicate(arrayOfIngredientsTags);
			const tagsDisplayed = arrayOfIngredientsTags
				.map((element) => {
					return `<span class='tags__item --Ingredients'>${element}<i id="close" class="far fa-times-circle"></i></span>`;
				})
				.join('');

			const ingredientTagSection = document.querySelector('.tags__Ingredients');
			ingredientTagSection.innerHTML = tagsDisplayed;

			const tagInput = normalizeString(ingredient.innerText);
			currentSearch = searchByIngredient(currentSearch, tagInput);
			//la recherche actuelle est mise à jour avec le nouvel input (le tag)
			resultSection.innerHTML = displayRecipes(currentSearch);
			IngredientsToDisplay = currentSearch.flatMap((element) => element.ingredients);
			// Les ingrédients à afficber correspondent désormais aux ingrédients contenus dans les résultats de la recherche actuelle
			// console.log(IngredientsToDisplay);
			// IngredientsToDisplay = IngredientsToDisplay.filter((element) => element.ingredient !== ingredient.innerText);
			// On retire de ces ingrédients celui sur lequel on a cliqué
			displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', '', 'Ingredients');

			ApplianceToDisplay = currentSearch;
			displayAdvancedSearchListOfElement(ApplianceToDisplay, 'appliance', '', 'Appareils');

			UstensilsToDisplay = currentSearch;
			displayAdvancedSearchListOfElement(UstensilsToDisplay, 'ustensils', '', 'Ustenciles');
			// les listes de recherche avancées sont mises à jour selon la nouvelle recherche
		});
	}
});
ingredientsListObserver.observe(IngredientList, { subtree: true, childList: true });
//On écoute les modifications dans le DOM pour IngredientList, à chaque modification on relance la fonction callback

///////////////////
// Appliances observer
/////////////////
const applianceList = document.querySelector(`.filters__list.--Appareils`);
const observerListAppliance = new MutationObserver(() => {
	// console.log("j'acoute");
	const appliances = document.querySelectorAll(`.filters__list__item.--Appareils`);
	for (const appliance of appliances) {
		appliance.addEventListener('click', () => {
			// appliance.remove();
			// ApplianceToDisplay = currentSearch.filter((element) => element.appliance !== appliance.innerText);
			arrayOfAppliancesTags.push(appliance.innerText);
			arrayOfAppliancesTags = removeDuplicate(arrayOfAppliancesTags);
			// console.log(applianceTagsArray);
			const tagsDisplayed = arrayOfAppliancesTags
				.map((element) => {
					return `<span class='tags__item --Appareils'>${element}<i id="close" class="far fa-times-circle"></i></span>`;
				})
				.join('');

			const tagSection = document.querySelector('.tags__Appareils');
			tagSection.innerHTML = tagsDisplayed;

			const tagInput = normalizeString(appliance.innerText);
			currentSearch = searchByAppliance(currentSearch, tagInput);
			resultSection.innerHTML = displayRecipes(currentSearch);
			ApplianceToDisplay = currentSearch.filter((element) => element.appliance !== appliance.innerText);
			displayAdvancedSearchListOfElement(ApplianceToDisplay, 'appliance', '', 'Appareils');

			UstensilsToDisplay = currentSearch;
			displayAdvancedSearchListOfElement(UstensilsToDisplay, 'ustensils', '', 'Ustenciles');

			IngredientsToDisplay = currentSearch.flatMap((element) => element.ingredients);
			displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', '', 'Ingredients');
		});
	}
});
observerListAppliance.observe(applianceList, { subtree: true, childList: true });

///////////////////
// Ustensils observer
/////////////////
const ustensilList = document.querySelector(`.filters__list.--Ustenciles`);
const observerListUstensil = new MutationObserver(() => {
	const ustensils = document.querySelectorAll('.filters__list__item.--Ustenciles');
	for (const ustensil of ustensils) {
		ustensil.addEventListener('click', () => {
			ustensil.remove();
			UstensilsToDisplay = UstensilsToDisplay.filter((element) => element.ustensils !== ustensil.innerText);
			arrayOfUstensilsTags.push(ustensil.innerText);
			arrayOfUstensilsTags = removeDuplicate(arrayOfUstensilsTags);
			const tagsDisplayed = arrayOfUstensilsTags
				.map((element) => {
					return `<span class='tags__item --Ustenciles'>${element}<i id="close" class="far fa-times-circle"></i></span>`;
				})
				.join('');

			const tagSection = document.querySelector('.tags__Ustenciles');
			tagSection.innerHTML = tagsDisplayed;

			const tagInput = normalizeString(ustensil.innerText);
			currentSearch = searchUstensil(currentSearch, tagInput);
			resultSection.innerHTML = displayRecipes(currentSearch);
			UstensilsToDisplay = currentSearch.filter((element) => element.ustensils !== ustensil.innerText);
			displayAdvancedSearchListOfElement(UstensilsToDisplay, 'ustensils', '', 'Ustenciles');

			IngredientsToDisplay = currentSearch.flatMap((element) => element.ingredients);
			displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', '', 'Ingredients');

			ApplianceToDisplay = currentSearch;
			displayAdvancedSearchListOfElement(ApplianceToDisplay, 'appliance', '', 'Appareils');
		});
	}
});
observerListUstensil.observe(ustensilList, { subtree: true, childList: true });

displayAdvancedSearchListOfElements();

///////////////////
// Ingredients search
/////////////////
function searchByIngredient(arr, input) {
	const arrayOfIngredients_WithoutUnmatchedByInput = arr.map((element) => {
		const ingredients = element.ingredients; //les ingrédients des éléments du tableau
		// console.log(ingredients);
		const ingredientsName = ingredients.map((el) => el.ingredient); //le nom des ingrédients des éléments du tableau
		// console.log(ingredientsName);
		return ingredientsName.filter((item) => {
			const elementNormalized = normalizeString(item);
			return elementNormalized.includes(input);
			// on retourne le tableau des noms des ingrédients, mais sans ceux qui ne contiennent pas l'input
		});
	});
	// console.log(arrayOfIngredients_WithoutUnmatchedByInput);
	const arrayOfIndexesOfMatchingElements = [];
	//arrayOfIndexesOfMatchingElements est un tableau contenant l'index des éléments qui correspondent à l'input
	const notEmpty = (element) => element.length > 0;
	for (const item of arrayOfIngredients_WithoutUnmatchedByInput) {
		// console.log(item.findIndex(isNotEmpty));
		if (item.findIndex(notEmpty) === 0) {
			// item.findIndex(isNotEmpty) renvoie -1 si l'item est vide
			// si l'item du tableau n'est pas vide
			// on envoie l'indice de l'item dans le tableau arrayOfIndexesOfMatchingElements
			arrayOfIndexesOfMatchingElements.push(arrayOfIngredients_WithoutUnmatchedByInput.indexOf(item));
		}
	}
	// console.log(arrayOfIndexesOfMatchingElements);
	const recipesWithMatchingIngredient = [];
	// recipesWithMatchingIngredient est un tableau contenant les recettes contenant l'ingrédient
	for (const i of arrayOfIndexesOfMatchingElements) {
		// on envoie dans recipesWithMatchingIngredient les recettes ayant les index précédemment récupérés
		recipesWithMatchingIngredient.push(arr[i]);
	}
	// console.log(recipesWithMatchingIngredient);

	let search = recipesWithMatchingIngredient;
	removeDuplicate(search);
	return search;
	//on retourne les recettes ayant le même index que ceux des ingrédients qui matchent avec l'input
}

///////////////////
// Appliance search
/////////////////
function searchByAppliance(arr, input) {
	// recipesAppliances retourne les recettes ayant un appliance qui match avec l'input
	const recipesWithMatchingAppliance = arr.filter((element) => {
		const appliancesName = element.appliance;
		// console.log(appliancesName);
		return normalizeString(appliancesName).includes(input);
	});
	console.log(recipesWithMatchingAppliance);
	let search = recipesWithMatchingAppliance;
	removeDuplicate(search);
	return search;
}

///////////////////
// Ustensil search
/////////////////
function searchUstensil(arr, input) {
	const arrayOfUstensils_WithoutUnmatchedByInput = arr.map((element) => {
		const ustensils = element.ustensils;
		return ustensils.filter((item) => {
			const elementNormalized = normalizeString(item);
			return elementNormalized.includes(input);
		});
	});
	console.log(arrayOfUstensils_WithoutUnmatchedByInput);
	const arrayOfIndexesOfMatchingElements = [];
	const notEmpty = (element) => element.length > 0;
	for (const item of arrayOfUstensils_WithoutUnmatchedByInput) {
		if (item.findIndex(notEmpty) === 0) {
			arrayOfIndexesOfMatchingElements.push(arrayOfUstensils_WithoutUnmatchedByInput.indexOf(item));
		}
	}
	const recipesWithMatchingUstensil = [];
	for (const i of arrayOfIndexesOfMatchingElements) {
		recipesWithMatchingUstensil.push(arr[i]);
	}

	///REMOVE DUPLICATE
	let search = recipesWithMatchingUstensil;
	removeDuplicate(search);
	return search;
}

///////////////////
// Tags style gestion
/////////////////
const filterElementIngredient = document.querySelector('.filters__search.--Ingredients');

filterElementIngredient.addEventListener('click', () => {
	const IngredientsInput = document.querySelector('#IngredientsInput');
	filterElementIngredient.classList.toggle('open');
	IngredientsInput.value = '';
	IngredientsInput.focus();
});

const filterElementAppliance = document.querySelector('.filters__search.--Appareils');
filterElementAppliance.addEventListener('click', () => {
	const AppareilsInput = document.querySelector('#AppareilsInput');
	filterElementAppliance.classList.toggle('open');
	AppareilsInput.value = '';
	AppareilsInput.focus();
});

const filterElementUstensil = document.querySelector('.filters__search.--Ustenciles');
filterElementUstensil.addEventListener('click', () => {
	const UstencilesInput = document.querySelector('#UstencilesInput');
	filterElementUstensil.classList.toggle('open');
	UstencilesInput.value = '';
	UstencilesInput.focus();
});
