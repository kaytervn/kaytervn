package personal.mediator;

public class MediatorDemo {
	public static void main(String[] args) {
		AppointmentMediator mediator = new AppointmentMediator("Employee Wellness Initiatives");

		Member john = new MemberImpl(mediator, "John", "CEO");
		Member sarah = new MemberImpl(mediator, "Sarah", "HR Manager");
		Member michael = new MemberImpl(mediator, "Michael", "Operations Supervisor");

		mediator.addMember(john);
		mediator.addMember(sarah);
		mediator.addMember(michael);

		john.talk("Today, we'll discuss our employee wellness initiatives.");
		sarah.talk("Implement flexible work arrangements to promote work-life balance.");
		michael.talk("Provide gym membership discounts to encourage physical fitness.");
		john.talk("Thank you, everyone, for your valuable suggestions.");
	}
}