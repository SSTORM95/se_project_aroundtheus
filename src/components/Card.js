
export default class Card{
    constructor(data, cardSelector, handleImageClick, deleteBtnHandler, handleCardLike){
       
       this._data = data
       this._name =data.name;
       this._link = data.link;
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
      }
      


    _setEventListener(){
        this._likeBtn = this._cardElement.querySelector("#card-like-button");
        this._trashBtn = this._cardElement.querySelector("#card-trash-button");
        this._cardImg = this._cardElement.querySelector(".card__image");

    this._likeBtn.addEventListener('click', () => {
        this.toggleLikeUI();
    this._handleCardLike(this)});

    this._trashBtn.addEventListener('click', () => (this._deleteBtnHandler(this)));

    this._cardImg.addEventListener('click', () => (this._handleImageClick(this)));
    }
    
    _handleImageClick(data){
        this._imageModal = this._cardElement.querySelector("#image-popup-modal");
        this._imageModalImg.src = data.link;
        this._imageModalTitle.textContent = data.name;
        this._imageModalImg.alt = data.name;
        open(this._imageModal);
    }

    toggleLikeUI() {
        this.isLiked = !this.isLiked;
        this._updateLikeIcon();
      }

    _updateLikeIcon() {
    if (this.isLiked) {
      this._likeBtn.classList.add("card__like-button_active");
    } else {
      this._likeBtn.classList.remove("card__like-button_active");
    }
     }

    
    handleLike(isLiked){
        this.isLiked = isLiked;
        this._updateLikeIcon();
    }

    getCard() {
        
        this._cardElement = document.querySelector(this._cardSelector).content.querySelector(".card").cloneNode(true);
        
       
        this._setEventListener();

        this._cardElement.querySelector(".card__image").src = this._link;
        this._cardElement.querySelector(".card__image").alt = this._name;
        this._cardElement.querySelector(".card__description-title").textContent = this._name;

        this._updateLikeIcon();
        return this._cardElement;
    }
}