import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";

import RecipeDataService from "../../services/RecipeService";
import AuthService from "../../services/AuthService";
import FileService from "../../services/FileService";

const RecipeAdd = () => {
    let navigate = useNavigate();
    const form = useRef();
    const checkBtn = useRef();

    //get current user
    const currentUser = AuthService.getCurrentUser();

    //initial state
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
    };
    const [recipe, setRecipe] = useState(initialRecipeState);

    //Input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value });
    };

    // Ingredients
    const [ingredientsArray, setIngredientsArray] = useState([]);
    const [ingredientsData, setIngredientsData] = useState({ amount: "", unit: "", ingredient: "" });
    //Ingredient change
    const handleInputChangeIngredient = (e) => {
        setIngredientsData({ ...ingredientsData, [e.target.name]: e.target.value });
    };
    //Submit Ingredient
    const submitIngredient = (e) => {
        e.preventDefault();
        setIngredientsArray([...ingredientsArray, { ...ingredientsData }]);
        setIngredientsData({ amount: "", unit: "", ingredient: "" });
    };
    //update ingredient
    const updateIngredient = (e, index, field) => {
        const updatedIngredients = [...ingredientsArray];
        updatedIngredients[index][field] = e.target.value;
        setIngredientsArray(updatedIngredients);
    };
    //delete Ingredient
    const deleteIngredient = (index) => {
        const updatedIngredients = [...ingredientsArray];
        updatedIngredients.splice(index, 1);
        setIngredientsArray(updatedIngredients);
    };

    // Steps
    const [stepsArray, setStepsArray] = useState([]);
    const [stepData, setStepData] = useState({ step: "" });
    const handleInputChangeStep = e => {
        setStepData({ ...stepData, [e.target.name]: e.target.value })
    };
    let { step } = stepData;
    //add step
    const submitStep = e => {
        e.preventDefault();
        setStepsArray([...stepsArray, { step }]);
        setStepData({ step: "" });
    };
    //update step
    const updateStep = (e, index) => {
        const updatedSteps = [...stepsArray];
        updatedSteps[index].step = e.target.value;
        setStepsArray(updatedSteps);
    };
    //delete step
    const deleteStep = index => {
        const updatedSteps = [...stepsArray];
        updatedSteps.splice(index, 1);
        setStepsArray(updatedSteps);
    };

    // Tags
    const [tagsArray, setTagsArray] = useState([]);
    const [tagData, setTagData] = useState({ name: "" });
    const [suggestedTags, setSuggestedTags] = useState([]);
    //given tag options
    const possibleTags = [
        "Brot und Brötchen", "Cremes", "Eis", "Kekse & Plätzchen", "Konfiserie", "Kuchen", "Tarte/Quiche", "Torten", "Beilage", "Gemüse", "Kartoffeln", "Klöße", "Nudeln", "Reis/Getreide", "Dessert", "Frühstück", "Hauptspeise", "Eier", "Eintopf", "Fisch", "Geflügel", "Wildgeflügel", "Gemüse", "Kartoffeln", "Krustentier & Muscheln", "Lamm & Ziege", "Pasta & Nudel", "Pilze", "Pizza", "Reis/Getreide", "Rind", "Schwein", "Wild & Kaninchen", "Salat", "Eier & Käse", "Fleisch & Wurst", "Früchte", "Gemüse", "Kartoffel", "Fisch", "Pilze", "Salatdressing", "Warme Salate", "Suppen", "Vorspeisen", "Afrika", "Ägypten", "Marokko", "Südafrika", "Amerika", "Lateinamerika", "Mexico", "USA & Kanada", "Asien", "Chinesisch", "Indisch", "Japanisch", "Koreanisch", "Thailand", "Vietnam", "Australien", "Europa", "Belgien", "Dänemark", "Deutschland", "Finnland", "Frankreich", "Griechenland", "Großbritannien", "Italien", "Luxemburg", "Malta", "Niederlande", "Norwegen", "Österreich", "Polen", "Portugal", "Russland", "Schweden", "Schweiz", "Spanien", "Tschechien", "Türkei", "Ungarn", "Weißrussland", "Karibik & Exotik", "Mittlerer und Naher Osten", "Osteuropa", "Fettarm", "Kalorienarm", "Vegan", "Vegetarisch", "Vollwert", "Festlich", "Fingerfood", "Kinder", "Party", "Preiswert", "Resteverwertung", "Saucen & Dips", "Schnell", "Studentenküche", "Aufstrich", "Backen", "Beilage", "Brotspeise", "Eierspeise", "Eintopf", "Fisch", "Frucht", "Frühstück", "Gemüse", "Auflauf", "Grillen", "Wok", "Pasta", "Saucen", "Snacks"
    ];
    //Change tag
    const handleInputChangeTag = (e) => {
        const { value } = e.target;
        setTagData({ name: value });
        if (value.trim() === "") {
            setSuggestedTags([]);
            return;
        }
        const filteredTags = possibleTags.filter((tag) =>
            tag.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestedTags(filteredTags);
    };
    //select tag
    const selectTag = (tag) => {
        setTagsArray([...tagsArray, { name: tag }]);
        setTagData({ name: "" });
        setSuggestedTags([]);
    };
    //delete tag
    const deleteTag = (index) => {
        const updatedTags = [...tagsArray];
        updatedTags.splice(index, 1);
        setTagsArray(updatedTags);
    };

    // Image
    const [currentFile, setCurrentFile] = useState(undefined);
    const [imagePreview, setImagePreview] = useState("");
    const [fileSizeError, setFileSizeError] = useState(false);
    const selectFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log(file.size)
            const fileSizeInMB = file.size / (1024 * 1024);
            console.log(file.name)
            //Check file size
            if (fileSizeInMB <= 1) {
                setCurrentFile(file);
                setFileSizeError(false);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setCurrentFile(null);
                setFileSizeError(true);
            }
        }
    };

    // Validations
    const [submitted, setSubmitted] = useState(false);
    const required = (value) => {
        if (!value) {
            return (
                <div className="alert alert-danger" role="alert">
                    Bitte ausfüllen.
                </div>
            );
        }
    };

    // Save Recipe
    const saveRecipe = (e) => {
        e.preventDefault();

        setSubmitted(true);

        form.current.validateAll();
        //check validations
        if (checkBtn.current.context._errors.length === 0 && tagsArray.length > 0) {
            const uuid = uuidv4();
            const modifiedName = `${uuid}-${currentFile.name}`;

            const modifiedFile = new File([currentFile], modifiedName, {
                type: currentFile.type,
            });
            //Upload image
            FileService.uploadImg(modifiedFile)
                .then((response) => {
                    console.log("Image uploaded successfully:", response.data);
                    setCurrentFile(undefined); // Clear the selected file
                })
                .catch((error) => {
                    console.log("Error uploading the image:", error);
                    setCurrentFile(undefined); // Clear the selected file
                });

            const ingredients = ingredientsArray.map((ingredient) => ({
                amount: ingredient.amount,
                unit: ingredient.unit,
                ingredient: ingredient.ingredient,
            }));

            const steps = stepsArray.map((step) => step.step);
            const tags = tagsArray.map((tag) => tag.name);

            var data = {
                published: false,
                author: currentUser.id,
                title: recipe.title,
                description: recipe.description,
                fileName: modifiedName,
                difficulty: recipe.difficulty,
                duration: recipe.duration,
                price: recipe.price,
                ingredients: ingredients,
                steps: steps,
                tags: tags,
            };
            RecipeDataService.create(data)
                .then(response => {
                    setRecipe({
                        id: response.data.id,
                        published: response.data.published,
                        author: response.data.author,
                        title: response.data.title,
                        description: response.data.description,
                        fileName: response.data.fileName,
                        difficulty: response.data.difficulty,
                        duration: response.data.duration,
                        price: response.data.price,
                        ingredients: response.data.ingredients,
                        steps: response.data.steps,
                        tags: response.data.tags,
                    });
                    console.log(response.data);
                    navigate("/myrecipes")
                })
                .catch(e => {
                    console.log(e);
                });
        }
    };

    return (
        <div>
            <h1>Neues Rezept</h1>
            <Form onSubmit={saveRecipe} ref={form}>
                <div className="row">
                    <div className="col-md-8">
                        <div className="form-group">
                            <label htmlFor="title">Rezepttitel</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="title"
                                value={recipe.title}
                                onChange={handleInputChange}
                                validations={[required]}
                                placeholder="Der Name deines Rezepts..."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Beschreibung</label>
                            <Textarea
                                type="textarea"
                                className="form-control"
                                rows="6"
                                name="description"
                                value={recipe.description}
                                onChange={handleInputChange}
                                validations={[required]}
                                placeholder="Eine detaillierte Beschreibung deines Rezepts..."
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label>Bild</label>
                        <div className="form-group">
                            <div className="custom-file">
                                <Input
                                    type="file"
                                    className="custom-file-input"
                                    id="inputGroupFile02"
                                    onChange={selectFile}
                                    validations={[required]}
                                />
                                <label className="custom-file-label" htmlFor="inputGroupFile02">
                                    {currentFile ? currentFile.name : 'Choose file'}
                                </label>
                            </div>
                            {fileSizeError && (
                                <div className="alert alert-danger" role="alert">
                                    Bitte Bild hochladen, das kleiner als 1MB ist.
                                </div>
                            )}
                        </div>
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '190px', objectFit: 'cover' }} />
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="duration">Zubereitungszeit</label>
                        <div className="form-group">
                            <Input
                                type="number"
                                className="form-control"
                                name="duration"
                                value={recipe.duration}
                                onChange={handleInputChange}
                                validations={[required]}
                                onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                                placeholder="Zubereitungszeit in Minuten..."
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="difficulty">Schwierigkeit</label>
                        <div className="form-group">
                            <Select
                                className="form-control"
                                name="difficulty"
                                value={recipe.difficulty}
                                onChange={handleInputChange}
                                validations={[required]}
                            >
                                <option disabled value="">Wähle einen aus...</option>
                                <option value="Leicht">Leicht</option>
                                <option value="Mittel">Mittel</option>
                                <option value="Schwer">Schwer</option>
                                <option value="Profi">Profi</option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="price">Kosten</label>
                        <div className="form-group">
                            <Input
                                type="number"
                                className="form-control"
                                name="price"
                                value={recipe.price}
                                onChange={handleInputChange}
                                validations={[required]}
                                onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                                placeholder="Gesamtkosten des Rezepts..."
                            />
                        </div>
                    </div>
                </div>
                <label htmlFor="ingredients">Zutaten</label>
                <div className="row">
                    <div className="col-md-3">
                        <Input
                            type="number"
                            className="form-control"
                            name="amount"
                            placeholder="Menge"
                            value={ingredientsData.amount}
                            onChange={handleInputChangeIngredient}
                            onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                        />
                    </div>
                    <div className="col-md-3">
                        <Select
                            className="form-control"
                            name="unit"
                            value={ingredientsData.unit}
                            onChange={handleInputChangeIngredient}
                        >
                            <option disabled value="">Einheit auswählen</option>
                            <option value="ml">ml</option>
                            <option value="l">liter</option>
                            <option value="g">gramm</option>
                            <option value="kp">kg</option>
                            <option value="TL">TL</option>
                            <option value="EL">EL</option>
                        </Select>
                    </div>
                    <div className="col-md-4">
                        <Input
                            type="text"
                            className="form-control"
                            name="ingredient"
                            placeholder="Zutat"
                            value={ingredientsData.ingredient}
                            onChange={handleInputChangeIngredient}
                        />
                    </div>
                    <div className="col-md-2">
                        <button
                            className="btn btn-outline-success"
                            style={{ width: '100%' }}
                            type="button"
                            onClick={submitIngredient}
                        >
                            Hinzufügen
                        </button>
                    </div>
                </div>
                {ingredientsArray.length > 0 && (
                    <div>
                        <label>Hinzugefügte Zutaten</label>
                        {ingredientsArray.map((ingredient, index) => (
                            <div className="row" key={index}>
                                <div className="col-md-3">
                                    <Input
                                        type="number"
                                        className="form-control"
                                        value={ingredient.amount}
                                        onChange={(e) => updateIngredient(e, index, "amount")}
                                        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Select
                                        className="form-control"
                                        name="unit"
                                        value={ingredient.unit}
                                        onChange={(e) => updateIngredient(e, index, "unit")}
                                    >
                                        <option value="ml">ml</option>
                                        <option value="l">liter</option>
                                        <option value="g">gramm</option>
                                        <option value="kp">kg</option>
                                        <option value="TL">TL</option>
                                        <option value="EL">EL</option>
                                    </Select>
                                </div>
                                <div className="col-md-4">
                                    <Input
                                        type="text"
                                        className="form-control"
                                        value={ingredient.ingredient}
                                        onChange={(e) => updateIngredient(e, index, "ingredient")}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button
                                        className="btn btn-outline-danger"
                                        style={{ width: '100%' }}
                                        type="button"
                                        onClick={() => deleteIngredient(index)}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {submitted && ingredientsArray.length === 0 && (
                    <div className="alert alert-danger" role="alert">
                        Bitte eine Zutatsangabe hinzufügen.
                    </div>
                )}
                <label htmlFor="ingredients">Zubereitungsschritte</label>
                <div className="row">
                    <div className="col-md-10">
                        <Textarea
                            type="textarea"
                            rows="1"
                            className="form-control"
                            name="step"
                            value={stepData.step}
                            onChange={handleInputChangeStep}
                            placeholder="Hier kommen nach und nach die Schritte hinzu..."
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-outline-success" type="button" style={{ width: '100%' }} onClick={submitStep}>Hinzufügen</button>
                    </div>
                </div>
                {stepsArray.length > 0 && (
                    <div>
                        <label>Hinzugefügte Schritte</label>
                        {stepsArray.map((step, index) => (
                            <div className="row" key={index}>
                                <div className="col-md-10">
                                    <Textarea
                                        type="text"
                                        rows="1"
                                        className="form-control"
                                        value={step.step}
                                        onChange={e => updateStep(e, index)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-outline-danger" type="button" style={{ width: '100%' }} onClick={() => deleteStep(index)}>Entfernen</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {submitted && stepsArray.length === 0 && (
                    <div className="alert alert-danger" role="alert">
                        Bitte einen Zubereitungsschritt hinzufügen.
                    </div>
                )}
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="tags">Kategorien hinzufügen</label>
                        <Input
                            type="text"
                            className="form-control"
                            name="name"
                            value={tagData.name}
                            onChange={handleInputChangeTag}
                            placeholder="Wähle min. eine Kategorie für ihr Rezept"
                        />
                    </div>
                    <div className="col-md-4">
                        <label>Hinzugefügte Kategorien</label>
                        {tagsArray.map((tag, index) => (
                            <div className="badge btn-success" style={{ margin: '5px' }} key={index}>
                                {tag.name + "  "}
                                <div
                                    style={{ color: 'red' }}
                                    type="button"
                                    onClick={() => deleteTag(index)}
                                >
                                    X
                                </div>
                            </div>
                        ))}
                        {submitted && tagsArray.length === 0 && (
                            <div className="alert alert-danger" role="alert">
                                Bitte einen Tag hinzufügen.
                            </div>
                        )}
                    </div>
                    <div className="col-md-4">
                        <label>Vorschläge</label>
                        {suggestedTags.length > 0 &&
                            suggestedTags.map((tag, index) => (
                                <div
                                    className="badge btn-success"
                                    style={{ margin: '5px' }}
                                    key={index}
                                    onClick={() => selectTag(tag)}
                                >
                                    {tag}
                                </div>
                            ))}
                    </div>

                </div>
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>

            <div style={{ position: "fixed", top: '90vh', right: '50%', transform: 'translateX(50%)', zIndex: 999 }}>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                    <button onClick={saveRecipe} className="btn btn-success">
                        Zur Prüfung hochladen
                    </button>
                </div>
            </div>
            <div style={{ height: '100px' }}></div>
        </div>
    );
};

export default RecipeAdd;