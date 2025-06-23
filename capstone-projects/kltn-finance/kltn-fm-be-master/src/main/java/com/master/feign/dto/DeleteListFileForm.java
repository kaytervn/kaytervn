package com.master.feign.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@AllArgsConstructor
public class DeleteListFileForm {
    @NotNull(message = "files cannot be null!")
    private List<String> files;
}
