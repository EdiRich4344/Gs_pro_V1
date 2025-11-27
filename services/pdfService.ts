// @ts-nocheck
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Resident, Payment, Room, Cot } from '../types';

const defaultLogoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Modern color palette
const COLORS = {
    primary: '#7c3aed',      // Violet
    primaryDark: '#5b21b6',  // Dark violet
    primaryLight: '#a78bfa', // Light violet
    accent: '#06b6d4',       // Cyan
    success: '#10b981',      // Green
    warning: '#f59e0b',      // Amber
    danger: '#ef4444',       // Red
    dark: '#1f2937',         // Dark gray
    text: '#374151',         // Gray
    textLight: '#6b7280',    // Light gray
    border: '#e5e7eb',       // Border gray
    background: '#f9fafb',   // Background
};

// Enhanced letterhead with modern design
const addModernLetterhead = (doc: jsPDF, customLogo?: string | null) => {
    const logoToUse = customLogo || defaultLogoBase64;
    const pageCount = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.saveGraphicsState();
        
        // Modern gradient-inspired design element
        doc.setFillColor(124, 58, 237); // Violet
        doc.rect(0, 0, 6, pageHeight, 'F');
        
        // Subtle accent line at top
        doc.setFillColor(167, 139, 250); // Light violet
        doc.rect(6, 0, pageWidth - 6, 3, 'F');
        
        // Watermark (very subtle)
        try {
            doc.setGState(new doc.GState({opacity: 0.03}));
            doc.addImage(logoToUse, 'PNG', pageWidth/2 - 50, pageHeight/2 - 50, 100, 100);
        } catch (e) {
            console.error("Failed to add watermark:", e);
        }
        doc.restoreGraphicsState();

        // ======== MODERN HEADER ========
        // Header background with subtle gradient effect
        doc.setFillColor(249, 250, 251); // Light background
        doc.rect(0, 3, pageWidth, 42, 'F');
        
        // Logo
        try {
            // Logo background circle
            doc.setFillColor(255, 255, 255);
            doc.circle(25, 22, 12, 'F');
            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.5);
            doc.circle(25, 22, 12, 'S');
            
            doc.addImage(logoToUse, 'PNG', 17, 14, 16, 16);
        } catch(e) {
            console.error("Failed to add header logo:", e);
        }
        
        // Hostel name and details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(COLORS.dark);
        doc.text('Good Shepherd Ladies Hostel', 42, 19);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(COLORS.textLight);
        doc.text('Nagamalaipudukottai Madurai, 625019', 42, 25);
        doc.text('Email: contact@goodshepherd.com | Phone: +91 90809 97137', 42, 30);
        
        // Decorative header line
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(1);
        doc.line(14, 45, pageWidth - 14, 45);

        // ======== MODERN FOOTER ========
        // Footer accent line
        doc.setFillColor(167, 139, 250); // Light violet
        doc.rect(14, pageHeight - 22, pageWidth - 28, 2, 'F');
        
        // Footer text
        doc.setFontSize(7);
        doc.setTextColor(COLORS.textLight);
        doc.setFont('helvetica', 'normal');
        doc.text('A safe, comfortable, and empowering space for women.', 14, pageHeight - 14);
        
        // Page number with modern styling
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.primary);
        doc.text(`${i}`, pageWidth - 14, pageHeight - 14, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.textLight);
        doc.text(`of ${pageCount}`, pageWidth - 18, pageHeight - 14, { align: 'right' });
    }
};

// Add section header with modern styling
const addSectionHeader = (doc: jsPDF, title: string, yPos: number, icon?: string) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Background accent
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, yPos - 6, pageWidth - 28, 12, 2, 2, 'F');
    
    // Left accent line
    doc.setFillColor(124, 58, 237);
    doc.rect(14, yPos - 6, 3, 12, 'F');
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(COLORS.dark);
    doc.text(title, 22, yPos + 2);
};

// Add info box with modern card design
const addInfoBox = (doc: jsPDF, title: string, content: string, x: number, y: number, width: number) => {
    // Card background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, 20, 3, 3, 'F');
    
    // Card border
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, width, 20, 3, 3, 'S');
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.textLight);
    doc.text(title.toUpperCase(), x + 4, y + 6);
    
    // Content
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.dark);
    doc.text(content, x + 4, y + 14);
};

export const generatePaymentStatementPDF = (resident: Resident, payments: Payment[], room: Room | null, cot: Cot | null, customLogo?: string | null) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 55;

    // Document title with modern badge
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(14, yPos, 8, 8, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(COLORS.dark);
    doc.text('Payment Statement', 26, yPos + 6);
    
    // Document date badge
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(pageWidth - 55, yPos - 2, 41, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textLight);
    doc.text(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), pageWidth - 14, yPos + 5, { align: 'right' });

    yPos += 20;

    // Resident information cards
    addInfoBox(doc, 'Resident Name', resident.name, 14, yPos, 90);
    addInfoBox(doc, 'Contact', resident.phone || 'N/A', 106, yPos, 90);
    
    yPos += 25;
    
    addInfoBox(doc, 'Room Assignment', room && cot ? `${room.name} - ${cot.name}` : 'Not Assigned', 14, yPos, 90);
    addInfoBox(doc, 'Monthly Rent', `₹${resident.rent.toLocaleString('en-IN')}`, 106, yPos, 90);
    
    yPos += 35;

    // Payment history section
    addSectionHeader(doc, 'Payment History', yPos);
    
    autoTable(doc, {
        head: [["Date", "Description", "Amount", "Status"]],
        body: payments.map(p => [
            new Date(p.date).toLocaleDateString('en-IN'),
            p.description,
            `₹${p.amount.toLocaleString('en-IN')}`,
            p.status
        ]),
        startY: yPos + 10,
        theme: 'plain',
        // Fix: Explicitly set margins to avoid page overflow warnings.
        margin: { left: 14, right: 14 },
        headStyles: { 
            fillColor: [249, 250, 251],
            textColor: [107, 114, 128],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'left',
            cellPadding: 4
        },
        styles: { 
            fontSize: 10,
            textColor: [55, 65, 81],
            cellPadding: 4
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },
        columnStyles: {
            // Fix: Defined explicit widths for more columns to ensure table fits within margins.
            0: { cellWidth: 35 }, // Date
            1: { cellWidth: 'auto' }, // Description
            2: { halign: 'right', fontStyle: 'bold', cellWidth: 40 }, // Amount
            3: { halign: 'center', fontStyle: 'bold', cellWidth: 30 } // Status
        },
        didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 3) {
                const status = data.cell.raw;
                if (status === 'Paid') {
                    data.cell.styles.textColor = [16, 185, 129]; // Green
                } else if (status === 'Due') {
                    data.cell.styles.textColor = [245, 158, 11]; // Amber
                } else if (status === 'Overdue') {
                    data.cell.styles.textColor = [239, 68, 68]; // Red
                }
            }
        },
        // Fix: Added missing line drawing call to correctly render cell borders.
        didDrawCell: (data) => {
            // Add subtle borders
            if (data.section === 'body') {
                doc.setDrawColor(229, 231, 235);
                doc.setLineWidth(0.1);
                doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
            }
        }
    });

    // Summary card
    const finalY = doc.lastAutoTable.finalY + 15;
    const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const totalDue = payments.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0);
    
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, finalY, pageWidth - 28, 35, 3, 3, 'F');
    
    // Summary title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.dark);
    doc.text('Payment Summary', 20, finalY + 8);
    
    // Total paid
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textLight);
    doc.text('Total Paid:', 20, finalY + 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.success);
    doc.text(`₹${totalPaid.toLocaleString('en-IN')}`, 20, finalY + 27);
    
    // Total due
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textLight);
    doc.text('Total Outstanding:', pageWidth/2, finalY + 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(totalDue > 0 ? COLORS.danger : COLORS.success);
    doc.text(`₹${totalDue.toLocaleString('en-IN')}`, pageWidth/2, finalY + 27);
    
    addModernLetterhead(doc, customLogo);
    doc.save(`${resident.name}_Payment_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateWelcomeLetterPDF = (resident: Resident, room: Room | null, cot: Cot | null, customLogo?: string | null) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 60;

    // Date badge
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(pageWidth - 60, yPos - 5, 46, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textLight);
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(today, pageWidth - 14, yPos, { align: 'right' });
    
    yPos += 15;

    // Welcome badge
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(14, yPos, 35, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('WELCOME', 31.5, yPos + 6.5, { align: 'center' });
    
    yPos += 20;

    // Greeting
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(COLORS.dark);
    doc.text(`Dear ${resident.name},`, 14, yPos);
    
    yPos += 12;

    // Letter body with better formatting
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text);
    const lineHeight = 7;
    
    const para1 = "Welcome to your new home! We are absolutely delighted to have you join our vibrant and supportive community at Good Shepherd Ladies Hostel. Our mission is to provide a safe, comfortable, and empowering environment where every resident can thrive.";
    const lines1 = doc.splitTextToSize(para1, pageWidth - 28);
    doc.text(lines1, 14, yPos);
    yPos += lines1.length * lineHeight + 12;

    // Financial summary table
    addSectionHeader(doc, 'Financial Summary', yPos);
    
    autoTable(doc, {
        startY: yPos + 10,
        theme: 'plain',
        margin: { left: 14, right: 14 },
        body: [
            ['Room Assignment', room && cot ? `${room.name}, ${cot.name}` : 'Not Assigned'],
            ['Monthly Rent', `₹${resident.rent.toLocaleString('en-IN')}`],
            ['Security Deposit (Refundable)', `₹${resident.depositAmount.toLocaleString('en-IN')}`],
        ],
        styles: {
            fontSize: 10,
            cellPadding: 4,
        },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: COLORS.dark },
            1: { halign: 'right', textColor: COLORS.text }
        },
        didDrawCell: (data) => {
            if (data.section === 'body') {
                doc.setDrawColor(243, 244, 246); // Lighter border
                doc.setLineWidth(0.2);
                doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
            }
        }
    });

    yPos = doc.lastAutoTable.finalY + 15;
    

    // Guidelines paragraph
    const para2 = "We have established a comprehensive set of guidelines to ensure everyone's comfort, safety, and well-being. You will find these in your resident handbook. Our team is always available should you have any questions or require assistance with anything during your stay.";
    const lines2 = doc.splitTextToSize(para2, pageWidth - 28);
    doc.setFont('helvetica', 'normal');
    doc.text(lines2, 14, yPos);
    yPos += lines2.length * lineHeight + 8;

    // Closing paragraph
    const para3 = "We genuinely look forward to having you as part of our family and hope your stay with us is pleasant, comfortable, and memorable.";
    const lines3 = doc.splitTextToSize(para3, pageWidth - 28);
    doc.text(lines3, 14, yPos);
    yPos += lines3.length * lineHeight + 15;

    // Signature
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text);
    doc.text("Warm regards,", 14, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.dark);
    doc.text("The Management Team", 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textLight);
    doc.text("Good Shepherd Ladies Hostel", 14, yPos + 6);
    
    addModernLetterhead(doc, customLogo);
    doc.save(`${resident.name}_Welcome_Letter_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateVacateLetterPDF = (resident: Resident, customLogo?: string | null) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 60;

    // Certificate badge
    doc.setFillColor(16, 185, 129); // Green
    doc.roundedRect(14, yPos - 5, 8, 8, 1, 1, 'F');
    
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(COLORS.dark);
    doc.text('Certificate of Hostel Vacation', 26, yPos + 2);
    
    // Date badge
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(pageWidth - 60, yPos - 5, 46, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textLight);
    doc.text(today, pageWidth - 14, yPos, { align: 'right' });
    
    yPos += 25;

    // Resident info card
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, yPos, pageWidth - 28, 30, 3, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.dark);
    doc.text('Resident Information', 20, yPos + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);
    doc.text('Name:', 20, yPos + 18);
    doc.setFont('helvetica', 'bold');
    doc.text(resident.name, 50, yPos + 18);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Resident ID:', 20, yPos + 25);
    doc.setFont('helvetica', 'bold');
    doc.text(resident.id, 50, yPos + 25);
    
    yPos += 45;

    // Certificate text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text);
    
    doc.text('To Whom It May Concern,', 14, yPos);
    yPos += 12;
    
    const certText = `This letter serves as official certification that ${resident.name} (Resident ID: ${resident.id}) has successfully completed all necessary formalities and has officially vacated their accommodation at Good Shepherd Ladies Hostel as of ${today}.`;
    const lines1 = doc.splitTextToSize(certText, pageWidth - 28);
    doc.text(lines1, 14, yPos);
    yPos += lines1.length * 7 + 10;
    
    // Status badges
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(14, yPos, 85, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('✓ ALL DUES SETTLED', 56.5, yPos + 6.5, { align: 'center' });
    
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(105, yPos, 91, 10, 2, 2, 'F');
    doc.text('✓ NO PENDING ISSUES', 150.5, yPos + 6.5, { align: 'center' });
    
    yPos += 20;
    
    const closingText = "We sincerely thank them for being part of our community and wish them every success and happiness in their future endeavors.";
    const lines2 = doc.splitTextToSize(closingText, pageWidth - 28);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text);
    doc.text(lines2, 14, yPos);
    yPos += lines2.length * 7 + 20;

    // Signature
    doc.setFont('helvetica', 'normal');
    doc.text("Sincerely,", 14, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(COLORS.dark);
    doc.text("Hostel Management", 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.textLight);
    doc.text("Good Shepherd Ladies Hostel", 14, yPos + 6);

    addModernLetterhead(doc, customLogo);
    doc.save(`${resident.name}_Vacation_Certificate_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateInvoicePDF = (resident: Resident, payment: Payment, customLogo?: string | null) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const invoiceDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    let yPos = 55;
    
    // Invoice header with modern badge
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(14, yPos, 10, 10, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(COLORS.dark);
    doc.text('INVOICE', 28, yPos + 8);
    
    yPos += 20;

    // Invoice details cards
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(14, yPos, 90, 35, 3, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.textLight);
    doc.text('BILLED TO', 20, yPos + 7);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(COLORS.dark);
    doc.text(resident.name, 20, yPos + 16);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(COLORS.text);
    if (resident.phone) {
        doc.text(`Phone: ${resident.phone}`, 20, yPos + 23);
    }
    if (resident.email) {
        doc.text(`Email: ${resident.email}`, 20, yPos + 29);
    }
    
    // Invoice info card
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(106, yPos, 90, 35, 3, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE NUMBER', pageWidth - 14, yPos + 7, { align: 'right' });
    doc.setFontSize(12);
    doc.text(`#INV-${payment.id}`, pageWidth - 14, yPos + 15, { align: 'right' });
    
    doc.setFontSize(8);
    doc.text('INVOICE DATE', pageWidth - 14, yPos + 22, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoiceDate, pageWidth - 14, yPos + 29, { align: 'right' });
    
    yPos += 50;

    // Invoice items table
    addSectionHeader(doc, 'Invoice Details', yPos);
    
    autoTable(doc, {
        startY: yPos + 10,
        head: [['DESCRIPTION', 'AMOUNT']],
        body: [[payment.description, `₹${payment.amount.toLocaleString('en-IN')}`]],
        theme: 'plain',
        // Fix: Explicitly set margins to avoid page overflow warnings.
        margin: { left: 14, right: 14 },
        headStyles: { 
            fillColor: [249, 250, 251],
            textColor: [107, 114, 128],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'left',
            cellPadding: 5
        },
        bodyStyles: { 
            fontSize: 11,
            textColor: [55, 65, 81],
            cellPadding: 5
        },
        columnStyles: {
            // Fix: Let description width be auto and set a fixed width for amount.
            0: { cellWidth: 'auto' },
            1: { halign: 'right', fontStyle: 'bold', cellWidth: 52 }
        },
        // Fix: Added missing line drawing call to correctly render cell borders.
        didDrawCell: (data) => {
            if (data.section === 'body') {
                doc.setDrawColor(229, 231, 235);
                doc.setLineWidth(0.5);
                doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
            }
        }
    });

    const finalY = doc.lastAutoTable.finalY + 15;

    // Total section with modern design
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(pageWidth - 110, finalY, 96, 30, 3, 3, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL AMOUNT', pageWidth - 62, finalY + 10, { align: 'center' });
    
    doc.setFontSize(20);
    doc.text(`₹${payment.amount.toLocaleString('en-IN')}`, pageWidth - 62, finalY + 22, { align: 'center' });

    // Payment status badge
    if (payment.status === 'Paid') {
        doc.saveGraphicsState();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.setGState(new doc.GState({opacity: 0.15}));
        doc.setTextColor(16, 185, 129);
        // Fix: Replaced unsupported 'rotate' with standard 'angle' property.
        doc.text('PAID', 50, finalY + 25, { angle: -20 });
        doc.restoreGraphicsState();
        
        // Paid stamp
        doc.setFillColor(16, 185, 129);
        doc.roundedRect(14, finalY + 5, 50, 12, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('✓ PAYMENT RECEIVED', 39, finalY + 12.5, { align: 'center' });
    } else if (payment.status === 'Overdue') {
        doc.saveGraphicsState();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.setGState(new doc.GState({opacity: 0.15}));
        doc.setTextColor(239, 68, 68);
        // Fix: Replaced unsupported 'rotate' with standard 'angle' property.
        doc.text('OVERDUE', 50, finalY + 25, { angle: -20 });
        doc.restoreGraphicsState();
        
        // Overdue stamp
        doc.setFillColor(239, 68, 68);
        doc.roundedRect(14, finalY + 5, 50, 12, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text('! PAYMENT OVERDUE', 39, finalY + 12.5, { align: 'center' });
    }
    
    addModernLetterhead(doc, customLogo);
    doc.save(`${resident.name}_Invoice_${payment.id}_${new Date().toISOString().split('T')[0]}.pdf`);
};
