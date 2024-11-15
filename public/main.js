
const tournamentDiv = document.getElementById("upcoming-tournaments");
const showForm = document.getElementById("add-tournament");
const formContainer = document.getElementById("form-container");
const tournamentForm = document.getElementById("tournament-form");
const saveBtn = document.getElementById("add-btn");
const backBtn = document.getElementById("back-btn");
const logoutBtn = document.getElementById('logout-btn');
const mainUser = document.getElementById('main-user');
const profileBtn = document.getElementById('my-profile')


showForm.addEventListener('click', () => {
    tournamentDiv.style.display = 'none';
    formContainer.style.display = 'flex';
    formContainer.classList.add('animate');
    
});


backBtn.addEventListener('click', () => {
    tournamentDiv.style.display = 'block';
    formContainer.style.display = 'none';
    formContainer.classList.remove('animate');
})


logoutBtn.addEventListener('click', () => {
    // Send a request to the server to logout
    fetch('/logout', {
    })
    .then((response) => {
      // Redirect to login page or homepage
      window.location.href = 'logout';
    })
    .catch((error) => {
      console.error(error);
    });
});
  

profileBtn.addEventListener('click', () => {
    const user = mainUser.textContent;
    window.location.href = 'profile?user=' + user;
})


saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const user = document.getElementById('user').value;
    const tourname = document.getElementById('tourname').value;
    const venue = document.getElementById('venue').value;
    const date = document.getElementById('date').value;
    const host = document.getElementById('host').value;
    const contact = document.getElementById('contact').value;
    const entry = document.getElementById('entry').value;
    const winner = document.getElementById('win').value;
    const runner = document.getElementById('runner').value;
    const rules = document.getElementById('rules').value;
    let boundary;
    let ball;

    const radioInput1 = document.querySelectorAll('input[type="radio"][name="boundary"]');
    const radioInput2 = document.querySelectorAll('input[type="radio"][name="ball"]');
    
    
    radioInput1.forEach((input) => {
    if (input.checked) {
        boundary = input.value;
    }
    });


    radioInput2.forEach((input) => {
    if (input.checked) {
        ball = input.value;
    }
    });

    
    fetch('/saveBtn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, tourname, venue, date, host, contact, entry, winner, runner, boundary, ball, rules }),
    })
    .then((res) => res.json())
    .then(data => console.log(data))
    .catch(err => console.error('Error saving:', err));
    tournamentDiv.style.display = 'block';
    formContainer.style.display = 'none';
    formContainer.classList.remove('animate');
    location.reload();

})

user = document.getElementById('user').value;

function addTournament() {
    fetch('/getUrl')
    .then(res => res.json())
    .then((data) => {
        data.forEach((tour) => {
            const div = document.createElement('div');
            div.classList.add('tournament');
            const strong = document.createElement('strong');
            const link = document.createElement('a');
            const br = document.createElement('br');
            const tournament = tour;
            const href = "/tournament?user=" + user +"&tourname=" + tournament;
            link.href = href;
            strong.textContent = tournament;
            link.appendChild(strong);
            div.appendChild(link)
            tournamentDiv.append(div, br);
        });
    })
    .catch(error => console.error("Error retrieving data:", error));
    
}

window.onload = () => {
    addTournament();
}