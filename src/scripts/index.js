import Api from './components/api.js';
import { buildCard, checkIsLiked, refreshLikeView, deleteCardEl } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

const apiClient = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/apf-cohort-203',
  headers: {
    authorization: '0635bc35-0c15-4d06-bb59-b1d70da162a6',
    'Content-Type': 'application/json'
  }
});

const formConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(formConfig);

const cardsList = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const editProfileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = editProfileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = editProfileForm.querySelector(".popup__input_type_description");

const addCardPopup = document.querySelector(".popup_type_new-card");
const addCardForm = addCardPopup.querySelector(".popup__form");
const placeNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const placeLinkInput = addCardForm.querySelector(".popup__input_type_url");

const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

const editProfileBtn = document.querySelector(".profile__edit-button");
const addCardBtn = document.querySelector(".profile__add-button");

const userNameEl = document.querySelector(".profile__title");
const userAboutEl = document.querySelector(".profile__description");
const userAvatarEl = document.querySelector(".profile__image");

const editAvatarPopup = document.querySelector(".popup_type_edit-avatar");
const editAvatarForm = editAvatarPopup.querySelector(".popup__form");
const avatarLinkInput = editAvatarForm.querySelector(".popup__input");
const headerLogo = document.querySelector(".header__logo");

const statsPopup = document.querySelector(".popup_type_info");
const statsTitle = statsPopup.querySelector(".popup__title");
const statsInfoList = statsPopup.querySelector(".popup__info");
const statsText = statsPopup.querySelector(".popup__text");
const statsUsersList = statsPopup.querySelector(".popup__list");

let myUserId = null;

const openImagePopup = (data) => {
  popupImage.src = data.link;
  popupImage.alt = data.name;
  popupCaption.textContent = data.name;
  openModalWindow(imagePopup);
};

const onLike = (cardId, btnLike, likeCounter, isLiked) => {
  apiClient.changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      refreshLikeView(btnLike, likeCounter, updatedCard.likes);
    })
    .catch(err => console.error('Ошибка при обработке лайка:', err));
};

const onDelete = (cardId, card) => {
  apiClient.deleteCard(cardId)
    .then(() => {
      deleteCardEl(card);
    })
    .catch(err => console.error('Ошибка при удалении карточки:', err));
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const saveBtn = editProfileForm.querySelector('.popup__button');
  const btnDefaultText = saveBtn.textContent;
  saveBtn.textContent = 'Сохранение...';
  saveBtn.disabled = true;

  apiClient.setUserInfo(profileTitleInput.value, profileDescriptionInput.value)
    .then((userInfo) => {
      userNameEl.textContent = userInfo.name;
      userAboutEl.textContent = userInfo.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch(err => console.error(err))
    .finally(() => {
      saveBtn.textContent = btnDefaultText;
      saveBtn.disabled = false;
    });
};

const submitAvatarForm = (evt) => {
  evt.preventDefault();
  const saveBtn = editAvatarForm.querySelector('.popup__button');
  const btnDefaultText = saveBtn.textContent;
  saveBtn.textContent = 'Сохранение...';
  saveBtn.disabled = true;

  apiClient.updateUserAvatar(avatarLinkInput.value)
    .then((userInfo) => {
      userAvatarEl.style.backgroundImage = `url(${userInfo.avatar})`;
      closeModalWindow(editAvatarPopup);
    })
    .catch(err => console.error(err))
    .finally(() => {
      saveBtn.textContent = btnDefaultText;
      saveBtn.disabled = false;
    });
};

const submitCardForm = (evt) => {
  evt.preventDefault();
  const saveBtn = addCardForm.querySelector('.popup__button');
  const btnDefaultText = saveBtn.textContent;
  saveBtn.textContent = 'Создание...';
  saveBtn.disabled = true;

  apiClient.addCard(placeNameInput.value, placeLinkInput.value)
    .then((cardItem) => {
      cardsList.prepend(buildCard(cardItem, myUserId, {
        onLikeCard: onLike,
        onDeleteCard: onDelete,
        onPreviewPicture: openImagePopup
      }));
      closeModalWindow(addCardPopup);
      addCardForm.reset();
      clearValidation(addCardForm, formConfig);
    })
    .catch(err => console.error(err))
    .finally(() => {
      saveBtn.textContent = btnDefaultText;
      saveBtn.disabled = false;
    });
};

editProfileForm.addEventListener("submit", handleProfileFormSubmit);
editAvatarForm.addEventListener("submit", submitAvatarForm);
addCardForm.addEventListener("submit", submitCardForm);

editProfileBtn.addEventListener("click", () => {
  profileTitleInput.value = userNameEl.textContent;
  profileDescriptionInput.value = userAboutEl.textContent;
  clearValidation(editProfileForm, formConfig);
  openModalWindow(profileFormModalWindow);
});

userAvatarEl.addEventListener("click", () => {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, formConfig);
  openModalWindow(editAvatarPopup);
});

addCardBtn.addEventListener("click", () => {
  addCardForm.reset();
  clearValidation(addCardForm, formConfig);
  openModalWindow(addCardPopup);
});

const dateToString = (d) => {
  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const buildInfoRow = (label, value) => {
  const defTemplate = document.querySelector('#popup-info-definition-template').content;
  const rowEl = defTemplate.querySelector('.popup__info-item').cloneNode(true);

  rowEl.querySelector('.popup__info-term').textContent = label;
  rowEl.querySelector('.popup__info-description').textContent = value;

  return rowEl;
};

const buildUserTag = (name) => {
  const defTemplate = document.querySelector('#popup-info-user-preview-template').content;
  const rowEl = defTemplate.querySelector('.popup__list-item').cloneNode(true);

  rowEl.textContent = name;

  return rowEl;
};

const onLogoClick = () => {
  statsInfoList.innerHTML = '';
  statsUsersList.innerHTML = '';

  apiClient.getCardList()
    .then((allCards) => {
      const cardsCount = allCards.length;

      let firstCard = allCards[0];
      let lastCard = allCards[0];

      allCards.forEach(item => {
        const itemDate = new Date(item.createdAt);
        if (itemDate < new Date(firstCard.createdAt)) firstCard = item;
        if (itemDate > new Date(lastCard.createdAt)) lastCard = item;
      });

      const cardsByUser = new Map();
      const usersMap = new Map();

      allCards.forEach(item => {
        const uid = item.owner._id;
        const name = item.owner.name;

        cardsByUser.set(uid, (cardsByUser.get(uid) || 0) + 1);
        if (!usersMap.has(uid)) {
          usersMap.set(uid, name);
        }
      });

      const topCount = Math.max(...cardsByUser.values());

      statsTitle.textContent = "Статистика пользователей";

      statsInfoList.append(buildInfoRow("Всего карточек:", cardsCount.toString()));

      if (allCards.length > 0) {
        statsInfoList.append(buildInfoRow("Первая создана:", dateToString(new Date(firstCard.createdAt))));
        statsInfoList.append(buildInfoRow("Последняя создана:", dateToString(new Date(lastCard.createdAt))));
      }

      statsInfoList.append(buildInfoRow("Всего пользователей:", usersMap.size.toString()));
      statsInfoList.append(buildInfoRow("Максимум карточек от одного:", topCount.toString()));

      statsText.textContent = "Все пользователи:";

      usersMap.forEach((name) => {
        statsUsersList.append(buildUserTag(name));
      });

      openModalWindow(statsPopup);
    })
    .catch((err) => {
      console.error('Ошибка при загрузке статистики:', err);
      statsText.textContent = 'Ошибка загрузки данных';
    });
};

Promise.all([apiClient.getUserInfo(), apiClient.getCardList()])
  .then(([userInfo, allCards]) => {
    myUserId = userInfo._id;

    userNameEl.textContent = userInfo.name;
    userAboutEl.textContent = userInfo.about;
    userAvatarEl.style.backgroundImage = `url(${userInfo.avatar})`;

    allCards.forEach(item => {
      cardsList.append(buildCard(item, myUserId, {
        onLikeCard: onLike,
        onDeleteCard: onDelete,
        onPreviewPicture: openImagePopup
      }));
    });
  })
  .catch(err => console.error('Ошибка загрузки данных:', err));

headerLogo.addEventListener("click", onLogoClick);
const popupsList = document.querySelectorAll(".popup");
popupsList.forEach(pop => setCloseModalWindowEventListeners(pop));
