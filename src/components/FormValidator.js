export default class FormValidator {
  constructor(config, formEl) {
    this._inputSelector = config.inputSelector;
    this._submitButtonSelector = config.submitButtonSelector;
    this._inactiveButtonClass = config.inactiveButtonClass;
    this._inputErrorClass = config.inputErrorClass;
    this._errorClass = config.errorClass;

    this._form = formEl;
  }

  _resetBtn() {
    this._btnElement.classList.add(this._inactiveButtonClass);
  }

  toggleButtonState() {
    if (this._hasInvalidInput()) {
      this.disableBtn();
    } else {
      this.enableBtn();
    }
  }

  disableBtn() {
    this._btnElement.classList.add(this._inactiveButtonClass);
    this._btnElement.disabled = true;
  }

  enableBtn() {
    this._btnElement.classList.remove(this._inactiveButtonClass);
    this._btnElement.disabled = false;
  }

  _showInputError(inputEl) {
    const errorMessageEl = this._form.querySelector(`#${inputEl.id}-error`);

    inputEl.classList.add(this._inputErrorClass);
    if (errorMessageEl) {
      errorMessageEl.textContent = inputEl.validationMessage;
      errorMessageEl.classList.add(this._errorClass);
    }
  }

  hideInputError(inputEl) {
    const errorMessageEl = this._form.querySelector(`#${inputEl.id}-error`);

    inputEl.classList.remove(this._inputErrorClass);
    if (errorMessageEl) {
      errorMessageEl.textContent = "";
      errorMessageEl.classList.remove(this._inputErrorClass);
    }
  }

  _hasInvalidInput() {
    return !this._inputList.every((inputEl) => inputEl.validity.valid);
  }

  _checkInputValidity(inputEl) {
    if (!inputEl.validity.valid) {
      this._showInputError(inputEl);
    } else {
      this.hideInputError(inputEl);
    }
  }

  _setEventListeners() {
    this._inputList = [...this._form.querySelectorAll(this._inputSelector)];
    this._btnElement = this._form.querySelector(this._submitButtonSelector);

    this._inputList.forEach((inputEl) => {
      inputEl.addEventListener("input", () => {
        this._checkInputValidity(inputEl);
        this.toggleButtonState();
      });
    });
  }

  enableValidation() {
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    this._setEventListeners(this._form);
  }

  resetValidation() {
    this._inputList.forEach((inputEl) => {
      this.hideInputError(inputEl);
    });
    this.toggleButtonState();
  }
}





const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};
