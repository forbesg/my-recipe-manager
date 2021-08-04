export function goodFood(url, cb) {
  console.log(url);
  if (!url.match(/(https:\/\/www\.bbcgoodfood\.com\/recipes\/)/)) {
    return cb(
      null,
      null,
      "Invalid URL - Please Enter a valid BBC Good Food URL"
    );
  }
  let recipe = {};

  // API URI on Glitch to scrape bbc good food recipes
  let fetchUrl = `https://bbc-food-scraper.glitch.me/api/scrape?url=${url}`;

  fetch(fetchUrl)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((res) => {
      console.log(res);
      recipe.name = res.title;
      recipe.ingredients = res.ingredients;
      recipe.image = {
        url: res.image,
        alt: res.title,
        remote: true,
      };
      recipe.prepTime = res.time.prep ? res.time.prep.match(/[0-9]+/)[0] : 0;
      recipe.cookTime = res.time.cook ? res.time.cook.match(/[0-9]+/)[0] : 0;
      recipe.serves = res.serves.match(/[0-9]+/)[0] || 0;
      recipe.methodSteps = res.method;
      console.log(recipe);
      cb(null, recipe);
    })
    .catch((err) => {
      console.log(err);
      cb(err, null);
    });
}
