const checkIsLiked = (likeButton) => {
  return likeButton.classList.contains('card__like-button_is-active');
};

const refreshLikeView = (likeButton, likeCount, likes) => {
  likeButton.classList.toggle('card__like-button_is-active');
  if (likeCount) {
    likeCount.textContent = likes.length;
  }
};

const deleteCardEl = (cardElement) => {
  cardElement.remove();
};

const buildCard = (data, userId, callbacks) => {
  const template = document.querySelector('#card-template').content;
  const cardElement = template.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__control-button_type_delete');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  if (likeCount) {
    likeCount.textContent = data.likes ? data.likes.length : 0;
  }

  const isAlreadyLiked = data.likes?.some(item => item._id === userId);
  if (isAlreadyLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (data.owner._id !== userId) {
    deleteButton.style.display = 'none';
  }

  likeButton.addEventListener('click', () => {
    const isLiked = checkIsLiked(likeButton);
    callbacks.onLikeCard(data._id, likeButton, likeCount, isLiked);
  });

  if (data.owner._id === userId) {
    deleteButton.addEventListener('click', () => {
      callbacks.onDeleteCard(data._id, cardElement);
    });
  }

  cardImage.addEventListener('click', () => {
    callbacks.onPreviewPicture(data);
  });

  return cardElement;
};

export {
  buildCard,
  checkIsLiked,
  refreshLikeView,
  deleteCardEl
};
