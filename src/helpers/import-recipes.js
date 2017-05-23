export function goodFood (url, cb) {
  console.log(url);
  if (!url.match(/(https:\/\/www\.bbcgoodfood\.com\/recipes\/)/)) {
    return cb(null, null, "Invalid URL - Please Enter a valid BBC Good Food URL");
  }
  let recipe = {};
  let ingredientsUrl = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22${url}%22%20and%20xpath%3D%22%2F%2Ful%5B%40class%3D%5C%27ingredients-list__group%5C%27%5D%22%0A%20%20%20%20&format=json`
  let headerUrl = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22${url}%22%20and%20xpath%3D%22%2F%2Fheader%5B%40class%3D%5C'recipe-header%5C'%5D%22%0A%20%20%20%20&format=json`;
  let methodUrl = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22${url}%22%20and%20xpath%3D%22%2F%2Fol%5B%40class%3D%5C'method__list%5C'%5D%22%0A%20%20%20%20&format=json`;

  function formatIngredients (array) {

    // array will either be a nested array of ingredient objects or will contain an 'li'
    // property with an array of all ingredients
    console.log(array);
    if (!array.concat) { // If array is not of type Array map over the li property
      return array.li.map(ing => {
        return ing.a ? `${ing.content.trim()} ${ing.a.content.trim()}`: ing.content;
      });
    }

    // The array contains nested ingredients arrays
    return array.reduce((prev, arr) => {
      if (arr.li){
        return prev.concat(arr.li.map(ing => {
          return ing.a ? `${ing.content.trim()} ${ing.a.content.trim()}`: ing.content;
        }));
      }
      return prev;
    }, []);
  }

  fetch(ingredientsUrl).then((response) => {
    return response.json();
  }).then((res) => {
    console.log(res);
    recipe.ingredients = formatIngredients(res.query.results.ul);
    console.log(headerUrl);
    fetch(headerUrl).then(header => {
      return header.json();
    }).then(headerObj => {
      console.log(headerObj);
      let recipeHeader = headerObj.query.results.header;
      console.log(recipeHeader);
      recipe.name = recipeHeader.div[1].div[0].h1.content;
      recipe.image = {
        url: `https:${recipeHeader.div[0].div.img.src.split('?')[0]}`,
        alt: recipe.name,
        remote: true
      };

      // Times can be a range which is stored as an array. If this is the case take to first time from the array
      recipe.prepTime = recipeHeader.div[1].div[1].div.section[0].div.span[0].span.content ?
                        recipeHeader.div[1].div[1].div.section[0].div.span[0].span.content.match(/\d[0-9]*/g)[0] :
                        recipeHeader.div[1].div[1].div.section[0].div.span[0].span[0].content.match(/\d[0-9]*/g)[0];
      recipe.cookTime = recipeHeader.div[1].div[1].div.section[0].div.span[1].span.content ?
                        recipeHeader.div[1].div[1].div.section[0].div.span[1].span.content.match(/\d[0-9]*/g)[0] :
                        recipeHeader.div[1].div[1].div.section[0].div.span[1].span[0].content.match(/\d[0-9]*/g)[0];
      recipe.serves = recipeHeader.div[1].div[1].div.section[2].span.content.match(/\d[0-9]*/g)[0];
      console.log(recipe);
    }).then(() => {
      fetch(methodUrl).then(methodList => {
        return methodList.json();
      }).then(methodObj => {
        console.log(methodObj);
        recipe.methodSteps = methodObj.query.results.ol.li.map(method => {
          console.log(typeof(method.p));
          if(typeof(method.p) === "object" && method.p.a) {
            let originalContentArray = method.p.content.split('  ');
            let linkText = method.p.a.map(a => {
              return a.content;
            });
            let count = 0;
            for (var i = 0; i < originalContentArray.length; i += 1) {
              if (i % 2 !== 0) {
              	originalContentArray.splice(i, 0, linkText[count]);
                count += 1;
              }
            }
            return originalContentArray.join(' ');
          }
          return method.p;
        });
        cb(null, recipe);
      }).catch(err => {
        cb(err);
      })
    }).catch(err => {
      cb(err);
    });
  }).catch(err => {
    cb(err);
  })
}
