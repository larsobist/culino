import React, { useState, useEffect } from "react";
import RecipeDataService from "../../services/RecipeService";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import FileService from "../../services/FileService";

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    retrieveRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTitle) {
      // Filter recipes based on searchTitle
      const filteredRecipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      setRecipes(filteredRecipes);
    } else {
      retrieveRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTitle]);

  //Search
  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  //Clear Search
  const clearSearchTitle = () => {
    setSearchTitle("");
  };

  // Retrieve all recipes
  const retrieveRecipes = () => {
    RecipeDataService.getAll()
      .then((response) => {
        // Filter recipes based on the current user's ID
        const filteredRecipes = response.data.filter(
          (recipe) => recipe.author === currentUser.id
        );
        setRecipes(filteredRecipes);
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

  // Delete the recipe from the database
  const deleteRecipe = (recipe) => {
    RecipeDataService.remove(recipe.id)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    // Remove the associated image file
    FileService.removeImg(recipe.fileName)
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    // Update the recipes state by removing the deleted recipe
    const updatedRecipes = recipes.filter((r) => r.id !== recipe.id);
    setRecipes(updatedRecipes);

    // Clear the currentRecipe and currentIndex state
    setCurrentRecipe(null);
    setCurrentIndex(-1);
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Rezeptliste</h1>
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
                key={index}
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
                  <div> <h4>{currentRecipe.title}</h4>
                    {currentRecipe.published ? "Veröffentlicht" : "In der Überprüfung"}
                  </div>
                </div>
                <div className="col-md-2">
                  <Link
                    to={"/recipes/" + currentRecipe.id}
                    className="btn btn-sm btn-warning"
                  >
                    Bearbeiten
                  </Link>
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
                  {currentRecipe.description}
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

export default RecipesList;
