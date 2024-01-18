import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login(props) {
  const [inputUserValue, setinputUserValue] = useState({
    email: "",
    password: "",
  });

  const handleSetUserInfo = (event) => {
    const { name, value } = event.target;

    setinputUserValue({
      ...inputUserValue,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { email, password } = inputUserValue;
    setinputUserValue({ email: "", password: "" });
    props.onRegister(email, password);
  };

  return (
    <div className="register">
      <form className="register__form" onSubmit={handleSubmit}>
        <h3 className="register__title">Регистрация</h3>

        <input
          id="email"
          required
          minLength="2"
          maxLength="40"
          className="register__input"
          name="email"
          value={inputUserValue.email}
          placeholder="Email"
          onChange={handleSetUserInfo}
          type="email"
        />
        <span className="popup__input-error"></span>

        <input
          id="password"
          required
          minLength="2"
          maxLength="200"
          className="register__input"
          name="password"
          value={inputUserValue.password}
          onChange={handleSetUserInfo}
          placeholder="Пароль"
          type="password"
        />
        <span className="popup__input-error"></span>

        <button className="popup__submit popup__submit_type-register">
          Зарегистрироваться
        </button>
        <Link to="/sign-in" className="register__question-login">
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  );
}
