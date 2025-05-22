package example2;

public class EmailService implements MessageService {
    public void sendMsg(String message) {
        System.out.println("Email Message : " + message);
    }
}
