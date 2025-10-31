const generateInvoiceNumber = (transactionId) => {
    const now = new Date();

    // Format: DDMMYYYY
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateStr = `${day}${month}${year}`;

    const counter = String(transactionId).padStart(3, "0");

    return `INV${dateStr}-${counter}`;
};

module.exports = {
    generateInvoiceNumber,
};
