// ////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ DROP AREA FUNCTIONALITY
const dropArea = document.querySelector('.drop-area');
const dropAreaFile = dropArea.querySelector('#dropAreaInput');

// Update drop area when DOM content loaded
document.addEventListener('DOMContentLoaded', updateDropArea);

// ~ ~ ~ ~ ~ Event listeners
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('drop-area__over');
});
//
['dragleave', 'dragend'].forEach((dragOption) => {
  dropArea.addEventListener(dragOption, (e) => {
    dropArea.classList.remove('drop-area__over');
  });
});
//
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();

  if (e.dataTransfer.files.length) {
    dropAreaFile.files = e.dataTransfer.files;
    updateDropArea(dropAreaFile.files);
  }

  dropArea.classList.remove('drop-area__over');
});
//
dropArea.addEventListener('click', () => {
  if (dropAreaFile.files.length < 1) {
    changeImage();
  }
});

// When the drop area file input value changes, update drop area
dropAreaFile.addEventListener('change', updateDropArea);

// Update drop area function
function updateDropArea() {
  const dropAreaThumb = document.querySelector('.drop-area__thumb');
  const dropAreaPrompt = dropArea.querySelector('.drop-area__prompt');
  const dropAreaImageOptions = dropArea.querySelector('.drop-area__image-options');

  if (dropAreaFile.files.length > 0) {
    refreshDropArea(dropAreaFile.files[0]);
  } else {
    initialiseDropArea();
  }

  // If file type is an image, update the drop area
  function refreshDropArea(imageUpload) {
    if (imageUpload.type.startsWith('image/')) {
      const reader = new FileReader();

      dropAreaPrompt.textContent = '';
      dropAreaThumb.style.backgroundSize = 'cover';
      dropAreaImageOptions.style.display = 'block';

      reader.readAsDataURL(imageUpload);
      reader.onload = () => {
        dropAreaThumb.style.backgroundImage = `url('${reader.result}')`;
      };
    }
  }

  // Initialise the drop area with onload graphics
  function initialiseDropArea() {
    dropAreaPrompt.textContent = 'Drag and drop or click to upload';
    dropAreaThumb.style.backgroundImage = 'url(../assets/images/icon-upload.svg)';
    dropAreaThumb.style.backgroundSize = 'auto';
    dropAreaImageOptions.style.display = 'none';
  }
}

// Remove image function (button)
function removeImage() {
  // setTimeout used to stop dropAreaFile.value='' from
  // triggering changeImage() in dropArea.addEventListener(click)
  setTimeout(() => {
    dropAreaFile.value = '';
    updateDropArea();
  }, 0);
}

// Change image function (button)
function changeImage() {
  dropAreaFile.click();
}

// ////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ FORM VALIDATION
function validateForm(formSelector) {
  const formElement = document.querySelector(formSelector);

  const validationOptions = [
    {
      attribute: 'required',
      isValid: (input) => input.value.trim() !== '',
      errorMessage: (input, label) =>
        input.type === 'file'
          ? 'Please upload your photo'
          : `Please enter a valid ${label.textContent.toLowerCase()}`,
    },
    {
      attribute: 'data-file-size',
      isValid: (input) => {
        if (input.files.length > 0) {
          return input.files[0].size <= Number(input.dataset.fileSize);
        } else {
          return false;
        }
      },
      errorMessage: (input) => {
        if (input.files.length > 0) {
          return `File too large. Please upload a photo under ${input.dataset.fileSize / 1000}KB.`;
        } else {
          return 'Please upload your photo';
        }
      },
    },
    {
      attribute: 'pattern',
      isValid: (input) => {
        const regex = new RegExp(input.pattern);
        return regex.test(input.value);
      },
      errorMessage: (input, label) => `Please enter a valid ${label.textContent.toLowerCase()}`,
    },
  ];

  function validateSingleFormGroup(formGroup) {
    const label = formGroup.querySelector('label');
    const input = formGroup.querySelector('input');
    const errorContainer = formGroup.querySelector('.error');

    let formGroupError = false;

    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        errorContainer.innerHTML = `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="#f57463"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"
            />
            <path fill="#f57463" d="M8.004 10.462V7.596ZM8 5.57v-.042Z" />
            <path
              stroke="#f57463"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.004 10.462V7.596M8 5.569v-.042"
            />
          </svg>
          <p>${option.errorMessage(input, label)}<p>`;
        input.classList.add('error__active');
        formGroupError = true;
      }
    }

    if (!formGroupError) {
      errorContainer.innerHTML = '';
      input.classList.remove('error__active');
    }
  }

  // //////////////////////////////////////////

  // Disable inbuilt HTML form validation
  formElement.setAttribute('novalidate', '');
  formElement.addEventListener('submit', function (e) {
    e.preventDefault();
    validateAllFormGroups(formElement);
  });

  function validateAllFormGroups(formToValidate) {
    const formGroups = Array.from(formToValidate.querySelectorAll('.form-group'));

    formGroups.forEach((formGroup) => {
      validateSingleFormGroup(formGroup);
    });
  }
}

// Execute validation (when form submitted)
validateForm('#ticketRegistrationForm');
