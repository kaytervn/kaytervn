package javatpoint.mediator;
//This is a class.  

public class User2 extends Participant {

	private String name;
	private ApnaChatRoom chat;

	@Override
	public void sendMsg(String msg) {
		this.chat.showMsg(msg, this);

	}

	@Override
	public void setname(String name) {
		this.name = name;
	}

	@Override
	public String getName() {
		return name;
	}

	public User2(ApnaChatRoom chat) {
		this.chat = chat;
	}

}
// End of the User2 class.  