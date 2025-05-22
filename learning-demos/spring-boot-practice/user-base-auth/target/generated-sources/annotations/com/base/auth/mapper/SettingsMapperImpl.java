package com.base.auth.mapper;

import com.base.auth.dto.settings.SettingsAutoCompleteDto;
import com.base.auth.dto.settings.SettingsDto;
import com.base.auth.form.settings.CreateSettingsForm;
import com.base.auth.form.settings.UpdateSettingsForm;
import com.base.auth.model.Settings;
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
public class SettingsMapperImpl implements SettingsMapper {

    @Override
    public Settings fromCreateSettingsFormToEntity(CreateSettingsForm createSettingsForm) {
        if ( createSettingsForm == null ) {
            return null;
        }

        Settings settings = new Settings();

        settings.setSettingValue( createSettingsForm.getSettingValue() );
        settings.setDescription( createSettingsForm.getDescription() );
        settings.setSettingKey( createSettingsForm.getSettingKey() );
        settings.setIsSystem( createSettingsForm.getIsSystem() );
        settings.setGroupName( createSettingsForm.getGroupName() );
        settings.setIsEditable( createSettingsForm.getIsEditable() );
        if ( createSettingsForm.getStatus() != null ) {
            settings.setStatus( createSettingsForm.getStatus() );
        }

        return settings;
    }

    @Override
    public void fromUpdateSettingsFormToEntity(UpdateSettingsForm updateSettingsForm, Settings settings) {
        if ( updateSettingsForm == null ) {
            return;
        }

        if ( updateSettingsForm.getSettingValue() != null ) {
            settings.setSettingValue( updateSettingsForm.getSettingValue() );
        }
        if ( updateSettingsForm.getDescription() != null ) {
            settings.setDescription( updateSettingsForm.getDescription() );
        }
        if ( updateSettingsForm.getStatus() != null ) {
            settings.setStatus( updateSettingsForm.getStatus() );
        }
    }

    @Override
    public SettingsDto fromEntityToSettingsDto(Settings settings) {
        if ( settings == null ) {
            return null;
        }

        SettingsDto settingsDto = new SettingsDto();

        settingsDto.setIsSystem( settings.getIsSystem() );
        settingsDto.setGroupName( settings.getGroupName() );
        if ( settings.getCreatedDate() != null ) {
            settingsDto.setCreatedDate( LocalDateTime.ofInstant( settings.getCreatedDate().toInstant(), ZoneId.of( "UTC" ) ) );
        }
        settingsDto.setIsEditable( settings.getIsEditable() );
        settingsDto.setSettingValue( settings.getSettingValue() );
        if ( settings.getModifiedDate() != null ) {
            settingsDto.setModifiedDate( LocalDateTime.ofInstant( settings.getModifiedDate().toInstant(), ZoneId.of( "UTC" ) ) );
        }
        settingsDto.setDescription( settings.getDescription() );
        settingsDto.setId( settings.getId() );
        settingsDto.setSettingKey( settings.getSettingKey() );
        settingsDto.setStatus( settings.getStatus() );

        return settingsDto;
    }

    @Override
    public List<SettingsDto> fromEntityListToSettingsDtoList(List<Settings> settings) {
        if ( settings == null ) {
            return null;
        }

        List<SettingsDto> list = new ArrayList<SettingsDto>( settings.size() );
        for ( Settings settings1 : settings ) {
            list.add( fromEntityToSettingsDto( settings1 ) );
        }

        return list;
    }

    @Override
    public SettingsAutoCompleteDto fromEntityToSettingsAutoCompleteDto(Settings settings) {
        if ( settings == null ) {
            return null;
        }

        SettingsAutoCompleteDto settingsAutoCompleteDto = new SettingsAutoCompleteDto();

        settingsAutoCompleteDto.setGroupName( settings.getGroupName() );
        settingsAutoCompleteDto.setId( settings.getId() );
        settingsAutoCompleteDto.setSettingKey( settings.getSettingKey() );

        return settingsAutoCompleteDto;
    }

    @Override
    public List<SettingsAutoCompleteDto> fromEntityListToSettingsAutoCompleteDtoList(List<Settings> settings) {
        if ( settings == null ) {
            return null;
        }

        List<SettingsAutoCompleteDto> list = new ArrayList<SettingsAutoCompleteDto>( settings.size() );
        for ( Settings settings1 : settings ) {
            list.add( fromEntityToSettingsAutoCompleteDto( settings1 ) );
        }

        return list;
    }
}
