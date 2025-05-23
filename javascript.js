document.addEventListener('DOMContentLoaded', function () {
    // Classe Carta
    class Carta {
        titolo;
        img;
        testo;
        paginaDettaglio;
        carta;

        constructor(img, titolo, testo, paginaDettaglio = "#") {
            this.titolo = titolo;
            this.img = img;
            this.testo = testo;
            this.paginaDettaglio = paginaDettaglio;
            this.carta = null;
        }

        creaCarta(principale) {
            this.carta = document.createElement("div");
            this.carta.className = "card text-decoration-none w-50";

            if (principale) {
                this.carta.style = "height: 25em;";
            } else {
                this.carta.style = "height: 21em;";
            }

            this.carta.addEventListener('click', () => {
                window.location.href = this.paginaDettaglio;
            });
            this.carta.style.cursor = 'pointer';

            const overlayImmagine = document.createElement("div");
            overlayImmagine.className = "position-relative";

            const immagine = document.createElement("img");
            immagine.className = "card-img-top position-relative opacity-50";
            immagine.src = this.img;
            immagine.style = principale ? "height: 20em; width: 100%" : "height: 15em; width: 100%";

            const overlay = document.createElement("div");
            overlay.className = "card-img-overlay position-absolute";
            const h1 = document.createElement("p");
            h1.className = "h3 position-absolute";
            h1.style = "top: 50%; left: 50%; transform: translate(-50%, -50%);"
            h1.innerHTML = this.titolo;
            overlay.appendChild(h1);

            overlayImmagine.appendChild(immagine);
            overlayImmagine.appendChild(overlay);

            const body = document.createElement("div");
            body.className = "card-body";
            const p = document.createElement("p");
            p.className = "card-text";
            p.innerHTML = this.testo;
            body.appendChild(p);

            this.carta.appendChild(overlayImmagine);
            this.carta.appendChild(body);

            return this.carta;
        }
    }

    // Classe GestoreCards
    class GestoreCards {
        carte;
        focus;
        contenitore;

        constructor(contenitore, carte) {
            this.contenitore = contenitore;
            this.carte = carte;
            this.focus = 0;

            this.generaCards();
        }

        clickPrecedente() {
            this.focus = (this.focus === 0) ? this.carte.length - 1 : this.focus - 1;
            this.generaCards();
        }

        clickSuccessivo() {
            this.focus = (this.focus === this.carte.length - 1) ? 0 : this.focus + 1;
            this.generaCards();
        }

        generaCards() {
            this.svuotaContenitore();
            for (let i = -1; i <= 1; i++) {
                let indice = (this.focus + i + this.carte.length) % this.carte.length;
                let carta = this.carte[indice];

                let c = new Carta(carta[0], carta[1], carta[2], carta[3]);
                let cardElement = c.creaCarta(i === 0);

                if (i === -1) {
                    cardElement.classList.add('slide-in-left');
                } else if (i === 1) {
                    cardElement.classList.add('slide-in-right');
                } else {
                    cardElement.classList.add('fade-in');
                }

                this.contenitore.appendChild(cardElement);
            }
        }

        svuotaContenitore() {
            this.contenitore.innerHTML = "";
        }
    }

    // Classe GraficoMondo
    class GraficoMondo {
        datiGrezzi;
        datiElaborati;
        chart;
        options;
        data;

        constructor(dati, options) {
            this.datiGrezzi = dati;
            this.datiElaborati = [];

            this.elaboraDati();
            this.caricaData();

            this.options = options;
            this.chart = new google.visualization.GeoChart(document.getElementById('regions_div'));
            this.chart.draw(this.data, this.options);
        }

        esiste(dato) {
            return this.datiElaborati.some(d => d[0] === dato[0]);
        }

        caricaData() {
            this.data = new google.visualization.DataTable();
            this.data.addColumn('string', 'Stato');
            this.data.addColumn('number', 'Guerra');
            this.data.addColumn({ type: 'string', role: 'tooltip' }, 'Note');
            this.data.addRows(this.datiElaborati);
        }

        elaboraDati() {
            for (let i = 0; i < this.datiGrezzi.length; i++) {
                if (this.esiste(this.datiGrezzi[i])) continue;

                let stessoStato = this.datiGrezzi
                    .map((val, j) => [j, val])
                    .filter(([_, val]) => val[0] === this.datiGrezzi[i][0])
                    .sort((a, b) => b[1][1][1] - a[1][1][1])
                    .map(([j, _]) => j);

                let dato = [this.datiGrezzi[i][0], this.datiGrezzi[stessoStato[0]][1][1]];

                let nota = stessoStato.map(indice => {
                    const [inizio, fine] = this.datiGrezzi[indice][1];
                    const desc = this.datiGrezzi[indice][2];
                    return `(${inizio} - ${fine}) ${fine === 2025 ? "Attualmente in corso" : "Finita"} - ${desc}`;
                }).join("\n");

                dato.push(nota);
                this.datiElaborati.push(dato);
            }
        }
    }

    // Inizializzazione cards
    const contenitore = document.getElementById("contenitoreCarousel");
    const btnPrec = document.getElementById("prec");
    const btnSuc = document.getElementById("succ");

    const carte = [
        ["./images/le_radici_della_guerra.jpeg", "Le radici della guerra", "Scopri le cause profonde dei conflitti...", "radici-guerra.html"],
        ["./images/riconciliazione.jpg", "Storie di guerra e riconciliazione", "Analisi di alcuni dei conflitti...", "riconciliazione.html"],
        ["./images/costo-umano.png", "Il costo umano della guerra", "Civili, profughi, bambini...", "costo-umano.html"],
        ["./images/costruire-pace.png", "Costruire la pace: modelli e soluzioni", "Mediazione, diplomazia...", "costruire-pace.html"]
    ];

    const gestore = new GestoreCards(contenitore, carte);
    btnPrec.addEventListener("click", () => gestore.clickPrecedente());
    btnSuc.addEventListener("click", () => gestore.clickSuccessivo());

    // Caricamento dati mappa
    let options = {
        colorAxis: { colors: '#FF0000' },
    };

    fetch('./dati.json')
        .then(response => response.json())
        .then(data => {
            const dati = Object.keys(data).map(key => [data[key].stato, data[key].anni, data[key].descrizione]);
            google.charts.load('current', { 'packages': ['geochart'] });
            google.charts.setOnLoadCallback(() => {
                new GraficoMondo(dati, options);
            });
        })
        .catch(error => console.error('Errore nel caricare il file JSON:', error));

    // Login
    const loginBtn = document.getElementById('loginToggle');
    const singupForm = document.getElementById("signupForm");
    const SignupBtn = document.getElementById("signupBtn");
    const loginForm = document.getElementById('loginForm');

    const loginSubmit = document.getElementById('formLogin');
    const singupSubmit = document.getElementById('formSignup');

    const errore = document.getElementById('erroreLogin');

    const fotoProfilo = document.getElementById('fotoProfilo');
    const schedaProfilo = document.getElementById('schedaProfilo');
    const btnLogout = document.getElementById('btnLogout');

    const listaAccount = [
        { email: "Mario.Rossi@gmail.com", password: "admin" },
        { email: "Cloud.Strife@gmail.com", password: "sephiroth" },
        { email: "giuseppe.verdi@gmail.com", password: "admin2" }
    ];

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
            fotoProfilo.classList.remove('d-none');
            fotoProfilo.className += "d-block";

            loginBtn.className += " d-none";
            SignupBtn.className += " d-none";
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
        if (!loginForm.contains(e.target) && e.target !== SignupBtn) {
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
        schedaProfilo.classList += "d-none";
    });
});
