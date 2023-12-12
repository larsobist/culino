import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RecipeDataService from "../../services/RecipeService";

const RecipeDetail = () => {
    //Initial State
    const initialRecipeState = {
        id: null,
        published: false,
        author: "",
        title: "",
        description: "",
        fileName: "",
        difficulty: "",
        duration: "",
        price: "",
        ingredients: [],
        steps: [],
        tags: [],
    };

    const [currentRecipe, setCurrentRecipe] = useState(initialRecipeState);
    const [ingredientCount, setIngredientCount] = useState(1);

    //Get Param from URL
    const { id } = useParams();

    //Get Recipe with ID
    const getRecipe = (id) => {
        RecipeDataService.get(id)
            .then((response) => {
                setCurrentRecipe(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        if (id) getRecipe(id);
    }, [id]);

    return (
        <div className="container" style={{ width: '80%' }}>
            <div className="card">
                <img
                    className="card-img-top-big"
                    src={`http://localhost:8080/api/files/${currentRecipe.fileName}`}
                    alt="Recipe"
                />
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-8"><h2>{currentRecipe.title}</h2></div>
                        <div className="col-md-4"><label>{currentRecipe.difficulty} • {currentRecipe.duration} Minuten • {currentRecipe.price} Euro</label></div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <label><strong>Beschreibung</strong></label>
                        <p>{currentRecipe.description}</p>
                    </div>
                    <div className="form-group">
                        <label><strong>Zutatenliste</strong></label>
                        <div className="d-flex align-items-center">
                            <span>Für</span>
                            <input
                                type="number"
                                className="form-control"
                                style={{ width: "65px", marginLeft: "5px", marginRight: "5px" }}
                                value={ingredientCount}
                                min="1"
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!isNaN(value) && value >= 0) {
                                        setIngredientCount(value);
                                    }
                                }}
                            />
                            <span>Personen:</span>
                        </div>
                        <table className="table table-bordered" style={{ marginTop: "10px" }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Menge</th>
                                    <th>Zutat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecipe.ingredients.map((ingredient, index) => {
                                    const adjustedAmount = ingredient.amount * ingredientCount;
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {adjustedAmount + " "}
                                                {ingredient.unit}
                                            </td>
                                            <td>{ingredient.ingredient}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <label>
                        <strong>Zubereitungsschritte</strong>
                    </label>
                    <div className="step-container">
                        {currentRecipe.steps.map((step, index) => (
                            <div key={index} className="step">
                                <div className="step-number">
                                    <h5>{index + 1}</h5>
                                </div>
                                <div className="step-description">{step}</div>
                            </div>
                        ))}
                    </div>
                    <label><strong>Kategorien</strong></label>
                    {currentRecipe.tags.map((tag, index) => (
                        <span key={index} className="badge btn-success" style={{ margin: "5px" }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div style={{ height: '50px' }}></div>
        </div>

    );
};

export default RecipeDetail;
