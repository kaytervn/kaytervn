package example2;

public class MyApplication {
    private MessageService service;

    // Setter injection
    public void setService(MessageService svc){
        this.service = svc;
    }

    public void processMessages(String msg) {
        service.sendMsg(msg);
    }
}
