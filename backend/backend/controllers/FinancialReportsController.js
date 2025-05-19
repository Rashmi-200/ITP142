import { Booking } from '../models/BookingModel.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

// Generate Financial Report as PDF
const generatePDFReport = async (req, res) => {
  try {
    const bookings = await Booking.find();

    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          'Content-Length': Buffer.byteLength(pdfData),
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=financial_report_${new Date().toISOString().slice(0,10)}.pdf`,
        })
        .end(pdfData);
    });

    // Title
    doc.fontSize(20).fillColor('black').text('Smart Home Care - Financial Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('gray').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1);

    let totalEarnings = 0;

    bookings.forEach((booking, index) => {
      doc.fillColor('black').fontSize(12);

      doc.text(`Booking #${index + 1}`, { underline: true });
      doc.moveDown(0.3);

      doc.text(`• Booking ID: ${booking._id}`);
      doc.text(`• Customer: ${booking.customerName}`);
      doc.text(`• Email: ${booking.email}`);
      doc.text(`• Phone: ${booking.phone}`);
      doc.text(`• Address: ${booking.address}`);
      doc.text(`• Service Type: ${booking.serviceType}`);
      doc.text(`• Provider: ${booking.provider}`);
      doc.text(`• Date: ${booking.date}`);
      doc.text(`• Time: ${booking.startTime}:00 - ${booking.endTime}:00 (${booking.totalHours} hours)`);
      doc.text(`• Price: Rs. ${booking.price}`);
      doc.text(`• Payment Status: ${booking.paymentStatus}`);
      doc.moveDown(1);

      totalEarnings += booking.price || 0;
    });

    // Add Total Earnings at the end
    doc.moveDown(2);
    doc.fontSize(16).fillColor('green').text(`Total Earnings: Rs. ${totalEarnings.toLocaleString()}`, { align: 'right' });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Error generating PDF report', error: err });
  }
};

// Generate Financial Report as Excel
const generateExcelReport = async (req, res) => {
  try {
    const bookings = await Booking.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Report');

    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Booking ID', key: 'id', width: 24 },
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Service', key: 'serviceType', width: 15 },
      { header: 'Provider', key: 'provider', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 20 },
      { header: 'Hours', key: 'totalHours', width: 10 },
      { header: 'Price (Rs)', key: 'price', width: 15 },
      { header: 'Payment Status', key: 'paymentStatus', width: 18 },
    ];

    // Style headers
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEFEFEF' },
      };
    });

    let totalEarnings = 0;

    bookings.forEach((booking, index) => {
      worksheet.addRow({
        no: index + 1,
        id: booking._id,
        customerName: booking.customerName,
        email: booking.email,
        phone: booking.phone,
        address: booking.address,
        serviceType: booking.serviceType,
        provider: booking.provider,
        date: booking.date,
        time: `${booking.startTime}:00 - ${booking.endTime}:00`,
        totalHours: booking.totalHours,
        price: booking.price,
        paymentStatus: booking.paymentStatus,
      });

      totalEarnings += booking.price || 0;
    });

    // Add Total Earnings at bottom
    const totalRow = worksheet.addRow([
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Total Earnings:',
      '',
      totalEarnings,
      ''
    ]);
    totalRow.font = { bold: true, color: { argb: 'FF008000' } }; // Green bold

    res.setHeader('Content-Disposition', `attachment; filename=financial_report_${new Date().toISOString().slice(0,10)}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Error generating Excel report', error: err });
  }
};

export { generatePDFReport, generateExcelReport };
