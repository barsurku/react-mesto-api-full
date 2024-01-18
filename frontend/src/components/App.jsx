import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/Api";
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Register from "./Register";
import Login from "./Login";
import * as Auth from "../utils/Authorization";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import ErrorPageNotFound from "./ErrorPageNotFound";

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);
  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard;
  const [deleteMyCard, setDeleteMyCard] = React.useState();

  // вход и регистрация
  const [email, setEmail] = React.useState({ email: "" });
  const [registrationSuccess, setregistrationSuccess] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isInfoTooltipPopup, setIsInfoTooltipPopup] = React.useState(false);

  const navigate = useNavigate();

  function openInfoTooltip() {
    setIsInfoTooltipPopup(!isInfoTooltipPopup);
  }
  function closeInfoTooltip() {
    setIsInfoTooltipPopup(false);
  }

  // регистрация
  const handleRegisterUser = (email, password) => {
    Auth.register(email, password)
      .then((res) => {
        console.log(res);
        setregistrationSuccess(true);
        openInfoTooltip();
        navigate("/sign-in", { replace: true });
      })
      .catch((error) => {
        console.error(error);
        openInfoTooltip();
      });
  };

  // авторизация
  function handleLoginUser(email, password) {
    Auth.login(email, password)
      .then((data) => {
        if (data.token) {
          setLoggedIn(true);
          setEmail({ email: email });
          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        setregistrationSuccess(false);
        openInfoTooltip();
        console.error(error);
      });
  }

  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    navigate("/sign-in", { replace: true });
  }

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      const token = localStorage.getItem("jwt");
      Auth.getToken(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setEmail(res.email);
            navigate("/", { replace: true });
          }
        })
        .catch((error) => {
          localStorage.removeItem("jwt");
          console.error(error);
        });
    }
  }, [navigate]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([user, cardData]) => {
          setCurrentUser(user);
          setCards(cardData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loggedIn]);

  // функция лайка и дизлайка
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);

    if (!isLiked) {
      api
        .setCardLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      api
        .removeCardLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  // удаление карточки с подтверждением
  const handleCardDelete = (event) => {
    event.preventDefault();

    setIsLoading(true);
    api.deleteMyCard(deleteMyCard._id).then(() =>
      api
        .getInitialCards()
        .then((item) => {
          setCards(item);
        })
        .then(() => closeAllPopups())
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setIsLoading(false))
    );
  };

  // функция изменения профиля
  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .editProfile(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }

  // функция изменения аватара
  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .changeProfileAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }

  // функция добавления новой карточки
  function handleAddPlaceSubmit(cardData) {
    setIsLoading(true);
    api
      .addNewCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  const handleDeleteClick = (card) => {
    setDeleteCardPopupOpen(true);
    setDeleteMyCard(card);
  };

  // закрытие попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setDeleteCardPopupOpen(false);
  }

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} signOut={handleLogout} />
        <Routes>
          <Route
            path="/sign-up"
            element={<Register onRegister={handleRegisterUser} />}
          />
          <Route
            path="/sign-in"
            element={<Login onLogin={handleLoginUser} />}
          />
          <Route path="*" element={<ErrorPageNotFound />} />
          <Route
            path="/"
            element={
              <ProtectedRoute element={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleteClick}
                loggedIn={loggedIn}
              />
            }
          ></Route>
        </Routes>
        <Footer />
      </div>

      {/* <!-- попап редактирования профиля --> */}
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
        isLoading={isLoading}
      />

      {/* <!--попап изменения аватарки--> */}
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
      />

      {/* <!-- попап добавления карточки --> */}
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
        isLoading={isLoading}
      />

      {/* <!-- попап карточки --> */}
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />

      {/* <!-- попап подтверждения удаления карточки --> */}
      <PopupWithForm
        name={"confirm-delete"}
        title={"Вы уверены?"}
        isOpen={isDeleteCardPopupOpen}
        onClose={closeAllPopups}
        buttonText={isLoading ? "Удаление..." : "Да"}
        isLoading={isLoading}
        onSubmit={handleCardDelete}
        card={deleteMyCard}
      />
      
      {/* попап ошибки или успеха */}
      <InfoTooltip
        registrationSuccess={registrationSuccess}
        isOpen={isInfoTooltipPopup}
        onClose={closeInfoTooltip}
      />
    </CurrentUserContext.Provider>
  );
}
