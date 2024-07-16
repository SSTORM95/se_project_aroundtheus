import Popup from "./Popup";

export default class DeletePopup extends Popup{
    constructor(popupSelector){
        super({ popupSelector });
        this._popupForm = this._popupElement.querySelector("#confirm-form");

        this._deleteBtn = this._popupElement.querySelector(".confirm__button");
        this._deleteBtnText = this._deleteBtn.textContent;
        
    }
    
    deleteHandler(handleDeleteSUbmit){
        this._handleDeleteSubmit = handleDeleteSUbmit
    }
    
    setEventListeners(){
        super.setEventListeners();
        this._popupForm.addEventListener("submit", (evt) => {
          evt.preventDefault();
          console.log('Submit event triggered');
          this._handleDeleteSubmit();
        });
    }
}

