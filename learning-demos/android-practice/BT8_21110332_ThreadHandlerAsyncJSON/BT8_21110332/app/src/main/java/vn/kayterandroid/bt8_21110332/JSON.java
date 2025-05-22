package vn.kayterandroid.bt8_21110332;

import androidx.appcompat.app.AppCompatActivity;

import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;

public class JSON extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_json);
        new ReadJSONObject().execute("http://app.iotstar.vn/json/data3.json");
    }

    private class ReadJSONObject extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... strings) {
            StringBuilder content = new StringBuilder();
            try {
                URL url = new URL(strings[0]);
                InputStreamReader inputStreamReader = new
                        InputStreamReader(url.openConnection().getInputStream());
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                String line = "";
                while ((line = bufferedReader.readLine()) != null) {
                    content.append(line);
                }
                bufferedReader.close();
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return content.toString();
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            //phân tích JSON
            try {
                JSONObject object = new JSONObject(s);
                //xử lý mảng
                JSONArray array = object.getJSONArray("monhoc");
                //duyệt các phần tử trong mảng
                for (int i = 0; i < array.length(); i++) {
                    JSONObject object1 = array.getJSONObject(i);
                    String name = object1.getString("name");
                    String desc = object1.getString("desc");
                    String pic = object1.getString("pic");
                    String kq = name + "\n" + desc + "\n" + pic;
                    Toast.makeText(JSON.this, kq, Toast.LENGTH_SHORT).show();
                }
            } catch (JSONException e) {
                Toast.makeText(JSON.this, "Error Parsing JSON", Toast.LENGTH_SHORT).show();
                e.printStackTrace();
            }
        }
    }
}