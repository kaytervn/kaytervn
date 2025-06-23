package com.finance.di.component;


import com.finance.di.module.ActivityModule;
import com.finance.di.scope.ActivityScope;
import com.finance.ui.category.CategoryActivity;
import com.finance.ui.category.details.CategoryDetailsActivity;
import com.finance.ui.chat.ChatActivity;
import com.finance.ui.chat.detail.ChatDetailActivity;
import com.finance.ui.debit.DebitActivity;
import com.finance.ui.debit.detail.DebitDetailActivity;
import com.finance.ui.debit.update.DebitUpdateActivity;
import com.finance.ui.department.DepartmentActivity;
import com.finance.ui.department.details.DepartmentDetailActivity;
import com.finance.ui.document.DocumentActivity;
import com.finance.ui.image.ImageActivity;
import com.finance.ui.key.filter.KeyFilterActivity;

import com.finance.ui.key.group.KeyGroupActivity;
import com.finance.ui.nofication.NotificationActivity;
import com.finance.ui.organization.OrganizationActivity;
import com.finance.ui.organization.detail.OrganizationDetailActivity;
import com.finance.ui.password.change.ChangePasswordActivity;
import com.finance.ui.password.forget.ForgetPasswordActivity;
import com.finance.ui.password.reset.ResetPasswordActivity;
import com.finance.ui.project.ProjectActivity;
import com.finance.ui.project.detail.ProjectDetailActivity;
import com.finance.ui.service.schedule.ServiceScheduleActivity;
import com.finance.ui.subtask.SubTaskActivity;
import com.finance.ui.tag.TagActivity;
import com.finance.ui.tag.detail.TagDetailActivity;
import com.finance.ui.task.TaskActivity;
import com.finance.ui.task.create_or_update.TaskCreateUpdateActivity;
import com.finance.ui.task.detail.TaskDetailActivity;
import com.finance.ui.task.filter.TaskFilterActivity;
import com.finance.ui.transaction.create_or_update.TransactionCreateUpdateActivity;
import com.finance.ui.transaction.detail.TransactionDetailActivity;
import com.finance.ui.transaction.group.TransactionGroupActivity;
import com.finance.ui.transaction.group.detail.TransactionGroupDetailActivity;

import com.finance.ui.fragment.account.update.UpdateProfileActivity;
import com.finance.ui.key.infor.KeyInfoActivity;
import com.finance.ui.fragment.statistics.detail.StaticsDetailActivity;
import com.finance.ui.service.group.ServiceGroupActivity;
import com.finance.ui.service.group.detail.ServiceGroupDetailActivity;
import com.finance.ui.key.details.KeyDetailsActivity;
import com.finance.ui.key.group.details.KeyGroupDetailsActivity;
import com.finance.ui.login.LoginActivity;
import com.finance.ui.main.MainActivity;
import com.finance.ui.service.ServiceActivity;
import com.finance.ui.service.detail.ServiceDetailActivity;


import dagger.Component;

@ActivityScope
@Component(modules = {ActivityModule.class}, dependencies = AppComponent.class)
public interface ActivityComponent {
    void inject(MainActivity activity);
    void inject(LoginActivity activity);
    void inject(UpdateProfileActivity activity);
    void inject(StaticsDetailActivity activity);
    void inject(TransactionDetailActivity activity);
    void inject(TransactionCreateUpdateActivity activity);
    void inject(CategoryActivity categoryActivity);
    void inject(CategoryDetailsActivity categoryDetailsActivity);
    void inject(DepartmentActivity departmentActivity);
    void inject(DepartmentDetailActivity departmentDetailActivity);
    void inject(TransactionGroupActivity activity);
    void inject(TransactionGroupDetailActivity activity);
    void inject(KeyDetailsActivity keyDetailsActivity);
    void inject(KeyGroupActivity keyGroupActivity);
    void inject(KeyGroupDetailsActivity keyGroupDetailsActivity);
    void inject(KeyInfoActivity keyInfoActivity);
    void inject(ServiceActivity activity);
    void inject(ServiceDetailActivity activity);
    void inject(ServiceGroupActivity activity);
    void inject(ServiceGroupDetailActivity activity);
    void inject(ForgetPasswordActivity forgetPasswordActivity);
    void inject(ResetPasswordActivity resetPasswordActivity);
    void inject(ChangePasswordActivity changePasswordActivity);
    void inject(ServiceScheduleActivity activity);
    void inject(OrganizationActivity groupActivity);
    void inject(OrganizationDetailActivity organizationDetailActivity);
    void inject(NotificationActivity activity);
    void inject(ProjectActivity activity);
    void inject(ProjectDetailActivity activity);
    void inject(TaskDetailActivity activity);
    void inject(TaskCreateUpdateActivity activity);
    void inject(KeyFilterActivity activity);
    void inject(TaskFilterActivity activity);
    void inject(DebitActivity activity);
    void inject(DebitDetailActivity activity);
    void inject(DebitUpdateActivity activity);
    void inject(SubTaskActivity activity);
    void inject(ImageActivity activity);
    void inject(TaskActivity activity);
    void inject(DocumentActivity activity);
    void inject(TagActivity activity);
    void inject(TagDetailActivity activity);
    void inject(ChatActivity activity);
    void inject(ChatDetailActivity activity);
}
