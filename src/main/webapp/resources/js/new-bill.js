console.log("new-bill.js loaded successfully");

const API_ITEMS = "http://localhost:8080/items/all";
const API_PROGRAM_UID = "http://localhost:8080/api/program/uid/";
const API_PROGRAM_YEAR = "http://localhost:8080/api/program/year/";
const API_SAVE_ORDERS = "http://localhost:8080/api/bill/save-orders";

const openAddModalBtn = document.getElementById("openAddModalBtn");
const addModal = document.getElementById("addModal");
const closeModalBtn = document.querySelector(".close-modal");
const searchProgramBtn = document.getElementById("searchProgramBtn");
const generateBillBtn = document.getElementById("generateBillBtn");

const itemSelect = document.getElementById("itemSelect");
const rateTypeSelect = document.getElementById("rateTypeSelect");
const displayPrice = document.getElementById("displayPrice");

const billTableBody = document.querySelector("#billTable tbody");
const totalRowsCount = document.getElementById("totalRowsCount");

const modalTitle = document.getElementById("modalTitle");
const submitBtn = document.getElementById("submitBtn");


let menuItems = [];
let billRows = [];
let isEditMode = false;
let editIndex = null;
let currentBillId = null;


searchProgramBtn.onclick = () => {
    const uid = document.getElementById("programUid").value.trim();
    const year = document.getElementById("programYear").value.trim();

    if (uid) {
        fetch(API_PROGRAM_UID + uid)
            .then(res => res.json())
            .then(fillProgramDetails)
            .catch(() => alert("Error fetching program"));
    } else if (year) {
        fetch(API_PROGRAM_YEAR + year)
            .then(res => res.json())
            .then(showProgramSelection)
            .catch(() => alert("Error fetching programs"));
    } else {
        alert("Enter Program UID or Year");
    }
};


function formatDateForInput(dateValue) {
    if (!dateValue) return "";

    const date = new Date(dateValue);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
}
function fillProgramDetails(p) {
    document.getElementById("programUid").value = p.programUid;
    document.getElementById("programYear").value = p.programYear;
    document.getElementById("programCallId").value = p.programCallId;
    document.getElementById("progNo").value = p.progNo;
    document.getElementById("programName").value = p.programName;
    document.getElementById("session").value = p.sessionName;
    document.getElementById("duration").value = p.duration;
    document.getElementById("category").value = p.category;
    document.getElementById("coordinatorName").value = p.coordinator;
    
    
    document.getElementById("programDateFrom").value =
        formatDateForInput(p.dateFrom);

    document.getElementById("programDateTo").value =
        formatDateForInput(p.dateTo);

    currentBillId = p.billId;
     document.getElementById("programResultsBox").style.display = "none";
    showPopup("✅ Program loaded successfully. You can now add bill items.");

}

/*function showProgramSelection(programs) {
    let msg = "Programs found:\n\n";
    programs.forEach(p => {
        msg += `UID: ${p.programUid} | ${p.programName}\n`;
    });
    alert(msg + "\n\nSearch using Program UID.");
}*/
/*function showProgramSelection(programs) {

    const resultsDiv = document.getElementById("programResults");
    resultsDiv.innerHTML = "";

    programs.forEach(p => {
        const div = document.createElement("div");
        div.className = "search-item";
        div.innerText = `${p.programUid} | ${p.programName}`;

        div.onclick = () => {
            fillProgramDetails(p);   // 🔥 auto-fill everything
            resultsDiv.innerHTML = ""; // hide list after selection
        };

        resultsDiv.appendChild(div);
    });
}*/

/*function showProgramSelection(programs) {

    const box = document.getElementById("programResultsBox");
    box.innerHTML = "";

    if (!programs || programs.length === 0) {
        box.style.display = "block";
        box.innerHTML = `<div class="program-result-item">No programs found</div>`;
        return;
    }

    programs.forEach(p => {
        const div = document.createElement("div");
        div.className = "program-result-item";
        div.innerText = `${p.programUid} | ${p.programName}`;

        div.onclick = () => {
            fillProgramDetails(p);
            box.style.display = "none";
        };

        box.appendChild(div);
    });

    box.style.display = "block";
}
*/



function showProgramSelection(programs) {

    const box = document.getElementById("programResultsBox");
    box.innerHTML = "";

    if (!programs || programs.length === 0) {
        box.innerHTML = `<div class="program-result-item">No programs found</div>`;
        box.style.display = "block";
        return;
    }

    programs.forEach(p => {
        const div = document.createElement("div");
        div.className = "program-result-item";
        div.innerText = `${p.programUid} | ${p.programName}`;

        div.onclick = () => {
            fillProgramDetails(p);
            box.style.display = "none";
        };

        box.appendChild(div);
    });

    box.style.display = "block";
}



openAddModalBtn.onclick = () => {
    if (!currentBillId) {
        alert("Please search and load a program first");
        return;
    }

    isEditMode = false;
    editIndex = null;

    modalTitle.innerText = "Add menu items";
    submitBtn.innerText = "Add to Bill";

    document.getElementById("addItemForm").reset();
    displayPrice.value = "₹0.00";

    addModal.style.display = "flex";
    loadMenuItems();
};

closeModalBtn.onclick = () => addModal.style.display = "none";


function loadMenuItems() {
    fetch(API_ITEMS)
        .then(res => res.json())
        .then(data => {
            menuItems = data;
            itemSelect.innerHTML =
                `<option value="" disabled selected>-- Select Item --</option>`;

            menuItems.forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.itemCode;
                opt.textContent = item.itemName;
                itemSelect.appendChild(opt);
            });
        });
}


function updateRate() {
    const itemCode = itemSelect.value;
    if (!itemCode) {
        displayPrice.value = "₹0.00";
        return;
    }

    const item = menuItems.find(i => i.itemCode == itemCode);
    if (!item) {
        displayPrice.value = "₹0.00";
        return;
    }

    let rate = 0;

    
    if (rateTypeSelect.value === "a") rate = item.aRate;
    if (rateTypeSelect.value === "b") rate = item.bRate;
    if (rateTypeSelect.value === "c") rate = item.cRate;

    displayPrice.value = `₹${Number(rate).toFixed(2)}`;
}

itemSelect.addEventListener("change", updateRate);
rateTypeSelect.addEventListener("change", updateRate);


document.getElementById("addItemForm").addEventListener("submit", e => {
    e.preventDefault();

    const serviceDate = document.getElementById("serviceDate").value;
    const servedTime = document.getElementById("servedTime").value;
    const itemCode = itemSelect.value;
    const qty = Number(document.getElementById("itemQty").value);

    const item = menuItems.find(i => i.itemCode == itemCode);
    let rate = 0;

    if (rateTypeSelect.value === "a") rate = item.aRate;
    if (rateTypeSelect.value === "b") rate = item.bRate;
    if (rateTypeSelect.value === "c") rate = item.cRate;

    if (!item || rate === 0) {
        alert("Select valid item and rate");
        return;
    }

    const billItem = {
        serviceDate,
        servedTime,
        itemCode,
        itemName: item.itemName,
        quantity: qty,
        rate,
        price: rate * qty
    };

    if (isEditMode) billRows[editIndex] = billItem;
    else billRows.push(billItem);

    renderBillTable();
    addModal.style.display = "none";
});


function renderBillTable() {
    billTableBody.innerHTML = "";
    let total = 0;

    billRows.forEach((r, i) => {
        total += r.price;
        billTableBody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${r.serviceDate}</td>
                <td>${r.servedTime}</td>
                <td>${r.itemName}</td>
                <td>${r.quantity}</td>
                <td>₹${r.rate.toFixed(2)}</td>
                <td>₹${r.price.toFixed(2)}</td>
                <td><button onclick="editRow(${i})"
                                            style="
                        background:none;
                        border:none;
                        color:red;
                        font-weight:bold;
                        font-size:14px;
                        cursor:pointer;
                        padding:0;
                    ">Edit</button></td>
            </tr>`;
    });

    if (billRows.length > 0) {
        billTableBody.innerHTML += `
            <tr style="font-weight:bold">
                <td colspan="6" align="right">TOTAL</td>
                <td>₹${total.toFixed(2)}</td>
                <td></td>
            </tr>`;
    }

    totalRowsCount.innerText = billRows.length;
    generateBillBtn.disabled = billRows.length === 0;
}


window.editRow = index => {
    const r = billRows[index];
    isEditMode = true;
    editIndex = index;

    addModal.style.display = "flex";
    loadMenuItems();

    setTimeout(() => {
        document.getElementById("serviceDate").value = r.serviceDate;
        document.getElementById("servedTime").value = r.servedTime;
        document.getElementById("itemQty").value = r.quantity;
        itemSelect.value = r.itemCode;
        updateRate();
    }, 300);
};

generateBillBtn.onclick = () => {

    if (!currentBillId) {
        alert("No program loaded");
        return;
    }

    if (billRows.length === 0) {
        alert("Add at least one item");
        return;
    }

    const payload = {
        billId: currentBillId,
        orders: billRows
    };

    console.log("Saving items with BILL ID:", currentBillId);

    fetch("http://localhost:8080/api/bill/save-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("✅ Items saved successfully");
        billRows = [];
        renderBillTable();
    })
    .catch(err => {
        console.error(err);
        alert("❌ Failed to save items");
    });
};

document.getElementById("programYear").addEventListener("input", () => {
    document.getElementById("programResultsBox").style.display = "none";
});

document.getElementById("programUid").addEventListener("input", () => {
    document.getElementById("programResultsBox").style.display = "none";
});

function showPopup(message) {
    const box = document.getElementById("popupBox");
    const msg = document.getElementById("popupMessage");

    msg.innerText = message;
    box.classList.add("show");

    setTimeout(() => {
        box.classList.remove("show");
    }, 3000);
}

