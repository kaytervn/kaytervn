package vn.kayterandroid.bt12_socketio;

import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.Toast;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class MainActivity extends AppCompatActivity {
    private Socket mSocket;
    Button buttonOn, buttonOff;
    ImageView imageLight;
    RelativeLayout mainLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        try {
            mSocket = IO.socket("https://food-app-api-demo.onrender.com/");
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        mSocket.connect();

        buttonOn = findViewById(R.id.buttonOn);
        buttonOff = findViewById(R.id.buttonOff);
        imageLight = findViewById(R.id.imageLight);
        mainLayout = findViewById(R.id.mainLayout);

        buttonOn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mSocket.emit("turnOn");
            }
        });

        buttonOff.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mSocket.emit("turnOff");
            }
        });

        mSocket.on("lightOn", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                imageLight.setImageResource(R.drawable.light_on);
                mainLayout.setBackgroundColor(Color.parseColor("#FFFFFF"));
            }
        });

        mSocket.on("lightOff", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                imageLight.setImageResource(R.drawable.light_off);
                mainLayout.setBackgroundColor(Color.parseColor("#000000"));
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mSocket.disconnect();
    }
}