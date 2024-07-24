export default class Card {
  constructor(
    data,
    cardSelector,
    handleImageClick,
    deleteBtnHandler,
    handleCardLike
  ) {
    this._data = data;
    this.name = data.name;
    this.link = data.link;
    this.id = data.id || data._id;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._deleteBtnHandler = deleteBtnHandler;
    this.isLiked = data.isLiked;
    this._handleCardLike = handleCardLike;
  }

  handleDeleteCard = () => {
    if (this._cardElement) {
      this._cardElement.remove();
      this._cardElement = null;
    }
  };

  _setEventListener() {
    this._likeBtn = this._cardElement.querySelector("#card-like-button");
    this._trashBtn = this._cardElement.querySelector("#card-trash-button");
    this._cardImg = this._cardElement.querySelector(".card__image");

    this._likeBtn.addEventListener("click", () => {
      this._handleCardLike(this);
    });

    this._trashBtn.addEventListener("click", () =>
      this._deleteBtnHandler(this)
    );

    this._cardImg.addEventListener("click", () => this._handleImageClick(this));
  }

  _updateLikeIcon() {
    if (this.isLiked) {
      this._likeBtn.classList.add("card__like-button_active");
    } else {
      this._likeBtn.classList.remove("card__like-button_active");
    }
  }

  handleLike(isLiked) {
    this.isLiked = isLiked;
    this._updateLikeIcon();
  }

  getCard() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    this._setEventListener();

    this._cardImg.src = this.link;
    this._cardImg.alt = this.name;
    this._cardElement.querySelector(".card__description-title").textContent =
      this.name;

    this._updateLikeIcon();
    return this._cardElement;
  }
}
