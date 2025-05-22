package personal.mediator;

public class MemberImpl extends Member {

	public MemberImpl(AppointmentMediator med, String name, String role) {
		super(med, name, role);
	}

	@Override
	public void talk(String content) {
		System.out.println("---");
		System.out.println(this.name + " is talking: " + content);
		this.mediator.giveTalk(content, this);
	}

	@Override
	public void hear() {
		System.out.println(this.name + " (" + this.role + ") " + "is hearing");
	}
}
