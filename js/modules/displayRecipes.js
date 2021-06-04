import { recipes } from './recipes.js';

export function displayRecipes(array) {
	//MAP ON ALL ARRAY
	const results = array
		.map((element) => {
			const recipeName = element.name;
			const recipeTime = element.time;
			const recipeIngredients = element.ingredients;
			const recipeDescription = element.description;
			const recipeAppliance = element.appliance;
			const recipeUstensils = element.ustensils;
			//MAP ON INGREDIENTS
			const ingredientsDetails = recipeIngredients
				.map((ingredient) => {
					const ingredientName = ingredient.ingredient;
					let ingredientQuantity = ingredient.quantity;
					let ingredientUnit = ingredient.unit;
					if (ingredientUnit == undefined && ingredientQuantity == undefined) {
						return `<p>${ingredientName}</p>`;
					}
					if (ingredientQuantity == undefined) {
						return `<p>${ingredientName}: ${ingredientUnit}</p>`;
					}
					if (ingredientUnit == undefined) {
						return `<p>${ingredientName}: ${ingredientQuantity}</p>`;
					} else {
						return `<p>${ingredientName}: ${ingredientQuantity} ${ingredientUnit}</p>`;
					}
				})
				.join('');
			const ustensilsDetails = recipeUstensils
				.map((ustensils) => {
					return `<p class="recipe__ustensils">${ustensils}</p>`;
				})
				.join('');
			return `
			<article class="recipe">
			<img class="recipe__image" src="../images/recipePic.png" alt="${recipeName}" />
			<header class="recipe__header">
			<h2 class="recipe__title">${recipeName}</h2>
			<span class="recipe__time">${recipeTime} min</span>
			</header>
			<div class="recipe__ingredients">${ingredientsDetails}</div>
			<p class="recipe__description">${recipeDescription}</p>
			<p class="recipe__appliance">${recipeAppliance}</p>
			<div class="recipe__ustensils">${ustensilsDetails}</div>
		</article>
		`;
		})
		.join('');
	//GET RESULTS SECTION
	const resultSection = document.querySelector('.result');
	//INJECT RESULTS ON RESULTS SECTION
	resultSection.innerHTML = results;
	return results;
}

displayRecipes(recipes);

export { displayRecipes as default };
