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

            const immagine = document.createElement("img");
            this.carta.className += " w-50";
            if (principale) {
                this.carta.style = "height: 25em;";
                immagine.style = "height: 20em; width: 100%";

            }
            else {
                this.carta.style = "height: 21em;";
                immagine.style = "height: 15em; width: 100%";

            }

            this.carta.addEventListener('click', () => {
                window.location.href = this.paginaDettaglio;
            });
            this.carta.style.cursor = 'pointer';

            const overlayImmagine = document.createElement("div");
            overlayImmagine.className = "position-relative";

            immagine.className = "card-img-top position-relative opacity-50";
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

                let c = new Carta(carta[0], carta[1], carta[2], carta[3]);
                let cardElement = c.creaCarta(i == 0);

                // Aggiungi classi di animazione in base alla posizione
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
        this.data.addColumn({type:'string', role:'tooltip'}, 'Note');

        this.data.addRows(this.datiElaborati);
      }

      elaboraDati() {
        for (let i = 0; i < this.datiGrezzi.length; i++) {
          if (this.esiste(this.datiGrezzi[i])) continue;

          let stessoStato = [];
          for (let j = 0; j < this.datiGrezzi.length; j++)  {
            if (this.datiGrezzi[j][0] == this.datiGrezzi[i][0]) stessoStato.push(j);
          }
          stessoStato.sort((a, b) => this.datiGrezzi[b][1][1] - this.datiGrezzi[a][1][1]);

          let dato = [];
          dato.push(this.datiGrezzi[i][0]);
          dato.push(this.datiGrezzi[stessoStato[0]][1][1]);

          let nota = "";
          for (let j = 0; j < stessoStato.length; j++) {
            let indice = stessoStato[j];
            
            if (j != 0) nota += "\n";
            if (this.datiGrezzi[indice][1][1] == 2025) {
              nota += `(${this.datiGrezzi[indice][1][0]} - ${this.datiGrezzi[indice][1][1]}) Attualmente in corso - ${this.datiGrezzi[indice][2]}`;
            }
            else {
              nota += `(${this.datiGrezzi[indice][1][0]} - ${this.datiGrezzi[indice][1][1]}) Finita - ${this.datiGrezzi[indice][2]}`;
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

    let options = {
      colorAxis: {colors: '#FF0000'},
    };

    let dati = [];
    fetch('./dati.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        dati = Object.keys(data).map(key => {
            return [data[key].stato, data[key].anni, data[key].descrizione];
        });
        console.log(dati)
        caricamento(dati);
    })
    .catch(error => console.error('Errore nel caricare il file JSON:', error));

    function caricamento(dati) {
        google.charts.load('current', {
            'packages': ['geochart'],
        });
        google.charts.setOnLoadCallback(() => {
            const mondo = new GraficoMondo(dati, options);
        });

    }

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
    // quando fai il login/signup devi fare
    /**
     * const fotoProfilo = document.getElementById('fotoProfilo');
     * 
     * se hai effettuato il login/signup:
     *      fotoProfilo.className = "bi bi-person-circle ms-3"
     * 
     * se hai fatto il logout:
     *      fotoProfilo.className = "bi bi-person-circle ms-3 d-none"
     * 
     * Quando clicchi su fotoProfilo deve comparire una scheda come con il login dove c'è un pulsante per il logout**
     */

    //chiude cliccando fuori
    document.addEventListener('click', (e) => {
        if (!loginForm.contains(e.target) && e.target !== toggleBtn) {
            loginForm.style.display = 'none';
        }
    });
    // salvataggio su json
});