package com.master.service;

import com.master.utils.DateUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;

@Service
public class ExcelService {
    public CellStyle createBorderCellStyle(Row row){
        CellStyle borderedCellStyle = row.getSheet().getWorkbook().createCellStyle();
        borderedCellStyle.setBorderBottom(BorderStyle.THIN);
        borderedCellStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
        borderedCellStyle.setBorderLeft(BorderStyle.THIN);
        borderedCellStyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
        borderedCellStyle.setBorderRight(BorderStyle.THIN);
        borderedCellStyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
        borderedCellStyle.setBorderTop(BorderStyle.THIN);
        borderedCellStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
        return borderedCellStyle;
    }

    public void createCell(Row row, int cellIndex, Date value, CellStyle style) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        String formattedDate = dateFormat.format(value);
        Cell cell = row.createCell(cellIndex);
        cell.setCellStyle(style);
        if (value != null) {
            cell.setCellValue(formattedDate);
        }
    }

    public void createCell(Row row, int cellIndex, String value, CellStyle style) {
        Cell cell = row.createCell(cellIndex);
        cell.setCellStyle(style);
        if (value != null) {
            cell.setCellValue(value);
        }
    }

    public void createCell(Row row, int cellIndex, Double value, CellStyle style) {
        Cell cell = row.createCell(cellIndex);
        if (value != null) {
            cell.setCellValue(value);
            DataFormat format = row.getSheet().getWorkbook().createDataFormat();
            CellStyle formattedStyle = row.getSheet().getWorkbook().createCellStyle();
            formattedStyle.cloneStyleFrom(style);
            formattedStyle.setDataFormat(format.getFormat("#,##0.0"));
            cell.setCellStyle(formattedStyle);
        } else {
            cell.setCellStyle(style);
        }
    }

    public void createCell(Row row, int cellIndex, Integer value, CellStyle style) {
        Cell cell = row.createCell(cellIndex);
        if (value != null) {
            cell.setCellValue(value);
            DataFormat format = row.getSheet().getWorkbook().createDataFormat();
            CellStyle formattedStyle = row.getSheet().getWorkbook().createCellStyle();
            formattedStyle.cloneStyleFrom(style);
            formattedStyle.setDataFormat(format.getFormat("#,##0"));
            cell.setCellStyle(formattedStyle);
        } else {
            cell.setCellStyle(style);
        }
    }

    public void createCell(Row row, int cellIndex, Long value, CellStyle style) {
        Cell cell = row.createCell(cellIndex);
        if (value != null) {
            cell.setCellValue(value);
            DataFormat format = row.getSheet().getWorkbook().createDataFormat();
            CellStyle formattedStyle = row.getSheet().getWorkbook().createCellStyle();
            formattedStyle.cloneStyleFrom(style);
            formattedStyle.setDataFormat(format.getFormat("#,##0"));
            cell.setCellStyle(formattedStyle);
        } else {
            cell.setCellStyle(style);
        }
    }

    public Date getCellDateValue(Row row, int cellIndex) throws ParseException {
        Cell cell = row.getCell(cellIndex);
        if (cell != null) {
            String cellValue = cell.getStringCellValue();
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            return dateFormat.parse(cellValue);
        }
        return null;
    }

    public void skipRows(Iterator<Row> rows, int numberOfRows) {
        for (int i = 0; i < numberOfRows && rows.hasNext(); i++) {
            rows.next();
        }
    }

    public ResponseEntity<Resource> downloadTemplate(ResourceLoader resourceLoader, String location, String fileName) throws IOException {
        Resource resource = resourceLoader.getResource(location);
        InputStream inputStream = resource.getInputStream();
        Workbook workbook = new XSSFWorkbook(inputStream);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
        ByteArrayOutputStream outPut = new ByteArrayOutputStream();
        workbook.write(outPut);
        ByteArrayResource byteArrayResource = new ByteArrayResource(outPut.toByteArray());
        return ResponseEntity.ok()
                .headers(headers)
                .body(byteArrayResource);
    }

    public String generateFileName(String baseName) {
        SimpleDateFormat fileNameDateFormat = new SimpleDateFormat("dd.MM.yyyy_HHmmss");
        String fileNameDate = fileNameDateFormat.format(DateUtils.convertUTCToVN(new Date()));
        return baseName + "." + fileNameDate + ".xlsx";
    }
}
