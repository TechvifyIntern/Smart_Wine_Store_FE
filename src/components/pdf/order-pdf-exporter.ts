import { jsPDF } from "jspdf";

interface OrderDetail {
    ProductName: string;
    Quantity: number;
    UnitPrice: number;
    FinalItemPrice: number;
}

interface Order {
    OrderID: number;
    UserID: number;
    UserName: string;
    Email: string;
    StatusID: number;
    CreatedAt: string;
    FinalTotal: number;
    OrderStreetAddress: string;
    OrderWard: string;
    OrderProvince: string;
    Details?: OrderDetail[];
}

// Helper function to get status text
const getStatusText = (statusID: number): string => {
    const statusMap: Record<number, string> = {
        1: "Pending",
        2: "Processing",
        3: "Shipped",
        4: "Completed",
        5: "Cancelled",
    };
    return statusMap[statusID] || "Pending";
};

// Helper function to format address
const getFormattedAddress = (order: Order): string => {
    const parts = [
        order.OrderStreetAddress,
        order.OrderWard,
        order.OrderProvince,
    ].filter(Boolean);
    return parts.join(", ");
};

/**
 * Export a single order as PDF with optimized styling
 */
export const exportSingleOrderPDF = (order: Order) => {
    const doc = new jsPDF({
        filters: ["ASCIIHexEncode"],
    });

    // Set default font to support more characters
    doc.setFont("helvetica");

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Color palette
    const primaryColor = [124, 101, 62]; // #7C653E
    const secondaryColor = [139, 115, 85];
    const accentColor = [184, 134, 11];
    const lightBg = [250, 248, 245];
    const darkText = [51, 51, 51];

    // Helper function to add centered text
    const addCenteredText = (
        text: string,
        fontSize: number,
        y: number,
        color: number[] = darkText
    ) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        const textWidth = doc.getTextWidth(text);
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
    };

    // Helper function to add left-right aligned text
    const addLeftRightText = (
        leftText: string,
        rightText: string,
        y: number,
        fontSize: number = 10,
        color: number[] = darkText
    ) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(leftText, 20, y);
        const rightTextWidth = doc.getTextWidth(rightText);
        doc.text(rightText, pageWidth - 20 - rightTextWidth, y);
    };

    // Background
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Top accent bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 8, "F");

    yPosition = 25;

    // Header - Company Info
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(24);
    addCenteredText("WINEICY STORE", 24, yPosition, primaryColor);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    addCenteredText("Premium Wine Collection & Events", 12, yPosition, [100, 100, 100]);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    addCenteredText("273 Nguyễn Hữu Thọ", 9, yPosition, [120, 120, 120]);
    yPosition += 4;
    addCenteredText("Phone: (555) 123-4567 | Email: info@smartwinestore.com", 9, yPosition, [120, 120, 120]);
    yPosition += 12;

    // Decorative line
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;

    // Invoice Title
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(20, yPosition - 6, pageWidth - 40, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    addCenteredText(`INVOICE #${order.OrderID}`, 14, yPosition + 2, [255, 255, 255]);
    yPosition += 18;

    // Order Details Box
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.3);
    doc.setFillColor(255, 255, 255);
    doc.rect(20, yPosition, pageWidth - 40, 40, "FD");
    yPosition += 8;

    // Order Information
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    addLeftRightText("Order ID:", `#${order.OrderID}`, yPosition, 9);
    yPosition += 7;
    addLeftRightText(
        "Order Date:",
        new Date(order.CreatedAt).toLocaleDateString(),
        yPosition,
        9
    );
    yPosition += 7;
    addLeftRightText(
        "Status:",
        getStatusText(order.StatusID).toUpperCase(),
        yPosition,
        9
    );
    yPosition += 7;
    addLeftRightText("Payment:", "Credit Card", yPosition, 9);
    yPosition += 15;

    // Customer Information
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(20, yPosition - 4, pageWidth - 40, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER INFORMATION", 25, yPosition);
    yPosition += 10;

    doc.setFillColor(248, 248, 248);
    doc.rect(20, yPosition - 4, pageWidth - 40, 20, "F");
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.rect(20, yPosition - 4, pageWidth - 40, 20);

    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`ID: ${order.UserID}`, 25, yPosition + 1);
    doc.text(`Name: ${order.UserName || "N/A"}`, 25, yPosition + 7);
    doc.text(`Email: ${order.Email || "N/A"}`, 25, yPosition + 13);
    yPosition += 25;

    // Shipping Address
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(20, yPosition - 4, pageWidth - 40, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SHIPPING ADDRESS", 25, yPosition);
    yPosition += 10;

    doc.setFillColor(248, 248, 248);
    const address = getFormattedAddress(order);
    const addressLines = doc.splitTextToSize(address, 160);
    const addressHeight = Math.max(15, addressLines.length * 5 + 6);
    doc.rect(20, yPosition - 4, pageWidth - 40, addressHeight, "F");
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.rect(20, yPosition - 4, pageWidth - 40, addressHeight);

    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(addressLines, 25, yPosition + 1);
    yPosition += addressHeight + 10;

    // Order Items Table
    if (order.Details && order.Details.length > 0) {
        // Check if we need a new page
        if (yPosition > 200) {
            doc.addPage();
            yPosition = 20;
        }

        // Table Header
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(20, yPosition - 4, pageWidth - 40, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("ORDER ITEMS", 25, yPosition + 2);
        yPosition += 12;

        // Table Column Headers
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(20, yPosition - 4, pageWidth - 40, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("#", 25, yPosition + 1);
        doc.text("Product", 35, yPosition + 1);
        doc.text("Qty", 123, yPosition + 1, { align: "center" });
        doc.text("Unit Price", 153, yPosition + 1, { align: "right" });
        doc.text("Total", 185, yPosition + 1, { align: "right" });
        yPosition += 10;

        // Table Rows
        doc.setFont("helvetica", "normal");
        order.Details.forEach((detail, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;

                // Redraw table header
                doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.rect(20, yPosition - 4, pageWidth - 40, 10, "F");
                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.text("ORDER ITEMS (continued)", 25, yPosition + 2);
                yPosition += 12;

                doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
                doc.rect(20, yPosition - 4, pageWidth - 40, 8, "F");
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(9);
                doc.text("#", 25, yPosition + 1);
                doc.text("Product", 35, yPosition + 1);
                doc.text("Qty", 123, yPosition + 1, { align: "center" });
                doc.text("Unit Price", 153, yPosition + 1, { align: "right" });
                doc.text("Total", 185, yPosition + 1, { align: "right" });
                yPosition += 10;
                doc.setFont("helvetica", "normal");
            }

            // Row background
            if (index % 2 === 0) {
                doc.setFillColor(252, 252, 252);
            } else {
                doc.setFillColor(245, 245, 245);
            }
            doc.rect(20, yPosition - 4, pageWidth - 40, 9, "F");

            doc.setDrawColor(230, 230, 230);
            doc.setLineWidth(0.05);
            doc.rect(20, yPosition - 4, pageWidth - 40, 9);

            doc.setTextColor(darkText[0], darkText[1], darkText[2]);
            doc.setFontSize(8);
            doc.text(`${index + 1}`, 25, yPosition + 1);

            // Product name with better Vietnamese support
            let productName = detail.ProductName;

            // Calculate actual width for better truncation - reduced width to prevent overlap
            doc.setFontSize(8);
            const maxWidth = 80; // Reduced from 95 to prevent overlap with Qty column
            const textLines = doc.splitTextToSize(productName, maxWidth);

            if (textLines.length > 1) {
                productName = textLines[0].substring(0, textLines[0].length - 3) + "...";
            }

            doc.text(productName, 35, yPosition + 1);

            doc.text(`${detail.Quantity}`, 123, yPosition + 1, { align: "center" });
            doc.text(`${detail.UnitPrice.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 153, yPosition + 1, { align: "right" });
            doc.text(`${detail.FinalItemPrice.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 185, yPosition + 1, { align: "right" });

            yPosition += 9;
        });

        // Total Section with improved layout
        yPosition += 8;

        // Draw total box aligned to the right
        const totalBoxWidth = 75;
        const totalBoxX = pageWidth - 20 - totalBoxWidth;

        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(totalBoxX, yPosition, totalBoxWidth, 14, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);

        // Format number with thousand separators - no decimals for cleaner look
        const formattedTotal = order.FinalTotal.toLocaleString("vi-VN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        doc.text(`TOTAL: ${formattedTotal} VND`, totalBoxX + totalBoxWidth / 2, yPosition + 9, {
            align: "center",
        });
    }

    // Footer
    const footerY = pageHeight - 30;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, footerY - 4, pageWidth, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    addCenteredText(
        "Thank you for choosing Smart Wine Store!",
        9,
        footerY + 4,
        [255, 255, 255]
    );
    addCenteredText(
        "For questions, contact us at info@smartwinestore.com",
        7,
        footerY + 10,
        [255, 255, 255]
    );
    addCenteredText(
        `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        6,
        footerY + 15,
        [255, 255, 255]
    );

    // Bottom accent
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, pageHeight - 2, pageWidth, 2, "F");

    // Save the PDF
    doc.save(`order-invoice-${order.OrderID}.pdf`);
};

/**
 * Export multiple orders as PDFs
 */
export const exportMultipleOrdersPDFs = (orders: Order[]) => {
    orders.forEach((order) => {
        exportSingleOrderPDF(order);
    });
};
