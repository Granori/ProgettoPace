document.addEventListener('DOMContentLoaded', function() {
    
    const loginBtn = document.getElementById('loginToggle');
    const singupForm = document.getElementById("signupForm");
    const SignupBtn = document.getElementById("signupBtn");
    const loginForm = document.getElementById('loginForm');

    const loginSubmit = document.getElementById('formLogin');
    const singupSubmit = document.getElementById('formSignup');

    const errore = document.getElementById('erroreLogin');

    const fotoProfilo = document.getElementById('fotoProfilo');
    const nomeProfilo = document.getElementById('nome');
    const schedaProfilo = document.getElementById('schedaProfilo');
    const btnLogout = document.getElementById('btnLogout');

    let listaAccount;
    async function leggiJson() {
        let risposta = await fetch('./utenti.json');

        let dati = await risposta.json();

        listaAccount = dati;
    };
    leggiJson();

    // fetch('./utenti.json')
    //     .then(risposta => risposta.json())
    //     .then(dati => {
    //         listaAccount = dati;
    //     })

    loginBtn.addEventListener('click', () => {
        loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    });

    SignupBtn.addEventListener('click', () => {
        singupForm.style.display = singupForm.style.display === 'none' ? 'block' : 'none';
    });

    singupSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('emailData').value;
        const password = document.getElementById('passwordData').value;
        listaAccount.push({email, password});
        singupForm.style.display = 'none';
    });

    loginSubmit.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = loginSubmit.elements['email'].value;
        const password = loginSubmit.elements['password'].value;

        const account = listaAccount.find(acc => acc.email === email && acc.password === password);

        if (account) {
            errore.style.display = "none";
            loginForm.style.display = "none";
            fotoProfilo.style.display = "block";

            nomeProfilo.innerHTML = email;

            loginBtn.className += " d-none";
            SignupBtn.className += " d-none";

            loginSubmit.value = "";
        } else {
            errore.style.display = "block";
        }
    });

    // Chiudi il login cliccando fuori
    document.addEventListener('click', (e) => {
        if (!loginForm.contains(e.target) && e.target !== loginBtn) {
            loginForm.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!singupForm.contains(e.target) && e.target !== SignupBtn) {
            singupForm.style.display = 'none';
        }
    });

    fotoProfilo.addEventListener('click', () => {
        schedaProfilo.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', (e) => {
        if (!fotoProfilo.contains(e.target) && e.target !== fotoProfilo) {
            schedaProfilo.style.display = 'none';
        }
    });
    fotoProfilo.style.cursor = 'pointer';

    btnLogout.addEventListener('click', () => {
        loginBtn.classList.remove('d-none');
        SignupBtn.classList.remove('d-none');

        fotoProfilo.style.display = "none";
        schedaProfilo.style.display = "none";
    });

});