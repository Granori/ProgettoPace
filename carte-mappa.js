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
                let indice = (this.focus + i + this.carte.length) % this.carte.length;
                let carta = this.carte[indice];

                let c = new Carta(carta[0], carta[1], carta[2], carta[3]);
                let cartaGrafica = c.creaCarta(i == 0);

                if (i == -1) {
                    cartaGrafica.classList.add('slide-in-left');
                } else if (i == 1) {
                    cartaGrafica.classList.add('slide-in-right');
                } else {
                    cartaGrafica.classList.add('fade-in');
                }

                this.contenitore.appendChild(cartaGrafica);
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

        caricaData() {
            this.data = new google.visualization.DataTable();
            this.data.addColumn('string', 'Stato');
            this.data.addColumn('number', 'Guerra');
            this.data.addColumn({ type: 'string', role: 'tooltip' }, 'Note');
            this.data.addRows(this.datiElaborati);
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

        elaboraDati() {
            for (let i = 0; i < this.datiGrezzi.length; i++) {
                if (this.esiste(this.datiGrezzi[i])) continue;

                let stessoStato = [];
                // Cerco se ci sono più guerre nello stesso stato
                for (let j = 0; j < this.datiGrezzi.length; j++)  {
                    if (this.datiGrezzi[j][0] == this.datiGrezzi[i][0]) stessoStato.push(j);
                }
                // Ordino la lista in modo decrescente (dal più recente al più vecchio)
                stessoStato.sort((a, b) => this.datiGrezzi[b][1][1] - this.datiGrezzi[a][1][1]);

                let dato = [];
                // Aggiungo lo stato
                dato.push(this.datiGrezzi[i][0]);
                // Aggiungo la data della guerra più recente
                dato.push(this.datiGrezzi[stessoStato[0]][1][1]);

                let nota = "";
                // Aggiungo nella nota dello stato tutte le guerre a cui ha partecipato partendo da quella più recente
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

});
