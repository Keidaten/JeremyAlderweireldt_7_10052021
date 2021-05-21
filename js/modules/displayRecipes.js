import { recipes } from './recipes.js';

function displayRecipes(array) {
	//MAP ON ALL ARRAY
	const results = array
		.map((element) => {
			const recipeName = element.name;
			const recipeTime = element.time;
			const recipeIngredients = element.ingredients;
			const description = element.description;
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
			return `
		<article class="recipe">
			<img class="recipe__image" src="../images/recipePic.png" alt="${recipeName}" />
			<header class="recipe__header">
				<h2 class="recipe__title">${recipeName}</h2>
				<span class="recipe__time">${recipeTime} min</span>
			</header>
			<div class="recipe__description">${ingredientsDetails}</div>
		</article>
		`;
		})
		.join('');
	return results;
}

//INJECTION IN HTML
const resultSection = document.querySelector('.result');
//INJECTION OF ALL RECIPES
resultSection.innerHTML = displayRecipes(recipes);

export { displayRecipes as default };
