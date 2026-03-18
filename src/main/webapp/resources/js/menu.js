document.addEventListener('DOMContentLoaded', () => {
    const minputCode = document.getElementById('itemCode');
    const minputName = document.getElementById('itemName');
    const minputRateA = document.getElementById('itemRateA');
    const minputRateB = document.getElementById('itemRateB');
    const minputRateC = document.getElementById('itemRateC');
    const modal = document.getElementById('addModal');
    const form = document.getElementById('addItemForm');
    const addBtn = document.getElementById('openAddModalBtn');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelBtn');
    const tableBody = document.querySelector('#menuTable tbody');
    const emptyState = document.getElementById('emptyState');

    const modalTitle = document.querySelector('#addModal h2');
    const submitBtn = document.querySelector('#addItemForm button[type="submit"]');

    let editingIndex = -1; // -1 means add mode, >= 0 means edit mode

    // Fetch and Render
    function renderMenu() {
        const items = DataManager.getMenu();
        tableBody.innerHTML = '';

        if (items.length === 0) {
            emptyState.style.display = 'block';
            return;
        } else {
            emptyState.style.display = 'none';
        }

        items.forEach((item, index) => {
            const row = document.createElement('tr');

            // Handle legacy data without code
            const code = item.code || '-';
            // Handle legacy items that only had single price
            const aRate = item.aRate ?? item.price ?? 0;
            const bRate = item.bRate ?? item.price ?? 0;
            const cRate = item.cRate ?? item.price ?? 0;

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${code}</td>
                <td>${item.name}</td>
                <td>${Formatter.currency(aRate)}</td>
                <td>${Formatter.currency(bRate)}</td>
                <td>${Formatter.currency(cRate)}</td>
                <td>
                    <button class="action-btn" onclick="editMenuItem(${index})">Edit</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Add/Update Item
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const code = minputCode.value.trim();
        const name = minputName.value.trim();
        const aRate = parseFloat(minputRateA.value);
        const bRate = parseFloat(minputRateB.value);
        const cRate = parseFloat(minputRateC.value);

        if (code && name && !isNaN(aRate) && !isNaN(bRate) && !isNaN(cRate)) {
            const items = DataManager.getMenu();

            // Check for duplicate code (if adding or if editing and code changed)
            if (editingIndex === -1 || items[editingIndex].code !== code) {
                const exists = items.some(item => item.code === code);
                if (exists) {
                    alert('Item Code must be unique!');
                    return;
                }
            }

            const payload = { code, name, aRate, bRate, cRate };

            if (editingIndex === -1) {
                items.push(payload);
            } else {
                items[editingIndex] = payload;
            }

            DataManager.saveMenu(items);

            closeModal();
            renderMenu();
        }
    });

    // Edit Item (Global)
    window.editMenuItem = (index) => {
        const items = DataManager.getMenu();
        const item = items[index];

        minputCode.value = item.code || '';
        minputName.value = item.name;
        minputRateA.value = item.aRate ?? item.price ?? 0;
        minputRateB.value = item.bRate ?? item.price ?? 0;
        minputRateC.value = item.cRate ?? item.price ?? 0;
        editingIndex = index;

        modalTitle.textContent = "Edit Menu Item";
        submitBtn.textContent = "Update Item";

        openModal();
    };

    // Delete Item (Global function to be accessible from HTML onclick)
    window.deleteMenuItem = (index) => {
        if (confirm('Are you sure you want to delete this item?')) {
            const items = DataManager.getMenu();
            items.splice(index, 1);
            DataManager.saveMenu(items);
            renderMenu();
        }
    };

    function openModal() {
        modal.style.display = 'block';
        if (editingIndex === -1) minputCode.focus(); else minputName.focus();
    }

    function closeModal() {
        modal.style.display = 'none';
        form.reset();
        editingIndex = -1;
        modalTitle.textContent = "Add New Menu Item";
        submitBtn.textContent = "Add Item";
    }

    addBtn.addEventListener('click', () => {
        // Ensure we are in add mode when clicking the add button
        editingIndex = -1;
        modalTitle.textContent = "Add New Menu Item";
        submitBtn.textContent = "Add Item";
        form.reset();
        openModal();
    });

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // Initial render
    renderMenu();
});
