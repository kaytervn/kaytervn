package com.finance.ui.chat.detail;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.RelativeLayout;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.finance.BR;
import com.finance.R;
import com.finance.constant.Constants;
import com.finance.data.model.api.request.chat.ChatRoomUpdateRequest;
import com.finance.data.model.api.request.chat.MessageReactionRequest;
import com.finance.data.model.api.request.chat.MessageSendRequest;
import com.finance.data.model.api.request.chat.MessageUpdateRequest;
import com.finance.data.model.api.response.chat.MessageReaction;
import com.finance.data.model.api.response.chat.detail.ChatDetailResponse;
import com.finance.data.model.api.response.document.DocumentResponse;
import com.finance.databinding.ActivityChatDetailBinding;
import com.finance.di.component.ActivityComponent;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.chat.adapter.MessageAdapter;
import com.finance.ui.chat.adapter.MessageSearchAdapter;
import com.finance.ui.dialog.EditMessageDialog;
import com.finance.ui.dialog.ListReactionsDialog;
import com.finance.ui.dialog.MemberListDialog;
import com.finance.ui.dialog.MessageOptionsDialog;
import com.finance.ui.dialog.RemoveMessageDialog;
import com.finance.ui.dialog.UpdateGroupInfoDialog;
import com.finance.ui.image.ImageActivity;
import com.finance.utils.BindingUtils;
import com.finance.utils.FileUtils;
import com.finance.utils.PdfDownloaderUtils;
import com.finance.utils.RealPathUtil;
import com.github.dhaval2404.imagepicker.ImagePicker;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;

import okhttp3.MultipartBody;
import timber.log.Timber;

public class ChatDetailActivity  extends BaseActivity<ActivityChatDetailBinding, ChatDetailViewModel> {

    private MessageAdapter adapter;
    private MessageSearchAdapter searchAdapter;
    public static Long CHAT_ROOM_ID = -999L;

    @Override
    public int getLayoutId() {
        return R.layout.activity_chat_detail;
    }

    @Override
    public int getBindingVariable() {
        return BR.vm;
    }

    @Override
    public void performDependencyInjection(ActivityComponent buildComponent) {
        buildComponent.inject(this);
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewModel.showLoading();
        viewModel.getChatRoomDetail(CHAT_ROOM_ID);
        viewModel.getChatDetail(CHAT_ROOM_ID);
        setupAdapter();
        setupSearchAdapter();
        setupSearch();
        observeMessages();
        setupScrollToEndButton();
        viewModel.editTextSend.addOnPropertyChangedCallback(new androidx.databinding.Observable.OnPropertyChangedCallback() {
            @Override
            public void onPropertyChanged(androidx.databinding.Observable sender, int propertyId) {
                if (viewModel.editTextSend.get() != null && !viewModel.editTextSend.get().isEmpty()) {
                    viewModel.isTyping.set(true);
                } else  {
                    viewModel.isTyping.set(false);
                }
            }
        });

        viewBinding.buttonSend.setOnClickListener(v -> {
            try {
                sendMessage();
            } catch (Exception e) {
                Timber.e(e, "Error sending message");
            }
        });


        viewModel.filePathEditImage.observe(this, filePath -> {
            if (filePath != null && !filePath.isEmpty()) {
                viewModel.avatarGroupUpdate.set(filePath);
            } else {
                viewModel.avatarGroupUpdate.set("");
            }
        });

        getDocumentAfterUpload();

        viewModel.membersLiveData.observe(this, members -> {
            if (members != null && !members.isEmpty()) {
                viewModel.listMemberAdds.clear();
                viewModel.listMemberAdds.addAll(members);
                viewModel.isEditingGroup = true;
                dialog = new MemberListDialog(
                        this,
                        viewModel.listMemberAdds,
                        viewModel.chatRoomCurrent.get().getIsOwner(),
                        new MemberListDialog.OnDialogActionListener() {
                            @Override
                            public void onAddMemberClicked() {
//                        viewModel.getMembers(1);
                            }

                            @Override
                            public void onMemberDeleted(Long id) {
                                viewModel.removeMember(id);
                                dialog.dismiss();
                            }
                        }
                );
                dialog.setOnDismissListener(dialogInterface -> {
                    viewModel.isEditingGroup = false;
                });
                dialog.show();
            }
        });

        viewModel.messageLiveDataAdd.observe(this, messageResponse -> {
            if (messageResponse != null && messageResponse.getId() != null) {
                addMessage(messageResponse);
            }
        });

        viewModel.messageLiveDataUpdate.observe(this, messageResponse -> {
            if (messageResponse != null && messageResponse.getId() != null) {
                messageResponse.setDocument(decrypt(messageResponse.getDocument()));
                messageResponse.setContent(decrypt(messageResponse.getContent()));
                boolean haveId = false;
                for (int i = 0; i < viewModel.listMessages.size(); i++) {
                    ChatDetailResponse message = viewModel.listMessages.get(i);
                    if (message.getId().equals(messageResponse.getId())) {
                        messageResponse.setContent(messageResponse.getContent());
                        messageResponse.setDocument(messageResponse.getDocument());
                        haveId = true;
                        adapter.updateMessage(i, messageResponse);
                        break;
                    }
                }
                if (!haveId) {
                    messageResponse.setPositionInChat(viewModel.listMessages.size());
                    adapter.addMessage(messageResponse);
                }
            }
        });
    }

    private void addMessage(ChatDetailResponse messageResponse) {
        messageResponse.setDocument(decrypt(messageResponse.getDocument()));
        messageResponse.setContent(decrypt(messageResponse.getContent()));
        messageResponse.setPositionInChat(viewModel.listMessages.size());
        boolean isAtBottom = isAtLastPosition();
        adapter.addMessage(messageResponse);
        if (isAtBottom || viewModel.isSending.get()) {
            viewBinding.buttonScrollToEnd.setVisibility(View.GONE);
            scrollToPosition(0);
        } else {
            viewBinding.buttonScrollToEnd.setVisibility(View.VISIBLE);
        }
        viewModel.editTextSend.set("");
        viewModel.isSending.set(false);
    }

    private boolean isAtLastPosition() {
        LinearLayoutManager layoutManager = (LinearLayoutManager) viewBinding.rcvMessage.getLayoutManager();
        if (layoutManager != null) {
            int firstVisiblePosition = layoutManager.findFirstCompletelyVisibleItemPosition();
            return firstVisiblePosition <= 2;
        }
        return false;
    }

    private void setupScrollToEndButton() {
        viewBinding.buttonScrollToEnd.setOnClickListener(v -> {
            scrollToPosition(0);
            viewBinding.buttonScrollToEnd.setVisibility(View.GONE);
        });

        // Thêm scroll listener để tự động ẩn/hiện button
        viewBinding.rcvMessage.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);

                if (isAtLastPosition()) {
                    viewBinding.buttonScrollToEnd.setVisibility(View.GONE);
                } else {
                    // Chỉ hiện button khi có tin nhắn mới và không ở cuối
                    if (viewBinding.buttonScrollToEnd.getVisibility() == View.VISIBLE) {
                        viewBinding.buttonScrollToEnd.setVisibility(View.VISIBLE);
                    }
                }
            }
        });
    }

    @SuppressLint("NotifyDataSetChanged")
    private void observeMessages() {
        viewModel.chatDetailLiveData.observe(this, listChatDetailResponses -> {
            if (listChatDetailResponses != null) {
                if (listChatDetailResponses.isEmpty()) {
                    return;
                }
                viewModel.listMessages.clear();
                for (int i = 0; i < listChatDetailResponses.size(); i++) {
                    ChatDetailResponse message = listChatDetailResponses.get(i);
                    message.setPositionInChat(i);
                    message.setDocument(decrypt(message.getDocument()));
                    message.setContent(decrypt(message.getContent()));
                    viewModel.listMessages.add(message);
                }
                adapter.setMessages(viewModel.listMessages);
            }
        });
    }

    private void setupAdapter() {
        adapter = new MessageAdapter(new ArrayList<>(), new MessageAdapter.OnMessageClickListener() {
            @Override
            public void onMessageLongClick(ChatDetailResponse message, int position) {
                MessageOptionsDialog dialog = new MessageOptionsDialog(
                        ChatDetailActivity.this,
                        message,
                        position,
                        new MessageOptionsDialog.MessageOptionsListener() {
                            @Override
                            public void onEmojiSelected(String emoji, ChatDetailResponse message, int position) {
                                MessageReactionRequest reactionRequest = new MessageReactionRequest();
                                reactionRequest.setMessageId(message.getId());
                                switch (emoji) {
                                    case MessageReaction.EMOJI_KIND_1:
                                        reactionRequest.setKind(1);
                                        break;
                                    case MessageReaction.EMOJI_KIND_2:
                                        reactionRequest.setKind(2);
                                        break;
                                    case MessageReaction.EMOJI_KIND_3:
                                        reactionRequest.setKind(3);
                                        break;
                                    case MessageReaction.EMOJI_KIND_4:
                                        reactionRequest.setKind(4);
                                        break;
                                    case MessageReaction.EMOJI_KIND_5:
                                        reactionRequest.setKind(5);
                                        break;
                                    default:
                                        reactionRequest.setKind(0);
                                }
                                viewModel.reactMessage(reactionRequest);
                            }

                            @Override
                            public void onEditMessage(ChatDetailResponse message, int position) {
                                showEditMessageDialog(message, position);
                            }

                            @Override
                            public void onRecallMessage(ChatDetailResponse message, int position) {
                                showRecallConfirmDialog(message, position);
                            }
                        }
                );
                dialog.show();
            }

            @Override
            public void onReactionClick(List<MessageReaction> reactions, MessageReaction reaction) {
                ListReactionsDialog dialog = new ListReactionsDialog(
                        ChatDetailActivity.this,
                        reactions
                );
                dialog.show();
            }

            @Override
            public void onDocumentClick(DocumentResponse document, int position) {
                if (document.isImageFile()) {
                    Intent intent = new Intent(ChatDetailActivity.this, ImageActivity.class);
                    intent.putExtra(Constants.IMAGE_URL, document.getUrl());
                    intent.putExtra(Constants.IMAGE_NAME, document.getName());
                    ChatDetailActivity.this.startActivity(intent);
                } else if (document.isPdfFile()) {
                    viewModel.showLoading();
                    PdfDownloaderUtils downloader = new PdfDownloaderUtils(ChatDetailActivity.this, BindingUtils.getImageUrl(document.getUrl()));
                    downloader.downloadPdf(document.getName());
                    downloader.registerDownloadCompleteReceiver(new BroadcastReceiver() {
                        @Override
                        public void onReceive(Context context, Intent intent) {
                            downloader.download(context, intent);
                            viewModel.hideLoading();
                        }
                    });
                } else {
                    Toast.makeText(ChatDetailActivity.this, R.string.unsupported_file_type, Toast.LENGTH_SHORT).show();

                }
            }
        });
        viewBinding.rcvMessage.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, true));
        viewBinding.rcvMessage.setAdapter(adapter);
    }

    private void setupSearchAdapter() {
        searchAdapter = new MessageSearchAdapter(new ArrayList<>(), new MessageSearchAdapter.OnMessageSearchClickListener() {
            @Override
            public void onMessageSearchClick(ChatDetailResponse message) {
                hideKeyboard();
                viewModel.isShowSearch();
                scrollToPosition(message.getPositionInChat());
            }
        });
        viewBinding.rcvMessageSearch.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false));
        viewBinding.rcvMessageSearch.setAdapter(searchAdapter);
    }

    private void showEditMessageDialog(ChatDetailResponse message, int position) {
        EditMessageDialog dialog = new EditMessageDialog(this, message, position, new EditMessageDialog.OnEditMessageListener() {
            @Override
            public void onMessageEdited(String newContent, ChatDetailResponse message, int position) {
                MessageUpdateRequest messageSendRequest = new MessageUpdateRequest();
                messageSendRequest.setId(message.getId());
                messageSendRequest.setContent(encrypt(newContent));
                messageSendRequest.setDocument(message.getDocument());
                viewModel.editMessage(messageSendRequest);
            }

            @Override
            public void onMessageUploaded(ChatDetailResponse message, int position) {

            }
        });
        dialog.show();
    }

    private void showRecallConfirmDialog(ChatDetailResponse message, int position) {
        RemoveMessageDialog dialog = new RemoveMessageDialog(
                "",
                new RemoveMessageDialog.DeleteListener() {
                    @Override
                    public void confirmDelete() {
                        viewModel.removeMessage(message.getId());
                    }

                    @Override
                    public void cancelDelete() {
                        // Do nothing
                    }
                }
        );
        dialog.show(getSupportFragmentManager(), "RemoveMessageDialog");
    }

    public void deleteEditSearch(){
        viewBinding.edtSearch.setText("");
    }

    public void sendMessage() throws Exception {
        viewModel.isSending.set(true);
        String content = encrypt(viewModel.editTextSend.get());
        String document = encrypt(viewModel.documentSend.get());
        MessageSendRequest messageSendRequest = new MessageSendRequest(CHAT_ROOM_ID, content, document);
        viewModel.sendMessage(messageSendRequest);
    }

    @Override
    protected void onDestroy() {
        CHAT_ROOM_ID = null;
        super.onDestroy();
    }

    @SuppressLint("NotifyDataSetChanged")
    public void setMessagesSearch(String searchText) {
        if (viewModel.listMessages == null || viewModel.listMessages.isEmpty()) {
            searchAdapter.setMessages(new ArrayList<>());
            searchAdapter.notifyDataSetChanged();
            return;
        }
        List<ChatDetailResponse> messageFilters = new ArrayList<>();
        for (int i = 0; i < viewModel.listMessages.size(); i++) {
            ChatDetailResponse message = viewModel.listMessages.get(i);
            if (message.getContent() != null && message.getContent().toLowerCase().contains(searchText.toLowerCase())) {
                messageFilters.add(message);
            }
        }
        searchAdapter.setMessages(messageFilters);
        searchAdapter.notifyDataSetChanged();
    }

    private void setupSearch() {
        viewBinding.edtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @SuppressLint("NotifyDataSetChanged")
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                String editSearch = viewBinding.edtSearch.getText().toString();
                viewModel.isSearchEmpty.set(editSearch);
                setMessagesSearch(editSearch);
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
    }

    public void scrollToPosition(int position) {
        if (viewBinding.rcvMessage.getLayoutManager() != null) {
            viewBinding.rcvMessage.getLayoutManager().scrollToPosition(position);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == Constants.STORAGE_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openGallery();
            } else {
                Toast.makeText(this, R.string.not_permission_gallery, Toast.LENGTH_SHORT).show();
            }
        } else if (requestCode == Constants.CAMERA_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openCamera();
            } else {
                Toast.makeText(this, R.string.not_permission_camera, Toast.LENGTH_SHORT).show();
            }
        }
    }

    public void showDialogChooseFile() {
        Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_file_picker);
        Window window = dialog.getWindow();
        if (window == null) {
            return;
        }
        window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));
        WindowManager.LayoutParams windowAttributes = window.getAttributes();
        windowAttributes.gravity  = android.view.Gravity.CENTER;
        window.setAttributes(windowAttributes);
        RelativeLayout btnGallery = dialog.findViewById(R.id.btn_galery);
        RelativeLayout btnCamera = dialog.findViewById(R.id.btn_camera);
        btnGallery.setOnClickListener(v -> {
            // Gallery option clicked
            dialog.dismiss();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES)
                        != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(this,
                            new String[]{Manifest.permission.READ_MEDIA_IMAGES}, Constants.STORAGE_REQUEST);
                } else {
                    openGallery();
                }
            } else {
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(this,
                            new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, Constants.STORAGE_REQUEST);
                } else {
                    openGallery();
                }
            }

        });
        btnCamera.setOnClickListener(v -> {
            // Camera option clicked
            dialog.dismiss();
            if (ContextCompat.checkSelfPermission(ChatDetailActivity.this, Manifest.permission.CAMERA)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(ChatDetailActivity.this,
                        new String[]{Manifest.permission.CAMERA}, Constants.CAMERA_REQUEST);
            } else {
                openCamera();
            }
        });
        dialog.show();
    }

    private void openGallery() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");
        String[] mimeTypes = {
                "application/pdf",
                "image/*"};
        if (viewModel.isEditingGroup) {
            mimeTypes = new String[]{
                    "image/*"
            };
        }
        intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
        activityResultLauncher.launch(intent);
    }
    private final ActivityResultLauncher<Intent> activityResultLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    Uri selectedImageUri = result.getData().getData();
                    String filePath = FileUtils.getFileFromUri(selectedImageUri, this);
                    //Get file name and type
                    String filename = filePath.substring(filePath.lastIndexOf("/") + 1);
                    //Pass them to current document
                    viewModel.currentDocument = new DocumentResponse();
                    viewModel.currentDocument.setName(filename);
                    MultipartBody.Part imagePart = FileUtils.filePathToMultipartBodyPart(filePath, "file");
                    //Call API to upload image
                    viewModel.doUploadFile(imagePart);
                }
            });

    private void openCamera() {
        ImagePicker.with(ChatDetailActivity.this)
                .cameraOnly()
                .cropSquare()
                .start();
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ImagePicker.REQUEST_CODE) {
            if (resultCode == RESULT_OK && data != null) {
                Uri selectedImageUri = data.getData();
                viewModel.currentDocument = new DocumentResponse();
                String filePath = RealPathUtil.getRealPath(this, selectedImageUri);
                String filename = filePath.substring(filePath.lastIndexOf("/") + 1);
                viewModel.currentDocument.setName(filename);
                MultipartBody.Part imagePart = FileUtils.uriToMultipartBodyPart(selectedImageUri, "file", this);
                viewModel.doUploadFile(imagePart);
            }
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    private void getDocumentAfterUpload() {
        viewModel.filePathDocuments.observe(this, filePath -> {
            if (filePath !=null && !filePath.isEmpty()){
                viewModel.currentDocument.setUrl(filePath);
                viewModel.documentSend.set(filePath);
                viewModel.documentSend.set(encrypt(filePath));
                List<DocumentResponse> listDocument = new ArrayList<>();
                listDocument.add(viewModel.currentDocument);
                Gson gson = new Gson();
                String json = gson.toJson(listDocument);
                MessageSendRequest messageSendRequest = new MessageSendRequest(
                        viewModel.chatRoomCurrent.get().getId(),
                        encrypt(json)
                );
                viewModel.sendMessage(messageSendRequest);
            }
        });
    }

    public void showDialogUpdateDialog() {
        viewModel.isEditingGroup = true;
        UpdateGroupInfoDialog dialog = new UpdateGroupInfoDialog(
                this,
                viewModel.chatRoomCurrent.get(),
                viewModel.avatarGroupUpdate,
                new UpdateGroupInfoDialog.UpdateGroupInfoListener() {
                    @Override
                    public void onUpdateGroupInfo(ChatRoomUpdateRequest request) {
                        if (viewModel.avatarGroupUpdate != null && !viewModel.avatarGroupUpdate.get().isEmpty()) {
                            request.setAvatar(viewModel.avatarGroupUpdate.get());
                        } else {
                            request.setAvatar(viewModel.chatRoomCurrent.get().getAvatar());
                        }
                        viewModel.isEditingGroup = false;
                        viewModel.updateChatRoom(request);
                    }

                    @Override
                    public void onSelectGroupImage() {
                        showDialogChooseFile();
                    }
                }
        );
        dialog.setOnDismissListener(dialogInterface -> {
            viewModel.isEditingGroup = false;
        });
        dialog.show();
    }

    MemberListDialog dialog;
    public void showDialogAddMember() {
        viewModel.getChatRoomMembers();

    }


    @Override
    public void onConnectionOpened() {
        super.onConnectionOpened();
        viewModel.getChatDetail(CHAT_ROOM_ID);
    }

    @Override
    public void onBackPressed() {
        if (Boolean.TRUE.equals(viewModel.isSearch.get())){
            hideKeyboard();
            viewModel.isShowSearch();
            deleteEditSearch();
        } else {
            setResult(RESULT_OK);
            super.onBackPressed();
        }
    }
}
