document.addEventListener('DOMContentLoaded', () => {
    // Search
    const searchInput = document.getElementById('billSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchError = document.getElementById('searchError');
    const invoiceContainer = document.getElementById('billInvoice');

    // Display
    const dispBillId = document.getElementById('dispBillId');
    const dispBillDate = document.getElementById('dispBillDate');
    const dispProgramUid = document.getElementById('dispProgramUid');
    const dispProgramName = document.getElementById('dispProgramName');
    const dispCoordinatorName = document.getElementById('dispCoordinatorName');
    const dispProgramDate = document.getElementById('dispProgramDate');
    const dispProgramTime = document.getElementById('dispProgramTime');
    const invoiceItems = document.getElementById('invoiceItems');
    const dispGrandTotal = document.getElementById('dispGrandTotal');
    const printBtn = document.getElementById('printBtn');
    const deleteBillBtn = document.getElementById('deleteBillBtn');

    // Edit Modal
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editQtyInput = document.getElementById('editQty');
    const editItemIndexInput = document.getElementById('editItemIndex');
    const closeModalBtn = document.querySelector('.close-modal');

    let currentBill = null;

    // Check URL params for auto-search
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('id');
    if (paramId) {
        searchInput.value = paramId;
        findBill(paramId);
    }

    searchBtn.addEventListener('click', () => {
        findBill(searchInput.value);
    });

    function findBill(id) {
        const bills = DataManager.getBills();
        const bill = bills.find(b => b.id == id); // loose equality for string/num match

        if (bill) {
            currentBill = bill;
            renderInvoice();
            searchError.textContent = '';
            invoiceContainer.style.display = 'block';
        } else {
            currentBill = null;
            renderInvoice(); // clears display
            searchError.textContent = 'Bill not found!';
            invoiceContainer.style.display = 'none';
        }
    }

    function renderInvoice() {
        if (!currentBill) return;

        dispBillId.textContent = currentBill.id;
        dispBillDate.textContent = Formatter.date(currentBill.date);
        dispProgramUid.textContent = currentBill.programUid || '-';
        dispProgramName.textContent = currentBill.programName || '-';
        dispCoordinatorName.textContent = currentBill.coordinatorName || '-';
        dispProgramDate.textContent = currentBill.programDate || '-';
        dispProgramTime.textContent = currentBill.programTime || '-';

        invoiceItems.innerHTML = '';
        let total = 0;

        currentBill.items.forEach((item, index) => {
            total += item.total;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${Formatter.currency(item.price)}</td>
                <td>${item.qty}</td>
                <td>${Formatter.currency(item.total)}</td>
                <td class="dont-print action-col">
                    <button class="action-btn" onclick="openEditModal(${index})">Edit</button> | 
                    <button class="action-btn" onclick="deleteLineItem(${index})" style="color:red">Del</button>
                </td>
            `;
            invoiceItems.appendChild(row);
        });

        dispGrandTotal.textContent = Formatter.currency(total);
        // Update stored total in case it changed due to edits
        currentBill.total = total;
    }

    // Window functions for actions
    window.openEditModal = (index) => {
        const item = currentBill.items[index];
        editQtyInput.value = item.qty;
        editItemIndexInput.value = index;
        editModal.style.display = 'block';
    };

    window.deleteLineItem = (index) => {
        if (!confirm('Remove this item from the bill?')) return;

        currentBill.items.splice(index, 1);
        saveAndRefresh();
    };

    // Edit Form Save
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(editItemIndexInput.value);
        const newQty = parseInt(editQtyInput.value);

        if (newQty > 0) {
            const item = currentBill.items[index];
            item.qty = newQty;
            item.total = item.price * newQty;

            saveAndRefresh();
            editModal.style.display = 'none';
        }
    });

    // Delete Entire Bill
    deleteBillBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to permanently delete this bill?')) {
            const bills = DataManager.getBills();
            const newBills = bills.filter(b => b.id !== currentBill.id);
            localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(newBills));

            alert('Bill deleted.');
            location.reload();
        }
    });

    // Print
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Helpers
    function saveAndRefresh() {
        DataManager.updateBill(currentBill);
        renderInvoice();
    }

    closeModalBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    window.onclick = (e) => {
        if (e.target == editModal) editModal.style.display = 'none';
    };
});



