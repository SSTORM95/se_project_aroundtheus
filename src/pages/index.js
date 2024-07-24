import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import UserInfo from "../components/UserInfo.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import DeletePopup from "../components/DeletePopup.js";
import Section from "../components/Section.js";
import "./index.css";
import { config } from "../utils/constants.js";
import { initialCards } from "../utils/constants.js";
import Popup from "../components/Popup.js";
import Api from "../components/Api.js";

// Elements //

const modal = document.querySelectorAll(".modal");
const addCardModal = document.querySelector("#card-add-modal");
const addCardForm = document.forms["add-form"];
const cardTitleInput = addCardForm.querySelector("#card-title");
const cardLinkInput = addCardForm.querySelector("#card-link");
const addNewCardBtn = document.querySelector("#profile-add-button");
const profileEditBtn = document.querySelector("#profile-edit-button");
const changeAvatarBtn = document.querySelector("#profile-picture-btn");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileModalCLoseButton = profileEditModal.querySelector(
  "#modal-close-button"
);
const addCardModalCLoseButton = addCardModal.querySelector(
  "#modal-close-button"
);
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title");
const profileDescriptionInput = document.querySelector("#profile-description");
const profileEditForm = document.forms["edit-form"];
const profileAvatarForm = document.forms["profile-picture-form"];
const profileImageModal = document.querySelector("#profile-picture-modal");
const cardListEl = document.querySelector(".gallery__cards");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;
const imageModal = document.querySelector("#image-popup-modal");
const imageModalCloseButton = imageModal.querySelector("#modal-close-button");
const imageModalImg = imageModal.querySelector(".modal__image");
const imageModalTitle = imageModal.querySelector(".modal__image_caption");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "0e73398c-f025-4150-bad3-59b841241c02",
    "Content-Type": "application/json",
  },
});

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
  profileImage: ".profile__image",
});

// Pop Ups //

const deleteImgPopup = new DeletePopup("#confirm-modal");
deleteImgPopup.setEventListeners();

const popupWithImage = new PopupWithImage("#image-popup-modal");
popupWithImage.setEventListeners();

function handleImageClick(card) {
  const mappedData = {
    link: card.link,
    name: card.name,
  };
  popupWithImage.open(mappedData);
}

const profileEditPopup = new PopupWithForm(
  "#profile-edit-modal",
  handleEditProfileSubmit
);

profileEditPopup.setEventListeners();

const addCardPopup = new PopupWithForm("#card-add-modal", (formData) => {
  handleCardSubmit(formData);
});
addCardPopup.setEventListeners();

const editAvatarModal = new PopupWithForm(
  "#profile-picture-modal",
  handleChangeAvatar
);
editAvatarModal.setEventListeners();

// render //
let cardSection;

function renderCard(data) {
  const card = createCard(data);
  cardSection.addItem(card);
}

function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    handleImageClick,
    deleteBtnHandler,
    handleCardLike
  );
  return card.getCard();
}

// Event listener//

profileEditBtn.addEventListener("click", () => {
  const { name, description } = userInfo.getUserInfo();
  profileTitleInput.value = name;
  profileDescriptionInput.value = description;
  profileEditPopup.open();
  formValidators["edit-form"].resetValidation();
});

addNewCardBtn.addEventListener("click", () => {
  addCardPopup.open();
  formValidators["add-form"].resetValidation();
});

changeAvatarBtn.addEventListener("click", () => {
  editAvatarModal.open();
  formValidators["profile-picture-form"].resetValidation();
});

// API REQUEST //
function handleSubmit(
  request,
  popupInstance,
  reset,
  loadingText = "Saving..."
) {
  popupInstance.renderLoading(true, loadingText);

  if (typeof request !== "function") {
    console.error("Request is not a function", request);
    return;
  }

  const result = request();
  if (!(result instanceof Promise) || typeof result.then !== "function") {
    console.error("Request did not return a promise", result);
    return;
  }

  result
    .then(() => {
      popupInstance.close();

      if (reset) {
        popupInstance.reset();
      }
    })
    .catch((error) => {
      console.error("Request failed:", error);
    })
    .finally(() => {
      popupInstance.renderLoading(false);
    });
}

function deleteBtnHandler(card) {
  deleteImgPopup.open();
  if (card && card.id) {
    deleteImgPopup.setDeleteHandler(() => {
      function handleRequest() {
        return api.deleteCard(card.id).then(() => {
          card.handleDeleteCard();
        });
      }
      handleSubmit(handleRequest, deleteImgPopup, false, "Deleting...");
    });
  }
}

function handleCardLike(card) {
  if (card.isLiked) {
    return api
      .removeLike(card.id)
      .then(() => {
        card.handleLike(false);
      })
      .catch((err) => {
        console.log(`Unable to process request, ${err}`);
      });
  }
  if (!card.isLiked) {
    return api
      .addLike(card.id)
      .then(() => {
        card.handleLike(true);
      })
      .catch((err) => {
        console.log(`Unable to process request, ${err}`);
      });
  }
}

function handleCardSubmit(inputValues) {
  function handleRequest() {
    return api.addNewCard(inputValues).then((res) => {
      renderCard(res);
    });
  }

  handleSubmit(handleRequest, addCardPopup, true);
}

function handleChangeAvatar(input) {
  function handleRequest() {
    return api.changeProfileImg(input).then((res) => {
      userInfo.updateProfileImage(res);
    });
  }
  handleSubmit(handleRequest, editAvatarModal, true);
}

api
  .loadUserInfo()
  .then((userData) => {
    userInfo.updateProfileImage(userData);
    userInfo.setUserInfo({
      name: userData.name,
      about: userData.about,
    });
  })
  .catch((err) => {
    console.error(`Unable to process request, Error: ${err}`);
  });

api
  .getInitialCards()
  .then((cards) => {
    cardSection = new Section(
      {
        items: cards,
        renderer: renderCard,
      },
      ".gallery__cards"
    );
    cardSection.renderItems(cards);
  })
  .catch((err) => {
    console.log(`Unable to process request, ${err}`);
  });

function handleEditProfileSubmit(inputValues) {
  function handleRequest() {
    return api.updateUserInfo(inputValues).then((userData) => {
      userInfo.setUserInfo(userData);
    });
  }
  handleSubmit(handleRequest, profileEditPopup, true);
}

// form validators //

const formValidators = {};

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => {
    const validator = new FormValidator(config, formEl);
    const formName = formEl.getAttribute("name");

    formValidators[formName] = validator;
    validator.enableValidation();
  });
};

enableValidation(config);
