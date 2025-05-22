package example2;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Application {
    public static void main(String[] args) {
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");
        MyApplication app = context.getBean("myApp", MyApplication.class);
        app.processMessages("Hello Spring DI via Setter!");

        context.close();
    }
}
