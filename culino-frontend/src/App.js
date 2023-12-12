import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from './Logo.png';
import menu from './Menu.png';
import "./App.css";

import AuthService from "./services/AuthService";

import Login from "./components/User/Login";
import Register from "./components/User/Register";
import RegisterMod from "./components/User/RegisterMod";

import RecipeAdd from "./components/Recipes/RecipeAdd";
import RecipeEdit from "./components/Recipes/RecipeEdit.js";
import RecipesList from "./components/Recipes/RecipesListOwn";
import RecipesListMod from "./components/Recipes/RecipesListMod";
import Recipes from "./components/Recipes/Recipes";
import RecipesDetail from "./components/Recipes/RecipesDetail";

import EventBus from "./common/EventBus";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  // Check if a user is logged in on component mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    // Listen for "logout" event
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      // Clean up event listener
      EventBus.remove("logout");
    };
  }, []);


  // Logout function
  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  // Navigation bar collapse state
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Toggle navigation bar collapse state
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      {/* Navigation bar */}
      <nav className="navbar fixed-top navbar-expand-lg">
        <Link to={"/"} className="navbar-brand">
          <img src={logo} className="App-logo" alt="logo" />
        </Link>
        <button
          className="navbar-toggler"
          style={{ padding: "none" }}
          type="button"
          onClick={handleToggleCollapse}
        >
          <img src={menu} className="App-logo" alt="menu" />
        </button>
        <div className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`}>
          <div className="navbar-nav mr-auto">
            {currentUser && (
              <li className="nav-item">
                <Link to={"/"} className="nav-link" onClick={handleToggleCollapse}>
                  Rezeptübersicht
                </Link>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
                <Link to={"/add"} className="nav-link" onClick={handleToggleCollapse}>
                  Rezept hinzufügen
                </Link>
              </li>
            )}
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link" onClick={handleToggleCollapse}>
                  Rezepte freischalten
                </Link>
              </li>
            )}
            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/registerMod"} className="nav-link" onClick={handleToggleCollapse}>
                  Erstelle Moderator
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/myrecipes"} className="nav-link" onClick={handleToggleCollapse}>
                  {currentUser.username}'s Rezepte
                </Link>
              </li>
              <li className="nav-item">
                <a href="/" className="nav-link" onClick={logOut}>
                  Logout
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link" onClick={handleToggleCollapse}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/register"} className="nav-link" onClick={handleToggleCollapse}>
                  Registrieren
                </Link>
              </li>
            </div>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mod" element={<RecipesListMod />} />
          <Route path="/registerMod" element={<RegisterMod />} />
          <Route path="/" element={<Recipes />} />
          <Route path="/myrecipes" element={<RecipesList />} />
          <Route path="/add" element={<RecipeAdd />} />
          <Route path="/recipes/:id" element={<RecipeEdit />} />
          <Route path="/recipe/:id" element={<RecipesDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;