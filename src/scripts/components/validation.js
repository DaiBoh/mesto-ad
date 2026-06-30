const showInputError = (form, input, msg, config) => {
  const errorEl = form.querySelector(`#${input.id}-error`);

  input.classList.add(config.inputErrorClass);
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add(config.errorClass);
  }
};

const hideInputError = (form, input, config) => {
  const errorEl = form.querySelector(`#${input.id}-error`);

  input.classList.remove(config.inputErrorClass);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove(config.errorClass);
  }
};

const checkInputValidity = (form, input, config) => {
  let msg = '';

  if (input.validity.patternMismatch) {
    msg = input.dataset.errorMessage || input.validationMessage;
  } else if (input.validity.valueMissing) {
    msg = input.dataset.requiredError || input.validationMessage;
  } else if (input.validity.tooShort) {
    msg = input.dataset.tooShortError || input.validationMessage;
  } else if (input.validity.tooLong) {
    msg = input.dataset.tooLongError || input.validationMessage;
  } else if (input.validity.typeMismatch && input.type === 'url') {
    msg = input.dataset.urlError || input.validationMessage;
  }

  if (!input.validity.valid) {
    showInputError(form, input, msg, config);
    return false;
  } else {
    hideInputError(form, input, config);
    return true;
  }
};

const hasInvalidInput = (inputs) => {
  return inputs.some(input => !input.validity.valid);
};

const disableSubmitButton = (btn, config) => {
  btn.classList.add(config.inactiveButtonClass);
  btn.disabled = true;
};

const enableSubmitButton = (btn, config) => {
  btn.classList.remove(config.inactiveButtonClass);
  btn.disabled = false;
};

const toggleButtonState = (inputs, btn, config) => {
  if (hasInvalidInput(inputs)) {
    disableSubmitButton(btn, config);
  } else {
    enableSubmitButton(btn, config);
  }
};

const setEventListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const btn = form.querySelector(config.submitButtonSelector);

  toggleButtonState(inputs, btn, config);

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      checkInputValidity(form, input, config);
      toggleButtonState(inputs, btn, config);
    });
  });
};

const clearValidation = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const btn = form.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    hideInputError(form, input, config);
  });

  if (btn) {
    disableSubmitButton(btn, config);
  }
};

const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach(form => {
    form.setAttribute('novalidate', '');
    setEventListeners(form, config);
  });
};

export { enableValidation, clearValidation };
