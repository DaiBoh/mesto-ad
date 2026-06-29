const checkIsLiked = (btnLike) => {
  return btnLike.classList.contains('card__like-button_is-active');
};

const refreshLikeView = (btnLike, likeCounter, likes) => {
  btnLike.classList.toggle('card__like-button_is-active');
  if (likeCounter) {
    likeCounter.textContent = likes.length;
  }
};

const deleteCardEl = (card) => {
  card.remove();
};

const buildCard = (data, userId, callbacks) => {
  const tmpl = document.querySelector('#card-template').content;
  const card = tmpl.querySelector('.card').cloneNode(true);

  const imgEl = card.querySelector('.card__image');
  const titleEl = card.querySelector('.card__title');
  const delBtn = card.querySelector('.card__control-button_type_delete');
  const btnLike = card.querySelector('.card__like-button');
  const likeNum = card.querySelector('.card__like-count');

  imgEl.src = data.link;
  imgEl.alt = data.name;
  titleEl.textContent = data.name;

  if (likeNum) {
    likeNum.textContent = data.likes ? data.likes.length : 0;
  }

  const alreadyLiked = data.likes?.some(like => like._id === userId);
  if (alreadyLiked) {
    btnLike.classList.add('card__like-button_is-active');
  }

  if (data.owner._id !== userId) {
    delBtn.style.display = 'none';
  }

  btnLike.addEventListener('click', () => {
    const isLiked = checkIsLiked(btnLike);
    callbacks.onLikeCard(data._id, btnLike, likeNum, isLiked);
  });

  if (data.owner._id === userId) {
    delBtn.addEventListener('click', () => {
      callbacks.onDeleteCard(data._id, card);
    });
  }

  imgEl.addEventListener('click', () => {
    callbacks.onPreviewPicture(data);
  });

  return card;
};

export {
  buildCard,
  checkIsLiked,
  refreshLikeView,
  deleteCardEl
};
