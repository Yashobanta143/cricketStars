const sidebarToggle = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');
const hidebar = document.getElementById('hidebar');
const page = document.getElementById('page');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchButton.disabled = true;
let isSideBarOn = false;

sidebarToggle.addEventListener('click', () => {
  sidebar.toggleAttribute('hidden');
  sidebar.classList.toggle('active');
  isSideBarOn = true;

});

hidebar.addEventListener('click', () => {
  sidebar.toggleAttribute('hidden');
  sidebar.classList.toggle('active');
  isSideBarOn = false;
});


document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
    if (isSideBarOn) {
      sidebar.toggleAttribute('hidden');
      sidebar.classList.toggle('active');
      isSideBarOn = false;
    }
  }
});


searchInput.addEventListener('change', () => {
  if (searchInput.value.trim() === '') {
    searchButton.disabled = true;
  } else {
    searchButton.disabled = false;
  }
});


searchButton.addEventListener('click', () => {
  const search = searchInput.value.trim();
  const user = window.location.href.split('=')[1];
  window.location.href = '/search?user=' + user + '&search=' + search;
  searchInput.value = '';
  searchButton.disabled = true;
})
