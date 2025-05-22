package sample.cor;

public class ChainDemo {
	public static void main(String[] args) {
		Handler featureHandler = new FeatureRequestHandler();
		Handler maintenanceHandler = new MaintenanceRequestHandler();
		Handler technicalHandler = new TechnicalSupportHandler();

		featureHandler.setNext(maintenanceHandler);
		maintenanceHandler.setNext(technicalHandler);

		Request request1 = new Request(RequestType.FEATURE, "Implement new feature");
		Request request2 = new Request(RequestType.MAINTENANCE, "Update software version");
		Request request3 = new Request(RequestType.TECHNICAL, "Fix bug in module");

		featureHandler.handleRequest(request1);
		featureHandler.handleRequest(request2);
		featureHandler.handleRequest(request3);
	}
}