package unpsjb.labprog.backend.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter; 
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.BufferedImageHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.awt.image.BufferedImage;
import java.util.Hashtable;
import java.awt.Color;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Font;

@Service
public class QRCodeGenerator {

	public BufferedImage createQRImage(String qrCodeText, int size, String fileType)
			throws WriterException, IOException {
		Hashtable<EncodeHintType, ErrorCorrectionLevel> hintMap = new Hashtable<>();
		hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
		QRCodeWriter qrCodeWriter = new QRCodeWriter();
		BitMatrix byteMatrix = qrCodeWriter.encode( "http://localhost:3000/lotes/" + qrCodeText, BarcodeFormat.QR_CODE, size, size, hintMap);

		// Create a BufferedImage with a white background
		int matrixWidth = byteMatrix.getWidth();
		BufferedImage image = new BufferedImage(matrixWidth, matrixWidth, BufferedImage.TYPE_INT_RGB);
		Graphics2D graphics = image.createGraphics();
		graphics.setColor(Color.white);
		graphics.fillRect(0, 0, matrixWidth, matrixWidth);
		graphics.setColor(Color.black);

		// Copy the QR code pattern to the image
		for (int i = 0; i < matrixWidth; i++) {
			for (int j = 0; j < matrixWidth; j++) {
				if (byteMatrix.get(i, j)) {
					graphics.fillRect(i, j, 1, 1);
				}
			}
		}

		Font font = new Font("Arial", Font.BOLD, 18); // Puedes ajustar el tamaño (18 en este ejemplo)
		graphics.setFont(font);

		graphics.setColor(Color.black);
		FontMetrics fm = graphics.getFontMetrics(); // Obtiene información sobre la fuente
		int textWidth = fm.stringWidth(qrCodeText); // Obtiene el ancho del texto
		int x = (image.getWidth() - textWidth) / 2; // Calcula la posición x centrada
		int y = matrixWidth - 7; // Ajusta la posición y
		
		graphics.drawString(qrCodeText, x, y);

		return image;
	}

	@Bean
	public HttpMessageConverter<BufferedImage> createImageHttpMessageConverter() {
		return new BufferedImageHttpMessageConverter();
	}
}