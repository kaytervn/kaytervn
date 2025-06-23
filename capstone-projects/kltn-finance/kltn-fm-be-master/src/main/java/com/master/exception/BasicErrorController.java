package com.master.exception;

import com.master.dto.ApiMessageDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("${server.error.path:${error.path:/error}}")
public class BasicErrorController {
    @GetMapping
    public ResponseEntity<ApiMessageDto<String>> error(HttpServletRequest request) {
        ApiMessageDto<String> apiMessageDto = new ApiMessageDto<>();
        return new ResponseEntity<>(apiMessageDto, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
