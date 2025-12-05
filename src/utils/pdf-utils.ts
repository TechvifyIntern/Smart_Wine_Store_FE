import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { Order, OrderDetail } from "@/api/ordersRepository";

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
 * Helper function to get status text
 */
function getStatusTextForPdf(statusID: number): string {
    const statusMap: Record<number, string> = {
        1: "Pending",
        2: "Paid",
        3: "Shipped",
        4: "Completed",
        5: "Cancelled",
        6: "Failed",
    };
    return statusMap[statusID] || "Unknown";
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
 * Create PDF with Vietnamese text support using pdf-lib
 */
export async function createPdfWithVietnameseText(order: Order): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([595.28, 841.89]); // A4
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
    const tagline = "Premium Wine Collection & Events";
    const taglineWidth = font.widthOfTextAtSize(tagline, 12);
    page.drawText(tagline, {
        x: (width - taglineWidth) / 2,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= 15;

    // Address
    const addr1 = "273 Nguyen Huu Tho";
    const addr1Width = font.widthOfTextAtSize(addr1, 9);
    page.drawText(addr1, {
        x: (width - addr1Width) / 2,
        y: yPosition,
        size: 9,
        font: font,
        color: rgb(0.47, 0.47, 0.47),
    });
    yPosition -= 12;

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

    // Invoice title bar
    page.drawRectangle({
        x: margin,
        y: yPosition - 18,
        width: width - 2 * margin,
        height: 18,
        color: primaryColor,
    });

    const invoiceTitle = `INVOICE #${order.OrderID}`;
    const invoiceTitleWidth = fontBold.widthOfTextAtSize(invoiceTitle, 14);
    page.drawText(invoiceTitle, {
        x: (width - invoiceTitleWidth) / 2,
        y: yPosition - 13,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 30;

    // Order details box
    const orderBoxHeight = 50;
    page.drawRectangle({
        x: margin,
        y: yPosition - orderBoxHeight,
        width: width - 2 * margin,
        height: orderBoxHeight,
        color: rgb(1, 1, 1),
        borderColor: primaryColor,
        borderWidth: 0.3,
    });
    yPosition -= 10;

    // Order info rows
    const orderInfo = [
        ["Order ID:", `#${order.OrderID}`],
        ["Order Date:", new Date(order.CreatedAt).toLocaleDateString()],
        ["Status:", getStatusTextForPdf(order.StatusID).toUpperCase()],
    ];

    orderInfo.forEach(([label, value]) => {
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
        yPosition -= 10;
    });

    yPosition -= 15;

    // Customer info section
    page.drawRectangle({
        x: margin,
        y: yPosition - 16,
        width: width - 2 * margin,
        height: 16,
        color: secondaryColor,
    });
    page.drawText("CUSTOMER INFORMATION", {
        x: margin + 10,
        y: yPosition - 11,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 22;

    const customerBoxHeight = 45;
    page.drawRectangle({
        x: margin,
        y: yPosition - customerBoxHeight,
        width: width - 2 * margin,
        height: customerBoxHeight,
        color: rgb(0.97, 0.97, 0.97),
        borderColor: rgb(0.78, 0.78, 0.78),
        borderWidth: 0.1,
    });
    yPosition -= 10;

    page.drawText(`ID: ${order.UserID}`, {
        x: margin + 10,
        y: yPosition,
        size: 9,
        font: font,
        color: darkText,
    });
    yPosition -= 12;
    page.drawText(`Name: ${normalizeVietnameseText(order.UserName || "N/A")}`, {
        x: margin + 10,
        y: yPosition,
        size: 9,
        font: font,
        color: darkText,
    });
    yPosition -= 12;
    page.drawText(`Email: ${order.Email || "N/A"}`, {
        x: margin + 10,
        y: yPosition,
        size: 9,
        font: font,
        color: darkText,
    });
    yPosition -= 20;

    // Shipping address
    page.drawRectangle({
        x: margin,
        y: yPosition - 16,
        width: width - 2 * margin,
        height: 16,
        color: secondaryColor,
    });
    page.drawText("SHIPPING ADDRESS", {
        x: margin + 10,
        y: yPosition - 11,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 22;

    const addressParts = [
        order.OrderStreetAddress,
        order.OrderWard,
        order.OrderProvince,
    ].filter(Boolean);
    const address = normalizeVietnameseText(addressParts.join(", "));
    const addressLines = splitTextToFitWidth(address, width - 2 * margin - 20, font, 9);
    const addressHeight = Math.max(30, addressLines.length * 12 + 10);

    page.drawRectangle({
        x: margin,
        y: yPosition - addressHeight,
        width: width - 2 * margin,
        height: addressHeight,
        color: rgb(0.97, 0.97, 0.97),
        borderColor: rgb(0.78, 0.78, 0.78),
        borderWidth: 0.1,
    });

    let addrY = yPosition - 10;
    addressLines.forEach((line) => {
        page.drawText(line, {
            x: margin + 10,
            y: addrY,
            size: 9,
            font: font,
            color: darkText,
        });
        addrY -= 12;
    });
    yPosition -= addressHeight + 15;

    // Check page break
    if (yPosition < 150) {
        page = pdfDoc.addPage([595.28, 841.89]);
        yPosition = height - 20;
        page.drawRectangle({ x: 0, y: 0, width, height, color: lightBg });
    }

    // Order items header
    page.drawRectangle({
        x: margin,
        y: yPosition - 16,
        width: width - 2 * margin,
        height: 16,
        color: primaryColor,
    });
    page.drawText("ORDER ITEMS", {
        x: margin + 10,
        y: yPosition - 11,
        size: 10,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 22;

    // Table header
    page.drawRectangle({
        x: margin,
        y: yPosition - 18,
        width: width - 2 * margin,
        height: 18,
        color: secondaryColor,
    });

    page.drawText("PRODUCT", {
        x: margin + 25,
        y: yPosition - 13,
        size: 9,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    page.drawText("QTY", {
        x: width - 175,
        y: yPosition - 13,
        size: 9,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    page.drawText("PRICE", {
        x: width - 125,
        y: yPosition - 13,
        size: 9,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    page.drawText("TOTAL", {
        x: width - 65,
        y: yPosition - 13,
        size: 9,
        font: fontBold,
        color: rgb(1, 1, 1),
    });
    yPosition -= 24;

    // Table rows
    if (order.Details && order.Details.length > 0) {
        order.Details.forEach((detail: OrderDetail, index: number) => {
            if (yPosition < 100) {
                page = pdfDoc.addPage([595.28, 841.89]);
                yPosition = height - 40;
                page.drawRectangle({ x: 0, y: 0, width, height, color: lightBg });
            }

            const rowHeight = 20;
            page.drawRectangle({
                x: margin,
                y: yPosition - rowHeight,
                width: width - 2 * margin,
                height: rowHeight,
                color: index % 2 === 0 ? rgb(0.99, 0.99, 0.99) : rgb(0.96, 0.96, 0.96),
                borderColor: rgb(0.9, 0.9, 0.9),
                borderWidth: 0.05,
            });

            const textY = yPosition - 13;

            page.drawText(`${index + 1}`, {
                x: margin + 8,
                y: textY,
                size: 9,
                font: font,
                color: darkText,
            });

            const productName = normalizeVietnameseText(detail.ProductName);
            const truncated = productName.length > 40 ? productName.substring(0, 37) + "..." : productName;
            page.drawText(truncated, {
                x: margin + 25,
                y: textY,
                size: 9,
                font: font,
                color: darkText,
            });

            page.drawText(`${detail.Quantity}`, {
                x: width - 175,
                y: textY,
                size: 9,
                font: font,
                color: darkText,
            });

            const priceText = `${detail.UnitPrice.toLocaleString("vi-VN", { minimumFractionDigits: 0 })}`;
            const priceWidth = font.widthOfTextAtSize(priceText, 9);
            page.drawText(priceText, {
                x: width - 125 - priceWidth + 30,
                y: textY,
                size: 9,
                font: font,
                color: darkText,
            });

            const totalText = `${detail.FinalItemPrice.toLocaleString("vi-VN", { minimumFractionDigits: 0 })}`;
            const totalWidth = font.widthOfTextAtSize(totalText, 9);
            page.drawText(totalText, {
                x: width - 65 - totalWidth + 40,
                y: textY,
                size: 9,
                font: fontBold,
                color: darkText,
            });

            yPosition -= rowHeight;
        });
    }

    yPosition -= 15;

    // Total box
    const totalBoxWidth = 200;
    const totalBoxHeight = 35;
    const totalBoxX = width - margin - totalBoxWidth;

    page.drawRectangle({
        x: totalBoxX,
        y: yPosition - totalBoxHeight,
        width: totalBoxWidth,
        height: totalBoxHeight,
        color: primaryColor,
    });

    const formattedTotal = order.FinalTotal.toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
    });
    const totalText = `TOTAL: ${formattedTotal} VND`;
    const totalTextWidth = fontBold.widthOfTextAtSize(totalText, 12);
    page.drawText(totalText, {
        x: totalBoxX + (totalBoxWidth - totalTextWidth) / 2,
        y: yPosition - 22,
        size: 12,
        font: fontBold,
        color: rgb(1, 1, 1),
    });

    // Footer
    const footerY = 30;
    page.drawRectangle({
        x: 0,
        y: footerY - 4,
        width: width,
        height: 35,
        color: primaryColor,
    });

    const thanks = "Thank you for choosing Smart Wine Store!";
    const thanksWidth = font.widthOfTextAtSize(thanks, 9);
    page.drawText(thanks, {
        x: (width - thanksWidth) / 2,
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
export function downloadPdf(pdfBytes: Uint8Array, filename: string) {
    const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
    saveAs(blob, filename);
}
