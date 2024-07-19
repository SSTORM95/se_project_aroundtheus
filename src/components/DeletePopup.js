import Popup from "./Popup";

export default class DeletePopup extends Popup{
    constructor(popupSelector){
        super({ popupSelector });
        this._popupForm = this._popupElement.querySelector("#confirm-form");
        
    }
    
    deleteHandler(handleDeleteSubmit){
        this._handleDeleteSubmit = handleDeleteSubmit
        
    }

    
    setEventListeners(){
        super.setEventListeners();
        this._popupForm.addEventListener("submit", (evt) => {
          evt.preventDefault();
          this._handleDeleteSubmit();
        });
    }
}

