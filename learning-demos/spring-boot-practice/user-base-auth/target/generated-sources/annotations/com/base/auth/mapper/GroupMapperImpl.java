package com.base.auth.mapper;

import com.base.auth.dto.group.GroupDto;
import com.base.auth.model.Group;
import com.base.auth.model.Permission;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-06-30T13:02:31+0700",
    comments = "version: 1.3.1.Final, compiler: javac, environment: Java 11.0.22 (Oracle Corporation)"
)
@Component
public class GroupMapperImpl implements GroupMapper {

    @Override
    public GroupDto fromEntityToGroupDto(Group group) {
        if ( group == null ) {
            return null;
        }

        GroupDto groupDto = new GroupDto();

        groupDto.setName( group.getName() );
        groupDto.setDescription( group.getDescription() );
        groupDto.setId( group.getId() );
        groupDto.setKind( group.getKind() );
        List<Permission> list = group.getPermissions();
        if ( list != null ) {
            groupDto.setPermissions( new ArrayList<Permission>( list ) );
        }

        return groupDto;
    }
}
