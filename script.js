document.addEventListener('DOMContentLoaded', () => {
    const formularzKomitetu = document.getElementById('formularz-komitetu');
    const poleNazwaKomitetu = document.getElementById('nazwa-komitetu');
    const checkboxCzyKoalicja = document.getElementById('czy-koalicja');
    const poleLiczbaGlosow = document.getElementById('liczba-glosow');
    const przyciskDodaj = document.getElementById('przycisk-dodaj');
    const przyciskOblicz = document.getElementById('przycisk-oblicz');

    const listaKomitetow = document.getElementById('lista-komitetow');
    const cialoTabeliWynikow = document.getElementById('cialo-tabeli-wynikow');

    const infoBrakKomitetow = document.getElementById('info-brak-komitetow');
    const infoBrakWynikow = document.getElementById('info-brak-wynikow');
    const kontenerListyKomitetow = document.getElementById('kontener-listy-komitetow');
    const kontenerTabeliWynikow = document.getElementById('kontener-tabeli-wynikow');

    let komitety = [];
    let nastepnyIdKomitetu = 1;

    function dodajKomitet() {
        const nazwa = poleNazwaKomitetu.value.trim();
        const jestKoalicja = checkboxCzyKoalicja.checked;
        const glosyString = poleLiczbaGlosow.value;
        const glosy = parseInt(glosyString, 10);

        if (nazwa === '') {
            alert('Proszę podać nazwę komitetu.');
            poleNazwaKomitetu.focus();
            return;
        }
        if (glosyString.trim() === '' || isNaN(glosy) || glosy < 0) {
             alert('Proszę podać prawidłową (nieujemną liczbę całkowitą) liczbę głosów.');
             poleLiczbaGlosow.focus();
             return;
        }

        komitety.push({
            id: nastepnyIdKomitetu++,
            nazwa: nazwa,
            jestKoalicja: jestKoalicja,
            glosy: glosy
        });

        wyswietlZarejestrowaneKomitety();
        wyczyscTabeleWynikow();
        formularzKomitetu.reset();
        poleNazwaKomitetu.focus();
    }

    function wyswietlZarejestrowaneKomitety() {
        listaKomitetow.innerHTML = '';
        const czySaKomitety = komitety.length > 0;

        infoBrakKomitetow.style.display = czySaKomitety ? 'none' : 'block';
        kontenerListyKomitetow.style.display = czySaKomitety ? 'block' : 'none';

        if (czySaKomitety) {
             komitety.forEach((komitet, index) => {
                const li = document.createElement('li');
                const tekstKoalicji = komitet.jestKoalicja ? 'jest koalicją' : 'nie jest koalicją';
                li.textContent = `${index + 1}. ${komitet.nazwa} ${tekstKoalicji}, ilość głosów: ${komitet.glosy.toLocaleString('pl-PL')}`;
                listaKomitetow.appendChild(li);
            });
        }
    }

    function obliczIWyswietlWyniki() {
        if (komitety.length === 0) {
            alert('Proszę najpierw dodać przynajmniej jeden komitet.');
            return;
        }

        cialoTabeliWynikow.innerHTML = '';
        let sumaGlosow = 0;
        komitety.forEach(komitet => {
             sumaGlosow += komitet.glosy;
        });

        const czyMoznaObliczyc = sumaGlosow > 0;

        infoBrakWynikow.style.display = czyMoznaObliczyc ? 'none' : 'block';
        kontenerTabeliWynikow.style.display = czyMoznaObliczyc ? 'block' : 'none';

        if (!czyMoznaObliczyc) {
             infoBrakWynikow.textContent = 'Całkowita liczba głosów wynosi 0. Nie można obliczyć wyników procentowych.';
             return;
        } else {
            infoBrakWynikow.textContent = 'Kliknij "Sprawdź wynik procentowy", aby zobaczyć wyniki.';
        }


        const posortowaneKomitety = [...komitety].sort((a, b) => b.glosy - a.glosy);

        posortowaneKomitety.forEach((komitet, index) => {
            const prog = komitet.jestKoalicja ? 8 : 5;
            const procent = (komitet.glosy / sumaGlosow) * 100;
            const procentFormat = procent.toFixed(2).replace('.', ',');
            const czyOsiagnietoProg = procent >= prog;

            const wiersz = cialoTabeliWynikow.insertRow();
            wiersz.insertCell(0).textContent = index + 1;
            wiersz.insertCell(1).textContent = komitet.nazwa;
            wiersz.insertCell(2).textContent = prog;
            wiersz.insertCell(3).textContent = komitet.glosy.toLocaleString('pl-PL');
            wiersz.insertCell(4).textContent = procentFormat;

            wiersz.className = czyOsiagnietoProg ? 'prog-osiagniety' : 'prog-nieosiagniety';
        });
    }

    function wyczyscTabeleWynikow() {
        cialoTabeliWynikow.innerHTML = '';
        infoBrakWynikow.textContent = 'Kliknij "Sprawdź wynik procentowy", aby zobaczyć wyniki.';
        infoBrakWynikow.style.display = 'block';
        kontenerTabeliWynikow.style.display = 'none';
    }

    if (przyciskDodaj) {
        przyciskDodaj.addEventListener('click', dodajKomitet);
    }
    if (przyciskOblicz) {
        przyciskOblicz.addEventListener('click', obliczIWyswietlWyniki);
    }

    wyswietlZarejestrowaneKomitety();
    wyczyscTabeleWynikow();
});
