const supplierInput = document.getElementById("supplier");
const palletsInput = document.getElementById("pallets");
const notesInput = document.getElementById("notes");

const addButton = document.getElementById("addDeliveryBtn");
const deliveryList = document.getElementById("deliveryList");
const deliveryCount = document.getElementById("deliveryCount");
const palletCount = document.getElementById("palletCount");
const formTitle = document.getElementById("formTitle");
const editInfo = document.getElementById("editInfo");

const deleteModal =
    document.getElementById("deleteModal");

const deleteInfo =
    document.getElementById("deleteInfo");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

    const reportBtn =
    document.getElementById("reportBtn");

const reportModal =
    document.getElementById("reportModal");

const reportContent =
    document.getElementById("reportContent");

const closeReportBtn =
    document.getElementById("closeReportBtn");

const sendReportBtn =
    document.getElementById("sendReportBtn");
    const newDayBtn =
    document.getElementById("newDayBtn");

    const monthlyReportModal =
    document.getElementById("monthlyReportModal");

const monthlyReportContent =
    document.getElementById("monthlyReportContent");

const closeMonthlyReportBtn =
    document.getElementById("closeMonthlyReportBtn");

const sendMonthlyReportBtn =
    document.getElementById("sendMonthlyReportBtn");

const newMonthBtn =
    document.getElementById("newMonthBtn");
// --------------------------------
// Dane
// --------------------------------

let deliveries =
JSON.parse(localStorage.getItem("deliveries")) || [];
let monthlyHistory =
JSON.parse(localStorage.getItem("monthlyHistory")) || [];

let editId = null;
let deleteId = null;

// --------------------------------
// Dodawanie / Edycja dostawy
// --------------------------------

addButton.addEventListener("click", () => {

const supplier = supplierInput.value.trim();
const pallets = palletsInput.value.trim();
const notes = notesInput.value.trim();

if (!supplier) {
    alert("Podaj dostawcę");
    return;
}

if (!pallets) {
    alert("Podaj ilość palet");
    return;
}

// -----------------------------
// EDYCJA
// -----------------------------

if (editId !== null) {

    const delivery = deliveries.find(
        d => d.id === editId
    );

    if (delivery) {
        delivery.supplier = supplier;
        delivery.pallets = pallets;
        delivery.notes = notes;
    }

    editId = null;
    addButton.textContent = "Dodaj dostawę";
formTitle.textContent = "Nowa dostawa";
editInfo.textContent = "";
} else {

    // -----------------------------
    // NOWY WPIS
    // -----------------------------

    const now = new Date();

    deliveries.unshift({
        id: Date.now(),
        supplier,
        pallets,
        notes,
        date: now.toLocaleDateString("pl-PL"),
        time: now.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit"
        })
    });

}

saveDeliveries();

renderDeliveries();
updateStats();

supplierInput.value = "";
palletsInput.value = "";
notesInput.value = "";

supplierInput.focus();

});

// --------------------------------
// Render listy
// --------------------------------

function renderDeliveries() {

deliveryList.innerHTML = "";

deliveries.forEach(delivery => {

    const item = document.createElement("div");

    item.className = "delivery-item";

    item.innerHTML = `
        <div class="delivery-top">

            <span class="delivery-time">
                ${delivery.time}
            </span>

            <span class="delivery-pallets">
                ${delivery.pallets} palet
            </span>

        </div>

        <div class="delivery-supplier">
            ${delivery.supplier}
        </div>

        ${
            delivery.notes
                ? `<div class="delivery-notes">${delivery.notes}</div>`
                : ""
        }

        <div class="delivery-actions">

            <button
                class="btn-edit"
                data-id="${delivery.id}">
                Edytuj
            </button>

            <button
    class="delivery-delete-btn"
    data-id="${delivery.id}">
    Usuń
</button>

        </div>
    `;

    deliveryList.appendChild(item);

});

attachEvents();

}

// --------------------------------
// Obsługa przycisków
// --------------------------------

function attachEvents() {

// USUŃ

document.querySelectorAll(".delivery-delete-btn")
    .forEach(button => {

        button.onclick = () => {

            console.log("BUTTON HTML:");
            console.log(button.outerHTML);

            console.log("DATASET:");
            console.log(button.dataset);

            console.log("ID:");
            console.log(button.dataset.id);

            deleteId = button.dataset.id;

            const delivery = deliveries.find(
                d => String(d.id) === String(deleteId)
            );

            console.log("DELIVERY:");
            console.log(delivery);

            if (!delivery) return;

            deleteInfo.innerHTML = `
                Dostawca: ${delivery.supplier}<br>
                Palety: ${delivery.pallets}
            `;

            deleteModal.classList.add("show");

        };

    });

// EDYTUJ

document.querySelectorAll(".btn-edit")
    .forEach(button => {

        button.onclick = () => {

            const id = Number(button.dataset.id);

            const delivery = deliveries.find(
                d => d.id === id
            );

            if (!delivery) return;

            supplierInput.value = delivery.supplier;
            palletsInput.value = delivery.pallets;
            notesInput.value = delivery.notes || "";

            editId = id;

            addButton.textContent = "Zapisz zmiany";
formTitle.textContent = "Edycja dostawy";

editInfo.textContent =
    `${delivery.supplier} • ${delivery.pallets} palet`;
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };

    });

}

// --------------------------------
// Statystyki
// --------------------------------

function updateStats() {

deliveryCount.textContent = deliveries.length;

const totalPallets = deliveries.reduce(
    (sum, delivery) => sum + Number(delivery.pallets),
    0
);

palletCount.textContent = totalPallets;

}

// --------------------------------
// LocalStorage
// --------------------------------

function saveDeliveries() {

localStorage.setItem(
    "deliveries",
    JSON.stringify(deliveries)
);

}

// --------------------------------
// Start aplikacji
// --------------------------------

renderDeliveries();
updateStats();


cancelDeleteBtn.onclick = () => {

    deleteModal.classList.remove("show");

    deleteId = null;

};

confirmDeleteBtn.addEventListener("click", () => {

    console.log("DELETE CONFIRM");
    console.log("deleteId:", deleteId);

    deliveries = deliveries.filter(
        d => String(d.id) !== String(deleteId)
    );

    saveDeliveries();

    renderDeliveries();
    updateStats();

    deleteModal.classList.remove("show");

    deleteId = null;

});

reportBtn.onclick = () => {

    const today = new Date()
        .toLocaleDateString("pl-PL");

    let report =
`Raport dostaw - ${today}

`;

    deliveries.forEach(delivery => {

        report +=
`${delivery.time} | ${delivery.supplier} | ${delivery.pallets} palet

`;

        if (delivery.notes) {

            report +=
`Uwagi: ${delivery.notes}

`;

        }

    });

    const totalPallets = deliveries.reduce(
        (sum, d) => sum + Number(d.pallets),
        0
    );

    report +=
`--------------------------------

Łączna liczba dostaw: ${deliveries.length}
Łączna liczba palet: ${totalPallets}`;

    reportContent.textContent = report;

    reportModal.classList.add("show");

};
closeReportBtn.addEventListener("click", () => {
console.log("REPORT CLOSE");
    reportModal.classList.remove("show");

});
sendReportBtn.addEventListener("click", () => {
newDayBtn.style.display = "block";
    const today = new Date()
        .toLocaleDateString("pl-PL");

    const subject =
        `${today} - Rejestr dostaw`;

    const body =
        reportContent.textContent;

    window.location.href =
        `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

});
newDayBtn.addEventListener("click", () => {

    // dopisz dzisiejsze dostawy do historii

    monthlyHistory.push(...deliveries);

    localStorage.setItem(
        "monthlyHistory",
        JSON.stringify(monthlyHistory)
    );

    // wyczyść bieżący dzień

    deliveries = [];

    saveDeliveries();

    renderDeliveries();
    updateStats();

    // schowaj raport

    reportModal.classList.remove("show");

    // schowaj przycisk nowego dnia

    newDayBtn.style.display = "none";

});

monthlyReportBtn.addEventListener("click", () => {

    const totalDeliveries =
        monthlyHistory.length;

    const totalPallets =
        monthlyHistory.reduce(
            (sum, delivery) =>
                sum + Number(delivery.pallets),
            0
        );

    const today = new Date();

    const month =
        today.toLocaleDateString(
            "pl-PL",
            {
                month: "long",
                year: "numeric"
            }
        );

    monthlyReportContent.textContent =

`Raport miesięczny - ${month}

Łączna liczba dostaw: ${totalDeliveries}

Łączna liczba palet: ${totalPallets}`;

    monthlyReportModal.classList.add("show");

});

// --------------------------------
// Raport miesięczny - zamknij
// --------------------------------

closeMonthlyReportBtn.addEventListener("click", () => {

    monthlyReportModal.classList.remove("show");

});

// --------------------------------
// Raport miesięczny - e-mail
// --------------------------------

sendMonthlyReportBtn.addEventListener("click", () => {

    newMonthBtn.style.display = "block";

    const today = new Date()
        .toLocaleDateString("pl-PL");

    const subject =
        `Raport miesięczny - ${today}`;

    const body =
        monthlyReportContent.textContent;

    window.location.href =
        `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

});

// --------------------------------
// Nowy miesiąc
// --------------------------------

newMonthBtn.addEventListener("click", () => {

    monthlyHistory = [];

    localStorage.setItem(
        "monthlyHistory",
        JSON.stringify([])
    );

    monthlyReportModal.classList.remove("show");

    newMonthBtn.style.display = "none";

});