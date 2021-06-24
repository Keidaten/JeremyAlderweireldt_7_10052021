import { recipes } from './recipes.js';

export function displayRecipes(array) {
	//MAP ON ALL ARRAY
	const results = array
		.map((element) => {
			const recipeName = element.name;
			const recipeTime = element.time;
			const recipeIngredients = element.ingredients;
			const recipeDescription = element.description;
			//MAP ON INGREDIENTS
			const ingredientsDetails = recipeIngredients
				.map((ingredient) => {
					const ingredientName = ingredient.ingredient;
					let ingredientQuantity = ingredient.quantity;
					let ingredientUnit = ingredient.unit;
					if (ingredientUnit == undefined && ingredientQuantity == undefined) {
						return `<p><span>${ingredientName}</span></p>`;
					}
					if (ingredientQuantity == undefined) {
						return `<p><span>${ingredientName}</span>: ${ingredientUnit}</p>`;
					}
					if (ingredientUnit == undefined) {
						return `<p><span>${ingredientName}:</span> ${ingredientQuantity}</p>`;
					} else {
						return `<p><span>${ingredientName}:</span> ${ingredientQuantity} ${ingredientUnit}</p>`;
					}
				})
				.join('');

			return `
			<article class="recipe">
				<img class="recipe__image" src="images/recipePic.png" alt="${recipeName}" />
				<div class="recipe__content">
					<header class="recipe__header">
						<h2 class="recipe__title">${recipeName}</h2>
						<span class="recipe__time"><img class="recipe__timerImg" src="images/recipeTime.png" alt="timer">${recipeTime} min</span>
					</header>
					<div class="recipe__infos">
					<div class="recipe__ingredients">${ingredientsDetails}</div>
					<p class="recipe__description">${recipeDescription}</p>
					</div>
				</div>
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
