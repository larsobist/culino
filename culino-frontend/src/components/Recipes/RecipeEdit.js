import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import Select from "react-validation/build/select";
import CheckButton from "react-validation/build/button";

import RecipeDataService from "../../services/RecipeService";
import FileService from "../../services/FileService";

const RecipeEdit = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

  //Initial state
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

  //Get Recipe with ID
  const [currentRecipe, setCurrentRecipe] = useState(initialRecipeState);
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

  useEffect(() => {
    if (currentRecipe.id) {
      const {
        id,
        published,
        author,
        title,
        description,
        fileName,
        difficulty,
        duration,
        price,
        ingredients,
        steps,
        tags,
      } = currentRecipe;

      setCurrentRecipe({
        id,
        published,
        author,
        title,
        description,
        fileName,
        difficulty,
        duration,
        price,
        ingredients: [...ingredients],
        steps: [...steps],
        tags: [...tags],
      });
    }
  }, [currentRecipe]);

  //Input change
  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentRecipe({ ...currentRecipe, [name]: value });
  };

  //Add Step 
  const [currentStep, setCurrentStep] = useState("");
  const addStep = () => {
    setCurrentRecipe(prevState => ({
      ...prevState,
      steps: [...prevState.steps, currentStep]
    }));
    setCurrentStep("");
  };

  //Step change
  const handleStepChange = (event, index) => {
    const { value } = event.target;
    setCurrentRecipe(prevState => {
      const updatedSteps = [...prevState.steps];
      updatedSteps[index] = value;
      return { ...prevState, steps: updatedSteps };
    });
  };

  //delete step
  const deleteStep = index => {
    const updatedSteps = [...currentRecipe.steps];
    updatedSteps.splice(index, 1);
    setCurrentRecipe({ ...currentRecipe, steps: updatedSteps });
  };

  //Tag
  const [tagData, setTagData] = useState({ name: "" });
  const [suggestedTags, setSuggestedTags] = useState([]);
  const possibleTags = [
    "Brot und Brötchen", "Cremes", "Eis", "Kekse & Plätzchen", "Konfiserie", "Kuchen", "Tarte/Quiche", "Torten", "Beilage", "Gemüse", "Kartoffeln", "Klöße", "Nudeln", "Reis/Getreide", "Dessert", "Frühstück", "Hauptspeise", "Eier", "Eintopf", "Fisch", "Geflügel", "Wildgeflügel", "Gemüse", "Kartoffeln", "Krustentier & Muscheln", "Lamm & Ziege", "Pasta & Nudel", "Pilze", "Pizza", "Reis/Getreide", "Rind", "Schwein", "Wild & Kaninchen", "Salat", "Eier & Käse", "Fleisch & Wurst", "Früchte", "Gemüse", "Kartoffel", "Fisch", "Pilze", "Salatdressing", "Warme Salate", "Suppen", "Vorspeisen", "Afrika", "Ägypten", "Marokko", "Südafrika", "Amerika", "Lateinamerika", "Mexico", "USA & Kanada", "Asien", "Chinesisch", "Indisch", "Japanisch", "Koreanisch", "Thailand", "Vietnam", "Australien", "Europa", "Belgien", "Dänemark", "Deutschland", "Finnland", "Frankreich", "Griechenland", "Großbritannien", "Italien", "Luxemburg", "Malta", "Niederlande", "Norwegen", "Österreich", "Polen", "Portugal", "Russland", "Schweden", "Schweiz", "Spanien", "Tschechien", "Türkei", "Ungarn", "Weißrussland", "Karibik & Exotik", "Mittlerer und Naher Osten", "Osteuropa", "Fettarm", "Kalorienarm", "Vegan", "Vegetarisch", "Vollwert", "Festlich", "Fingerfood", "Kinder", "Party", "Preiswert", "Resteverwertung", "Saucen & Dips", "Schnell", "Studentenküche", "Aufstrich", "Backen", "Beilage", "Brotspeise", "Eierspeise", "Eintopf", "Fisch", "Frucht", "Frühstück", "Gemüse", "Auflauf", "Grillen", "Wok", "Pasta", "Saucen", "Snacks"
  ];

  //Tag change
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

  //Selected Tag
  const selectTag = (tag) => {
    setCurrentRecipe((prevState) => ({
      ...prevState,
      tags: [...prevState.tags, tag],
    }));
    setTagData({ name: "" });
    setSuggestedTags([]);
  };

  //Delete Tag
  const deleteTag = (index) => {
    const updatedTags = [...currentRecipe.tags];
    updatedTags.splice(index, 1);
    setCurrentRecipe({ ...currentRecipe, tags: updatedTags });
  };

  //Set Ingredient
  const [currentIngredient, setCurrentIngredient] = useState({
    amount: "",
    unit: "",
    ingredient: ""
  });

  //Add Ingredient
  const addIngredient = () => {
    setCurrentRecipe({
      ...currentRecipe,
      ingredients: [...currentRecipe.ingredients, currentIngredient]
    });
    setCurrentIngredient({ amount: "", unit: "", ingredient: "" });
  };

  //Ingredient change
  const handleIngredientChange = (event, index) => {
    const { name, value } = event.target;
    const updatedIngredients = [...currentRecipe.ingredients];
    updatedIngredients[index][name] = value;
    setCurrentRecipe({ ...currentRecipe, ingredients: updatedIngredients });
  };

  //Delete ingredient
  const deleteIngredient = index => {
    const updatedIngredients = [...currentRecipe.ingredients];
    updatedIngredients.splice(index, 1);
    setCurrentRecipe({ ...currentRecipe, ingredients: updatedIngredients });
  };

  // Validation
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

  //Update Request
  const updateRecipe = (e) => {
    e.preventDefault();

    setSubmitted(true);

    form.current.validateAll();

    //Check validations
    if (checkBtn.current.context._errors.length === 0) {
      //Unique Name for img
      if (currentFile) {
        const uuid = uuidv4();
        const modifiedName = `${uuid}-${currentFile.name}`;

        const modifiedFile = new File([currentFile], modifiedName, {
          type: currentFile.type,
        });
        //Img upload
        FileService.uploadImg(modifiedFile)
          .then((response) => {
            console.log("Image uploaded successfully:", response.data);
            setCurrentFile(undefined); // Clear the selected file

            const updatedRecipe = {
              ...currentRecipe,
              fileName: modifiedName, // Update the filename with the modified name
            };

            if (updatedRecipe.ingredients.length > 0 && updatedRecipe.steps.length > 0 && updatedRecipe.tags.length > 0) {
              RecipeDataService.update(currentRecipe.id, updatedRecipe)
                .then(response => {
                  console.log(response.data);
                  navigate('/myrecipes')
                })
                .catch(e => {
                  console.log(e);
                });
            }
          })
          .catch((error) => {
            console.log("Error uploading the image:", error);
            setCurrentFile(undefined); // Clear the selected file
          });
      } else {
        const updatedRecipe = { ...currentRecipe };

        if (updatedRecipe.ingredients.length > 0 && updatedRecipe.steps.length > 0 && updatedRecipe.tags.length > 0) {
          RecipeDataService.update(currentRecipe.id, updatedRecipe)
            .then(response => {
              console.log(response.data);
              navigate('/myrecipes')
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    }
  };

  //Delete img before selecting new one
  const deleteImage = () => {
    FileService.removeImg(currentRecipe.fileName)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    setCurrentRecipe({ ...currentRecipe, fileName: "" });
  };

  // Image selection
  const [currentFile, setCurrentFile] = useState(undefined);
  const [imagePreview, setImagePreview] = useState("");
  const [fileSizeError, setFileSizeError] = useState(false);
  const selectFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file.size)
      const fileSizeInMB = file.size / (1024 * 1024);
      console.log(file.name)
      //Img size
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

  //delete Recipe
  const deleteRecipe = () => {
    RecipeDataService.remove(currentRecipe.id)
      .then(response => {
        console.log(response.data);
        navigate("/recipes");
      })
      .catch(e => {
        console.log(e);
      });

    //delete image of recipe
    FileService.removeImg(currentRecipe.fileName)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentRecipe ? (
        <div>
          <h4>Dein Rezept</h4>
          <Form onSubmit={updateRecipe} ref={form}>
            <div className="row">
              <div className="col-md-8">
                <div className="form-group">
                  <label htmlFor="title">Rezepttitel</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="title"
                    value={currentRecipe.title}
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
                    value={currentRecipe.description}
                    onChange={handleInputChange}
                    validations={[required]}
                    placeholder="Eine detaillierte Beschreibung deines Rezepts..."
                  />
                </div>
              </div>
              <div className="col-md-4">
                <label>Bild</label>
                <div>
                  {currentRecipe.fileName ? (
                    <div>
                      <button className="btn btn-outline-danger" style={{ marginBottom: "15px" }} onClick={deleteImage}>
                        Bild löschen
                      </button>
                      <img
                        src={`http://localhost:8080/api/files/${currentRecipe.fileName}`}
                        alt={currentRecipe.title}
                        style={{ width: '100%', maxHeight: '190px', objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="row align-items-center">
                        <div className="col-12">
                          <div className="input-group mb-3 align-items-center">
                            <div className="custom-file">
                              <Input
                                type="file"
                                className="custom-file-input"
                                id="inputGroupFile02"
                                onChange={selectFile}
                                validations={[required]}
                              />
                              <label className="custom-file-label" htmlFor="inputGroupFile02">
                                {currentFile ? currentFile.name : "Choose file"}
                              </label>
                            </div>
                          </div>
                          {fileSizeError && (
                            <div className="alert alert-danger" role="alert">
                              Bildgröße muss kleiner als 1MB sein.
                            </div>
                          )}
                        </div>
                      </div>
                      {imagePreview && (
                        <div className="row align-items-center">
                          <div className="col-12">
                            <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '190px', objectFit: 'cover' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="duration">Zubereitungszeit</label>
                  <Input
                    type="number"
                    className="form-control"
                    name="duration"
                    value={currentRecipe.duration}
                    onChange={handleInputChange}
                    validations={[required]}
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    placeholder="Zubereitungszeit in Minuten..."
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="duration">Schwierigkeit</label>
                  <Select
                    className="form-control"
                    name="difficulty"
                    value={currentRecipe.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="Leicht">Leicht</option>
                    <option value="Mittel">Mittel</option>
                    <option value="Schwer">Schwer</option>
                    <option value="Profi">Profi</option>
                  </Select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="duration">Kosten</label>
                  <Input
                    type="number"
                    className="form-control"
                    name="price"
                    value={currentRecipe.price}
                    onChange={handleInputChange}
                    validations={[required]}
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    placeholder="Gesamtkosten des Rezepts..."
                  />
                </div>
              </div>
            </div>
            <label htmlFor="ingredients">Hinzugefügte Zutaten</label>
            <div className="row">
              {currentRecipe.ingredients.map((ingredient, index) => (
                <div key={index} className="input-group">
                  <div className="col-md-3">
                    <Input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={ingredient.amount}
                      onChange={e => handleIngredientChange(e, index)}
                      onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    />
                  </div>
                  <div className="col-md-3">
                    <Select
                      className="form-control"
                      name="unit"
                      value={ingredient.unit}
                      onChange={e => handleIngredientChange(e, index)}
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
                      name="ingredient"
                      value={ingredient.ingredient}
                      onChange={e => handleIngredientChange(e, index)}
                    />
                  </div>
                  <div className="col-md-2">
                    <div className="input-group-append">
                      <button className="btn btn-outline-danger" type="button" style={{ width: '100%' }} onClick={() => deleteIngredient(index)}>Löschen</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <label>Weitere Zutatsangabe hinzufügen</label>
            <div className="row">
              <div className="col-md-3">
                <div className="input-group">
                  <Input type="number"
                    className="form-control"
                    name="amount"
                    value={currentIngredient.amount}
                    onChange={e =>
                      setCurrentIngredient({
                        ...currentIngredient,
                        amount: e.target.value
                      })
                    }
                    placeholder="Menge"
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <Select
                  className="form-control"
                  name="unit"
                  value={currentIngredient.unit}
                  onChange={e =>
                    setCurrentIngredient({
                      ...currentIngredient,
                      unit: e.target.value
                    })
                  }
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
                <Input type="text"
                  className="form-control"
                  name="ingredient"
                  value={currentIngredient.ingredient}
                  onChange={e =>
                    setCurrentIngredient({
                      ...currentIngredient,
                      ingredient: e.target.value
                    })
                  }
                  placeholder="Zutat" />
              </div>

              <div className="col-md-2">
                <div className="input-group-append">
                  <button className="btn btn-outline-success" type="button" style={{ width: '100%' }} onClick={addIngredient}>Hinzufügen</button>
                </div>
              </div>

            </div>
            {submitted && currentRecipe.ingredients.length === 0 && (
              <div className="alert alert-danger" role="alert">
                Bitte eine Zutatsangabe hinzufügen.
              </div>
            )}

            <div className="form-group">
              <label htmlFor="steps">Hinzugefügte Zubereitungsschritte</label>
              {currentRecipe.steps.map((step, index) => (
                <div className="row">
                  <div key={index} className="col-md-10">
                    <Textarea
                      type="textarea"
                      rows="1"
                      className="form-control"
                      value={step}
                      onChange={e => handleStepChange(e, index)}
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={() => deleteStep(index)}
                      style={{ width: '100%' }}
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
              <label>Weitere Schrittangabe</label>
              <div className="row">
                <div className="col-md-10">
                  <Textarea
                    type="text"
                    className="form-control"
                    rows="1"
                    value={currentStep}
                    onChange={e => setCurrentStep(e.target.value)}
                    placeholder="Hier kommen nach und nach die Schritte hinzu..."
                  />
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={addStep}
                    style={{ width: '100%' }}
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
              {submitted && currentRecipe.steps.length === 0 && (
                <div className="alert alert-danger" role="alert">
                  Bitte eine Zutatsangabe hinzufügen.
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="tags">Kategorien bearbeiten</label>
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
                {currentRecipe.tags.map((tag, index) => (
                  <div key={index} className="badge btn-success btn-sm" style={{ margin: '5px' }}>
                    {tag + "   "}
                    <div
                      style={{ color: 'red' }}
                      onClick={() => deleteTag(index)}
                    >
                      x
                    </div>
                  </div>
                ))}
                {submitted && currentRecipe.tags.length === 0 && (
                  <div className="alert alert-danger" role="alert">
                    Bitte eine Kategorie hinzufügen.
                  </div>
                )}
              </div>
              {suggestedTags.length > 0 && (
                <div className="col-md-4">
                  <label>Vorschläge</label>
                  {suggestedTags.map((tag, index) => (
                    <div
                      className="badge btn-success btn-sm"
                      style={{ margin: '5px' }}
                      key={index}
                      onClick={() => selectTag(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}

            </div>
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>

          <div style={{ position: "fixed", top: '90vh', right: '50%', transform: 'translateX(50%)', zIndex: 999 }}>
            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
              <button className="btn btn-danger" style={{ marginRight: "10px" }} onClick={deleteRecipe}>
                Rezept Löschen
              </button>
              <button onClick={updateRecipe} className="btn btn-success">
                Rezept aktualisieren
              </button>
            </div>
          </div>
          <div style={{ height: '100px' }}></div>
        </div>
      ) : (
        <></>
      )}
    </div>

  );
};

export default RecipeEdit;