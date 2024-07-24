import Popup from "./Popup";

export default class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super({ popupSelector });
    this._imgElement = this._popupElement.querySelector(".modal__image");
    this._captionElement = this._popupElement.querySelector(
      ".modal__image_caption"
    );
  }

  open(data) {
    this._imgElement.src = data.link;
    this._imgElement.alt = data.name;
    this._captionElement.textContent = data.name;

    super.open();
  }
}
