import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { InventoryLog } from "@/services/inventory-log/api";

/**
 * Normalize Vietnamese text to ASCII-safe characters
 */
function normalizeVietnameseText(text: string): string {
    const vietnameseMap: Record<string, string> = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
        'Đ': 'D',
    };

    return text.split('').map(char => vietnameseMap[char] || char).join('');
}

/**
 * Helper function to get transaction type text
 */
function getTransactionTypeText(typeId: number): string {
    const typeMap: Record<number, string> = {
        1: "Import",
        2: "Export",
        3: "Sale",
    };
    return typeMap[typeId] || "Unknown";
}

/**
 * Helper function to split text into multiple lines
 */
function splitTextToFitWidth(
    text: string,
    maxWidth: number,
    font: any,
    fontSize: number
): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);

        if (width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

/**
 * Create PDF for single inventory log detail
 */
export async function createInventoryLogPdf(log: InventoryLog): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
    const { width, height } = page.getSize();
    let yPosition = height - 20;
    const margin = 20;

    // Colors
    const primaryColor = rgb(0.49, 0.40, 0.24);
    const secondaryColor = rgb(0.55, 0.45, 0.33);
    const lightBg = rgb(0.98, 0.97, 0.96);
    const darkText = rgb(0.2, 0.2, 0.2);

    // Background
    page.drawRectangle({ x: 0, y: 0, width, height, color: lightBg });

    // Top bar
    page.drawRectangle({ x: 0, y: height - 8, width, height: 8, color: primaryColor });
    yPosition = height - 35;

    // Company name - centered
    const companyName = "WINEICY STORE";
    const companyWidth = fontBold.widthOfTextAtSize(companyName, 24);
    page.drawText(companyName, {
        x: (width - companyWidth) / 2,
        y: yPosition,
        size: 24,
        font: fontBold,
        color: primaryColor,
    });
    yPosition -= 35;

    // Tagline
    const tagline = "Inventory Management System";
    const taglineWidth = font.widthOfTextAtSize(tagline, 12);
    page.drawText(tagline, {
        x: (width - taglineWidth) / 2,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= 15;

    // Contact
    const contact = "Phone: (555) 123-4567 | Email: info@smartwinestore.com";
    const contactWidth = font.widthOfTextAtSize(contact, 9);
    page.drawText(contact, {
        x: (width - contactWidth) / 2,
        y: yPosition,
        size: 9,
        font: font,
        color: rgb(0.47, 0.47, 0.47),
    });
    yPosition -= 20;

    // Line
    page.drawLine({
        start: { x: margin, y: yPosition },
        end: { x: width - margin, y: yPosition },
        thickness: 0.5,
        color: primaryColor,
    });
    yPosition -= 20;

    // Document title bar
    page.drawRectangle({
        x: margin,
        y: yPosition - 18,
        width: width - 2 * margin,
        height: 18,
        color: primaryColor,
    });

    const docTitle = `INVENTORY LOG #${log.InventoryLogID}`;
    const docTitleWidth = fontBold.widthOfTextAtSize(docTitle, 14);
    page.drawText(docTitle, {
        x: (width - docTitleWidth) / 2,
        y: yPosition - 13,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 30;

    // Log Details Section
    page.drawRectangle({
        x: margin,
        y: yPosition - 16,
        width: width - 2 * margin,
        height: 16,
        color: secondaryColor,
    });
    page.drawText("LOG INFORMATION", {
        x: margin + 10,
        y: yPosition - 11,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 22;

    const logBoxHeight = 60;
    page.drawRectangle({
        x: margin,
        y: yPosition - logBoxHeight,
        width: width - 2 * margin,
        height: logBoxHeight,
        color: rgb(1, 1, 1),
        borderColor: primaryColor,
        borderWidth: 0.3,
    });
    yPosition -= 10;

    // Log info rows
    const logInfo = [
        ["Log ID:", `#${log.InventoryLogID}`],
        ["Transaction Type:", getTransactionTypeText(log.TransactionTypeID).toUpperCase()],
        ["Date & Time:", new Date(log.Date).toLocaleString()],
        ["Inventory ID:", `#${log.InventoryID}`],
    ];

    logInfo.forEach(([label, value]) => {
        page.drawText(label, {
            x: margin + 10,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: primaryColor,
        });
        const valueWidth = fontBold.widthOfTextAtSize(value, 9);
        page.drawText(value, {
            x: width - margin - valueWidth - 10,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: primaryColor,
        });
        yPosition -= 12;
    });

    yPosition -= 15;

    // Product Information
    page.drawRectangle({
        x: margin,
        y: yPosition - 16,
        width: width - 2 * margin,
        height: 16,
        color: secondaryColor,
    });
    page.drawText("PRODUCT INFORMATION", {
        x: margin + 10,
        y: yPosition - 11,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 22;

    const productName = normalizeVietnameseText(log.ProductName);
    const productLines = splitTextToFitWidth(productName, width - 2 * margin - 20, font, 10);
    const productBoxHeight = Math.max(45, productLines.length * 12 + 20);

    page.drawRectangle({
        x: margin,
        y: yPosition - productBoxHeight,
        width: width - 2 * margin,
        height: productBoxHeight,
        color: rgb(0.97, 0.97, 0.97),
        borderColor: rgb(0.78, 0.78, 0.78),
        borderWidth: 0.1,
    });
    yPosition -= 10;

    page.drawText("Product Name:", {
        x: margin + 10,
        y: yPosition,
        size: 9,
        font: fontBold,
        color: darkText,
    });
    yPosition -= 12;

    productLines.forEach((line) => {
        page.drawText(line, {
            x: margin + 10,
            y: yPosition,
            size: 10,
            font: font,
            color: darkText,
        });
        yPosition -= 12;
    });

    yPosition -= 15;

    // Location Information
    page.drawRectangle({
        x: margin,
        y: yPosition - 16,
        width: width - 2 * margin,
        height: 16,
        color: secondaryColor,
    });
    page.drawText("LOCATION", {
        x: margin + 10,
        y: yPosition - 11,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 22;

    const location = normalizeVietnameseText(log.Location);
    const locationLines = splitTextToFitWidth(location, width - 2 * margin - 20, font, 9);
    const locationBoxHeight = Math.max(30, locationLines.length * 12 + 10);

    page.drawRectangle({
        x: margin,
        y: yPosition - locationBoxHeight,
        width: width - 2 * margin,
        height: locationBoxHeight,
        color: rgb(0.97, 0.97, 0.97),
        borderColor: rgb(0.78, 0.78, 0.78),
        borderWidth: 0.1,
    });

    let locY = yPosition - 10;
    locationLines.forEach((line) => {
        page.drawText(line, {
            x: margin + 10,
            y: locY,
            size: 9,
            font: font,
            color: darkText,
        });
        locY -= 12;
    });
    yPosition -= locationBoxHeight + 15;

    // Transaction Details Section
    page.drawRectangle({
        x: margin,
        y: yPosition - 16,
        width: width - 2 * margin,
        height: 16,
        color: secondaryColor,
    });
    page.drawText("TRANSACTION DETAILS", {
        x: margin + 10,
        y: yPosition - 11,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 22;

    // Quantity Box
    const qtyBoxHeight = 80;
    page.drawRectangle({
        x: margin,
        y: yPosition - qtyBoxHeight,
        width: width - 2 * margin,
        height: qtyBoxHeight,
        color: rgb(1, 1, 1),
        borderColor: primaryColor,
        borderWidth: 0.3,
    });
    yPosition -= 20;

    // Quantity with color
    const qtyLabel = "Quantity Changed:";
    page.drawText(qtyLabel, {
        x: margin + 10,
        y: yPosition,
        size: 11,
        font: fontBold,
        color: darkText,
    });
    yPosition -= 25;

    const qtyText = log.Quantity > 0 ? `+${log.Quantity}` : `${log.Quantity}`;
    const qtyColor = log.Quantity > 0 ? rgb(0.13, 0.55, 0.13) : rgb(0.8, 0, 0); // Forest green for positive
    const qtyWidth = fontBold.widthOfTextAtSize(qtyText, 24);
    page.drawText(qtyText, {
        x: (width - qtyWidth) / 2,
        y: yPosition,
        size: 24,
        font: fontBold,
        color: qtyColor,
    });

    yPosition -= 40;

    // Performed By Section
    page.drawRectangle({
        x: margin,
        y: yPosition - 16,
        width: width - 2 * margin,
        height: 16,
        color: secondaryColor,
    });
    page.drawText("PERFORMED BY", {
        x: margin + 10,
        y: yPosition - 11,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 22;

    const userBoxHeight = 55;
    page.drawRectangle({
        x: margin,
        y: yPosition - userBoxHeight,
        width: width - 2 * margin,
        height: userBoxHeight,
        color: rgb(0.97, 0.97, 0.97),
        borderColor: rgb(0.78, 0.78, 0.78),
        borderWidth: 0.1,
    });
    yPosition -= 10;

    page.drawText(`User ID: ${log.UserID}`, {
        x: margin + 10,
        y: yPosition,
        size: 9,
        font: font,
        color: darkText,
    });
    yPosition -= 12;

    const username = normalizeVietnameseText(log.Username);
    page.drawText(`Name: ${username}`, {
        x: margin + 10,
        y: yPosition,
        size: 9,
        font: font,
        color: darkText,
    });
    yPosition -= 12;

    page.drawText(`Email: ${log.Email}`, {
        x: margin + 10,
        y: yPosition,
        size: 9,
        font: font,
        color: darkText,
    });
    yPosition -= 12;

    page.drawText(`Phone: ${log.PhoneNumber}`, {
        x: margin + 10,
        y: yPosition,
        size: 9,
        font: font,
        color: darkText,
    });
    yPosition -= 20;

    // Footer
    const footerY = 30;
    page.drawRectangle({
        x: 0,
        y: footerY - 4,
        width: width,
        height: 35,
        color: primaryColor,
    });

    const footerText = "Inventory Logs Report - Wineicy Store";
    const footerTextWidth = font.widthOfTextAtSize(footerText, 9);
    page.drawText(footerText, {
        x: (width - footerTextWidth) / 2,
        y: footerY + 14,
        size: 9,
        font: font,
        color: rgb(1, 1, 1),
    });

    const contactLine = "For questions, contact us at info@smartwinestore.com";
    const contactLineWidth = font.widthOfTextAtSize(contactLine, 7);
    page.drawText(contactLine, {
        x: (width - contactLineWidth) / 2,
        y: footerY + 6,
        size: 7,
        font: font,
        color: rgb(1, 1, 1),
    });

    const genDate = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
    const genDateWidth = font.widthOfTextAtSize(genDate, 6);
    page.drawText(genDate, {
        x: (width - genDateWidth) / 2,
        y: footerY,
        size: 6,
        font: font,
        color: rgb(1, 1, 1),
    });

    // Bottom accent
    page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: 2,
        color: rgb(0.72, 0.53, 0.04),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

/**
 * Download PDF file using file-saver
 */
export function downloadInventoryLogPdf(pdfBytes: Uint8Array, filename: string) {
    const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
    saveAs(blob, filename);
}
