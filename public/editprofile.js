const backBtn = document.getElementById('back-btn');
const saveBtn = document.getElementById('save-btn');
const form = document.getElementById("profile-form");


backBtn.addEventListener('click', () => {
    window.history.back();
})


saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const phno = document.getElementById('ph-no').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const bat = document.getElementById('bat').value;
    const bowl = document.getElementById('bowl').value;
    const achievement = document.getElementById("achievement").value;

    if (!role || !bat || !bowl) {
        alert("  error: 'All fields are required' ");
        return
      }

    fetch('/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, phno, email, role, bat, bowl, achievement}),     
    })
    .then((res) => res.json())
    .then(data => console.log(data))
    .catch(err => console.error('Error saving:', err));
    window.location.href = '/profile?user=' + user;

    // window.history.back();
    // setTimeout(() => {
    //     location.reload();
    //   }, 2);
      
    
    // window.location.reload();


}) 

