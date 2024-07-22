export default class UserInfo {
  constructor({ nameSelector, descriptionSelector, profileImage }) {
    this._nameElement = document.querySelector(nameSelector);
    this._descriptionElement = document.querySelector(descriptionSelector);
    this._profileImage = document.querySelector(profileImage);
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      description: this._descriptionElement.textContent,
    };
  }

  setUserInfo(userData) {
    if (userData.name) {
      this._nameElement.textContent = userData.name;
    }
    if (userData.about) {
      this._descriptionElement.textContent = userData.about;
    }
  }

  updateProfileImage(image) {
    if (image.avatar) {
      this._profileImage.src = image.avatar;
    }
  }
}
