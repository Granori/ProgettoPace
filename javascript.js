document.addEventListener('DOMContentLoaded', function () {
    // Qui il codice per inizializzare la mappa
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
            this.paginaDettaglio = paginaDettaglio; // Aggiunto parametro per la pagina di destinazione
            this.carta = null;
        }

        creaCarta(principale) {
            this.carta = document.createElement("div"); // Cambiato da div ad a
           // Aggiunto href
            this.carta.className = "card text-decoration-none";
            if (principale) {
                this.carta.className += " w-80";
                this.carta.style = "height: 26em;";
            }
            else {
                this.carta.className += " w-50";
                this.carta.style = "height: 21.5em;";
            }

            this.carta.addEventListener('click', () => {
                window.location.href = this.paginaDettaglio;
            });
            this.carta.style.cursor = 'pointer';

            const overlayImmagine = document.createElement("div");
            overlayImmagine.className = "position-relative";

            const immagine = document.createElement("img");
            immagine.className = "card-img-top w-100 h-auto position-relative opacity-50";
            immagine.src = this.img;

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
            body.className = "card-body ";
            const p = document.createElement("p");
            p.className = "card-text";
            p.innerHTML = this.testo;

            body.appendChild(p);

            this.carta.appendChild(overlayImmagine);
            this.carta.appendChild(body);

            return this.carta;
        }
    };

    class GestoreCards {
        carte;
        focus;
        contenitore

        constructor(contenitore, carte) {
            this.contenitore = contenitore;
            this.carte = carte;
            this.focus = 0;

            this.generaCards();
        }

        clickPrecedente() {
            if (this.focus == 0) this.focus = this.carte.length - 1;
            else this.focus--;

            this.generaCards();
        }
        clickSuccessivo() {
            if (this.focus == this.carte.length - 1) this.focus = 0;
            else this.focus++;

            this.generaCards();
        }

        generaCards() {
            this.svuotaContenitore();
            for (let i = -1; i <= 1; i++) {
                let indice = this.focus + i;
                if (this.focus + i < 0) indice = this.carte.length - 1;
                else if (this.focus + i >= this.carte.length) indice = 0;
                let carta = this.carte[indice];
                console.log(this.focus);


                let c = new Carta(carta[0], carta[1], carta[2], carta[3]);

                this.contenitore.appendChild(c.creaCarta(i == 0));
            }
        }

        svuotaContenitore() {
            this.contenitore.innerHTML = "";
        }

    }

    class GraficoMondo {
        datiGrezzi;
        datiElaborati;

        chart;
        options;
        data;

        constructor(dati) {
            this.datiGrezzi = dati;
            this.datiElaborati = [];

            this.elaboraDati();
            this.caricaData();

            this.options = {
                colorAxis: { minValue: 0, colors: '#FF0000' },
            };

            this.chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

            this.chart.draw(this.data, this.options);
        }

        esiste(dato) {
            let presente = false;
            for (let i = 0; i < this.datiElaborati.length; i++) {
                if (this.datiElaborati[i][0] == dato[0]) {
                    presente = true;
                    break;
                }
            }

            return presente;
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

                let stessoStato = [];
                for (let j = 0; j < this.datiGrezzi.length; j++) {
                    if (this.datiGrezzi[j][0] == this.datiGrezzi[i][0]) stessoStato.push(j);
                }
                stessoStato.sort((a, b) => this.datiGrezzi[b][1][1] - this.datiGrezzi[a][1][1]);

                let dato = [];
                dato.push(this.datiGrezzi[i][0]);
                dato.push(this.datiGrezzi[stessoStato[0]][1][1]);

                let nota = "";
                for (let j = 0; j < stessoStato.length; j++) {
                    if (j != 0) nota += "\n";
                    if (this.datiGrezzi[stessoStato[j]][1][1] == 2025) {
                        nota += `(${this.datiGrezzi[stessoStato[j]][1][0]} - ${this.datiGrezzi[stessoStato[j]][1][1]}) Attualmente in corso - ${this.datiGrezzi[stessoStato[j]][2]}`;
                    }
                    else {
                        nota += `(${this.datiGrezzi[stessoStato[j]][1][0]} - ${this.datiGrezzi[stessoStato[j]][1][1]}) Finita - ${this.datiGrezzi[stessoStato[j]][2]}`;
                    }
                };
                dato.push(nota);

                this.datiElaborati.push(dato);
            };
        }

    }

    const contenitore = document.getElementById("contenitoreCarousel");
    const btnPrec = document.getElementById("prec");
    const btnSuc = document.getElementById("succ");

    const carte = [
        [
            "./images/le_radici_della_guerra.jpeg",
            "Le radici della guerra",
            "Scopri le cause profonde dei conflitti...",
            "radici-guerra.html" 
        ],
        [
            "./images/riconciliazione.jpg",
            "Storie di guerra e riconciliazione",
            "Analisi di alcuni dei conflitti...",
            "riconciliazione.html"
        ],
        [
            "./images/costo-umano.png",
            "Il costo umano della guerra",
            "Civili, profughi, bambini...",
            "costo-umano.html"
        ],
        [
            "./images/costruire-pace.png",
            "Costruire la pace: modelli e soluzioni",
            "Mediazione, diplomazia...",
            "costruire-pace.html"
        ],
    ];
    const gestore = new GestoreCards(contenitore, carte);

    btnPrec.addEventListener("click", (e) => {
        const bottone = e.currentTarget;
        bottone.blur();

        gestore.clickPrecedente();
    });
    btnSuc.addEventListener("click", (e) => {
        const bottone = e.currentTarget;
        bottone.blur();

        gestore.clickSuccessivo();
    });


    let dati = [
        // In corso
        ['Russia', [2014, 2025], "in guerra con l'Ucraina"],
        ['Ukraine', [2014, 2025], "in guerra con la Russia"],
        ['Israel', [2023, 2025], "in guerra con la Palestina"],
        ['Palestine', [2023, 2025], "in guerra con Israele"],
        ['Sudan', [2023, 2025], "in una guerra civile"],
        ['Myanmar', [2021, 2025], "in una guerra civile"],
        ['Yemen', [2015, 2025], "in stato d'emergenza a causa della violenza di gang"],
        ['Somalia', [1991, 2025], "in una guerra civile"],
        ['CD', [2022, 2025], "in una guerra civile"], // Congo

        // Finite
        ['US', [2001, 2021], "guerra con l'Afghanistan"],
        ['Afghanistan', [2001, 2021], "guerra con gli Stati Uniti"],
        ['Iraq', [2003, 2011], "guerra con gli Stati Uniti"],
        ['Sudan', [2003, 2020], "guerra civile"],
        ['Mexico', [2004, 2010], "guerra tra gang"],
        ['Central African Republic', [2004, 2007], "guerra civile"],
        ['Chad', [2005, 2010], "guerra civile"],
        ['Kenya', [2005, 2008], "guerra civile"],
        ['Sri Lanka', [2006, 2009], "guerra civile"],
        ['Libya', [2011, 2011], "guerra civile"],
        ['', [], ""],
    ];

    google.charts.load('current', {
        'packages': ['geochart'],
    });
    google.charts.setOnLoadCallback(() => {
        const mondo = new GraficoMondo(dati);
    });

    // Validazione login
    const toggleBtn = document.getElementById('loginToggle');
    const loginForm = document.getElementById('loginForm');

    toggleBtn.addEventListener('click', () => {
        loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    });

    //messaggi errore
    function failogin(event) {
        event.preventDefault();
        let emailCorretta = "Mario.Rossi@gmail.com";
        let passwordCorretta = "admin";

        let emailData = document.login.email.value;
        let passwordData = document.login.password.value;

        let errorEmail = document.getElementById("errorEmail");
        let errorPassword = document.getElementById("errorPassword");

        if (emailData !== emailCorretta)
            errorEmail.style.display = "block";
        if (passwordData !== passwordCorretta)
            errorPassword.style.display = "block";

    }
    //chiude cliccando fuori
    document.addEventListener('click', (e) => {
        if (!loginForm.contains(e.target) && e.target !== toggleBtn) {
            loginForm.style.display = 'none';
        }
    });

    console.log(google); // Dovresti vedere l'oggetto google
    console.log(google.visualization); // Dovresti vedere visualization
    console.log(google.visualization.GeoChart); // Dovresti vedere la funzione GeoChart
    // salvataggio su json
});