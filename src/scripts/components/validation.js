const markInputError = (form, input, msg, config) => {
  const errorEl = form.querySelector(`#${input.id}-error`);

  input.classList.add(config.inputErrorClass);
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add(config.errorClass);
  }
};

const clearInputError = (form, input, config) => {
  const errorEl = form.querySelector(`#${input.id}-error`);

  input.classList.remove(config.inputErrorClass);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove(config.errorClass);
  }
};

const validateInput = (form, input, config) => {
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
    markInputError(form, input, msg, config);
    return false;
  } else {
    clearInputError(form, input, config);
    return true;
  }
};

const hasErrors = (inputs) => {
  return inputs.some(input => !input.validity.valid);
};

const lockButton = (btn, config) => {
  btn.classList.add(config.inactiveButtonClass);
  btn.disabled = true;
};

const unlockButton = (btn, config) => {
  btn.classList.remove(config.inactiveButtonClass);
  btn.disabled = false;
};

const updateButtonState = (inputs, btn, config) => {
  if (hasErrors(inputs)) {
    lockButton(btn, config);
  } else {
    unlockButton(btn, config);
  }
};

const attachFormListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const btn = form.querySelector(config.submitButtonSelector);

  updateButtonState(inputs, btn, config);

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      validateInput(form, input, config);
      updateButtonState(inputs, btn, config);
    });
  });
};

const clearValidation = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const btn = form.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    clearInputError(form, input, config);
  });

  if (btn) {
    lockButton(btn, config);
  }
};

const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach(form => {
    form.setAttribute('novalidate', '');
    attachFormListeners(form, config);
  });
};

export { enableValidation, clearValidation };
