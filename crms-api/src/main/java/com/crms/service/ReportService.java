package com.crms.service;

import com.crms.domain.Routine;
import com.crms.repository.RoutineRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private RoutineRepository routineRepository;

    public byte[] generatePdfReport() throws IOException {
        List<Routine> routines = routineRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Class Routine Management System - Full Schedule").setBold().setFontSize(18));
        
        Table table = new Table(new float[]{2, 2, 2, 2, 2});
        table.addHeaderCell("Class");
        table.addHeaderCell("Subject");
        table.addHeaderCell("Teacher");
        table.addHeaderCell("Time Slot");
        table.addHeaderCell("Room");

        for (Routine r : routines) {
            table.addCell(r.getClassEntity().getCode());
            table.addCell(r.getSubject().getName());
            table.addCell(r.getTeacher().getUser().getFirstName() + " " + r.getTeacher().getUser().getLastName());
            table.addCell(r.getTimeSlot().getDayOfWeek() + " " + r.getTimeSlot().getStartTime());
            table.addCell(r.getClassroom().getCode());
        }

        document.add(table);
        document.close();

        return out.toByteArray();
    }

    public byte[] generateExcelReport() throws IOException {
        List<Routine> routines = routineRepository.findAll();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Routines");

        Row header = sheet.createRow(0);
        String[] columns = {"Class", "Subject", "Teacher", "Day", "Time", "Room"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columns[i]);
            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            style.setFont(font);
            cell.setCellStyle(style);
        }

        int rowIdx = 1;
        for (Routine r : routines) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(r.getClassEntity().getCode());
            row.createCell(1).setCellValue(r.getSubject().getName());
            row.createCell(2).setCellValue(r.getTeacher().getUser().getFirstName() + " " + r.getTeacher().getUser().getLastName());
            row.createCell(3).setCellValue(r.getTimeSlot().getDayOfWeek().toString());
            row.createCell(4).setCellValue(r.getTimeSlot().getStartTime().toString());
            row.createCell(5).setCellValue(r.getClassroom().getCode());
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return out.toByteArray();
    }
}
