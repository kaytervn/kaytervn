package com.base.auth.mapper;

import com.base.auth.dto.nation.NationAdminDto;
import com.base.auth.dto.nation.NationDto;
import com.base.auth.form.nation.CreateNationForm;
import com.base.auth.form.nation.UpdateNationForm;
import com.base.auth.model.Nation;
import java.time.LocalDateTime;
import java.time.ZoneId;
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
public class NationMapperImpl implements NationMapper {

    @Override
    public NationAdminDto fromEntityToAdminDto(Nation nation) {
        if ( nation == null ) {
            return null;
        }

        NationAdminDto nationAdminDto = new NationAdminDto();

        nationAdminDto.setParent( fromEntityToAutoCompleteDto( nation.getParent() ) );
        if ( nation.getCreatedDate() != null ) {
            nationAdminDto.setCreatedDate( LocalDateTime.ofInstant( nation.getCreatedDate().toInstant(), ZoneId.of( "UTC" ) ) );
        }
        nationAdminDto.setKind( nation.getKind() );
        nationAdminDto.setName( nation.getName() );
        if ( nation.getModifiedDate() != null ) {
            nationAdminDto.setModifiedDate( LocalDateTime.ofInstant( nation.getModifiedDate().toInstant(), ZoneId.of( "UTC" ) ) );
        }
        nationAdminDto.setPostCode( nation.getPostCode() );
        nationAdminDto.setId( nation.getId() );
        nationAdminDto.setStatus( nation.getStatus() );

        return nationAdminDto;
    }

    @Override
    public Nation fromCreateFormToEntity(CreateNationForm createNationForm) {
        if ( createNationForm == null ) {
            return null;
        }

        Nation nation = new Nation();

        nation.setKind( createNationForm.getKind() );
        nation.setName( createNationForm.getName() );
        nation.setPostCode( createNationForm.getPostCode() );
        if ( createNationForm.getStatus() != null ) {
            nation.setStatus( createNationForm.getStatus().intValue() );
        }

        return nation;
    }

    @Override
    public void fromUpdateFormToEntity(UpdateNationForm updateForm, Nation nation) {
        if ( updateForm == null ) {
            return;
        }

        if ( updateForm.getName() != null ) {
            nation.setName( updateForm.getName() );
        }
        if ( updateForm.getPostCode() != null ) {
            nation.setPostCode( updateForm.getPostCode() );
        }
        if ( updateForm.getStatus() != null ) {
            nation.setStatus( updateForm.getStatus().intValue() );
        }
    }

    @Override
    public NationDto fromEntityToAutoCompleteDto(Nation nation) {
        if ( nation == null ) {
            return null;
        }

        NationDto nationDto = new NationDto();

        nationDto.setName( nation.getName() );
        nationDto.setId( nation.getId() );
        nationDto.setKind( nation.getKind() );

        return nationDto;
    }

    @Override
    public List<NationDto> convertToAutoCompleteDto(List<Nation> list) {
        if ( list == null ) {
            return null;
        }

        List<NationDto> list1 = new ArrayList<NationDto>( list.size() );
        for ( Nation nation : list ) {
            list1.add( fromEntityToAutoCompleteDto( nation ) );
        }

        return list1;
    }

    @Override
    public List<NationAdminDto> convertToListAdminDto(List<Nation> list) {
        if ( list == null ) {
            return null;
        }

        List<NationAdminDto> list1 = new ArrayList<NationAdminDto>( list.size() );
        for ( Nation nation : list ) {
            list1.add( fromEntityToAdminDto( nation ) );
        }

        return list1;
    }
}
