package timepasstechies.decorator;

public class Driver {
	public static void main(String[] args) {
		double rawData = 2.345;
		double calibratedData = new DeviceTypeCalibration(new TechTypeCalibration(new HuwCalibration()))
				.calibrate(rawData);
		System.out.println(calibratedData);
	}
}