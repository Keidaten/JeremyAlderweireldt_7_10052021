import { recipes } from './recipes.js';
import { displayRecipes } from './displayRecipes.js';
import { AdvancedSearchField } from './advancedSearch.js';
import { normalizeString, removeDuplicate } from './normalizeFunctions.js';

///////////////////
//Global variables
/////////////////
let currentSearch;
let IngredientsToDisplay;
let ApplianceToDisplay;
let UstensilsToDisplay;
let arrayOfIngredientsTags = [];
let arrayOfAppliancesTags = [];
let arrayOfUstensilsTags = [];

///////////////////
//Listen main input
/////////////////
const searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('input', (e) => {
	//Récuperation de l'input utilisateur
	const textInput = e.target.value.toLowerCase().replace(/\s+/g, '');
	if (textInput.length > 2) {
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

///////////////////
//Get recipes by user input
/////////////////
const displayDataByserInput = (arr, input) => {
	const recipesFiltered = arr.filter((element) => {
		//Recuperation des nom des ingrédients
		const recipeIngredients = [];
		for (let y = 0; y < element.ingredients.length; y++) {
			recipeIngredients.push(element.ingredients[y].ingredient.toLocaleLowerCase());
		}
		//filtre
		const check = normalizeString(element.name).includes(input) || normalizeString(element.description).includes(input) || recipeIngredients.includes(input);
		return check;
	});
	return recipesFiltered;
};

currentSearch = displayDataByserInput(recipes, '');

///////////////////
//Display advanced search list elements
/////////////////
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
		// HTML pour chaques éléments de la liste
		const resultDisplayed = elementReturnedWithoutDuplicate.map((element) => `<li class='filters__list__item  --${name}'>${element}</li>`).join('');
		if (resultDisplayed.length > 0) {
			// si il y a des éléments à afficher, Le HTML est envoyé dans le DOM
			const elementList = document.querySelector(`.filters__list.--${name}`);
			elementList.innerHTML = resultDisplayed;
		} else {
			// sinon on renvoie un autre HTML
			const elementList = document.querySelector(`.filters__list.--${name}`);
			elementList.innerHTML = `<li class="filters__list__item__error --${name}">
			  Pas de résultats
			</li>`;
		}
	} else {
		//si l'input n'existe pas, on envoie toute les éléments sans filtrage
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
// Ingredients observer
/////////////////
const IngredientList = document.querySelector(`.filters__list.--Ingredients`);

//function appelée à chaque modifiction de IngredientList
const ingredientsListObserver = new MutationObserver(() => {
	//récupération de tout les ingrédients affichées
	const ingredients = document.querySelectorAll(`.filters__list__item.--Ingredients`);
	for (const ingredient of ingredients) {
		ingredient.addEventListener('click', () => {
			// l'ingrédient cliqué est envoyé dans un tableau
			arrayOfIngredientsTags.push(ingredient.innerText);
			arrayOfIngredientsTags = removeDuplicate(arrayOfIngredientsTags);
			//on défini le HTML pour les tags
			const tagsDisplayed = arrayOfIngredientsTags
				.map((element) => {
					return `<span class='tags__item --Ingredients'>${element}<i id="close" class="far fa-times-circle"></i></span>`;
				})
				.join('');

			const ingredientTagSection = document.querySelector('.tags__Ingredients');
			ingredientTagSection.innerHTML = tagsDisplayed;

			//on récupère le string de l'input cliqué (nom de l'ingredient)
			const tagInput = normalizeString(ingredient.innerText);
			//la recherche actuelle est mise à jour avec le nouvel input (le tag)
			currentSearch = searchByIngredient(currentSearch, tagInput);
			resultSection.innerHTML = displayRecipes(currentSearch);
			IngredientsToDisplay = currentSearch.flatMap((element) => element.ingredients);
			// Les ingrédients à afficber correspondent désormais aux ingrédients contenus dans les résultats de la recherche actuelle
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
	//récupération de tout les Appareils affichées
	const appliances = document.querySelectorAll(`.filters__list__item.--Appareils`);
	for (const appliance of appliances) {
		appliance.addEventListener('click', () => {
			// l'appareil cliqué est envoyé dans un tableau
			arrayOfAppliancesTags.push(appliance.innerText);
			arrayOfAppliancesTags = removeDuplicate(arrayOfAppliancesTags);

			// Création du HTML de l'élément cliqué pour en faire un tag
			const tagsDisplayed = arrayOfAppliancesTags
				.map((element) => {
					return `<span class='tags__item --Appareils'>${element}<i id="close" class="far fa-times-circle"></i></span>`;
				})
				.join('');

			// Injection dans le DOM de tag
			const tagSection = document.querySelector('.tags__Appareils');
			tagSection.innerHTML = tagsDisplayed;

			//on récupère le string de l'input cliqué (nom de l'appareil)
			const tagInput = normalizeString(appliance.innerText);
			//la recherche actuelle est mise à jour avec le nouvel input (le tag)
			currentSearch = searchByAppliance(currentSearch, tagInput);
			resultSection.innerHTML = displayRecipes(currentSearch);
			// Les appareils à afficber correspondent désormais aux ingrédients contenus dans les résultats de la recherche actuelle
			ApplianceToDisplay = currentSearch;
			displayAdvancedSearchListOfElement(ApplianceToDisplay, 'appliance', '', 'Appareils');

			UstensilsToDisplay = currentSearch;
			displayAdvancedSearchListOfElement(UstensilsToDisplay, 'ustensils', '', 'Ustenciles');

			IngredientsToDisplay = currentSearch.flatMap((element) => element.ingredients);
			displayAdvancedSearchListOfElement(IngredientsToDisplay, 'ingredient', '', 'Ingredients');
			// les listes de recherche avancées sont mises à jour selon la nouvelle recherche
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
			UstensilsToDisplay = currentSearch;
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

		const ingredientsName = ingredients.map((el) => el.ingredient); //le nom des ingrédients des éléments du tableau

		return ingredientsName.filter((item) => {
			const elementNormalized = normalizeString(item);
			return elementNormalized.includes(input);
			// on retourne le tableau des noms des ingrédients, mais sans ceux qui ne contiennent pas l'input
		});
	});
	const arrayOfIndexesOfMatchingElements = [];
	//arrayOfIndexesOfMatchingElements est un tableau contenant l'index des éléments qui correspondent à l'input
	const notEmpty = (element) => element.length > 0;
	for (const item of arrayOfIngredients_WithoutUnmatchedByInput) {
		if (item.findIndex(notEmpty) === 0) {
			// item.findIndex(isNotEmpty) renvoie -1 si l'item est vide
			// si l'item du tableau n'est pas vide
			// on envoie l'indice de l'item dans le tableau arrayOfIndexesOfMatchingElements
			arrayOfIndexesOfMatchingElements.push(arrayOfIngredients_WithoutUnmatchedByInput.indexOf(item));
		}
	}

	const recipesWithMatchingIngredient = [];
	// recipesWithMatchingIngredient est un tableau contenant les recettes contenant l'ingrédient
	for (const i of arrayOfIndexesOfMatchingElements) {
		// on envoie dans recipesWithMatchingIngredient les recettes ayant les index précédemment récupérés
		recipesWithMatchingIngredient.push(arr[i]);
	}

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
		return normalizeString(appliancesName).includes(input);
	});
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
