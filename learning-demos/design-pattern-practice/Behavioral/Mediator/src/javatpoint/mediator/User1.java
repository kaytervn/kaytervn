package javatpoint.mediator;
//This is a class.  

public class User1 extends Participant {

	private String name;
	private ApnaChatRoom chat;

	@Override
	public void sendMsg(String msg) {
		chat.showMsg(msg, this);

	}

	@Override
	public void setname(String name) {
		this.name = name;
	}

	@Override
	public String getName() {
		return name;
	}

	public User1(ApnaChatRoom chat) {
		this.chat = chat;
	}

}// End of the User1 class.