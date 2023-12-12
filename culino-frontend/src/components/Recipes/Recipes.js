import React, { useState, useEffect } from "react";
import RecipeDataService from "../../services/RecipeService";
import FileService from "../../services/FileService";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";

const Recipes = () => {
  //Get current user
  const user = AuthService.getCurrentUser();

  const [recipes, setRecipes] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [uniqueTags, setUniqueTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    retrieveRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    retrieveImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, selectedTags]);

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

  //Get all published Recipes
  const retrieveRecipes = () => {
    RecipeDataService.getAll()
      .then((response) => {
        const publishedRecipes = response.data.filter((recipe) => recipe.published);
        setRecipes(publishedRecipes);
        extractUniqueTags(publishedRecipes);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Get the Images
  const retrieveImages = () => {
    FileService.getFiles()
      .then((response) => {
        setImgs(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Get all Tags from recipes
  const extractUniqueTags = () => {
    const tagCountMap = new Map();
    recipes.forEach((recipe) => {
      recipe.tags.forEach((tag) => {
        if (tagCountMap.has(tag)) {
          tagCountMap.set(tag, tagCountMap.get(tag) + 1);
        } else {
          tagCountMap.set(tag, 1);
        }
      });
    });

    const sortedTags = Array.from(tagCountMap.entries()).sort((a, b) => b[1] - a[1]);
    const uniqueTagsArray = sortedTags.map((entry) => entry[0]);
    setUniqueTags(uniqueTagsArray);
  };

  //Clicked Tag
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      // Tag is already selected, remove it
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      // Tag is not selected, add it
      setSelectedTags([...selectedTags, tag]);
    }
  };

  //Filter Recipes
  const filterRecipes = () => {
    const filteredRecipes = recipes.filter((recipe) =>
      selectedTags.length === 0 || recipe.tags.some((recipeTag) => selectedTags.includes(recipeTag))
    );
    setFilteredRecipes(filteredRecipes);
    extractUniqueTags(filteredRecipes);
  };

  //Reset clicked Tags
  const handleClearTags = () => {
    setSelectedTags([]);
  };

  //Tag dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const handleToggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  return (
    <div>
      {user && (
        <div>
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

          <div className="row" style={{ paddingBottom: "15px" }}>
            <div className="col-md-9" style={{ display: "flex", flexWrap: "wrap" }}>
              {uniqueTags &&
                uniqueTags.map((tag, index) => {
                  if (index < 6 || showDropdown) {
                    return (
                      <button
                        key={index}
                        className={`${selectedTags.includes(tag) ? "btn btn-success" : "btn btn-outline-success"}`}
                        style={{ margin: "0 10px 10px 0" }}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    );
                  }
                  return null;
                })}

              {uniqueTags.length > 6 && (
                <div className="dropdown">
                  {showDropdown && (
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      {uniqueTags.slice(6).map((tag, index) => (
                        <button
                          key={index}
                          className={`${selectedTags.includes(tag) ? "dropdown-item active" : "dropdown-item"}`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-md-3">
              <div style={{ display: "flex" }}>
                <button className="btn btn-outline-success" style={{ width: "125px" }} onClick={handleClearTags}>
                  Zurücksetzen
                </button>
                {filteredRecipes.length > 1 ? (
                  <button className="btn btn-outline-success dropdown-toggle" type="button" aria-expanded={showDropdown} style={{ marginLeft: "10px", width: "125px" }} onClick={handleToggleDropdown}>
                    {showDropdown ? "Weniger" : "Mehr"}
                  </button>
                ) : (<></>)}
              </div>
            </div>
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="row">
              {filteredRecipes.map((recipe, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card">
                    <img
                      className="card-img-top"
                      src={`http://localhost:8080/api/files/${recipe.fileName}`}
                      alt="Recipe"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{recipe.title}</h5>
                      <p className="card-text">{recipe.duration + " Minuten • " + recipe.difficulty + " • " + recipe.price + "€"}</p>
                      <Link to={"/recipe/" + recipe.id} className="btn btn-success btn-block">
                        Genauer ansehen
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p>Keine Rezepte vorhanden.</p>
              <Link to={"/add"} className="btn btn-success">
                Rezept erstellen
              </Link>
            </div>
          )}
        </div>
      )}

      {!user && <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1, width: "100%", height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px'}}>
              <Link className="btn btn-success" style={{margin: '10px'}} to={"/login"}>Login</Link>
              <Link className="btn btn-success" style={{margin: '10px'}} to={"/register"}>Registrieren</Link>
            </div>
          </div>
        </div>

        <div className="row" style={{ filter: "blur(8px)" }}>
          {imgs.map((img, index) => (
            <div className="col-md-4" key={index}>
              <div className="card" >
                <img className="card-img-top" src={`http://localhost:8080/api/files/${img.name}`} alt="Recipe" />
              </div>
            </div>
          ))}
        </div>
      </div>}
    </div >
  );
};

export default Recipes;
