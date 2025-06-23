package com.tenant.controller;

import com.tenant.constant.FinanceConstant;
import com.tenant.dto.ApiMessageDto;
import com.tenant.dto.ErrorCode;
import com.tenant.dto.ResponseListDto;
import com.tenant.dto.chatHistory.ChatHistoryDto;
import com.tenant.exception.BadRequestException;
import com.tenant.form.chatHistory.CreateChatHistoryForm;
import com.tenant.mapper.ChatHistoryMapper;
import com.tenant.multitenancy.dto.ChatRequestAnswerDto;
import com.tenant.multitenancy.dto.ChatRequestDto;
import com.tenant.multitenancy.feign.FeignCacheService;
import com.tenant.service.KeyService;
import com.tenant.storage.tenant.model.Account;
import com.tenant.storage.tenant.model.ChatHistory;
import com.tenant.storage.tenant.model.criteria.ChatHistoryCriteria;
import com.tenant.storage.tenant.repository.AccountRepository;
import com.tenant.storage.tenant.repository.ChatHistoryRepository;
import com.tenant.utils.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/v1/chat-history")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ChatHistoryController extends ABasicController {
    @Autowired
    private ChatHistoryRepository chatHistoryRepository;
    @Autowired
    private ChatHistoryMapper chatHistoryMapper;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private KeyService keyService;
    @Autowired
    private FeignCacheService feignCacheService;
    @Value("${cache.api-key}")
    private String cacheApiKey;

    @GetMapping(value = "/get/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ChatHistoryDto> get(@PathVariable("id") Long id) {
        ChatHistory chatHistory = chatHistoryRepository.findById(id).orElse(null);
        if (chatHistory == null) {
            throw new BadRequestException(ErrorCode.CHAT_HISTORY_ERROR_NOT_FOUND, "Not found chat history");
        }
        return makeSuccessResponse(chatHistoryMapper.fromEntityToChatHistoryDto(chatHistory, keyService.getFinanceKeyWrapper()), "Get chat history success");
    }

    @GetMapping(value = "/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ResponseListDto<List<ChatHistoryDto>>> list(ChatHistoryCriteria chatHistoryCriteria, Pageable pageable) {
        if (FinanceConstant.BOOLEAN_FALSE.equals(chatHistoryCriteria.getIsPaged())) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        } else {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        }
        chatHistoryCriteria.setAccountId(getCurrentUser());
        Page<ChatHistory> listChatHistory = chatHistoryRepository.findAll(chatHistoryCriteria.getCriteria(), pageable);
        ResponseListDto<List<ChatHistoryDto>> responseListObj = new ResponseListDto<>();
        responseListObj.setContent(chatHistoryMapper.fromEntityListToChatHistoryDtoList(listChatHistory.getContent(), keyService.getFinanceKeyWrapper()));
        responseListObj.setTotalPages(listChatHistory.getTotalPages());
        responseListObj.setTotalElements(listChatHistory.getTotalElements());
        return makeSuccessResponse(responseListObj, "Get list chat history success");
    }

    @PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiMessageDto<ChatHistoryDto> create(@Valid @RequestBody CreateChatHistoryForm form, BindingResult bindingResult) {
        Account account = accountRepository.findById(getCurrentUser()).orElse(null);
        if (account == null) {
            throw new BadRequestException(ErrorCode.ACCOUNT_ERROR_NOT_FOUND, "Not found account");
        }
        List<ChatHistory> chatHistories = chatHistoryRepository.findAllByAccountIdOrderByCreatedDateAsc(getCurrentUser());
        ChatRequestDto req = new ChatRequestDto();
        req.setMessage(AESUtils.decrypt(keyService.getUserSecretKey(), form.getMessage(), FinanceConstant.AES_ZIP_ENABLE));
        req.setHistory(chatHistoryMapper.fromEntityListToChatHistoryFormList(chatHistories, keyService.getFinanceSecretKey()));

        ChatHistory chatHistory = chatHistoryMapper.fromCreateChatHistoryFormToEntity(form, keyService.getUserKeyWrapper());
        chatHistory.setAccount(account);
        chatHistory.setRole(FinanceConstant.CHAT_HISTORY_ROLE_USER);
        chatHistoryRepository.save(chatHistory);

        ApiMessageDto<ChatRequestAnswerDto> res = feignCacheService.sendMessageGenAi(cacheApiKey, req);
        ChatHistory answer = new ChatHistory();
        answer.setAccount(account);
        answer.setRole(FinanceConstant.CHAT_HISTORY_ROLE_MODEL);
        answer.setMessage(AESUtils.encrypt(keyService.getFinanceSecretKey(), res.getData().getAnswer(), FinanceConstant.AES_ZIP_ENABLE));
        chatHistoryRepository.save(answer);

        ChatHistoryDto resDto = chatHistoryMapper.fromEntityToChatHistoryDto(answer, keyService.getFinanceKeyWrapper());
        return makeSuccessResponse(resDto, "Send message success");
    }
}
