package javatpoint.proxy;

public class ProxyPatternClient {
	public static void main(String[] args) {
		OfficeInternetAccess access = new ProxyInternetAccess("Ashwani Rajput");
		access.grantInternetAccess();
	}
}