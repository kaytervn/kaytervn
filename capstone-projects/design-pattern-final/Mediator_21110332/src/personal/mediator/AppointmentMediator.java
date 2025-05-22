package personal.mediator;

import java.util.ArrayList;
import java.util.List;

public class AppointmentMediator implements Mediator {

	public AppointmentMediator(String topic) {
		System.out.println("The topic " + topic + " is being brought up");
	}

	List<Member> members = new ArrayList<>();;

	@Override
	public void giveTalk(String content, Member member) {
		for (Member mem : this.members) {
			if (!mem.equals(member)) {
				mem.hear();
			}
		}
	}

	@Override
	public void addMember(Member member) {
		System.out.println(member.name + " joined this appointment");
		this.members.add(member);
	}
}