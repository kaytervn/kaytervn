package personal.mediator;

public abstract class Member {
	protected AppointmentMediator mediator;
	protected String name;
	protected String role;

	public Member(AppointmentMediator med, String name, String role) {
		this.mediator = med;
		this.name = name;
		this.role = role;
	}

	public abstract void talk(String content);

	public abstract void hear();
}
