export default class Popup{
    constructor({popupSelector}){
        this._popupElement = document.querySelector(popupSelector);
        this._closeBtn = this._popupElement.querySelector("#modal-close-button");
        this._modalButton = this._popupElement.querySelector(".modal__button")
      
    }

    open(){
        this._popupElement.classList.add("modal_opened");
        document.addEventListener("keydown", this._handleEscClose);
        this._popupElement.addEventListener("mousedown", this._closePopupAround);
    }

    close(){
         this._popupElement.classList.remove("modal_opened");
        document.removeEventListener("keydown", this._handleEscClose);
        this._popupElement.removeEventListener("mousedown",this._closePopupAround);
    }

    _handleEscClose = (evt) => {
        if(evt.key === 'Escape') {
            this.close();
        }
    }

    _closePopupAround = (evt) => {
        if(evt.target === this._popupElement){
            this.close();
        }
    }
    
    renderLoading(isLoading, loadingText = "Deleting...") {
        this._modalButton.textContent = isLoading ? loadingText : this._modalButton.textContent;
      }

    setEventListeners(){
        
        this._popupElement.addEventListener("mousedown", (evt) => {
            if(evt.target === this._closeBtn) {
                this.close();
            }
        })
    }
}