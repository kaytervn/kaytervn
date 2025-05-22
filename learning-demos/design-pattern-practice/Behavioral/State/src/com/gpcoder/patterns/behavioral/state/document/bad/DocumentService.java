package com.gpcoder.patterns.behavioral.state.document.bad;

class DocumentService {
	private DocumentState state;

	public void setState(DocumentState state) {
		this.state = state;
	}

	public void handleRequest() {
		switch (state) {
		case NEW:
			System.out.println("Create a new document");
			break;
		case SUBMITTED:
			System.out.println("Submitted");
			break;
		case APPROVED:
			System.out.println("Approved");
			break;
		case REJECTED:
			System.out.println("Rejected");
			break;

		default:
			break;
		}
	}
}