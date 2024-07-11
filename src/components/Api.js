export default class Api{
    constructor({ baseUrl, headers }){
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    loadUserInfo(){
      return fetch(`${this._baseUrl}/users/me`, {
          headers: this._headers
      })
      .then(res => {
          if (!res.ok) {
              return Promise.reject(`Request failed with status ${res.status}: ${res.statusText}`);
          }
          return res.json();
      });
  }

    getInitialCards() {
        return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
            headers: this._headers
          })
            .then(this._handleResponse)
        }

    updateUserInfo(userData) {
      return fetch(`${this._baseUrl}/users/me`, {
          method: 'PUT', // Or 'PATCH' depending on the API spec
          headers: this._headers,
          body: JSON.stringify(userData)
      })
      .then(res => {
          if (!res.ok) {
              return Promise.reject(`Update failed with status ${res.status}: ${res.statusText}`);
          }
          return res.json();
      });
    }

    addNewCard(card){
      return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({
          name: `${card.name}`,
          link: `${card.link}`
        })
      });
    }

    deleteCard(cardId){
      return fetch(`${this._baseUrl}/cards/${cardId}`, {
        method: "DELETE",
        headers: this._headers
      })
    }

    addLike(cardId){
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: "PUT",
        headers: this._headers
      })
    }

    removeLike(cardId){
      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: "DELETE",
        headers: this._headers
      })
    }

    changeProfileImg(url){
      return fetch("https://around-api.en.tripleten-services.com/v1/users/me/avatar", {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
          avatar: url
        })
      })
    }

    _handleResponse(res) {
      if (res.ok) {
        return res.json();
      }
     
      return Promise.reject(`Error: ${res.status}`);
    }
      }
