package unpsjb.labprog.backend.presenter;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.DTOs.LoteCodigoDTO;
import unpsjb.labprog.backend.DTOs.informe.DDJJDTO;
import unpsjb.labprog.backend.DTOs.informe.InformeDTO;
import unpsjb.labprog.backend.DTOs.informe.LoteDDJJDTO;
import unpsjb.labprog.backend.DTOs.informe.LoteStockDTO;
import unpsjb.labprog.backend.DTOs.informe.StockDTO;
import unpsjb.labprog.backend.business.LoteService;
import unpsjb.labprog.backend.model.Atributo;
import unpsjb.labprog.backend.model.Lote;
import unpsjb.labprog.backend.model.Valor;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/export")
public class ExportController {
    @Autowired
    LoteService loteService;

    @PostMapping(value = "/toExcel")
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
        headerRow2.createCell(2).setCellValue("Variedad");
        headerRow2.createCell(3).setCellValue("Cantidad ");

        for (int i = 4; i < 4 + stock.getAtributos().size(); i++) {
            headerRow2.createCell(i).setCellValue(stock.getAtributos().get(i - 4).getNombre());
        }

        // Crear un mapa para realizar un seguimiento de los atributos y sus índices de
        // celdas correspondientes
        Map<String, Integer> atributoIndexMap = new HashMap<>();
        for (int i = 4; i < 4 + stock.getAtributos().size(); i++) {
            atributoIndexMap.put(stock.getAtributos().get(i - 4).getNombre(), i);
        }

        // Llenar la hoja con datos
        int rowNum = 3; // Comenzar desde la tercera fila después de los títulos
        for (LoteStockDTO dato : stock.getLotesStock()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(dato.getCodigo());
            row.createCell(1).setCellValue(dato.getCategoria());
            row.createCell(2).setCellValue(dato.getVariedad());
            row.createCell(3).setCellValue(dato.getCantidad());

            // Llenar celdas de valores en función del orden de los atributos
            for (int i = 4; i < 4 + stock.getAtributos().size(); i++) {
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
        for (int i = 1; i < 4 + stock.getAtributos().size(); i++) {
            sheet.autoSizeColumn(i);
        }
        // Obtener el estilo de celda para centrar el contenido
        CellStyle centerAlignStyle = workbook.createCellStyle();
        centerAlignStyle.setAlignment(HorizontalAlignment.CENTER);
        centerAlignStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        // Aplicar el estilo de centrado a todas las celdas
        for (int rowIndex = 2; rowIndex < rowNum; rowIndex++) {
            Row rows = sheet.getRow(rowIndex);
            for (int colIndex = 0; colIndex < 4 + stock.getAtributos().size(); colIndex++) {
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
        headerRow2.createCell(1).setCellValue("Variedad");
        headerRow2.createCell(2).setCellValue("Fecha ");
        headerRow2.createCell(3).setCellValue("Cantidad ");
        headerRow2.createCell(4).setCellValue("Codigo De Lote Origen ");
        headerRow2.createCell(5).setCellValue("Categoria del Lote Origen");

        for (int i = 6; i < 6 + ddjj.getAtributos().size(); i++) {
            headerRow2.createCell(i).setCellValue(ddjj.getAtributos().get(i - 6).getNombre());
        }
        // Crear un mapa para realizar un seguimiento de los atributos y sus índices de
        // celdas correspondientes
        Map<String, Integer> atributoIndexMap = new HashMap<>();
        for (int i = 6; i < 6 + ddjj.getAtributos().size(); i++) {
            atributoIndexMap.put(ddjj.getAtributos().get(i - 6).getNombre(), i);
        }

        // Llenar la hoja con datos
        int rowNum = 3; // Comenzar desde la tercera fila después de los títulos
        for (LoteDDJJDTO dato : ddjj.getLotesDDJJ()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(dato.getCodigo());
            row.createCell(1).setCellValue(dato.getVariedad());
            row.createCell(2).setCellValue(dato.getFecha());
            row.createCell(3).setCellValue(dato.getCantidad());
            row.createCell(4).setCellValue(dato.getCodigoPadre());
            row.createCell(5).setCellValue(dato.getCategoriaPadre());

            // Llenar celdas de valores en función del orden de los atributos
            for (int i = 6; i < 6 + ddjj.getAtributos().size(); i++) {
                Valor valor = null;
                // Buscar el valor correspondiente al atributo en el mapa
                for (Valor v : dato.getValores()) {
                    if (v.getAtributo().getNombre().equals(ddjj.getAtributos().get(i - 6).getNombre())) {
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
        for (int i = 1; i < 6 + ddjj.getAtributos().size(); i++) {
            sheet.autoSizeColumn(i);
        }
        // Obtener el estilo de celda para centrar el contenido
        CellStyle centerAlignStyle = workbook.createCellStyle();
        centerAlignStyle.setAlignment(HorizontalAlignment.CENTER);
        centerAlignStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        // Aplicar el estilo de centrado a todas las celdas
        for (int rowIndex = 2; rowIndex < rowNum; rowIndex++) {
            Row rows = sheet.getRow(rowIndex);
            for (int colIndex = 0; colIndex < 6 + ddjj.getAtributos().size(); colIndex++) {
                Cell cell = rows.getCell(colIndex);
                if (cell != null) {
                    cell.setCellStyle(centerAlignStyle);
                }
            }
        }

    }

    @PostMapping(value = "/generar-informe")
    public ResponseEntity<Object> crear(@RequestBody InformeDTO informeF) {
        InformeDTO informe = new InformeDTO();

        List<Lote> lotes = loteService.findAll();
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
            for (Lote l : lotes) {
                loteStock = new LoteStockDTO();
                loteStock.setCodigo(l.getCodigo());
                loteStock.setCantidad(l.getCantidad());
                loteStock.setVariedad(l.getCultivar().getNombre());
                loteStock.setCategoria(l.getCategoria().getNombre());

                lotesStock.add(loteStock);
            }
        } else {

            List<Object[]> results = loteService.findLotesAndValoresByAtributos(list);
            Map<Long, List<Valor>> lotesValoresMap = new HashMap<>();

            for (Object[] result : results) {
                Long loteId = (Long) result[0];
                Lote l = (Lote) result[1];
                Valor valor = (Valor) result[2];
                if (!lotesValoresMap.containsKey(loteId)) {
                    loteStock = new LoteStockDTO();
                    loteStock.setCodigo(l.getCodigo());
                    loteStock.setCantidad(l.getCantidad());
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
            List<Lote> lotesc = loteService.findLotesByCategoria(ddjjdto.getCategoria());
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

                for (Lote ld : lotesc) {
                    loteD = new LoteDDJJDTO();
                    loteD.setCodigo(ld.getCodigo());
                    if (ld.getLotePadre() != null) {
                        loteD.setCodigoPadre(ld.getLotePadre().getCodigo());
                        loteD.setCategoriaPadre(ld.getLotePadre().getCategoria().getNombre());
                    }
                    loteD.setCantidad(ld.getCantidad());
                    loteD.setVariedad(ld.getCultivar().getNombre());
                    loteD.setFecha(ld.getFecha());
                    lotesD.add(loteD);
                }
            } else {
                List<Object[]> resultsD = loteService.findLotesAndValoresByAtributosAndCategoria(listd,
                        ddjjdto.getCategoria());
                Map<Long, List<Valor>> lotesValoresMapD = new HashMap<>();

                for (Object[] result : resultsD) {
                    Long loteId = (Long) result[0];
                    Lote ld = (Lote) result[1];
                    Valor valor = (Valor) result[2];
                    if (!lotesValoresMapD.containsKey(loteId)) {
                        loteD = new LoteDDJJDTO();
                        loteD.setCodigo(ld.getCodigo());
                        if (ld.getLotePadre() != null) {
                            loteD.setCodigoPadre(ld.getLotePadre().getCodigo());
                            loteD.setCategoriaPadre(ld.getLotePadre().getCategoria().getNombre());
                        }
                        loteD.setCantidad(ld.getCantidad());
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
