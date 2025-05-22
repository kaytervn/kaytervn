package timepasstechies.decorator;

public class HuwCalibration extends VendorCalibration {
	@Override
	public double calibrate(Double rawdata) {
// TODO Auto-generated method stub
		return rawdata * 0.945;
	}
}