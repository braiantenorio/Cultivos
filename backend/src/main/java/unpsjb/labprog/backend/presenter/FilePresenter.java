package unpsjb.labprog.backend.presenter;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.FileStorageService;
import unpsjb.labprog.backend.message.ResponseFile;
import unpsjb.labprog.backend.message.ResponseMessage;
import unpsjb.labprog.backend.model.FileDB;

@Controller
public class FilePresenter {

  @Autowired
  private FileStorageService storageService;

  @PostMapping("/upload")
  public ResponseEntity<Object> uploadFile(@RequestParam("file") MultipartFile file) {
    String message = "";
    try {
      return Response.ok(storageService.store(file), "Uploaded the file successfully: " + file.getOriginalFilename());
      // return ResponseEntity.status(HttpStatus.OK).body(new
      // ResponseMessage(message));
    } catch (Exception e) {
      message = "Could not upload the file: " + file.getOriginalFilename() + "!";
      return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
    }
  }

  @GetMapping("/files")
  public ResponseEntity<List<ResponseFile>> getListFiles() {
    List<ResponseFile> files = storageService.getAllFiles().map(dbFile -> {
      String fileDownloadUri = ServletUriComponentsBuilder
          .fromCurrentContextPath()
          .path("/files/")
          .path(dbFile.getId())
          .toUriString();

      return new ResponseFile(
          dbFile.getName(),
          fileDownloadUri,
          dbFile.getType(),
          dbFile.getData().length);
    }).collect(Collectors.toList());

    return ResponseEntity.status(HttpStatus.OK).body(files);
  }

  @GetMapping("/files/{id}")
  public ResponseEntity<byte[]> getFile(@PathVariable String id) {
    FileDB fileDB = storageService.getFile(id);

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDB.getName() + "\"")
        .body(fileDB.getData());
  }

  @GetMapping("/files/view/{id}")
  public ResponseEntity<byte[]> viewFile(@PathVariable String id) {
    FileDB fileDB = storageService.getFile(id);

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_TYPE, fileDB.getType())
        .body(fileDB.getData());
  }

  @GetMapping("/files/info/{id}")
  public ResponseEntity<ResponseFile> getFileInfo(@PathVariable String id) {
    FileDB dbFile = storageService.getFile(id);

    String fileDownloadUri = ServletUriComponentsBuilder
          .fromCurrentContextPath()
          .path("/files/")
          .path(dbFile.getId())
          .toUriString();

    return ResponseEntity.status(HttpStatus.OK).body(new ResponseFile(
        dbFile.getName(),
        fileDownloadUri,
        dbFile.getType(),
        dbFile.getData().length));
  }

}