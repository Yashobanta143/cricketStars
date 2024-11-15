const backBtn = document.getElementById('back-btn');
const saveDpBtn = document.getElementById('savedp');
const discardBtn = document.getElementById('discard');
const dpInput = document.getElementById('dp');
const img = document.getElementById('profile-picture-preview');
const changeDp = document.getElementById('img-label');
const user = document.getElementById('user').innerHTML;
const zoomOverlay = document.getElementById('zoom-overlay');
const zoomedPicture = document.querySelector('.zoomed-picture');


img.addEventListener('click', () => {
  zoomOverlay.style.display = 'block';
  zoomedPicture.src = img.src;
});


zoomOverlay.addEventListener('click', () => {
  zoomOverlay.style.display = 'none';
});


backBtn.addEventListener('click', () => {
    window.location.href = '/protected?user=' + user;
});

dpInput.addEventListener('change', () => {
    const file = dpInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
    img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    changeDp.style.display = 'none';
    saveDpBtn.classList.remove('hidden');
    discardBtn.classList.remove('hidden');
});


saveDpBtn.addEventListener('click', function() {
    const formData = new FormData();
    const file = dpInput.files[0];
    formData.append('image', file);
    formData.append('user', user);
    fetch('/upload-image', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
    saveDpBtn.classList.add('hidden');
    discardBtn.classList.add('hidden');
    changeDp.style.display = 'flex';

});


discardBtn.addEventListener('click', () => {
    location.reload()
})