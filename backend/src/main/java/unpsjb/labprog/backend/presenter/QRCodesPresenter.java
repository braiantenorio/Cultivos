package unpsjb.labprog.backend.presenter;

import unpsjb.labprog.backend.util.QRCodeGenerator;
import java.awt.image.BufferedImage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("qrcodes")
public class QRCodesPresenter {

    @Autowired
    private QRCodeGenerator qrGenerator;

    @GetMapping(value = "/{qrcode}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<BufferedImage> QRcode(@PathVariable("qrcode") String qrcode) throws Exception {
        BufferedImage image = qrGenerator.createQRImage(qrcode, 225, "png");
        return new ResponseEntity<>(image, HttpStatus.OK);

    }

}
