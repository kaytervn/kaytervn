package utility;

import java.util.Base64;

public class Upload {
	public String byteArrayToImageData(byte[] imageBytes) {
		if (imageBytes != null) {
			String base64Image = Base64.getEncoder().encodeToString(imageBytes);
			String imageData = "data:image/png;base64," + base64Image;
			return imageData;
		}
		return null;
	}
}
