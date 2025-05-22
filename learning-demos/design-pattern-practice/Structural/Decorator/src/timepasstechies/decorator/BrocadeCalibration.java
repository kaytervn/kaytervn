package timepasstechies.decorator;

public class BrocadeCalibration extends VendorCalibration {
	@Override
	public double calibrate(Double rawdata) {
// TODO Auto-generated method stub
		return rawdata * 0.967;
	}
}