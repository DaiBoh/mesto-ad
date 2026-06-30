const handleEscKey = (e) => {
  if (e.key === "Escape") {
    const activePopup = document.querySelector(".popup_is-opened");
    closeModalWindow(activePopup);
  }
};

export const openModalWindow = (modalWindow) => {
  modalWindow.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscKey);
};

export const closeModalWindow = (modalWindow) => {
  modalWindow.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscKey);
};

export const setCloseModalWindowEventListeners = (modalWindow) => {
  const closeButton = modalWindow.querySelector(".popup__close");
  closeButton.addEventListener("click", () => {
    closeModalWindow(modalWindow);
  });

  modalWindow.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("popup")) {
      closeModalWindow(modalWindow);
    }
  });
};
