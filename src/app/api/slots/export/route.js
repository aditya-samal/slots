import connectDB from "../../../../lib/mongodb";
import Slot from "../../../../models/Slot";
import ExcelJS from "exceljs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const bookedSlots = await Slot.find({ isBooked: true }).sort({
      date: 1,
      time: 1,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Interview Slots");

    // Add headers
    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Time", key: "time", width: 20 },
      { header: "Student Name", key: "studentName", width: 30 },
      { header: "Email", key: "studentEmail", width: 35 },
    ];

    // Add data
    bookedSlots.forEach((slot) => {
      worksheet.addRow({
        date: slot.date,
        time: slot.time,
        studentName: slot.studentName,
        studentEmail: slot.studentEmail,
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6E6FA" },
    };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=interview-slots.xlsx"
    );
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Export failed" });
  }
}
