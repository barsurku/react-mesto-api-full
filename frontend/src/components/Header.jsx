import React from "react";
import logo from "../images/logo.svg";

import { Routes, Route, Link } from "react-router-dom";

export default function Header(props) {
  const { email } = props.email;

  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="Логотип" />

      <Routes>
        <Route
          path="/sign-up"
          element={
            <Link className="header__link" to="/sign-in">
              Войти
            </Link>
          }
        ></Route>

        <Route
          path="/sign-in"
          element={
            <Link className="header__link" to="/sign-up">
              Регистрация
            </Link>
          }
        ></Route>

        <Route
          exact
          path="/"
          element={
            <div className="header__login">
              <p className="header__email">{email}</p>
              <button className="header__exit" onClick={props.signOut}>
                Выйти
              </button>
            </div>
          }
        ></Route>

      </Routes>
    </header>
  );
}