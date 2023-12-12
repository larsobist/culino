import React, { useState, useEffect } from "react";
import RecipeDataService from "../../services/RecipeService";
import FileService from "../../services/FileService";

const RecipesListMod = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    retrieveRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      setCurrentRecipe(recipes[currentIndex]);
    } else {
      setCurrentRecipe(null);
      setCurrentIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, currentIndex]);

  useEffect(() => {
    if (searchTitle) {
      const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      setRecipes(filteredRecipes);
    } else {
      retrieveRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle, recipes]);

  //Search
  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  //Clear search
  const clearSearchTitle = () => {
    setSearchTitle("");
  };

  //Get all unpublished recipes
  const retrieveRecipes = () => {
    RecipeDataService.getAll()
      .then((response) => {
        const unpublishedRecipes = response.data.filter((recipe) => !recipe.published);
        setRecipes(unpublishedRecipes);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Clicked Recipe
  const setActiveRecipe = (recipe, index) => {
    setCurrentRecipe(recipe);
    setCurrentIndex(index);
  };

  //Delete Recipe
  const deleteRecipe = (recipe) => {
    RecipeDataService.remove(recipe.id)
      .then((response) => {
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    // Remove the associated image file
    FileService.removeImg(recipe.fileName)
      .then((response) => {
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    const updatedRecipes = recipes.filter((r) => r.id !== recipe.id);
    setRecipes(updatedRecipes);
  };

  //Update published status
  const updatePublished = (status, index) => {
    const recipe = recipes[index];

    if (!recipe || !recipe.id) {
      console.log("Invalid recipe or recipe id");
      return;
    }

    var data = {
      id: recipe.id,
      published: status,
      author: recipe.author,
      title: recipe.title,
      description: recipe.description,
      fileName: recipe.fileName,
      difficulty: recipe.difficulty,
      duration: recipe.duration,
      price: recipe.price,
      ingredients: recipe.ingredients,
      tags: recipe.tags,
      steps: recipe.steps,
    };

    RecipeDataService.update(recipe.id, data)
      .then((response) => {
        const updatedRecipes = recipes.filter((r) => r.id !== recipe.id);
        setRecipes(updatedRecipes);
        setActiveRecipe("");
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Unveröffentlichte Rezepte</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Rezepte suchen..."
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={clearSearchTitle}
            >
              Suche leeren
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <ul className="list-group" style={{ marginBottom: '10px' }}>
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveRecipe(recipe, index)}
                key={recipe.id}
              >
                {recipe.title}
              </li>
            ))
          ) : (
            <li className="list-group-item">Keine Rezepte gefunden</li>
          )}
        </ul>
      </div>
      <div className="col-md-8">
        {currentRecipe ? (
          <div className="card">
            <div className="card-header" >
              <div className="row">
                <div className="col-md-8">
                  <h4>{currentRecipe.title}</h4>
                </div>
                <div className="col-md-2">
                  <button
                    className={"btn btn-success btn-sm"}
                    onClick={() => updatePublished(true, currentIndex)}
                  >
                    Veröffentlichen
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteRecipe(currentRecipe)}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label><strong>Beschreibung: </strong></label>
                  <div>{currentRecipe.description}</div>
                  <label><strong>Zutaten: </strong></label>
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <div key={index}>
                      <span>
                        {ingredient.amount}{ingredient.unit} - {ingredient.ingredient}
                      </span>
                    </div>
                  ))}

                  <label><strong>Zubereitungsschritte:</strong></label>
                  {currentRecipe.steps.map((step, index) => (
                    <div key={index} style={{ listStyleType: "none", margin: "0" }} >
                      <span>{"Schritt " + (index + 1) + ": " + step}</span>
                    </div>
                  ))}
                  <label><strong>Kategorien:</strong></label>
                  {currentRecipe.tags.map((tag, index) => (
                    <span key={index} className="badge btn-success mr-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="col-md-6">
                  <img
                    src={`http://localhost:8080/api/files/${currentRecipe.fileName}`}
                    alt={"Rezept Bild"}
                    className="card-img"
                  />
                  <label><strong>Kosten: </strong>{currentRecipe.price} €</label>
                  <label><strong>Schwierigkeit: </strong>{currentRecipe.difficulty}</label>
                  <label><strong>Zubereitungszeit: </strong>{currentRecipe.duration} Minuten</label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <br />
            <p>Klick auf ein Rezept...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesListMod;