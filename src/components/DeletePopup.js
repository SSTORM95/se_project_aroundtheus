import Popup from "./Popup";

export default class DeletePopup extends Popup {
  constructor(popupSelector) {
    super({ popupSelector });
    this._popupForm = this._popupElement.querySelector("#confirm-form");
    this._modalBtnContent = this._modalButton.textContent
  }

  setDeleteHandler(handleDeleteSubmit) {
    this._handleDeleteSubmit = handleDeleteSubmit;
  }

  renderLoading(isLoading, loadingText = "Deleting...") {
    this._modalButton.textContent = isLoading
      ? loadingText
      : this._modalBtnContent;
  }

  setEventListeners() {
    super.setEventListeners();
    this._popupForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleDeleteSubmit();
    });
  }
}
