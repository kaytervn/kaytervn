package com.finance.data.remote;


import com.finance.data.model.api.ResponseListObj;
import com.finance.data.model.api.ResponseStatus;
import com.finance.data.model.api.ResponseWrapper;
import com.finance.data.model.api.request.account.AccountEmail;
import com.finance.data.model.api.request.account.ChangePasswordRequest;
import com.finance.data.model.api.request.account.UpdateProfileRequest;
import com.finance.data.model.api.request.category.CategoryCreateRequest;
import com.finance.data.model.api.request.category.CategoryUpdateRequest;
import com.finance.data.model.api.request.chat.ChatRoomCreateGroupRequest;
import com.finance.data.model.api.request.chat.ChatRoomCreateRequest;
import com.finance.data.model.api.request.chat.ChatRoomUpdateRequest;
import com.finance.data.model.api.request.chat.MessageReactionRequest;
import com.finance.data.model.api.request.chat.MessageSendRequest;
import com.finance.data.model.api.request.chat.MessageUpdateRequest;
import com.finance.data.model.api.request.debit.DebitApproveRequest;
import com.finance.data.model.api.request.debit.DebitUpdateRequest;
import com.finance.data.model.api.request.department.DepartmentCreateRequest;
import com.finance.data.model.api.request.department.DepartmentUpdateRequest;
import com.finance.data.model.api.request.key.KeyCreateRequest;
import com.finance.data.model.api.request.key.KeyGroupCreateRequest;
import com.finance.data.model.api.request.key.KeyGroupUpdateRequest;
import com.finance.data.model.api.request.key.KeyUpdateRequest;
import com.finance.data.model.api.request.login.LoginRequest;
import com.finance.data.model.api.request.organization.OrganizationCreateRequest;
import com.finance.data.model.api.request.organization.OrganizationUpdateRequest;
import com.finance.data.model.api.request.payment_period.PaymentPeriodApproveRequest;
import com.finance.data.model.api.request.payment_period.PaymentPeriodRecalculateRequest;
import com.finance.data.model.api.request.privatekey.PrivateKeyRequest;
import com.finance.data.model.api.request.project.ProjectCreateRequest;
import com.finance.data.model.api.request.project.ProjectUpdateRequest;
import com.finance.data.model.api.request.service.ServiceCreateUpdateRequest;
import com.finance.data.model.api.request.service.group.GroupServiceCreateRequest;
import com.finance.data.model.api.request.service.group.GroupServiceUpdateRequest;
import com.finance.data.model.api.request.service.pay.ServicePayRequest;
import com.finance.data.model.api.request.service.schedule.ServiceScheduleUpdateRequest;
import com.finance.data.model.api.request.tag.TagCreateRequest;
import com.finance.data.model.api.request.tag.TagUpdateRequest;
import com.finance.data.model.api.request.task.TaskChangeStateRequest;
import com.finance.data.model.api.request.task.TaskCreateRequest;
import com.finance.data.model.api.request.task.TaskUpdateRequest;
import com.finance.data.model.api.request.transaction.TransactionApproveRequest;
import com.finance.data.model.api.request.transaction.TransactionCreateUpdateRequest;
import com.finance.data.model.api.request.transaction.TransactionRejectRequest;
import com.finance.data.model.api.request.transaction.TransactionRemoveRequest;
import com.finance.data.model.api.request.transaction.group.GroupTransactionCreateRequest;
import com.finance.data.model.api.request.transaction.group.GroupTransactionUpdateRequest;
import com.finance.data.model.api.response.account.AccountResponse;
import com.finance.data.model.api.response.account.AccountUserId;
import com.finance.data.model.api.response.chat.AutoCompleteAccountResponse;
import com.finance.data.model.api.response.chat.ChatRoomMemberResponse;
import com.finance.data.model.api.response.account.ResetPassword;
import com.finance.data.model.api.response.category.CateResponse;
import com.finance.data.model.api.response.category.CategoryResponse;
import com.finance.data.model.api.response.chat.ChatRoomResponse;
import com.finance.data.model.api.response.chat.MessageResponse;
import com.finance.data.model.api.response.chat.detail.ChatDetailResponse;
import com.finance.data.model.api.response.debit.DebitResponse;
import com.finance.data.model.api.response.department.DepartmentResponse;
import com.finance.data.model.api.response.key.KeyGroupResponse;
import com.finance.data.model.api.response.key.KeyResponse;
import com.finance.data.model.api.response.key.MyKeyResponse;
import com.finance.data.model.api.response.login.LoginResponse;
import com.finance.data.model.api.response.notification.NotificationId;
import com.finance.data.model.api.response.notification.NotificationResponse;
import com.finance.data.model.api.response.organization.OrganizationResponse;
import com.finance.data.model.api.response.project.ProjectResponse;
import com.finance.data.model.api.response.service.ServiceResponse;
import com.finance.data.model.api.response.service.group.ServiceGroupResponse;
import com.finance.data.model.api.response.service.schedule.ServiceScheduleResponse;
import com.finance.data.model.api.response.statistics.StatisticsResponse;
import com.finance.data.model.api.response.tag.TagResponse;
import com.finance.data.model.api.response.task.TaskResponse;
import com.finance.data.model.api.response.transaction.TransactionResponse;
import com.finance.data.model.api.response.transaction.group.TransactionGroupResponse;
import com.finance.ui.scanner.WebQRCodeRequest;

import io.reactivex.rxjava3.core.Observable;
import okhttp3.ResponseBody;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {
    //Login
    @POST("v1/account/login")
    @Headers({"BasicAuth: 1"})
    Observable<LoginResponse> login(@Body LoginRequest request);

    //Account
    @GET("v1/account/profile")
    Observable<ResponseWrapper<AccountResponse>> getProfile();
    //--Update profile
    @PUT("v1/account/update-profile-admin")
    Observable<ResponseStatus> updateProfile(@Body UpdateProfileRequest request);

    //Fragment Home
    //--Transaction
    @GET("v1/transaction/list?sortDate=2&isPaged=0&ignorePaymentPeriod=1")
    Observable<ResponseWrapper<ResponseListObj<TransactionResponse>>> getListTransactions(@Query("kind") Integer kind);
    //--Payment Period
    @GET("v1/transaction/list")
    Observable<ResponseWrapper<ResponseListObj<TransactionResponse>>> getListTransactionsByPaymentPeriodId(@Query("paymentPeriodId") Long paymentPeriodId,
                                                                                                                     @Query("kind") Integer kind,
                                                                                                                     @Query("sortDate") Integer sortDate,
                                                                                                                     @Query("ignorePaymentPeriod") Integer ignorePaymentPeriod,
                                                                                                                   @Query("isPaged") Integer isPaged
    );
    //--Get all category by kind
    @GET("v1/category/list")
    Observable<ResponseWrapper<ResponseListObj<CategoryResponse>>> getAllCategoryByKind(@Query("kind") Integer kind,
                                                                                        @Query("status") Integer status,
                                                                                        @Query("isPaged") Integer isPaged);

    //--Create Transaction
    @POST("/v1/transaction/create")
    Observable<ResponseStatus> createTransaction(@Body TransactionCreateUpdateRequest request);
    //--Update Transaction
    @PUT("/v1/transaction/update")
    Observable<ResponseStatus> updateTransaction(@Body TransactionCreateUpdateRequest request);
    //--Delete Transaction
    @DELETE("/v1/transaction/delete/{id}")
    Observable<ResponseStatus> deleteTransaction(@Path("id") Long id);
    @PUT("/v1/transaction/reject")
    Observable<ResponseStatus> rejectTransaction(@Body TransactionRejectRequest request);
    @PUT("/v1/transaction/remove-from-period")
    Observable<ResponseStatus> removeTransaction(@Body TransactionRemoveRequest request);

    @PUT("/v1/transaction/approve")
    Observable<ResponseStatus> approveTransaction(@Body TransactionApproveRequest request);

    //--Detail Transaction
    @GET("v1/transaction/get/{id}")
    Observable<ResponseWrapper<TransactionResponse>> getDetailTransaction(@Path("id") Long id);
    @GET("/v1/category/list?sort=createdDate,desc")
    Observable<ResponseWrapper<ResponseListObj<CateResponse>>> getCategories(@Query("page") Integer pageNumber,
                                                                             @Query("size") Integer pageSize,
                                                                             @Query("kind") Integer kind);
    @GET("/v1/category/get/{id}")
    Observable<ResponseWrapper<CateResponse>> getCategoryDetails(@Path("id") Long id);
    @POST("/v1/category/create")
    Observable<ResponseStatus> createCategory(@Body CategoryCreateRequest request);
    @PUT("/v1/category/update")
    Observable<ResponseStatus> updateCategory(@Body CategoryUpdateRequest request);
    @DELETE("/v1/category/delete/{id}")
    Observable<ResponseStatus> deleteCategory(@Path("id") Long id);

    @GET("/v1/department/list?sort=createdDate,desc")
    Observable<ResponseWrapper<ResponseListObj<DepartmentResponse>>> getDepartments(@Query("page") Integer pageNumber,
                                                                                    @Query("size") Integer pageSize);
    @GET("/v1/department/get/{id}")
    Observable<ResponseWrapper<DepartmentResponse>> getDepartmentDetails(@Path("id") Long id);
    @POST("/v1/department/create")
    Observable<ResponseStatus> createDepartment(@Body DepartmentCreateRequest request);
    @PUT("/v1/department/update")
    Observable<ResponseStatus> updateDepartment(@Body DepartmentUpdateRequest request);
    @DELETE("/v1/department/delete/{id}")
    Observable<ResponseStatus> deleteDepartment(@Path("id") Long id);
    @GET("/v1/key-information/list")
    Observable<ResponseWrapper<ResponseListObj<KeyResponse>>> getKeyInformation(@Query("page") Integer pageNumber,
                                                                                @Query("size") Integer pageSize,
                                                                                @Query("kind") Integer kind,
                                                                                @Query("keyInformationGroupId") Long keyInformationGroupId,
                                                                                @Query("organizationId") Long organizationId,
                                                                                @Query("tagId") Long tagId,
                                                                                @Query("isPaged") Integer isPaged);
    @GET("/v1/key-information/get/{id}")
    Observable<ResponseWrapper<KeyResponse>> getKeyDetails(@Path("id") Long id);
    @POST("/v1/key-information/create")
    Observable<ResponseStatus> createKey(@Body KeyCreateRequest request);
    @PUT("/v1/key-information/update")
    Observable<ResponseStatus> updateKey(@Body KeyUpdateRequest request);
    @DELETE("/v1/key-information/delete/{id}")
    Observable<ResponseStatus> deleteKey(@Path("id") Long id);
    @GET("/v1/key-information-group/list?sort=createdDate,desc")
    Observable<ResponseWrapper<ResponseListObj<KeyGroupResponse>>> getKeyGroupList(@Query("page") Integer pageNumber,
                                                                                   @Query("size") Integer pageSize);
    @GET("/v1/key-information-group/list?sort=createdDate,desc")
    Observable<ResponseWrapper<ResponseListObj<KeyGroupResponse>>> getKeyGroupList(@Query("isPaged") Integer isPaged);
    @GET("/v1/key-information-group/list")
    Observable<ResponseWrapper<ResponseListObj<KeyGroupResponse>>> getGroupKeys(@Query("page") Integer page,
                                                                                                  @Query("size") Integer size,
                                                                                                  @Query("isPaged") Integer isPaged,
                                                                                                  @Query("sort") String sort);
    //Group Transaction
    //--GET ALL
    @GET("/v1/transaction-group/list")
    Observable<ResponseWrapper<ResponseListObj<TransactionGroupResponse>>> getAllGroupTransaction(@Query("page") Integer page,
                                                                                                  @Query("size") Integer size,
                                                                                                  @Query("isPaged") Integer isPaged,
                                                                                                  @Query("sort") String sort
    );
    @GET("/v1/transaction-group/list?isPaged=0&sortDate=2")
    Observable<ResponseWrapper<ResponseListObj<TransactionGroupResponse>>> getAllGroupTransaction();
    //--CREATE
    @POST("/v1/transaction-group/create")
    Observable<ResponseStatus> createGroupTransaction(@Body GroupTransactionCreateRequest request);
    //--GET 1
    @GET("/v1/transaction-group/get/{id}")
    Observable<ResponseWrapper<TransactionGroupResponse>> getGroupTransactionDetail(@Path("id") Long id);
    //--UPDATE
    @PUT("/v1/transaction-group/update")
    Observable<ResponseStatus> updateGroupTransaction(@Body GroupTransactionUpdateRequest request);
    //--DELETE
    @DELETE("/v1/transaction-group/delete/{id}")
    Observable<ResponseStatus> deleteGroupTransaction(@Path("id") Long id);

    @GET("/v1/key-information-group/get/{id}")
    Observable<ResponseWrapper<KeyGroupResponse>> getGroupKey(@Path("id") Long id);
    @POST("/v1/key-information-group/create")
    Observable<ResponseStatus> createKeyGroup(@Body KeyGroupCreateRequest request);
    @PUT("/v1/key-information-group/update")
    Observable<ResponseStatus> updateKeyGroup(@Body KeyGroupUpdateRequest request);
    @DELETE("/v1/key-information-group/delete/{id}")
    Observable<ResponseStatus> deleteKeyGroup(@Path("id") Long id);

    //Service
    @GET("/v1/service/list?isPaged=0")
    Observable<ResponseWrapper<ResponseListObj<ServiceResponse>>> getAllServicesIsPaged(@Query("sortDate") Integer sort);
    //--CREATE
    @POST("/v1/service/create")
    Observable<ResponseStatus> createService(@Body ServiceCreateUpdateRequest request);
    //--GET 1
    @GET("/v1/service/get/{id}")
    Observable<ResponseWrapper<ServiceResponse>> getServiceDetail(@Path("id") Long id);
    //--UPDATE
    @PUT("/v1/service/update")
    Observable<ResponseStatus> updateService(@Body ServiceCreateUpdateRequest request);
    @PUT("/v1/service/resolve")
    Observable<ResponseStatus> payService(@Body ServicePayRequest request);
    //--DELETE
    @DELETE("/v1/service/delete/{id}")
    Observable<ResponseStatus> deleteService(@Path("id") Long id);

    @POST("/v1/account/request-key")
    Observable<ResponseBody> exportToExcelKey(@Body PrivateKeyRequest request);
    @GET("/v1/account/my-key")
    Observable<ResponseWrapper<MyKeyResponse>> getMyKey();

    //Group Service
    //--GET ALL
    @GET("/v1/service-group/list")
    Observable<ResponseWrapper<ResponseListObj<ServiceGroupResponse>>> getAllGroupService(@Query("page") Integer page,
                                                                                          @Query("size") Integer size,
                                                                                          @Query("sort") String sort);

    @GET("/v1/service-group/list")
    Observable<ResponseWrapper<ResponseListObj<ServiceGroupResponse>>> getAllGroupService(@Query("isPaged") Integer isPaged);
    
    //--CREATE
    @POST("/v1/service-group/create")
    Observable<ResponseStatus> createGroupService(@Body GroupServiceCreateRequest request);
    //--GET 1
    @GET("/v1/service-group/get/{id}")
    Observable<ResponseWrapper<ServiceGroupResponse>> getGroupServiceDetail(@Path("id") Long id);
    //--UPDATE
    @PUT("/v1/service-group/update")
    Observable<ResponseStatus> updateGroupService(@Body GroupServiceUpdateRequest request);
    //--DELETE
    @DELETE("/v1/service-group/delete/{id}")
    Observable<ResponseStatus> deleteGroupService(@Path("id") Long id);

    @GET("/v1/notification/my-notification")
    Observable<ResponseWrapper<ResponseListObj<NotificationResponse>>> getMyNotification(@Query("page") Integer pageNumber,
                                                                                     @Query("size") Integer pageSize);
    @PUT("/v1/notification/read-all")
    Observable<ResponseStatus> readAllNotification();
    @PUT("/v1/notification/read")
    Observable<ResponseStatus> readNotification(@Body NotificationId notificationId);

    @DELETE("/v1/notification/delete-all")
    Observable<ResponseStatus> deleteAllNotification();
    @DELETE("/v1/notification/delete/{id}")
    Observable<ResponseStatus> deleteNotification(@Path("id") Long id);

    @POST("/v1/account/request-forget-password")
    @Headers({"BasicAuth: 1"})
    Observable<ResponseWrapper<AccountUserId>> forgetPassword(@Body AccountEmail email);
    @POST("/v1/account/reset-password")
    @Headers({"BasicAuth: 1"})
    Observable<ResponseStatus> resetPassword(@Body ResetPassword resetPassword);

    @POST("/v1/account/change-profile-password")
    Observable<ResponseStatus> changePassword(@Body ChangePasswordRequest request);

    //Service Schedule
    @GET("v1/service-schedule/list")
    Observable<ResponseWrapper<ResponseListObj<ServiceScheduleResponse>>> getServiceSchedules(@Query("serviceId") Long serviceId);
    @PUT("v1/service-schedule/update")
    Observable<ResponseStatus> updateServiceSchedule(@Body ServiceScheduleUpdateRequest request);

    @GET("/v1/payment-period/list")
    Observable<ResponseWrapper<ResponseListObj<StatisticsResponse>>> getPaymentPeriodList(@Query("page") Integer page,
                                                                                        @Query("state") Integer state,
                                                                                          @Query("sortDate") Integer sortDate);
    @PUT("/v1/payment-period/approve")
    Observable<ResponseStatus> approvePaymentPeriod(@Body PaymentPeriodApproveRequest request);
    @PUT("/v1/payment-period/recalculate")
    Observable<ResponseStatus> recalculatePaymentPeriod(@Body PaymentPeriodRecalculateRequest request);

    //ORGANIZATION
    @GET("/v1/organization/get/{id}")
    Observable<ResponseWrapper<OrganizationResponse>> getOrganizationDetail(@Path("id") Long id);
    @GET("/v1/organization/list")
    Observable<ResponseWrapper<ResponseListObj<OrganizationResponse>>> getAllOrganization(@Query("page") Integer page,
                                                                                          @Query("size") Integer size,
                                                                                          @Query("isPaged") Integer isPaged,
                                                                                          @Query("sort") String sort);

    @GET("/v1/organization/list")
    Observable<ResponseWrapper<ResponseListObj<OrganizationResponse>>> getAllOrganization(@Query("isPaged") Integer isPaged,
                                                                                          @Query("sort") String sort);
    @POST("/v1/organization/create")
    Observable<ResponseStatus> createOrganization(@Body OrganizationCreateRequest request);
    @PUT("/v1/organization/update")
    Observable<ResponseStatus> updateOrganization(@Body OrganizationUpdateRequest request);
    @DELETE("/v1/organization/delete/{id}")
    Observable<ResponseStatus> deleteOrganization(@Path("id") Long id);


    //PROJECT
    @GET("/v1/project/get/{id}")
    Observable<ResponseWrapper<ProjectResponse>> getProjectDetail(@Path("id") Long id);
    @GET("/v1/project/list")
    Observable<ResponseWrapper<ResponseListObj<ProjectResponse>>> getAllProject(@Query("page") Integer page,
                                                                                          @Query("size") Integer size,
                                                                                          @Query("isPaged") Integer isPaged,
                                                                                          @Query("sort") String sort);
    @GET("/v1/project/list")
    Observable<ResponseWrapper<ResponseListObj<ProjectResponse>>> getAllProject(@Query("isPaged") Integer isPaged,
                                                                                @Query("sort") String sort);
    @GET("/v1/project/list?isPaged=0&sortDate=2")
    Observable<ResponseWrapper<ResponseListObj<ProjectResponse>>> getAllProject();

    @GET("/v1/project/list?sort=createdDate,desc")
    Observable<ResponseWrapper<ResponseListObj<ProjectResponse>>> getAllProject(@Query("isPaged") Integer isPaged);
    @POST("/v1/project/create")
    Observable<ResponseStatus> createProject(@Body ProjectCreateRequest request);
    @PUT("/v1/project/update")
    Observable<ResponseStatus> updateProject(@Body ProjectUpdateRequest request);
    @DELETE("/v1/project/delete/{id}")
    Observable<ResponseStatus> deleteProject(@Path("id") Long id);

    //Fragment Home
    //--Task
    @GET("v1/task/list?ignoreParent=1&sortDate=2")
    Observable<ResponseWrapper<ResponseListObj<TaskResponse>>> getTasks(@Query("projectId") Long projectId,
                                                                                @Query("organizationId") Long organizationId,
                                                                                @Query("isPaged") Integer isPaged
    );
    @GET("v1/task/list?ignoreParent=1&sortDate=2&isPaged=0")
    Observable<ResponseWrapper<ResponseListObj<TaskResponse>>> getTasks(@Query("projectId") Long projectId);
    @GET("v1/task/list?sortDate=2&isPaged=0")
    Observable<ResponseWrapper<ResponseListObj<TaskResponse>>> getSubtasks(@Query("parentId") Long parentId);
    @POST("/v1/task/create")
    Observable<ResponseStatus> createTask(@Body TaskCreateRequest request);
    @PUT("/v1/task/update")
    Observable<ResponseStatus> updateTask(@Body TaskUpdateRequest request);
    @DELETE("/v1/task/delete/{id}")
    Observable<ResponseStatus> deleteTask(@Path("id") Long id);
    @GET("v1/task/get/{id}")
    Observable<ResponseWrapper<TaskResponse>> getDetailTask(@Path("id") Long id);
    @PUT("/v1/task/change-state")
    Observable<ResponseStatus> changeStateTask(@Body TaskChangeStateRequest request);

    //Account
    @GET("v1/account/list?isPaged=0")
    Observable<ResponseWrapper<ResponseListObj<AccountResponse>>> getListAccounts();

    //Debit
    @GET("v1/debit/list?sortDate=2")
    Observable<ResponseWrapper<ResponseListObj<DebitResponse>>> getListDebits(@Query("isPaged") Integer isPaged);
    @DELETE("/v1/debit/delete/{id}")
    Observable<ResponseStatus> deleteDebit(@Path("id") Long id);
    @PUT("/v1/debit/approve")
    Observable<ResponseStatus> approveDebit(@Body DebitApproveRequest request);
    @GET("v1/debit/get/{id}")
    Observable<ResponseWrapper<DebitResponse>> getDetailDebit(@Path("id") Long id);
    @PUT("/v1/debit/update")
    Observable<ResponseStatus> updateDebit(@Body DebitUpdateRequest request);

    //Tags
    @GET("v1/tag/list?isPaged=0&sortDate=2")
    Observable<ResponseWrapper<ResponseListObj<TagResponse>>> getTags(@Query("kind") Integer kind);
    @GET("v1/tag/list?isPaged=0")
    Observable<ResponseWrapper<ResponseListObj<TagResponse>>> getTags();
    @POST("/v1/tag/create")
    Observable<ResponseStatus> createTag(@Body TagCreateRequest request);
    @PUT("/v1/tag/update")
    Observable<ResponseStatus> updateTag(@Body TagUpdateRequest request);
    @DELETE("/v1/tag/delete/{id}")
    Observable<ResponseStatus> deleteTag(@Path("id") Long id);
    @GET("v1/tag/get/{id}")
    Observable<ResponseWrapper<TagResponse>> getDetailTag(@Path("id") Long id);

    @POST("/v1/account/verify-login-qr-code")
    Observable<ResponseStatus> verifyQrcode(@Body WebQRCodeRequest request);

    @GET("v1/account/auto-complete?ignoreCurrentUser=1")
    Observable<ResponseWrapper<ResponseListObj<AutoCompleteAccountResponse>>> getListAutoCompleteAccount(@Query("ignoreDirectMessageChatRoom") Integer ignoreDirectMessageChatRoom);

    @GET("v1/chat-room/list?isPaged=0")
    Observable<ResponseWrapper<ResponseListObj<ChatRoomResponse>>> getChatRooms();

    @GET("v1/chat-room/get/{id}")
    Observable<ResponseWrapper<ChatRoomResponse>> getChatRoomDetail(@Path("id") Long id);
    @PUT("v1/chat-room/update")
    Observable<ResponseStatus> updateChatRoom(@Body ChatRoomUpdateRequest request);

    @POST("v1/chat-room/create-direct-message")
    Observable<ResponseStatus> createChat(@Body ChatRoomCreateRequest request);

    @POST("v1/chat-room/create-group")
    Observable<ResponseStatus> createGroupChat(@Body ChatRoomCreateGroupRequest request);

    @GET("v1/message/list")
    Observable<ResponseWrapper<ResponseListObj<ChatDetailResponse>>> getChatDetail(
            @Query("chatRoomId") Long chatRoomId,
            @Query("isPaged") int isPaged
    );

    @GET("v1/message/get/{id}")
    Observable<ResponseWrapper<ChatDetailResponse>> getMessageById(@Path("id") Long id);

    @POST("v1/message/create")
    Observable<ResponseStatus> createMessage(@Body MessageSendRequest request);


    @PUT("v1/message/update")
    Observable<ResponseStatus> updateMessage(@Body MessageUpdateRequest request);

    @DELETE("v1/message/delete/{id}")
    Observable<ResponseStatus> removeMessage(@Path("id") Long id);

    @POST("v1/message-reaction/react")
    Observable<ResponseStatus> reactMessage(@Body MessageReactionRequest request);

    @GET("v1/chat-room-member/list?isPaged=0")
    Observable<ResponseWrapper<ResponseListObj<ChatRoomMemberResponse>>> getChatRoomMembers(@Query("chatRoomId") Long chatRoomId);

    @DELETE("v1/chat-room-member/delete/{id}")
    Observable<ResponseStatus> deleteChatRoomMember(@Path("id") Long id);
}
