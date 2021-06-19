import { recipes } from './recipes.js';
import { displayRecipes } from './displayRecipes.js';
import { normalizeString } from './normalizeFunctions.js';
///////////////////
//Class advanced search
/////////////////
export class AdvancedSearchField {
	constructor() {
		this.createAdvancedSearchField = function (string) {
			const placeholder = 'Rechercher un ' + normalizeString(string).slice(0, -1);
			return `
		<div class="filter --${string}">
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
// Style gestion
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
