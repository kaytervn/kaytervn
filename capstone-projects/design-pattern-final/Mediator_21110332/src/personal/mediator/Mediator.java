package personal.mediator;

public interface Mediator {
	void giveTalk(String content, Member member);

	void addMember(Member member);
}