/**
 * Shared Utility Functions for Cafeteria Management
 */

// Storage Keys
const STORAGE_KEYS = {
    MENU: 'canteen_menu_items',
    BILLS: 'canteen_bills',
    BILL_COUNTER: 'canteen_bill_counter'
};

// Data Helpers
const DataManager = {
    getMenu: () => {
        const items = localStorage.getItem(STORAGE_KEYS.MENU);
        return items ? JSON.parse(items) : [];
    },

    saveMenu: (items) => {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
    },

    getBills: () => {
        const bills = localStorage.getItem(STORAGE_KEYS.BILLS);
        return bills ? JSON.parse(bills) : [];
    },

    saveBill: (bill) => {
        const bills = DataManager.getBills();
        bills.push(bill);
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
    },

    updateBill: (updatedBill) => {
        let bills = DataManager.getBills();
        const index = bills.findIndex(b => b.id === updatedBill.id);
        if (index !== -1) {
            bills[index] = updatedBill;
            localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
        }
    },

    getNextBillNumber: () => {
        let current = parseInt(localStorage.getItem(STORAGE_KEYS.BILL_COUNTER) || '0');
        const next = current + 1;
        localStorage.setItem(STORAGE_KEYS.BILL_COUNTER, next.toString());
        return next;
    }
};

// Formatting Helpers
const Formatter = {
    currency: (amount) => {
        return '₹' + parseFloat(amount).toFixed(2);
    },

    date: (dateStr) => {
        return new Date(dateStr).toLocaleString();
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // initialize menu if empty with some dummy data for demo? 
    // Maybe better to let user add them. Let's keep it empty or add defaults if requested.
    // For now, empty is fine as per requirements "New Bill... dropdown". 
    // Actually, if menu is empty, dropdown will be empty.

    // Let's seed initial data if absolutely nothing exists, to make it look good immediately?
    // No, user specifically asked for "Menu Management" to add items. 
    // I'll stick to strict user entry.
});

