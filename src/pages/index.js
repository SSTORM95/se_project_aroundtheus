import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import UserInfo from "../components/UserInfo.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import DeletePopup from "../components/DeletePopup.js";
import Section from "../components/Section.js";
import './index.css';
import { validationSettings } from "../utils/constants.js";
import { initialCards } from "../utils/constants.js";
import Popup from "../components/Popup.js";
import Api from "../components/Api.js"


// Elements //

const modal = document.querySelectorAll(".modal");
const addCardModal = document.querySelector("#card-add-modal");
const addCardForm = document.forms["add-form"];
const cardTitleInput = addCardForm.querySelector("#card-title");
const cardLinkInput = addCardForm.querySelector("#card-link");
const addNewCardBtn = document.querySelector("#profile-add-button");
const profileEditBtn = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector('#profile-edit-modal');
const profileModalCLoseButton = profileEditModal.querySelector("#modal-close-button");
const addCardModalCLoseButton = addCardModal.querySelector("#modal-close-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title");
const profileDescriptionInput = document.querySelector("#profile-description");
const profileEditForm = document.forms["edit-form"];
const profileAvatarForm = document.forms["profile-picture-form"];
const profileImageModal = document.querySelector("#profile-picture-modal");
const cardListEl = document.querySelector(".gallery__cards");
const cardTemplate = document.querySelector("#card-template").content.firstElementChild;
const imageModal = document.querySelector("#image-popup-modal");
const imageModalCloseButton = imageModal.querySelector("#modal-close-button");
const imageModalImg = imageModal.querySelector(".modal__image");
const imageModalTitle = imageModal.querySelector(".modal__image_caption");



const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers:{
  authorization: "0e73398c-f025-4150-bad3-59b841241c02",
  "Content-Type": "application/json"
  }
})



const userInfo = new UserInfo({
    nameSelector: ".profile__title",
    descriptionSelector: ".profile__description",
    profileImage: ".profile__image"
  });
 
// Pop Ups // 

const deleteImgPopup = new DeletePopup("#confirm-modal");
deleteImgPopup.setEventListeners();


const popupWithImage = new PopupWithImage("#image-popup-modal");
popupWithImage.setEventListeners();

function handleImageClick(card) {
  const mappedData = {
    link: card._link,
    name: card._name,
  };
  popupWithImage.open(mappedData);
}
   
const profileEditPopup = new PopupWithForm(
    "#profile-edit-modal", 
    handleEditProfileSubmit   
  );
  
profileEditPopup.setEventListeners();

const addCardPopup = new PopupWithForm(
    "#card-add-modal", 
    (formData) => {
      handleCardSubmit(formData);
    }
  );
addCardPopup.setEventListeners();

const editAvatarModal = new PopupWithForm (
  "#profile-picture-modal",
    handleChangeAvatar
)
editAvatarModal.setEventListeners()
  
// render //


function renderCard(data) {
  const card = createCard(data);
  document.querySelector('.gallery__cards').prepend(card);
}

function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    handleImageClick,
    deleteBtnHandler,
    handleCardLike
  )
  return card.getCard();
}





// Event listener//
const editFormValidator = new FormValidator(validationSettings, profileEditForm);
editFormValidator.enableValidation();

profileEditBtn.addEventListener("click", () => {
    const { name, description } = userInfo.getUserInfo();
    profileTitleInput.value = name;
    profileDescriptionInput.value = description;
    editFormValidator.toggleButtonState();
    profileEditPopup.open();
});

addNewCardBtn.addEventListener("click", () => {
    addCardPopup.open()
})


document.querySelector("#profile-picture-btn").addEventListener("click", () => {
  editAvatarModal.open();
})

addCardModal.addEventListener("submit", () => {
  const modalButton = addCardForm.querySelector(".modal__button");
  if(!addCardModal.classList.contains(".modal_opened")){
    modalButton.disabled = true;
    setTimeout(function() {
      modalButton.classList.add("modal__button_disabled");
    },500)
  }
})

profileImageModal.addEventListener("submit", () => {
  const modalButton = profileAvatarForm.querySelector(".modal__button");
  if(!profileImageModal.classList.contains(".modal_opened")){
    modalButton.disabled = true;
    setTimeout(function() {
      modalButton.classList.add("modal__button_disabled");
    },500)
  }
})

// form validators //

const avatarChangeValidator = new FormValidator(validationSettings, profileAvatarForm);
avatarChangeValidator.enableValidation();

const addFormValidator = new FormValidator(validationSettings, addCardForm);
addFormValidator.enableValidation();

// API REQUEST //
function handleSubmit(request, popupInstance, reset,  loadingText = "Saving...") {
  
  popupInstance.renderLoading(true, loadingText);
  
  if (typeof request !== 'function') {
    console.error('Request is not a function', request);
    return;
  }
  
  const result = request();
  if (!(result instanceof Promise) || typeof result.then !== 'function') {
    console.error('Request did not return a promise', result);
    return;
  }

  result
    .then(() => {
      
      popupInstance.close();

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
    deleteImgPopup.deleteHandler(() => {
      function handleRequest() {
        
        return api.deleteCard(card.id).then(() => {
          
          card.handleDeleteCard();
        });
      }
      handleSubmit(handleRequest, deleteImgPopup, false, "Deleting...");
    });
  } 
}

function handleCardLike(card){
  if(card.isLiked){
    return api.removeLike(card.id)
    .then(() => {
      card.handleLike(false);
    })
    .catch((err) => {
      console.log(`Unable to process request, ${err}`);
    })
  }
  if (!card.isLiked){
    return api.addLike(card.id)
    .then(() => {
      card.handleLike(true);
    })
    .catch((err) => {
      console.log(`Unable to process request, ${err}`);
    })
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

function handleChangeAvatar(){
  const urlInput = document.querySelector('#avatar-url').value;
  console.log("urlInput:", urlInput); // Should log the URL value
  function handleRequest(){
    return api.changeProfileImg(urlInput).then((res) => {
      userInfo.updateProfileImage(res)
    });
  }
  handleSubmit(handleRequest, editAvatarModal, true)
}

api.loadUserInfo()
    .then((userData) => {
        userInfo.updateProfileImage(userData);
        userInfo.setUserInfo({
            name: userData.name,
            about: userData.about
        });
    })
    .catch((err) => {
        console.error(`Unable to process request, Error: ${err}`);
    });

  api
  .getInitialCards()
  .then((cards) => {
    const cardSection = new Section (
      {items: cards,
          renderer : ({ link, name, _id }) => {
              renderCard({ link, name, _id });
          }
      },
      ".gallery__cards" 
  );
  cardSection.renderItems(cards);
  
  })

function handleEditProfileSubmit(data){  
    const userData = { name: data.name, about: data.description };
function handleRequest(){
  
  return new Promise((resolve, reject) => {
    api.updateUserInfo(userData)
      .then((updatedUserData) => {
        userInfo.setUserInfo(updatedUserData);
        const modal = profileEditModal;
        modal.classList.remove('modal_opened');
        modal.querySelector('#edit-form').reset();
        resolve(updatedUserData);
      })
      .catch((err) => {
       
        reject(err);
      });
  });
      }
      handleSubmit(handleRequest, profileEditPopup, true)
}
