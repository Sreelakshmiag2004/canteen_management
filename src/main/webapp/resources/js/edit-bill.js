/* =============================
   GLOBAL STATE
============================= */
let currentBillId = null;
let savedItems = [];
let unsavedItems = [];

/* =============================
   REPORT BUTTON
============================= */
document.getElementById("reportBtn").onclick = () => {
    window.location.href = "program-report.html";
};

/* =============================
   LOAD MENU ITEMS (item_list)
============================= */
function loadMenuItems() {
    fetch("http://localhost:8080/api/item-list")
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(items => {
            const select = document.getElementById("itemSelect");

            select.innerHTML = `<option value="">-- Select Item --</option>`;

            items.forEach(i => {
                select.innerHTML += `
                    <option 
                        value="${i.rate}"
                        data-name="${i.itemName}">
                        ${i.itemName}
                    </option>`;
            });
        })
        .catch(() => {
            alert("❌ Failed to load menu items");
        });
}



/* =============================
   AUTO-FILL RATE
============================= */
document.getElementById("itemSelect").addEventListener("change", () => {
    const opt = itemSelect.options[itemSelect.selectedIndex];
    displayPrice.value = opt.value ? `₹${opt.value}` : "₹0.00";
});

/* =============================
   LOAD BILL BY BILL ID
============================= */
function loadBillForEdit() {
    const billId = billIdSearch.value.trim();

    if (!billId) {
        alert("Enter Bill ID");
        return;
    }

    fetch(`http://localhost:8080/api/program/by-bill/${billId}`)
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(() => {
            currentBillId = billId;
            editBillContainer.style.display = "block";
            loadProgramDetails(billId);
            loadOrderedItems(billId);
        })
        .catch(() => {
            editBillContainer.style.display = "none";
            alert("❌ Bill ID does not exist");
        });
}

/* =============================
   LOAD BILL BY PROGRAM UID
============================= */
function loadBillByProgramUid() {
    const uid = searchProgramUid.value.trim();

    if (!uid) {
        alert("Enter Programme UID");
        return;
    }

    fetch(`http://localhost:8080/api/program/uid/${uid}`)
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(program => {
            if (!program.billId) {
                alert("❌ No bill found for this Programme UID");
                editBillContainer.style.display = "none";
                return;
            }
            billIdSearch.value = program.billId;
            loadBillForEdit();
        })
        .catch(() => {
            alert("❌ Programme UID does not exist");
        });
}

/* =============================
   LOAD PROGRAM DETAILS
============================= */
function loadProgramDetails(billId) {
    fetch(`http://localhost:8080/api/program/by-bill/${billId}`)
        .then(res => res.json())
        .then(p => {
            programUid.value = p.programUid ?? "";
            programCallId.value = p.programCallId ?? "";
            progNo.value = p.progNo ?? "";
            programName.value = p.programName ?? "";
            sessionName.value = p.sessionName ?? "";
            dateFrom.value = p.dateFrom ?? "";
            dateTo.value = p.dateTo ?? "";
            duration.value = p.duration ?? "";
            category.value = p.category ?? "";
            coordinator.value = p.coordinator ?? "";

            lockProgramDetails();
        });
}

/* =============================
   LOAD SAVED ITEMS
============================= */
function loadOrderedItems(billId) {
    fetch(`http://localhost:8080/api/ordered-list/by-bill/${billId}`)
        .then(res => res.json())
        .then(items => {
            savedItems = items;
            unsavedItems = [];
            renderTable();
        })
        .catch(() => {
            savedItems = [];
            unsavedItems = [];
            renderTable();
        });
}

/* =============================
   RENDER TABLE
============================= */
function renderTable() {
    const tbody = document.querySelector("#billTable tbody");
    tbody.innerHTML = "";

    let index = 1;

    savedItems.forEach(i => {
        tbody.innerHTML += rowTemplate(index++, i, false);
    });

    unsavedItems.forEach(i => {
        tbody.innerHTML += rowTemplate(index++, i, true);
    });

    totalRowsCount.innerText = savedItems.length;
    unsavedRowsCount.innerText = unsavedItems.length;
}

function rowTemplate(index, i, isUnsaved) {
    return `
        <tr class="${isUnsaved ? 'unsaved-row' : ''}">
            <td>${index}</td>
            <td>${i.serviceDate}</td>
            <td>${i.servedTime}</td>
            <td>${i.itemName}</td>
            <td>${i.quantity}</td>
            <td>₹${i.rate}</td>
            <td>₹${i.price}</td>
            <td>
                ${
                    isUnsaved
                        ? `<button class="edit-btn" onclick="removeUnsaved(${index - savedItems.length - 1})">Remove</button>`
                        : `<span style="color:#999">Saved</span>`
                }
            </td>
        </tr>`;
}

/* =============================
   ADD ITEM (UI ONLY)
============================= */
addItemForm.addEventListener("submit", e => {
    e.preventDefault();

    const opt = itemSelect.options[itemSelect.selectedIndex];

    const item = {
        serviceDate: serviceDate.value,
        servedTime: servedTime.value,
        itemName: opt.dataset.name,
        quantity: Number(itemQty.value),
        rate: Number(opt.value),
        price: Number(itemQty.value) * Number(opt.value)
    };

    unsavedItems.push(item);
    closeAddModal();
    renderTable();
});

/* =============================
   REMOVE UNSAVED ITEM
============================= */
function removeUnsaved(index) {
    unsavedItems.splice(index, 1);
    renderTable();
}

/* =============================
   SAVE BILL (DB)
============================= */
function saveBill() {
    if (unsavedItems.length === 0) {
        alert("No unsaved rows to save");
        return;
    }

    fetch(`http://localhost:8080/api/ordered-list/save/${currentBillId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unsavedItems)
    })
        .then(res => {
            if (!res.ok) throw new Error();
            alert("✅ Bill saved successfully");
            loadOrderedItems(currentBillId);
        })
        .catch(() => {
            alert("❌ Failed to save bill");
        });
}

/* =============================
   LOCK PROGRAM DETAILS
============================= */
function lockProgramDetails() {
    [
        "programUid","programYear","programCallId","progNo",
        "programName","sessionName","duration","category","coordinator"
    ].forEach(id => {
        document.getElementById(id).readOnly = true;
    });

    dateFrom.disabled = true;
    dateTo.disabled = true;
}

/* =============================
   MODAL OPEN / CLOSE
============================= */
function openAddModal() {
    addModal.style.display = "flex";
    loadMenuItems();   // 🔥 IMPORTANT
}

function closeAddModal() {
    addModal.style.display = "none";
}

document.querySelector(".close-modal").onclick = closeAddModal;
