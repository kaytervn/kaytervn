package com.base.auth.mapper;

import com.base.auth.dto.account.AccountAutoCompleteDto;
import com.base.auth.dto.account.AccountDto;
import com.base.auth.form.user.SignUpUserForm;
import com.base.auth.form.user.UpdateUserForm;
import com.base.auth.model.Account;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-06-30T13:02:31+0700",
    comments = "version: 1.3.1.Final, compiler: javac, environment: Java 11.0.22 (Oracle Corporation)"
)
@Component
public class AccountMapperImpl implements AccountMapper {

    @Autowired
    private GroupMapper groupMapper;

    @Override
    public AccountDto fromAccountToDto(Account account) {
        if ( account == null ) {
            return null;
        }

        AccountDto accountDto = new AccountDto();

        accountDto.setLastLogin( account.getLastLogin() );
        accountDto.setPhone( account.getPhone() );
        accountDto.setKind( account.getKind() );
        accountDto.setFullName( account.getFullName() );
        accountDto.setIsSuperAdmin( account.getIsSuperAdmin() );
        accountDto.setId( account.getId() );
        accountDto.setAvatar( account.getAvatarPath() );
        accountDto.setEmail( account.getEmail() );
        accountDto.setUsername( account.getUsername() );
        accountDto.setGroup( groupMapper.fromEntityToGroupDto( account.getGroup() ) );

        return accountDto;
    }

    @Override
    public AccountAutoCompleteDto fromAccountToAutoCompleteDto(Account account) {
        if ( account == null ) {
            return null;
        }

        AccountAutoCompleteDto accountAutoCompleteDto = new AccountAutoCompleteDto();

        accountAutoCompleteDto.setAvatarPath( account.getAvatarPath() );
        accountAutoCompleteDto.setFullName( account.getFullName() );
        if ( account.getId() != null ) {
            accountAutoCompleteDto.setId( account.getId() );
        }

        return accountAutoCompleteDto;
    }

    @Override
    public List<AccountAutoCompleteDto> convertAccountToAutoCompleteDto(List<Account> list) {
        if ( list == null ) {
            return null;
        }

        List<AccountAutoCompleteDto> list1 = new ArrayList<AccountAutoCompleteDto>( list.size() );
        for ( Account account : list ) {
            list1.add( accountToAccountAutoCompleteDto( account ) );
        }

        return list1;
    }

    @Override
    public Account fromSignUpUserToAccount(SignUpUserForm signUpUserForm) {
        if ( signUpUserForm == null ) {
            return null;
        }

        Account account = new Account();

        account.setAvatarPath( signUpUserForm.getAvatarPath() );
        account.setFullName( signUpUserForm.getFullName() );
        account.setPhone( signUpUserForm.getPhone() );
        account.setEmail( signUpUserForm.getEmail() );

        return account;
    }

    @Override
    public void fromUpdateUserFormToEntity(UpdateUserForm updateUserForm, Account account) {
        if ( updateUserForm == null ) {
            return;
        }

        if ( updateUserForm.getAvatarPath() != null ) {
            account.setAvatarPath( updateUserForm.getAvatarPath() );
        }
        if ( updateUserForm.getFullName() != null ) {
            account.setFullName( updateUserForm.getFullName() );
        }
        if ( updateUserForm.getPhone() != null ) {
            account.setPhone( updateUserForm.getPhone() );
        }
        if ( updateUserForm.getEmail() != null ) {
            account.setEmail( updateUserForm.getEmail() );
        }
    }

    protected AccountAutoCompleteDto accountToAccountAutoCompleteDto(Account account) {
        if ( account == null ) {
            return null;
        }

        AccountAutoCompleteDto accountAutoCompleteDto = new AccountAutoCompleteDto();

        if ( account.getId() != null ) {
            accountAutoCompleteDto.setId( account.getId() );
        }
        accountAutoCompleteDto.setFullName( account.getFullName() );
        accountAutoCompleteDto.setAvatarPath( account.getAvatarPath() );

        return accountAutoCompleteDto;
    }
}
