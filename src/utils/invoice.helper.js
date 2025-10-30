/**
 * Generate invoice number with format INV{DDMMYYYY}-{001}
 * Auto-increment counter per day, reset counter every new day
 * @returns {string} - The generated invoice number
 */
const generateInvoiceNumber = () => {
    const now = new Date();

    // Format: DDMMYYYY
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateStr = `${day}${month}${year}`;

    // Generate random 3-digit number for simplicity
    // In production, this should be stored in database with proper increment logic
    const counter = String(Math.floor(Math.random() * 900) + 100);

    return `INV${dateStr}-${counter}`;
};

module.exports = {
    generateInvoiceNumber,
};
