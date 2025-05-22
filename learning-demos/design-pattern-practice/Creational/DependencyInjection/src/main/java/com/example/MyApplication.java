package com.example;

import com.example.service.MyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MyApplication {

    private MyService myService;

    @Autowired
    public MyApplication(MyService myService) {
        this.myService = myService;
    }

    public void doWork() {
        System.out.println(myService.serve());
    }
}
