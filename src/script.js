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
    const dropAreaErrorMessage = document.querySelector('.drop-area__error-message');

    dropAreaPrompt.textContent = 'Drag and drop or click to upload';
    dropAreaThumb.style.backgroundImage = 'url(../assets/images/icon-upload.svg)';
    dropAreaThumb.style.backgroundSize = 'auto';
    dropAreaImageOptions.style.display = 'none';

    dropAreaErrorMessage.textContent = 'Upload your photo (JPG or PNG, max size: 500KB).';
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
