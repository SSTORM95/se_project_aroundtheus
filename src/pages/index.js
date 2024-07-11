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
 
  function handleProfileEditSubmit(userData) {
    profileEditPopup.close();
    userInfo.setUserInfo(userData);
  }

  function handlesCardSubmit(data){
    const name = data.title;
    const link = data.link;
    
    const newCardData = { link, name }; 
  

    const newCard = createCard(newCardData); 
    cardSection.addItem(newCard);
    
    addFormValidator.toggleButtonState();
    addCardPopup.close();
  }

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
    handleEditProfileSubmit()   
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
  (formData) => {
    handleChangeAvatar(formData.url);
  }
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

document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.querySelector('.gallery__cards');

  cardContainer.addEventListener('click', (evt) => {
    if (evt.target && evt.target.matches('#card-trash-button')) {
      evt.preventDefault();
      deleteBtnHandler();  // Ensure this function is defined and accessible
    }
  });
});

document.querySelector("#profile-picture-btn").addEventListener("click", () => {
  editAvatarModal.open();
  editFormValidator.enableValidation()
})



// form validators //



const addFormValidator = new FormValidator(validationSettings, addCardForm);
addFormValidator.enableValidation();

// API REQUEST //

function loadingHandler( request, modalSelector, reset, loadingText = "Saving..."){
  modalSelector.renderLoading(true, loadingText);
  request()
    .then(() => {
      modalSelector.close();

      if (reset) {
        modalSelector.reset();
      }
    })
    
    .catch(console.error)
    .finally(() => {
      modalSelector.renderLoading(false)
    })
}

function deleteBtnHandler(card) {
  deleteImgPopup.open();
  return deleteImgPopup.deleteHandler(() => {
    function handleRequest(){
      return api.deleteCard(card.id).then(() => {
        card.handleDeleteCard();        
      })
    }
    loadingHandler( handleRequest, deleteImgPopup, false, "Deleting...")
    
  })
}

function handleCardLike(card){
  if(card.isLiked){
    api.removeLike(card.id)
    .then(() => {
      card.handleLike(false);
    })
    .catch((err) => {
      console.log(`Unable to process request, ${err}`);
    })
  }
  if (!card.isLiked){
    api.addLike(card.id)
    .then(() => {
      card.handleLike(true);
    })
    .catch((err) => {
      console.log(`Unable to process request, ${err}`);
    })
  }
}

// function handleEditProfileSubmit(formData) {
//   function handleRequest() {
//     return api.updateUserInfo(formData).then(({ name, description }) => {
//       userInfo.setUserInfo({ name, description });
//     });
//   }
//   loadingHandler( handleRequest, profileEditPopup, true);
// }

function handleCardSubmit(inputValues) {
  function handleRequest() {
    return api.addNewCard(inputValues).then((res) => {
      renderCard(res);
    });
  }

  loadingHandler(handleRequest, addCardPopup, true);
}

function handleChangeAvatar(url){
  function handleRequest(){
    api.changeProfileImg(url).then((res) => {
      userInfo.updateProfileImage(res)
    });
  }
  loadingHandler(handleRequest, editAvatarModal, true)
}

api.loadUserInfo()
    .then((userData) => {
        console.log(userData); // Log the userData to verify its structure
        userInfo.updateProfileImage(userData);
        userInfo.setUserInfo({
            name: userData.name,
            description: userData.about
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
          renderer : ({ link, name }) => {
              renderCard({ link, name });
          }
      },
      ".gallery__cards" 
  );
  cardSection.renderItems(cards);
  
  })

function handleEditProfileSubmit(){  
  document.querySelector('#edit-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submit

    const nameInput = document.querySelector('#profile-title');
    const descriptionInput = document.querySelector('#profile-description');
    console.log('Name Input:', nameInput);
    console.log('Description Input:', descriptionInput);
    // Debug values
    console.log('Name Input Value:', nameInput.value);
    console.log('Description Input Value:', descriptionInput.value);


    const name = nameInput.value.trim();
    const about = descriptionInput.value.trim();

    console.log('Form Values after trimming:', { name, about });

    if (!name || !about) {
        console.error('Name and description fields cannot be empty');
        return;
    }
    const userData = { name, about };

    api.updateUserInfo(userData)
        .then((updatedUserData) => {
            userInfo.setUserInfo(updatedUserData);
            const modal = profileEditModal;
            modal.classList.remove('modal_opened'); // Assuming this class is used to manage modal visibility
            modal.querySelector('#edit-form').reset(); // Reset the form fields
        })
        .catch((err) => {
            console.error(`Update failed, Error: ${err}`);
        });
});
}