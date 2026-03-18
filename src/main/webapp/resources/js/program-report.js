let fullData = [];
let popup;

/* =============================
   ON PAGE LOAD
   ============================= */
document.addEventListener("DOMContentLoaded", () => {
    popup = document.getElementById("itemPopup");
    loadReport();
});

/* =============================
   LOAD PROGRAM REPORT
   ============================= */
function loadReport() {
    fetch("http://localhost:8080/api/program/report")
        .then(res => res.json())
        .then(data => {
            fullData = data;
            renderReport(fullData);
        })
        .catch(() => alert("Failed to load report"));
}

/* =============================
   FILTER DROPDOWN
   ============================= */
function filterByType() {
    const type = document.getElementById("programType").value;
    let filteredData = [];
/* =============================
   PLANNED AND UNPLANNED LOGIC
   ============================= */
    /*if (type === "all") {
        filteredData = fullData;
    } else if (type === "planned") {
        filteredData = fullData.filter(p => !p.programUid);
    } else if (type === "unplanned") {
        filteredData = fullData.filter(p => p.programUid);
    }*/
    
    if (type === "all") {
        filteredData = fullData;
    } else if (type === "unplanned") {
        filteredData = fullData.filter(p => !p.programUid);
    } else if (type === "planned") {
        filteredData = fullData.filter(p => p.programUid);
    }

    renderReport(filteredData);
}

function renderReport(data) {
    const tbody = document.querySelector("#programTable tbody");
    tbody.innerHTML = "";

    data.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.billId}</td>
            <td>${p.programUid ?? "-"}</td>
            <td>${p.programYear}</td>
            <td>${p.programName}</td>
            <td>${p.sessionName}</td>
            <td>${formatDate(p.dateFrom)}</td>
            <td>${formatDate(p.dateTo)}</td>
            <td>${p.category}</td>
            <td>${p.coordinator}</td>
            <td><strong>₹${p.totalAmount.toFixed(2)}</strong></td>
            <td>-</td>
        `;

        tr.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            showItemsPopup(tr, p.billId);
        });

        tbody.appendChild(tr);
    });
}

/* =============================
   DATE FORMAT
   ============================= */
function formatDate(d) {
    if (!d) return "-";
    return new Date(d).toISOString().split("T")[0];
}

/* =============================
   EXCEL DOWNLOAD
   ============================= */
function downloadExcel() {
    if (typeof XLSX === "undefined") {
        alert("Excel library not loaded!");
        return;
    }

    const table = document.getElementById("programTable");
    const ws = XLSX.utils.table_to_sheet(table);
    const range = XLSX.utils.decode_range(ws['!ref']);

    ['F', 'G'].forEach(col => {
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
            const cell = ws[col + (r + 1)];
            if (cell && typeof cell.v === "string") {
                const [y, m, d] = cell.v.split("-");
                const excelDate =
                    Math.floor(new Date(y, m - 1, d).getTime() / 86400000) + 25569;
                cell.v = excelDate;
                cell.t = "n";
                cell.z = "yyyy-mm-dd";
            }
        }
    });

    ws['!cols'] = [
        { wch: 8 }, { wch: 12 }, { wch: 8 }, { wch: 18 }, { wch: 12 },
        { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 12 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Programme Report");
    XLSX.writeFile(wb, "Programme_Report.xlsx");
}

function showItemsPopup(row, billId) {
    if (!popup) return;

    const table = document.getElementById("programTable");
    const tableRect = table.getBoundingClientRect();

    popup.style.display = "block";
    popup.style.position = "absolute";
    popup.innerHTML = "Loading items...";

    // Temporarily show to get width
    popup.style.visibility = "hidden";
    popup.style.left = "0px";
    popup.style.top = "0px";

    fetch(`http://localhost:8080/api/ordered-list/by-bill/${billId}`)
        .then(res => res.json())
        .then(items => {
            if (!items || items.length === 0) {
                popup.innerHTML = "<b>No items found</b>";
            } else {
                let html = `
                    <table>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                `;

                items.forEach(i => {
                    html += `
                        <tr>
                            <td>${i.itemName}</td>
                            <td>${i.quantity}</td>
                            <td>₹${i.rate}</td>
                            <td>₹${i.price}</td>
                        </tr>
                    `;
                });

                html += "</table>";
                /*popup.innerHTML = html;*/
                popup.innerHTML = `
    <div class="popup-header">
        <span class="popup-close" onclick="closePopup()">✖</span>
    </div>
    ${html}
`;


            }

            // Make visible now
            popup.style.visibility = "visible";

            // Center horizontally above table
            const popupWidth = popup.offsetWidth;
            const centerX = tableRect.left + (tableRect.width / 2) - (popupWidth / 2);

            popup.style.left = window.scrollX + centerX + "px";
            popup.style.top =
                window.scrollY + tableRect.top - popup.offsetHeight - 12 + "px";
        })
        .catch(() => {
            popup.style.visibility = "visible";
            popup.innerHTML = "<b>Error loading items</b>";
        });
}

function hideItemsPopup() {
    if (popup) popup.style.display = "none";
}
function applyFilters() {
    const type = document.getElementById("programType").value;
    const uidSearch = document.getElementById("searchUid").value.toLowerCase();
    const nameSearch = document.getElementById("searchName").value.toLowerCase();

    let filtered = fullData;

    // Filter by Program Type
    if (type === "planned") {
        filtered = filtered.filter(p => !p.programUid);
    } else if (type === "unplanned") {
        filtered = filtered.filter(p => p.programUid);
    }

    // Filter by Programme UID
    if (uidSearch) {
        filtered = filtered.filter(p =>
            p.programUid &&
            p.programUid.toString().toLowerCase().includes(uidSearch)
        );
    }

    // Filter by Programme Name
    if (nameSearch) {
        filtered = filtered.filter(p =>
            p.programName &&
            p.programName.toLowerCase().includes(nameSearch)
        );
    }

    renderReport(filtered);
}
function closePopup() {
    if (popup) {
        popup.style.display = "none";
    }
}

