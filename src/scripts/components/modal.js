const onEscKeyUp = (e) => {
  if (e.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    closeModalWindow(openedPopup);
  }
};

export const openModalWindow = (modalWindow) => {
  modalWindow.classList.add("popup_is-opened");
  document.addEventListener("keyup", onEscKeyUp);
};

export const closeModalWindow = (modalWindow) => {
  modalWindow.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", onEscKeyUp);
};

export const setCloseModalWindowEventListeners = (modalWindow) => {
  const closeBtn = modalWindow.querySelector(".popup__close");
  closeBtn.addEventListener("click", () => {
    closeModalWindow(modalWindow);
  });

  modalWindow.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("popup")) {
      closeModalWindow(modalWindow);
    }
  });
};
