import React from "react";
import success from "../images/success.svg";
import fail from "../images/fail.svg";

export default function InfoTooltip(props) {
  return (
    <div className={`popup ${props.isOpen && "popup_open"}`}>
      <div className={`popup__tooltip`}>
        <img
          className="popup__tooltip-image"
          src={props.registrationSuccess ? success : fail}
          alt="Результат авторизации"
        />
        <button
          className="popup__close"
          type="button"
          onClick={props.onClose}
        ></button>
      </div>

      <p className="popup__tooltip-info-text">
        {props.registrationSuccess
          ? "Вы успешно зарегистрировались!"
          : "Что-то пошло не так! Попробуйте ещё раз."}
      </p>
    </div>
  );
}