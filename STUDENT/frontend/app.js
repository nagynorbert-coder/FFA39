const API_URL = "https://localhost:4000/api"

// ── DOM elemek ────────────────────────────────────────────────────────────────

const fagyiKartyaTarolo    = document.getElementById("fagyiKartyaTarolo");
const fagyiLekerdezoGomb   = document.getElementById("fagyiLekerdezoGomb");
const fagyiNevKereso       = document.getElementById("fagyiNevKereso");
const tipusSzuro           = document.getElementById("tipusSzuro");
const elerhetosegSzuro     = document.getElementById("elerhetosegSzuro");
const rendezesValaszto     = document.getElementById("rendezesValaszto");
const fagyiMuveletUzenet   = document.getElementById("fagyiMuveletUzenet");
const statisztikaValaszto  = document.getElementById("statisztikaValaszto");
const statisztikaFejlecSor = document.getElementById("statisztikaFejlecSor");
const statisztikaTorzs     = document.getElementById("statisztikaTorzs");
const statisztikaUzenet    = document.getElementById("statisztikaUzenet");
const fagyiUrlap           = document.getElementById("fagyiUrlap");
const uzenet               = document.getElementById("uzenet");

let torlesAlattiId = null;
let editId = null;

// ── Modal segéd ───────────────────────────────────────────────────────────────

function modalShow(id) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).show();
}

function modalHide(id) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).hide();
}

// ── Visszajelzés ──────────────────────────────────────────────────────────────

function uzenetMutat(cim, szoveg, tipus) {
    document.getElementById("visszajelzesCim").textContent = cim;
    const szovegElem = document.getElementById('visszajelzesUzenet')
    szovegElem.textContent = szoveg
    if(tipus == 'hiba'){
        szovegElem.classList.add("fw-semibold text-center text-danger")
    }
    else{
        szovegElem.classList.add("fw-semibold text-center text-success")
    }
    modalShow("visszajelzesModal")
}

// ── Típusok betöltése ─────────────────────────────────────────────────────────

function tipusokBetoltese(selectId) {
    const selectElem = document.getElementById(selectId)
    if(!selectElem){
        return
    }
    fetch(API_URL + "/tipusok")
    .then(r => r.json())
    .then(adatok => {
        adatok.forEach(element => {
            const opcio = document.createElement("option")
            opcio.value = element.tipus_kod
            opcio.textContent = element.tipus_nev
            selectElem.appendChild(opcio)
        });
    })
    .catch(() => {
        if(fagyiMuveletUzenet){
            fagyiMuveletUzenet.textContent = "Nem sikerült betölteni a típusokat"
            fagyiMuveletUzenet.classList.add("text-danger text-center mb-4")
        }
    })
}

// ── Fagylalt kártya ───────────────────────────────────────────────────────────

function fagyiKartyaKeszites(fagyi) {

}

// ── Fagylaltok lekérdezése ────────────────────────────────────────────────────

function fagyikLekerdezese() {

}

// ── Szerkesztés modal ─────────────────────────────────────────────────────────

function szerkesztesModalMegnyit(gomb) {
    editId = parseInt(gomb.dataset.id);
    modalShow("szerkesztesModal");
}

document.getElementById("szerkesztesUrlap").addEventListener("submit", function(e) {
    e.preventDefault();
    if (!editId) {
        uzenetMutat("Hiba", "Nincs kiválasztott fagyi a szerkesztéshez", "hiba");
        return;
    }
    const adat ={
        fagyiNev: document.getElementById("szerkesztesNev").value,
        fagyiTipus: document.getElementById("szerkesztesTipus").value,
        fagyiAr: document.getElementById("szerkesztesAr").value,
        fagyiLeiras: document.getElementById("szerkesztesLeiras").value,
        fagyiElerheto: document.getElementById("szerkesztesElerheto").value
    };

    fetch(`${API_URL}/fagylaltok/${editId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(adat)
    })
    .then(r => r.json())
    .then(valasz => {
        uzenetMutat("Sikeres módosítás", valasz.uzenet, "siker");
        document.getElementById("szerkesztesUrlap").reset();
        modalHide("szerkesztesModal");
        fagyikLekerdezese();
        editId = null;
    })
    .catch(() => {
        uzenetMutat("Hiba", "Hiba történt a módosítás során", "hiba");
    });
});

// ── Törlés modal ──────────────────────────────────────────────────────────────

function torlesModalMegnyit(gomb) {

}

document.getElementById("torlesMegerosites").addEventListener("click", function() {

});

// ── Statisztika ───────────────────────────────────────────────────────────────

const statisztikaBeallitasok = {

};

function statisztikaLekerdezese() {

}

// ── Új fagyi mentése ──────────────────────────────────────────────────────────

function ujFagyiMentese(e) {
    e.preventDefault();
    const adat ={
        fagyiNev: document.getElementById("fagyiNev").value,
        fagyiTipus: document.getElementById("fagyiTipus").value,
        fagyiAr: document.getElementById("fagyiAr").value,
        fagyiLeiras: document.getElementById("fagyiLeiras").value,
        fagyiElerheto: document.getElementById("fagyiElerheto").value
    };

    fetch(API_URL + "/fagylaltok",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(adat)
    })
        .then(r => r.json())
        .then(valasz => {
            uzenetMutat("Sikeres mentés", valasz.uzenet, "siker")
            fagyiUrlap.reset()
            fagyikLekerdezese()

    })
        .catch(() => {
            uzenetMutat("Hiba","Hiba történt a mentés során", "hiba")
        })
}   
// ── Indítás ───────────────────────────────────────────────────────────────────

if (fagyiLekerdezoGomb) {
    tipusokBetoltese("tipusSzuro");
    fagyiLekerdezoGomb.addEventListener("click", fagyikLekerdezese);
}

statisztikaValaszto.addEventListener("change", statisztikaLekerdezese);

if (fagyiUrlap) {
    tipusokBetoltese("fagyiTipus");
    fagyiUrlap.addEventListener("submit", ujFagyiMentese);
}
