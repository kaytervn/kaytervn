package com.finance.di.module;

import android.content.Context;

import androidx.core.util.Supplier;
import androidx.lifecycle.ViewModelProvider;

import com.finance.MVVMApplication;
import com.finance.ViewModelProviderFactory;
import com.finance.data.Repository;
import com.finance.di.scope.ActivityScope;
import com.finance.ui.base.BaseActivity;
import com.finance.ui.category.CategoryViewModel;
import com.finance.ui.category.details.CategoryDetailsViewModel;
import com.finance.ui.chat.ChatViewModel;
import com.finance.ui.chat.detail.ChatDetailViewModel;
import com.finance.ui.debit.DebitViewModel;
import com.finance.ui.debit.detail.DebitDetailViewModel;
import com.finance.ui.debit.update.DebitUpdateViewModel;
import com.finance.ui.department.DepartmentViewModel;
import com.finance.ui.department.details.DepartmentDetailsViewModel;
import com.finance.ui.document.DocumentViewModel;
import com.finance.ui.fragment.statistics.detail.StatisticsDetailViewModel;
import com.finance.ui.image.ImageViewModel;
import com.finance.ui.key.filter.KeyFilterViewModel;
import com.finance.ui.key.group.KeyGroupViewModel;
import com.finance.ui.nofication.NotificationViewModel;
import com.finance.ui.organization.OrganizationViewModel;
import com.finance.ui.organization.detail.OrganizationDetailViewModel;
import com.finance.ui.password.change.ChangePasswordViewModel;
import com.finance.ui.password.forget.ForgetPasswordViewModel;
import com.finance.ui.password.reset.ResetPasswordViewModel;
import com.finance.ui.project.ProjectViewModel;
import com.finance.ui.project.detail.ProjectDetailViewModel;
import com.finance.ui.service.group.ServiceGroupViewModel;
import com.finance.ui.service.group.detail.ServiceGroupDetailViewModel;
import com.finance.ui.service.schedule.ServiceScheduleViewModel;
import com.finance.ui.subtask.SubTaskViewModel;
import com.finance.ui.tag.TagViewModel;
import com.finance.ui.tag.detail.TagDetailViewModel;
import com.finance.ui.task.TaskViewModel;
import com.finance.ui.task.create_or_update.TaskCreateUpdateViewModel;
import com.finance.ui.task.detail.TaskDetailViewModel;
import com.finance.ui.task.filter.TaskFilterViewModel;
import com.finance.ui.transaction.create_or_update.TransactionCreateUpdateViewModel;
import com.finance.ui.transaction.detail.TransactionDetailViewModel;
import com.finance.ui.transaction.group.TransactionGroupViewModel;
import com.finance.ui.fragment.account.update.UpdateProfileViewModel;
import com.finance.ui.key.infor.KeyInfoViewModel;
import com.finance.ui.key.details.KeyDetailsViewModel;
import com.finance.ui.transaction.group.detail.TransactionGroupDetailViewModel;
import com.finance.ui.key.group.details.KeyGroupDetailsViewModel;
import com.finance.ui.login.LoginViewModel;
import com.finance.ui.main.MainViewModel;
import com.finance.ui.service.ServiceViewModel;
import com.finance.ui.service.detail.ServiceDetailViewModel;


import javax.inject.Named;

import dagger.Module;
import dagger.Provides;

@Module
public class ActivityModule {
    private final BaseActivity<?, ?> activity;

    public ActivityModule(BaseActivity<?, ?> activity) {
        this.activity = activity;
    }
    @Named("access_token")
    @Provides
    @ActivityScope
    String provideToken(Repository repository){
        return repository.getToken();
    }

    @Provides
    @ActivityScope
    MainViewModel provideMainViewModel(Repository repository, Context application) {
        Supplier<MainViewModel> supplier = () -> new MainViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<MainViewModel> factory = new ViewModelProviderFactory<>(MainViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(MainViewModel.class);
    }

    @Provides
    @ActivityScope
    LoginViewModel provideSignInViewModel(Repository repository, Context application) {
        Supplier<LoginViewModel> supplier = () -> new LoginViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<LoginViewModel> factory = new ViewModelProviderFactory<>(LoginViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(LoginViewModel.class);
    }



    @Provides
    @ActivityScope
    UpdateProfileViewModel provideUpdateAccountViewModel(Repository repository, Context application) {
        Supplier<UpdateProfileViewModel> supplier = () -> new UpdateProfileViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<UpdateProfileViewModel> factory = new ViewModelProviderFactory<>(UpdateProfileViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(UpdateProfileViewModel.class);
    }

    @Provides
    @ActivityScope
    StatisticsDetailViewModel provideDetailStatisticsViewModel(Repository repository, Context application) {
        Supplier<StatisticsDetailViewModel> supplier = () -> new StatisticsDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<StatisticsDetailViewModel> factory = new ViewModelProviderFactory<>(StatisticsDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(StatisticsDetailViewModel.class);
    }

    @Provides
    @ActivityScope
    TransactionDetailViewModel provideDetailTransactionViewModel(Repository repository, Context application) {
        Supplier<TransactionDetailViewModel> supplier = () -> new TransactionDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TransactionDetailViewModel> factory = new ViewModelProviderFactory<>(TransactionDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TransactionDetailViewModel.class);
    }

    @Provides
    @ActivityScope
    TransactionCreateUpdateViewModel provideCreateTransactionViewModel(Repository repository, Context application) {
        Supplier<TransactionCreateUpdateViewModel> supplier = () -> new TransactionCreateUpdateViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TransactionCreateUpdateViewModel> factory = new ViewModelProviderFactory<>(TransactionCreateUpdateViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TransactionCreateUpdateViewModel.class);
    }

    @Provides
    @ActivityScope
    CategoryViewModel provideCategoryViewModel(Repository repository, Context application) {
        Supplier<CategoryViewModel> supplier = () -> new CategoryViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<CategoryViewModel> factory = new ViewModelProviderFactory<>(CategoryViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(CategoryViewModel.class);
    }
    @Provides
    @ActivityScope
    CategoryDetailsViewModel provideCategoryDetailsViewModel(Repository repository, Context application) {
        Supplier<CategoryDetailsViewModel> supplier = () -> new CategoryDetailsViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<CategoryDetailsViewModel> factory = new ViewModelProviderFactory<>(CategoryDetailsViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(CategoryDetailsViewModel.class);
    }

    @Provides
    @ActivityScope
    DepartmentViewModel provideDepartmentViewModel(Repository repository, Context application) {
        Supplier<DepartmentViewModel> supplier = () -> new DepartmentViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<DepartmentViewModel> factory = new ViewModelProviderFactory<>(DepartmentViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(DepartmentViewModel.class);
    }

    @Provides
    @ActivityScope
    DepartmentDetailsViewModel provideDepartmentDetailsViewModel(Repository repository, Context application) {
        Supplier<DepartmentDetailsViewModel> supplier = () -> new DepartmentDetailsViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<DepartmentDetailsViewModel> factory = new ViewModelProviderFactory<>(DepartmentDetailsViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(DepartmentDetailsViewModel.class);
    }

    @Provides
    @ActivityScope
    TransactionGroupViewModel provideGroupTransactionViewModel(Repository repository, Context application) {
        Supplier<TransactionGroupViewModel> supplier = () -> new TransactionGroupViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TransactionGroupViewModel> factory = new ViewModelProviderFactory<>(TransactionGroupViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TransactionGroupViewModel.class);
    }
    @Provides
    @ActivityScope
    TransactionGroupDetailViewModel provideGroupTransactionDetailViewModel(Repository repository, Context application) {
        Supplier<TransactionGroupDetailViewModel> supplier = () -> new TransactionGroupDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TransactionGroupDetailViewModel> factory = new ViewModelProviderFactory<>(TransactionGroupDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TransactionGroupDetailViewModel.class);
    }

    @Provides
    @ActivityScope
    KeyDetailsViewModel provideKeyDetailsViewModel(Repository repository, Context application) {
        Supplier<KeyDetailsViewModel> supplier = () -> new KeyDetailsViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<KeyDetailsViewModel> factory = new ViewModelProviderFactory<>(KeyDetailsViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(KeyDetailsViewModel.class);
    }

    @Provides
    @ActivityScope
    KeyGroupViewModel provideKeyGroupViewModel(Repository repository, Context application) {
        Supplier<KeyGroupViewModel> supplier = () -> new KeyGroupViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<KeyGroupViewModel> factory = new ViewModelProviderFactory<>(KeyGroupViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(KeyGroupViewModel.class);
    }

    @Provides
    @ActivityScope
    KeyGroupDetailsViewModel provideKeyGroupDetailsViewModel(Repository repository, Context application) {
        Supplier<KeyGroupDetailsViewModel> supplier = () -> new KeyGroupDetailsViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<KeyGroupDetailsViewModel> factory = new ViewModelProviderFactory<>(KeyGroupDetailsViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(KeyGroupDetailsViewModel.class);
    }
    @Provides
    @ActivityScope
    ServiceViewModel provideServiceViewModel(Repository repository, Context application) {
        Supplier<ServiceViewModel> supplier = () -> new ServiceViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ServiceViewModel> factory = new ViewModelProviderFactory<>(ServiceViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ServiceViewModel.class);
    }

    @Provides
    @ActivityScope
    ServiceDetailViewModel provideServiceDetailViewModel(Repository repository, Context application) {
        Supplier<ServiceDetailViewModel> supplier = () -> new ServiceDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ServiceDetailViewModel> factory = new ViewModelProviderFactory<>(ServiceDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ServiceDetailViewModel.class);
    }

    @Provides
    @ActivityScope
    KeyInfoViewModel provideKeyInfoViewModel(Repository repository, Context application) {
        Supplier<KeyInfoViewModel> supplier = () -> new KeyInfoViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<KeyInfoViewModel> factory = new ViewModelProviderFactory<>(KeyInfoViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(KeyInfoViewModel.class);
    }


    @Provides
    @ActivityScope
    ServiceGroupViewModel provideGroupServiceViewModel(Repository repository, Context application) {
        Supplier<ServiceGroupViewModel> supplier = () -> new ServiceGroupViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ServiceGroupViewModel> factory = new ViewModelProviderFactory<>(ServiceGroupViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ServiceGroupViewModel.class);
    }
    @Provides
    @ActivityScope
    ServiceGroupDetailViewModel provideGroupServiceDetailViewModel(Repository repository, Context application) {
        Supplier<ServiceGroupDetailViewModel> supplier = () -> new ServiceGroupDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ServiceGroupDetailViewModel> factory = new ViewModelProviderFactory<>(ServiceGroupDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ServiceGroupDetailViewModel.class);
    }

    @Provides
    @ActivityScope
    ForgetPasswordViewModel provideForgetPasswordViewModel(Repository repository, Context application) {
        Supplier<ForgetPasswordViewModel> supplier = () -> new ForgetPasswordViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ForgetPasswordViewModel> factory = new ViewModelProviderFactory<>(ForgetPasswordViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ForgetPasswordViewModel.class);
    }

    @Provides
    @ActivityScope
    ResetPasswordViewModel provideResetPasswordViewModel(Repository repository, Context application) {
        Supplier<ResetPasswordViewModel> supplier = () -> new ResetPasswordViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ResetPasswordViewModel> factory = new ViewModelProviderFactory<>(ResetPasswordViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ResetPasswordViewModel.class);
    }

    @Provides
    @ActivityScope
    ChangePasswordViewModel provideChangePasswordViewModel(Repository repository, Context application) {
        Supplier<ChangePasswordViewModel> supplier = () -> new ChangePasswordViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ChangePasswordViewModel> factory = new ViewModelProviderFactory<>(ChangePasswordViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ChangePasswordViewModel.class);
    }

    @Provides
    @ActivityScope
    ServiceScheduleViewModel provideServiceScheduleViewModel(Repository repository, Context application) {
        Supplier<ServiceScheduleViewModel> supplier = () -> new ServiceScheduleViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ServiceScheduleViewModel> factory = new ViewModelProviderFactory<>(ServiceScheduleViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ServiceScheduleViewModel.class);
    }
    @Provides
    @ActivityScope
    OrganizationViewModel provideOrganizationViewModel(Repository repository, Context application) {
        Supplier<OrganizationViewModel> supplier = () -> new OrganizationViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<OrganizationViewModel> factory = new ViewModelProviderFactory<>(OrganizationViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(OrganizationViewModel.class);
    }
    @Provides
    @ActivityScope
    OrganizationDetailViewModel provideOrganizationDetailViewModel(Repository repository, Context application) {
        Supplier<OrganizationDetailViewModel> supplier = () -> new OrganizationDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<OrganizationDetailViewModel> factory = new ViewModelProviderFactory<>(OrganizationDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(OrganizationDetailViewModel.class);
    }


    @Provides
    @ActivityScope
    NotificationViewModel provideNotificationViewModel(Repository repository, Context application) {
        Supplier<NotificationViewModel> supplier = () -> new NotificationViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<NotificationViewModel> factory = new ViewModelProviderFactory<>(NotificationViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(NotificationViewModel.class);
    }
    @Provides
    @ActivityScope
    ProjectViewModel provideProjectViewModel(Repository repository, Context application) {
        Supplier<ProjectViewModel> supplier = () -> new ProjectViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ProjectViewModel> factory = new ViewModelProviderFactory<>(ProjectViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ProjectViewModel.class);
    }
    @Provides
    @ActivityScope
    ProjectDetailViewModel provideProjectDetailViewModel(Repository repository, Context application) {
        Supplier<ProjectDetailViewModel> supplier = () -> new ProjectDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ProjectDetailViewModel> factory = new ViewModelProviderFactory<>(ProjectDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ProjectDetailViewModel.class);
    }
    @Provides
    @ActivityScope
    TaskDetailViewModel provideTaskDetailViewModel(Repository repository, Context application) {
        Supplier<TaskDetailViewModel> supplier = () -> new TaskDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TaskDetailViewModel> factory = new ViewModelProviderFactory<>(TaskDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TaskDetailViewModel.class);
    }

    @Provides
    @ActivityScope
    TaskCreateUpdateViewModel provideTaskCreateUpdateViewModel(Repository repository, Context application) {
        Supplier<TaskCreateUpdateViewModel> supplier = () -> new TaskCreateUpdateViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TaskCreateUpdateViewModel> factory = new ViewModelProviderFactory<>(TaskCreateUpdateViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TaskCreateUpdateViewModel.class);
    }

    @Provides
    @ActivityScope
    KeyFilterViewModel provideKeyFilterViewModel(Repository repository, Context application) {
        Supplier<KeyFilterViewModel> supplier = () -> new KeyFilterViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<KeyFilterViewModel> factory = new ViewModelProviderFactory<>(KeyFilterViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(KeyFilterViewModel.class);
    }
    @Provides
    @ActivityScope
    TaskFilterViewModel provideTaskFilterViewModel(Repository repository, Context application) {
        Supplier<TaskFilterViewModel> supplier = () -> new TaskFilterViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TaskFilterViewModel> factory = new ViewModelProviderFactory<>(TaskFilterViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TaskFilterViewModel.class);
    }
    @Provides
    @ActivityScope
    DebitViewModel provideDebitViewModel(Repository repository, Context application) {
        Supplier<DebitViewModel> supplier = () -> new DebitViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<DebitViewModel> factory = new ViewModelProviderFactory<>(DebitViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(DebitViewModel.class);
    }
    @Provides
    @ActivityScope
    DebitDetailViewModel provideDebitDetailViewModel(Repository repository, Context application) {
        Supplier<DebitDetailViewModel> supplier = () -> new DebitDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<DebitDetailViewModel> factory = new ViewModelProviderFactory<>(DebitDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(DebitDetailViewModel.class);
    }
    @Provides
    @ActivityScope
    DebitUpdateViewModel provideDebitUpdateViewModel(Repository repository, Context application) {
        Supplier<DebitUpdateViewModel> supplier = () -> new DebitUpdateViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<DebitUpdateViewModel> factory = new ViewModelProviderFactory<>(DebitUpdateViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(DebitUpdateViewModel.class);
    }
    @Provides
    @ActivityScope
    SubTaskViewModel provideSubTaskViewModel(Repository repository, Context application) {
        Supplier<SubTaskViewModel> supplier = () -> new SubTaskViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<SubTaskViewModel> factory = new ViewModelProviderFactory<>(SubTaskViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(SubTaskViewModel.class);
    }

    @Provides
    @ActivityScope
    ImageViewModel provideImageViewModel(Repository repository, Context application) {
        Supplier<ImageViewModel> supplier = () -> new ImageViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ImageViewModel> factory = new ViewModelProviderFactory<>(ImageViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ImageViewModel.class);
    }

    @Provides
    @ActivityScope
    TaskViewModel provideTaskViewModel(Repository repository, Context application) {
        Supplier<TaskViewModel> supplier = () -> new TaskViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TaskViewModel> factory = new ViewModelProviderFactory<>(TaskViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TaskViewModel.class);
    }

    @Provides
    @ActivityScope
    DocumentViewModel provideDocumentViewModel(Repository repository, Context application) {
        Supplier<DocumentViewModel> supplier = () -> new DocumentViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<DocumentViewModel> factory = new ViewModelProviderFactory<>(DocumentViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(DocumentViewModel.class);
    }

    @Provides
    @ActivityScope
    TagViewModel provideTagViewModel(Repository repository, Context application) {
        Supplier<TagViewModel> supplier = () -> new TagViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TagViewModel> factory = new ViewModelProviderFactory<>(TagViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TagViewModel.class);
    }

    @Provides
    @ActivityScope
    TagDetailViewModel provideTagDetailViewModel(Repository repository, Context application) {
        Supplier<TagDetailViewModel> supplier = () -> new TagDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<TagDetailViewModel> factory = new ViewModelProviderFactory<>(TagDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(TagDetailViewModel.class);
    }

    @Provides
    @ActivityScope
    ChatViewModel provideChatViewModel(Repository repository, Context application) {
        Supplier<ChatViewModel> supplier = () -> new ChatViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ChatViewModel> factory = new ViewModelProviderFactory<>(ChatViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ChatViewModel.class);
    }

    @Provides
    @ActivityScope
    ChatDetailViewModel provideChatDetailViewModel(Repository repository, Context application) {
        Supplier<ChatDetailViewModel> supplier = () -> new ChatDetailViewModel(repository, (MVVMApplication)application);
        ViewModelProviderFactory<ChatDetailViewModel> factory = new ViewModelProviderFactory<>(ChatDetailViewModel.class, supplier);
        return new ViewModelProvider(activity, factory).get(ChatDetailViewModel.class);
    }

}
