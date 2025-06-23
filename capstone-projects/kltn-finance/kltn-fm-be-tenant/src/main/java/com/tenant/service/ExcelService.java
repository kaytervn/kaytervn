package com.tenant.service;

import com.tenant.constant.FinanceConstant;
import com.tenant.utils.DateUtils;
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
import java.util.Objects;

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

    public String mapTransactionKind(int kind) {
        if (kind == FinanceConstant.TRANSACTION_KIND_INCOME) {
            return "Thu";
        } else if (kind == FinanceConstant.TRANSACTION_KIND_EXPENDITURE){
            return "Chi";
        }
        return null;
    }

    public Integer mapTransactionKind(String kind) {
        if (Objects.equals(kind, "Thu")) {
            return FinanceConstant.TRANSACTION_KIND_INCOME;
        } else if (Objects.equals(kind, "Chi")) {
            return FinanceConstant.TRANSACTION_KIND_EXPENDITURE;
        }
        return null;
    }

    public Integer mapTransactionState(String state) {
        if (Objects.equals(state, "Đã tạo")) {
            return FinanceConstant.TRANSACTION_STATE_CREATED;
        } else if (Objects.equals(state, "Chấp nhận")){
            return FinanceConstant.TRANSACTION_STATE_APPROVE;
        } else if (Objects.equals(state, "Từ chối")){
            return FinanceConstant.TRANSACTION_STATE_REJECT;
        } else if (Objects.equals(state, "Đã thanh toán")){
            return FinanceConstant.TRANSACTION_STATE_PAID;
        }
        return null;
    }

    public String mapTransactionState(Integer state) {
        if (Objects.equals(state, FinanceConstant.TRANSACTION_STATE_CREATED)) {
            return "Đã tạo";
        } else if (Objects.equals(state, FinanceConstant.TRANSACTION_STATE_APPROVE)){
            return "Chấp nhận";
        } else if (Objects.equals(state, FinanceConstant.TRANSACTION_STATE_REJECT)){
            return "Từ chối";
        } else if (Objects.equals(state, FinanceConstant.TRANSACTION_STATE_PAID)){
            return "Đã thanh toán";
        }
        return null;
    }

    public String mapKeyInformationKind(int kind) {
        if (kind == FinanceConstant.KEY_INFORMATION_KIND_SERVER) {
            return "Máy chủ";
        } else if (kind == FinanceConstant.KEY_INFORMATION_KIND_WEB){
            return "Web";
        }
        return null;
    }

    public Integer mapKeyInformationKind(String kind) {
        if (Objects.equals(kind, "Máy chủ")) {
            return FinanceConstant.KEY_INFORMATION_KIND_SERVER;
        } else if (Objects.equals(kind, "Web")) {
            return FinanceConstant.KEY_INFORMATION_KIND_WEB;
        }
        return null;
    }

    public String mapTaskState(int state) {
        if (state == FinanceConstant.TASK_STATE_PENDING) {
            return "Đang xử lý";
        } else if (state == FinanceConstant.TASK_STATE_DONE){
            return "Đã hoàn thành";
        }
        return null;
    }
}
