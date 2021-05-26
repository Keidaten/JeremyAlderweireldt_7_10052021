import { recipes } from './recipes.js';
import { displayRecipes } from './displayRecipes.js';

const searchInput = document.querySelector('.search__input');

searchInput.addEventListener('input', (e) => {
	const textInput = e.target.value.toLowerCase().replace(/\s+/g, '');
	if (textInput.length >= 3) {
		displayElementWhoMatchInput(textInput);
	} else {
		displayRecipes(recipes);
	}
});

const displayElementWhoMatchInput = (input) => {
	//tableau contenant toutes les recettes ayant la chaine de caractères contenue dans l'input
	const recipesWithTheWord = [];
	//Boucle sur les recettes
	for (let i = 0; i < recipes.length; i++) {
		const name = recipes[i].name.toLocaleLowerCase().replace(/\s+/g, '');
		const description = recipes[i].description.toLocaleLowerCase().replace(/\s+/g, '');
		const recipeIngredients = [];
		//Boucle sur les ingredients de la recette
		for (let y = 0; y < recipes[i].ingredients.length; y++) {
			recipeIngredients.push(recipes[i].ingredients[y].ingredient.toLocaleLowerCase());
		}
		const resultSection = document.querySelector('.result');
		if (name.includes(input) || description.includes(input) || recipeIngredients.toString().replace(/\s+/g, '').includes(input)) {
			// console.log(recipes[i]);
			recipesWithTheWord.push(recipes[i]);
		}
		resultSection.innerHTML = displayRecipes(recipesWithTheWord);
	}
};
