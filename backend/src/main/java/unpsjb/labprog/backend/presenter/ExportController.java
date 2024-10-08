package unpsjb.labprog.backend.presenter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.sql.Date;

//import org.apache.poi.hpsf.Date;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.DTOs.informe.DDJJDTO;
import unpsjb.labprog.backend.DTOs.informe.InformeDTO;
import unpsjb.labprog.backend.DTOs.informe.LoteDDJJDTO;
import unpsjb.labprog.backend.DTOs.informe.LoteStockDTO;
import unpsjb.labprog.backend.DTOs.informe.StockDTO;
import unpsjb.labprog.backend.business.LoteService;
import unpsjb.labprog.backend.model.Atributo;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Valor;

@RestController
@RequestMapping("/export")
public class ExportController {

    @Autowired
    LoteService loteService;

    @PostMapping(value = "/toExcel")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportToExcel(@RequestBody InformeDTO informeDTO) throws IOException {
        // Crear un libro de Excel
        Workbook workbook = new XSSFWorkbook();
        // Generar la hoja de Excel para la sección 'stock'
        crearHojaConStock(workbook, informeDTO.getStock());

        // Generar hojas de Excel para las secciones 'ddjjs'
        List<DDJJDTO> ddjjs = informeDTO.getDdjjs();
        for (int i = 0; i < ddjjs.size(); i++) {
            crearHojaConDDJJ(workbook, ddjjs.get(i), "DDJJ " + ddjjs.get(i).getCategoria().getNombre());
        }

        // Guardar el libro de Excel en un flujo de bytes
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);

        // Definir encabezados de respuesta para la descarga
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=datos.xlsx");

        // Convertir el flujo de bytes en un arreglo de bytes
        byte[] fileContent = outputStream.toByteArray();

        // Liberar recursos
        workbook.close();
        outputStream.close();

        return new ResponseEntity<>(fileContent, headers, org.springframework.http.HttpStatus.OK);
    }

    private void crearHojaConStock(Workbook workbook, StockDTO stock) {
        // Crear una hoja en el libro para la sección 'stock'
        Sheet sheet = workbook.createSheet("Stock De Materiales");

        // Crear una fila para los títulos de las columnas
        Row headerRow = sheet.createRow(0);
        Row headerRow1 = sheet.createRow(1);

        LocalDate fecha = LocalDate.now();

        headerRow.createCell(0).setCellValue("Declaracion TOTAL de STOCKS AL MOMENTO DE DECLARACION");
        headerRow1.createCell(0).setCellValue("Fecha De Declaración =  " + fecha);

        Row headerRow2 = sheet.createRow(2);
        headerRow2.createCell(0).setCellValue("Codigo");
        headerRow2.createCell(1).setCellValue("Categoria");
        headerRow2.createCell(2).setCellValue("Cultivar");
        headerRow2.createCell(3).setCellValue("Cantidad Inicial ");
        headerRow2.createCell(4).setCellValue("Cantidad Actual");

        for (int i = 5; i < 5 + stock.getAtributos().size(); i++) {
            headerRow2.createCell(i).setCellValue(stock.getAtributos().get(i - 5).getNombre());
        }

        // Crear un mapa para realizar un seguimiento de los atributos y sus índices de
        // celdas correspondientes
        Map<String, Integer> atributoIndexMap = new HashMap<>();
        for (int i = 5; i < 5 + stock.getAtributos().size(); i++) {
            atributoIndexMap.put(stock.getAtributos().get(i - 5).getNombre(), i);
        }

        // Llenar la hoja con datos
        int rowNum = 3; // Comenzar desde la tercera fila después de los títulos
        for (LoteStockDTO dato : stock.getLotesStock()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(dato.getCodigo());
            row.createCell(1).setCellValue(dato.getCategoria());
            row.createCell(2).setCellValue(dato.getVariedad());
            row.createCell(3).setCellValue(dato.getCantidad());
            row.createCell(4).setCellValue(dato.getCantidadActual());

            // Llenar celdas de valores en función del orden de los atributos
            for (int i = 5; i < 5 + stock.getAtributos().size(); i++) {
                Valor valor = null;
                // Buscar el valor correspondiente al atributo en el mapa
                for (Valor v : dato.getValores()) {
                    if (v.getAtributo().getNombre().equals(stock.getAtributos().get(i - 4).getNombre())) {
                        valor = v;
                        break;
                    }
                }
                // Insertar el valor en la celda correspondiente según el orden del atributo
                if (valor != null) {
                    row.createCell(i).setCellValue(valor.getValor());
                }
            }

        }
        for (int i = 1; i < 5 + stock.getAtributos().size(); i++) {
            sheet.autoSizeColumn(i);
        }
        // Obtener el estilo de celda para centrar el contenido
        CellStyle centerAlignStyle = workbook.createCellStyle();
        centerAlignStyle.setAlignment(HorizontalAlignment.CENTER);
        centerAlignStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        // Aplicar el estilo de centrado a todas las celdas
        for (int rowIndex = 2; rowIndex < rowNum; rowIndex++) {
            Row rows = sheet.getRow(rowIndex);
            for (int colIndex = 0; colIndex < 5 + stock.getAtributos().size(); colIndex++) {
                Cell cell = rows.getCell(colIndex);
                if (cell != null) {
                    cell.setCellStyle(centerAlignStyle);
                }
            }
        }

    }

    private void crearHojaConDDJJ(Workbook workbook, DDJJDTO ddjj, String nombreHoja) {
        // Crear una hoja en el libro para una sección 'ddjj'
        Sheet sheet = workbook.createSheet(nombreHoja);

        // Crear una fila para los títulos de las columnas
        Row headerRow = sheet.createRow(0);
        Row headerRow1 = sheet.createRow(1);

        LocalDate fecha = LocalDate.now();

        headerRow.createCell(0).setCellValue("Declaración Jurada de :" + ddjj.getCategoria().getNombre());
        headerRow1.createCell(0).setCellValue("Fecha De Declaración =  " + fecha);

        Row headerRow2 = sheet.createRow(2);
        headerRow2.createCell(0).setCellValue("Codigo");
        headerRow2.createCell(1).setCellValue("Cultivar");
        headerRow2.createCell(2).setCellValue("Fecha de Creacion ");
        headerRow2.createCell(3).setCellValue("Cantidad Inicial");
        headerRow2.createCell(4).setCellValue("Cantidad Actual");
        headerRow2.createCell(5).setCellValue("Codigo Del Lote Origen ");
        headerRow2.createCell(6).setCellValue("Categoria del Lote Origen");

        for (int i = 7; i < 7 + ddjj.getAtributos().size(); i++) {
            headerRow2.createCell(i).setCellValue(ddjj.getAtributos().get(i - 7).getNombre());
        }
        // Crear un mapa para realizar un seguimiento de los atributos y sus índices de
        // celdas correspondientes
        Map<String, Integer> atributoIndexMap = new HashMap<>();
        for (int i = 7; i < 7 + ddjj.getAtributos().size(); i++) {
            atributoIndexMap.put(ddjj.getAtributos().get(i - 7).getNombre(), i);
        }

        // Llenar la hoja con datos
        int rowNum = 3; // Comenzar desde la tercera fila después de los títulos
        for (LoteDDJJDTO dato : ddjj.getLotesDDJJ()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(dato.getCodigo());
            row.createCell(1).setCellValue(dato.getVariedad());
            LocalDate localDate = dato.getFecha();

            // Definir un formato de fecha
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            // Convertir LocalDate a String
            String dateString = localDate.format(formatter);
            row.createCell(2).setCellValue(dateString);
            row.createCell(3).setCellValue(dato.getCantidad());
            row.createCell(4).setCellValue(dato.getCantidadActual());
            row.createCell(5).setCellValue(dato.getCodigoPadre());
            row.createCell(6).setCellValue(dato.getCategoriaPadre());

            // Llenar celdas de valores en función del orden de los atributos
            for (int i = 7; i < 7 + ddjj.getAtributos().size(); i++) {
                Valor valor = null;
                // Buscar el valor correspondiente al atributo en el mapa
                for (Valor v : dato.getValores()) {
                    if (v.getAtributo().getNombre().equals(ddjj.getAtributos().get(i - 7).getNombre())) {
                        valor = v;
                        break;
                    }
                }
                // Insertar el valor en la celda correspondiente según el orden del atributo
                if (valor != null) {
                    row.createCell(i).setCellValue(valor.getValor());
                }
            }

        }
        // Ajustar automáticamente el ancho de las columnas después de llenar los datos
        for (int i = 1; i < 7 + ddjj.getAtributos().size(); i++) {
            sheet.autoSizeColumn(i);
        }
        // Obtener el estilo de celda para centrar el contenido
        CellStyle centerAlignStyle = workbook.createCellStyle();
        centerAlignStyle.setAlignment(HorizontalAlignment.CENTER);
        centerAlignStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        // Aplicar el estilo de centrado a todas las celdas
        for (int rowIndex = 2; rowIndex < rowNum; rowIndex++) {
            Row rows = sheet.getRow(rowIndex);
            for (int colIndex = 0; colIndex < 7 + ddjj.getAtributos().size(); colIndex++) {
                Cell cell = rows.getCell(colIndex);
                if (cell != null) {
                    cell.setCellStyle(centerAlignStyle);
                }
            }
        }

    }

    @PostMapping(value = "/generar-informe")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Object> crear(@RequestBody InformeDTO informeF) {
        InformeDTO informe = new InformeDTO();

        // Define el formato de la cadena de fecha
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate fecha = LocalDate.now();
        LocalDate fechaHasta = LocalDate.now();

        try {
            fecha = LocalDate.parse(informeF.getFechaDesde(), formatter);
            fechaHasta = LocalDate.parse(informeF.getFechaHasta(), formatter);
        } catch (Exception e) {
            // System.err.println("Error al analizar la cadena de fecha: " +
            // e.getMessage());
        }
        informe.setFechaDesde(informeF.getFechaDesde());
        informe.setFechaHasta(informeF.getFechaHasta());

        List<Object[]> lotes = loteService.findAllFecha(fecha, fechaHasta);
        StockDTO stock = new StockDTO();
        StockDTO stocki = informeF.getStock();
        List<Long> list = new ArrayList<>();
        List<Atributo> a = stocki.getAtributos();
        for (Atributo aa : a) {
            list.add(aa.getId());
        }

        List<LoteStockDTO> lotesStock = new ArrayList<>();
        LoteStockDTO loteStock;
        if (list.size() == 0) {
            for (Object[] result : lotes) {
                loteStock = new LoteStockDTO();
                // Lote l = (Lote) result[0];
                String cultivar = (String) result[0];
                String categoria = (String) result[1];
                String codigo = (String) result[2];

                Integer longValue = (Integer) result[3];
                Integer longValue2 = (Integer) result[4];
                // int loteId = longValue.intValue();
                loteStock.setCodigo(codigo);
                loteStock.setCantidad(longValue);
                loteStock.setCantidadActual(longValue2);
                loteStock.setVariedad(cultivar);
                loteStock.setCategoria(categoria);

                lotesStock.add(loteStock);
            }
        } else {

            List<Object[]> results = loteService.findLotesAndValoresByAtributos(list, fecha);
            Map<Long, List<Valor>> lotesValoresMap = new HashMap<>();

            for (Object[] result : results) {
                Long loteId = (Long) result[0];
                Lote l = (Lote) result[1];
                Valor valor = (Valor) result[2];
                Long longValue = (Long) result[3];
                int loteId2 = longValue.intValue();
                if (!lotesValoresMap.containsKey(loteId)) {
                    loteStock = new LoteStockDTO();
                    loteStock.setCodigo(l.getCodigo());
                    loteStock.setCantidad(l.getCantidad() + loteId2);
                    loteStock.setVariedad(l.getCultivar().getNombre());
                    loteStock.setCategoria(l.getCategoria().getNombre());
                    loteStock.addValor(valor);
                    lotesStock.add(loteStock);
                } else {
                    LoteStockDTO loteStockk = lotesStock.get(lotesStock.size() - 1);
                    loteStockk.addValor(valor);
                }

                lotesValoresMap
                        .computeIfAbsent(loteId, k -> new ArrayList<>())
                        .add(valor);
            }
        }
        stock.setLotesStock(lotesStock);
        stock.setAtributos(informeF.getStock().getAtributos());
        informe.setStock(stock);

        List<DDJJDTO> ddjjdtos = informeF.getDdjjs();
        List<DDJJDTO> ddjjdtosS = new ArrayList<>();
        DDJJDTO ddjjdtoM;
        for (DDJJDTO ddjjdto : ddjjdtos) {
            ddjjdtoM = new DDJJDTO();
            List<Object[]> lotesc = loteService.findLotesByCategoria(ddjjdto.getCategoria(), fecha, fechaHasta);
            List<Atributo> dAtributos = ddjjdto.getAtributos();
            ddjjdtoM.setAtributos(dAtributos);
            ddjjdtoM.setCategoria(ddjjdto.getCategoria());
            List<Long> listd = new ArrayList<>();
            List<LoteDDJJDTO> lotesD = new ArrayList<>();
            LoteDDJJDTO loteD;
            for (Atributo aad : dAtributos) {
                listd.add(aad.getId());
            }
            if (listd.size() == 0) {

                for (Object[] result : lotesc) {
                    loteD = new LoteDDJJDTO();
                    String cultivar = (String) result[0];

                    String codigo = (String) result[2];
                    Integer longValue = (Integer) result[3];
                    Integer longValue2 = (Integer) result[6];

                    // LocalDate fechaL = (LocalDate) result[5];
                    Date sqlDate = (Date) result[5]; // Suponiendo que la fecha está en la posición 4
                    LocalDate fechaL = sqlDate.toLocalDate();

                    loteD.setCodigo(codigo);
                    if (result[1] != null) {
                        String categoriaP = (String) result[1];
                        String codigoP = (String) result[4];
                        loteD.setCodigoPadre(codigoP);
                        loteD.setCategoriaPadre(categoriaP);
                    }
                    loteD.setCantidad(longValue);
                    loteD.setCantidadActual(longValue2);
                    loteD.setVariedad(cultivar);
                    loteD.setFecha(fechaL);
                    lotesD.add(loteD);
                }
            } else {
                List<Object[]> resultsD = loteService.findLotesAndValoresByAtributosAndCategoria(listd,
                        ddjjdto.getCategoria(), fecha);
                Map<Long, List<Valor>> lotesValoresMapD = new HashMap<>();

                for (Object[] result : resultsD) {
                    Long loteId = (Long) result[0];
                    Lote ld = (Lote) result[1];
                    Valor valor = (Valor) result[2];
                    Long longValue = (Long) result[3];
                    int loteId2 = longValue.intValue();
                    if (!lotesValoresMapD.containsKey(loteId)) {
                        loteD = new LoteDDJJDTO();
                        loteD.setCodigo(ld.getCodigo());
                        if (ld.getLotePadre() != null) {
                            loteD.setCodigoPadre(ld.getLotePadre().getCodigo());
                            loteD.setCategoriaPadre(ld.getLotePadre().getCategoria().getNombre());
                        }
                        loteD.setCantidad(ld.getCantidad() + loteId2);
                        loteD.setVariedad(ld.getCultivar().getNombre());
                        loteD.setFecha(ld.getFecha());
                        loteD.addValor(valor);
                        lotesD.add(loteD);
                    } else {
                        LoteDDJJDTO loteDD = lotesD.get(lotesD.size() - 1);
                        loteDD.addValor(valor);
                    }

                    lotesValoresMapD
                            .computeIfAbsent(loteId, k -> new ArrayList<>())
                            .add(valor);
                }

            }
            ddjjdtoM.setLotesDDJJ(lotesD);
            ddjjdtosS.add(ddjjdtoM);
        }
        informe.setDdjjs(ddjjdtosS);

        return Response.ok(informe, "informe generado correctamente");
    }

}
