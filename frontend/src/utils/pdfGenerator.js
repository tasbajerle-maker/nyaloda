import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePdfForOrder(order, products) {
    // ... (ez a függvény változatlan)
    if (!order) {
        alert('Hiba: A rendelés nem található a PDF generáláshoz.');
        return;
    }
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Szállítólevél", 105, 20, null, null, "center");
    // ...többi kód...
    doc.save(`szallitolevel_${order.orderId}.pdf`);
}

// <<< ÚJ FÜGGVÉNY >>>
export function generatePdfForDatasheet(product) {
    if (!product) {
        alert('Hiba: A termék nem található a PDF generáláshoz.');
        return;
    }
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text(product.name, 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Termék ID: ${product.productId}`, 14, 40);
    doc.text(`Vonalkód: ${product.barcode || 'N/A'}`, 14, 46);
    doc.text(`Típus: ${product.type === 'finished' ? 'Késztermék' : 'Alapanyag'}`, 105, 40);
    doc.text(`Egység: ${product.unit}`, 105, 46);

    doc.setFontSize(16);
    doc.text("Gyártási lap / Adatlap:", 14, 70);
    
    // Az adatlap szövegének beillesztése, sortörésekkel
    const textLines = doc.splitTextToSize(product.datasheet || 'Nincs megadva.', 180);
    doc.setFontSize(12);
    doc.text(textLines, 14, 80);

    doc.save(`adatlap_${product.name.replace(/ /g, "_")}.pdf`);
}