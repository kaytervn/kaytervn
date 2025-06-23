package com.finance;

import static com.spos.data.socket.scarlet.websocket.okhttp.OkHttpClientUtils.newWebSocketFactory;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Application;
import android.content.Intent;
import android.content.pm.PackageManager;

import androidx.annotation.MainThread;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.OnLifecycleEvent;
import androidx.lifecycle.ProcessLifecycleOwner;

import com.finance.constant.Constants;
import com.finance.data.socket.Command;
import com.finance.data.socket.KittyRealtimeEvent;
import com.finance.data.socket.KittyService;
import com.finance.data.socket.dto.App;
import com.finance.data.socket.dto.Message;
import com.finance.di.component.AppComponent;
import com.finance.di.component.DaggerAppComponent;
import com.finance.others.MyTimberDebugTree;
import com.finance.others.MyTimberReleaseTree;
import com.finance.ui.login.LoginActivity;
import com.finance.utils.DialogUtils;
import com.google.firebase.crashlytics.FirebaseCrashlytics;
import com.spos.data.socket.scarlet.websocket.lifecycle.android.AndroidLifecycle;
import com.spos.data.socket.scarlet.websocket.messageadapter.gson.GsonMessageAdapter;
import com.spos.data.socket.scarlet.websocket.streamadapter.rxjava2.RxJava2StreamAdapterFactory;
import com.tinder.scarlet.Scarlet;
import com.tinder.scarlet.WebSocket;
import com.tinder.scarlet.retry.ExponentialWithJitterBackoffStrategy;

import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import es.dmoral.toasty.Toasty;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Flowable;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.disposables.Disposable;
import io.reactivex.rxjava3.schedulers.Schedulers;
import io.reactivex.rxjava3.subjects.PublishSubject;
import lombok.Getter;
import lombok.Setter;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.HttpException;
import timber.log.Timber;

public class MVVMApplication  extends Application{
    @Getter
    @Setter
    private AppCompatActivity currentActivity;

    @Setter
    @Getter
    private AppComponent appComponent;

    @Getter
    @Setter
    private static List<String> permissions;

    @Getter
    @Setter
    private Boolean isBackground = false;

    private Scarlet scarletInstance;
    private KittyService kittyService;
    Disposable disposableSocket;
    private Message lastMessage;
    CompositeDisposable compositeDisposable = new CompositeDisposable();
    private Disposable disposablePingSocket;
    private Disposable disposableVerifyToken;

    @Override
    public void onCreate() {
        super.onCreate();

        // Enable firebase log
        FirebaseCrashlytics firebaseCrashlytics = FirebaseCrashlytics.getInstance();
        firebaseCrashlytics.setCrashlyticsCollectionEnabled(true);

        if (BuildConfig.DEBUG) {
            Timber.plant(new MyTimberDebugTree());
        } else {
            Timber.plant(new MyTimberReleaseTree(firebaseCrashlytics));
        }

        appComponent = DaggerAppComponent.builder()
                .application(this)
                .build();
        appComponent.inject(this);

        ProcessLifecycleOwner.get().getLifecycle().addObserver(lifecycleObserver);
        createSocket(BuildConfig.WS_URL);

    }
    public PublishSubject<Integer> showDialogNoInternetAccess(){
        final PublishSubject<Integer> subject = PublishSubject.create();
        currentActivity.runOnUiThread(() ->
                DialogUtils.dialogConfirm(currentActivity, currentActivity.getResources().getString(R.string.newtwork_error),
                        currentActivity.getResources().getString(R.string.newtwork_error_button_retry),
                        (dialogInterface, i) -> subject.onNext(1), currentActivity.getResources().getString(R.string.newtwork_error_button_exit),
                        (dialogInterface, i) -> System.exit(0))
        );
        return subject;
    }

    private final LifecycleObserver lifecycleObserver = new DefaultLifecycleObserver() {
        @Override
        public void onStart(@NonNull LifecycleOwner owner) {
            DefaultLifecycleObserver.super.onStart(owner);
            Timber.tag("Lifecycle").e("App in foreground");
            isBackground = false;
            if (currentActivity instanceof LoginActivity) return;

            // Check token
            String token = appComponent.getRepository().getSharedPreferences().getToken();
            if (token.isEmpty() || token.equals("NULL") || token.equals("null")) return;
            // Verify token if from background to foreground
            verifyToken();
        }

        @Override
        public void onStop(@NonNull LifecycleOwner owner) {
            DefaultLifecycleObserver.super.onStop(owner);
            Timber.tag("Lifecycle").e("App in background");
            isBackground = true;
        }
    };

    private void startPing(){
        disposablePingSocket = ObservablePingSocket();
        compositeDisposable.add(disposablePingSocket);
    }

    public void stopPing(){
        if (disposablePingSocket == null) return;
        disposablePingSocket.dispose();
        compositeDisposable.remove(disposablePingSocket);
    }

    @SuppressLint("CheckResult")
    public void createSocket(String url){
        Timber.d(url);
        createScarletInstance(url);
        createKittyService();
        compositeDisposable.clear();
        observeWebSocketEvent();
    }


    void createScarletInstance(String url) {
        scarletInstance = new Scarlet.Builder().webSocketFactory(
                        newWebSocketFactory(new OkHttpClient.Builder()
                                .readTimeout(4000, TimeUnit.MILLISECONDS)
                                .writeTimeout(4000, TimeUnit.MILLISECONDS)
                                .addInterceptor(
                                        new HttpLoggingInterceptor().setLevel(
                                                HttpLoggingInterceptor.Level.BODY))
                                .build(), url))
                .lifecycle(AndroidLifecycle.ofApplicationForeground(this))
                .addMessageAdapterFactory(new GsonMessageAdapter.Factory())
                .addStreamAdapterFactory(new RxJava2StreamAdapterFactory())
                .backoffStrategy(new ExponentialWithJitterBackoffStrategy(10000L,15000L,new Random()))
                .build();
    }

    void createKittyService() {
        kittyService = scarletInstance.create(KittyService.class);
    }

    public void sendMessage(Message message){
        Timber.d(message.toString());
        kittyService.request(message);
        if (message.getCmd().equals(Command.COMMAND_CLIENT_PING)) return;
        lastMessage = message;
    }

    public void verifyToken() {
        disposableVerifyToken = ObserveVerifyToken();
        compositeDisposable.add(disposableVerifyToken);
    }

    public void observeWebSocketEvent() {
        Flowable<WebSocket.Event> share = kittyService.observeWebSocketEvent()
                .filter(o -> !(o instanceof WebSocket.Event.OnMessageReceived))
                .observeOn(Schedulers.io())
                .share();

        compositeDisposable.add(share.subscribe(o -> {
            Timber.d(o.toString());
            KittyRealtimeEvent kittyRealtimeEvent = (KittyRealtimeEvent) currentActivity;
            if (kittyRealtimeEvent == null) return;
            if (o instanceof WebSocket.Event.OnConnectionOpened) {
                Timber.tag("State-socket").d("OnConnectionOpened");
                kittyRealtimeEvent.onConnectionOpened();
                sendLastMessage();
                startPing();
            } else if (o instanceof WebSocket.Event.OnConnectionClosed) {
                Timber.tag("State-socket").d("OnConnectionClosed");
                kittyRealtimeEvent.onConnectionClosed();
                stopPing();
            } else if (o instanceof WebSocket.Event.OnConnectionClosing) {
                Timber.tag("State-socket").d("OnConnectionClosing");
                kittyRealtimeEvent.onConnectionClosing();
            } else if (o instanceof WebSocket.Event.OnConnectionFailed) {
                Timber.tag("State-socket").d("OnConnectionFailed");
                kittyRealtimeEvent.onConnectionFailed();
                stopPing();
            }
        }));

        compositeDisposable.add(kittyService.message()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(o -> {
                    KittyRealtimeEvent kittyRealtimeEvent = (KittyRealtimeEvent) currentActivity;
                    // Check if the message is lock device
                    if (kittyRealtimeEvent == null) return;
                    if (o != null && lastMessage != null && o.getCmd().equals(lastMessage.getCmd())) {
                        if (o.getSubCmd() != null && o.getSubCmd().equals(lastMessage.getSubCmd())) {
                            Timber.d("CLEAR LAST MESSAGE");
                            this.lastMessage = null;
                        }
                    }
                    if (o != null && Objects.equals(o.getCmd(), Command.COMMAND_CLIENT_PING)) {
                        // Check if the current activity is login activity
                        if (currentActivity != null && currentActivity instanceof LoginActivity)
                            return;
                        if (o.getResponseCode() == 400) {
                            currentActivity.runOnUiThread(this::lockDevice);
                        }
                        return;
                    }
                    if (o != null && Objects.equals(o.getCmd(), Command.COMMAND_LOCK_DEVICE)) {
                        // Check if the current activity is login activity
                        if (currentActivity != null && currentActivity instanceof LoginActivity)
                            return;
                        currentActivity.runOnUiThread(this::lockDevice);
                        return;
                    }
                    kittyRealtimeEvent.onMessageReceived(o);
                })
        );
    }

    private void sendLastMessage(){
        if (lastMessage != null) {
            sendMessage(lastMessage);
        }
    }

    @NonNull
    private Disposable ObservablePingSocket() {
        return Observable.interval(20, 40, TimeUnit.SECONDS)
                .observeOn(Schedulers.io())
                .subscribe(
                        o -> {
                            // Check token
                            String token = appComponent.getRepository().getSharedPreferences().getToken();
                            if (token != null && !token.isEmpty() && !token.equals("NULL") && !token.equals("null")) {
                                Message message = new Message();
                                message.setCmd(Command.COMMAND_CLIENT_PING);
                                message.setData(new App(Constants.APP));
                                message.setToken(appComponent.getRepository().getSharedPreferences().getToken());
                                kittyService.request(message);
                            }
                        },
                        Timber::e
                );
    }

    @NonNull
    private Disposable ObserveVerifyToken() {
        return appComponent.getRepository().getApiService()
                .getProfile()
                .subscribeOn(Schedulers.io())
                .observeOn(Schedulers.io())
                .subscribe(
                        response -> {
                            if (!response.isResult()) {
                                lockDevice();
                            }
                            compositeDisposable.remove(disposableVerifyToken);
                        },
                        throwable -> {
                            // Check if error is 'device not active'
                            lockDevice();
                            compositeDisposable.remove(disposableVerifyToken);
                        }
                );
    }

    public void lockDevice() {
        Timber.tag("LockDevice").e("Lock device");
        stopPing();
        Intent intent = new Intent(currentActivity, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        currentActivity.startActivity(intent);
        appComponent.getRepository().getSharedPreferences().setToken(null);
        currentActivity.finish();
    }

}
