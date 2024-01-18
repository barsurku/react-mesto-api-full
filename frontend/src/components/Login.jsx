import React from "react";
import { useState } from "react";


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
    if (!email || !password) {
      return;
    }

    setinputUserValue({ email: "", password: "" });
    props.onLogin(email, password);

  };

  return (
    <div className="sign-up">
      <form className="sign-up__form" onSubmit={handleSubmit}>
        <h2 className="sign-up__title">Вход</h2>

        <input
          id="email"
          required
          minLength="2"
          maxLength="40"
          className="sign-up__input"
          name="email"
          value={inputUserValue.email}
          placeholder="Email"
          onChange={handleSetUserInfo}
          type="email"
        />
        <span className="popup__input-error" />

        <input
          id="password"
          required
          minLength="2"
          maxLength="200"
          className="sign-up__input"
          name="password"
          value={inputUserValue.password}
          onChange={handleSetUserInfo}
          placeholder="Пароль"
          type="password"
        />
        <span className="popup__input-error" />
        <button
          className="popup__submit popup__submit_type-signup"
          type="submit"
          name="button-submit"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
