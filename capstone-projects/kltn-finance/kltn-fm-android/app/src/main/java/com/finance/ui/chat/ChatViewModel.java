package com.finance.ui.chat;

import androidx.databinding.ObservableField;
import androidx.lifecycle.MutableLiveData;

import com.finance.MVVMApplication;
import com.finance.R;
import com.finance.data.Repository;
import com.finance.data.model.api.ApiModelUtils;
import com.finance.data.model.api.request.chat.ChatRoomCreateGroupRequest;
import com.finance.data.model.api.request.chat.ChatRoomCreateRequest;
import com.finance.data.model.api.response.chat.AutoCompleteAccountResponse;
import com.finance.data.model.api.response.chat.ChatRoomResponse;
import com.finance.data.model.api.response.socket.MessageSocketData;
import com.finance.data.socket.Command;
import com.finance.data.socket.dto.Message;
import com.finance.ui.base.BaseViewModel;
import com.finance.ui.dialog.CreateGroupInfoDialog;
import com.finance.utils.NetworkUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.core.Observable;
import io.reactivex.rxjava3.core.ObservableSource;
import io.reactivex.rxjava3.functions.Function;
import io.reactivex.rxjava3.schedulers.Schedulers;
import timber.log.Timber;

public class ChatViewModel extends BaseViewModel {
    public ObservableField<Boolean> isValidKey = new ObservableField<>(false);
    public ObservableField<String> isSearchEmpty = new ObservableField<>("");

    public ObservableField<Boolean> isSearch = new ObservableField<>(false);
    public List<ChatRoomResponse> chatRoomList = new ArrayList<>();
    public MutableLiveData<List<ChatRoomResponse>> chatRoomLiveData = new MutableLiveData<>(new ArrayList<>());
    public MutableLiveData<List<AutoCompleteAccountResponse>> membersLiveData = new MutableLiveData<>(new ArrayList<>());
    public List<AutoCompleteAccountResponse> listMembers = new ArrayList<>();
    public List<String> listPeoples = new ArrayList<>();
    public ObservableField<String> avatarPath = new ObservableField<>("");
    public Boolean firstLoad = true;

    public ChatViewModel(Repository repository, MVVMApplication application) {
        super(repository, application);
    }

    public void isShowSearch() {
        isSearch.set(Boolean.FALSE.equals(isSearch.get()));
    }

    public void getAllChatRooms(){
        if (firstLoad) {
            showLoading();
            firstLoad = false;
        }
        compositeDisposable.add(repository.getApiService().getChatRooms()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            if (response.isResult()) {
                                chatRoomLiveData.setValue(response.getData().getContent());
                            }
                        }, throwable -> {
                            hideLoading();
                            Timber.tag("Chataactiiwqdq").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void getMembers(Integer isGroup){
        compositeDisposable.add(repository.getApiService().getListAutoCompleteAccount(isGroup)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            if (response.isResult()) {
                                membersLiveData.setValue(response.getData().getContent());
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            Timber.tag("Chataactiiwqdq").e(throwable);
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createChat(ChatRoomCreateRequest request, CreateGroupInfoDialog dialog){
        compositeDisposable.add(repository.getApiService().createChat(request)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            if (response.isResult()) {
                                if (dialog != null) {
                                    dialog.dismiss();
                                }
                                showSuccessMessage(application.getResources().getString(R.string.create_chat_success));
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    public void createGroupChat(ChatRoomCreateGroupRequest request, CreateGroupInfoDialog dialog){
        compositeDisposable.add(repository.getApiService().createGroupChat(request)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .retryWhen(throwable ->
                        throwable.flatMap((Function<Throwable, ObservableSource<?>>) throwable1 -> {
                            if (NetworkUtils.checkNetworkError(throwable1)) {
                                hideLoading();
                                return application.showDialogNoInternetAccess();
                            }else{
                                return Observable.error(throwable1);
                            }
                        })
                )
                .subscribe(
                        response -> {
                            if (response.isResult()) {
                                if (dialog != null) {
                                    dialog.dismiss();
                                }
                                showSuccessMessage(application.getResources().getString(R.string.create_chat_success));
                            }
                            hideLoading();
                        }, throwable -> {
                            hideLoading();
                            showErrorMessage(application.getResources().getString(R.string.no_internet));
                        }
                ));
    }

    @Override
    public void messageReceived(Message message) {
        super.messageReceived(message);
        if(message != null && message.getResponseCode() == 200) {
            switch (message.getCmd()) {
                case Command.COMMAND_CLIENT_PING:
                case Command.COMMAND_CLIENT_INFO:
                    break;
                case Command.CMD_NEW_MESSAGE:
                case Command.CMD_MESSAGE_UPDATED:
                case Command.CMD_CHAT_ROOM_CREATED:
                case Command.CMD_CHAT_ROOM_UPDATED:
                case Command.CMD_CHAT_ROOM_DELETED:
                    getAllChatRooms();
                    break;

            }
        }else if(message != null && message.getResponseCode() == 400){
            switch (message.getCmd()) {
                case Command.CMD_MESSAGE_UPDATED:
            }
        }else {
        }
    }

}
