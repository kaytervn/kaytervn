package com.tenant.service;

import com.tenant.constant.FinanceConstant;
import com.tenant.mapper.DebitMapper;
import com.tenant.storage.tenant.model.*;
import com.tenant.storage.tenant.repository.*;
import com.tenant.utils.AESUtils;
import com.tenant.utils.ConvertUtils;
import com.tenant.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TransactionHistoryRepository transactionHistoryRepository;
    @Autowired
    private PaymentPeriodRepository paymentPeriodRepository;
    @Autowired
    private KeyService keyService;
    @Autowired
    private DebitRepository debitRepository;
    @Autowired
    private DebitMapper debitMapper;
    @Autowired
    private ServiceRepository serviceRepository;

    public void createTransactionHistory(Long accountId, Transaction transaction, String note) {
        accountRepository.findById(accountId).ifPresent(account -> {
            TransactionHistory transactionHistory = new TransactionHistory();
            transactionHistory.setState(transaction.getState());
            transactionHistory.setNote(note);
            transactionHistory.setTransaction(transaction);
            transactionHistory.setAccount(account);
            transactionHistoryRepository.save(transactionHistory);
        });
    }

    public void recalculatePaymentPeriod(Long paymentPeriodId) {
        paymentPeriodRepository.findById(paymentPeriodId).ifPresent(paymentPeriod -> {
            double totalIncome = 0.0;
            double totalExpenditure = 0.0;
            List<Transaction> transactions = transactionRepository.findAllByPaymentPeriodId(paymentPeriod.getId());
            String secretKey = keyService.getFinanceSecretKey();
            for (Transaction transaction : transactions) {
                double amount = Double.parseDouble(Objects.requireNonNull(AESUtils.decrypt(secretKey, transaction.getMoney(), FinanceConstant.AES_ZIP_ENABLE)));
                if (FinanceConstant.TRANSACTION_KIND_INCOME.equals(transaction.getKind())) {
                    totalIncome += amount;
                } else {
                    totalExpenditure += amount;
                }
            }
            paymentPeriod.setTotalIncome(AESUtils.encrypt(secretKey, ConvertUtils.convertDoubleToString(totalIncome), FinanceConstant.AES_ZIP_ENABLE));
            paymentPeriod.setTotalExpenditure(AESUtils.encrypt(secretKey, ConvertUtils.convertDoubleToString(totalExpenditure), FinanceConstant.AES_ZIP_ENABLE));
            paymentPeriodRepository.save(paymentPeriod);
        });
    }

    private boolean isTransactionValidForDebit(Transaction transaction) {
        return FinanceConstant.TRANSACTION_STATE_APPROVE.equals(transaction.getState()) &&
                FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_FALSE.equals(transaction.getIgnoreDebit()) &&
                FinanceConstant.TRANSACTION_KIND_EXPENDITURE.equals(transaction.getKind());
    }

    private boolean isTransactionInvalidForDebit(Transaction transaction) {
        return FinanceConstant.TRANSACTION_STATE_CREATED.equals(transaction.getState()) ||
                FinanceConstant.TRANSACTION_KIND_INCOME.equals(transaction.getKind()) ||
                FinanceConstant.IGNORE_ENTITY_RELATIONSHIP_TRUE.equals(transaction.getIgnoreDebit());
    }

    public void createDebitByTransaction(Transaction transaction) {
        if (isTransactionValidForDebit(transaction)) {
            Debit debit = debitMapper.fromEncryptTransactionToEntity(transaction);
            debit.setTransaction(transaction);
            debitRepository.save(debit);
        }
    }

    public void updateDebitByTransaction(Transaction transaction) {
        if (isTransactionInvalidForDebit(transaction)) {
            debitRepository.deleteAllByTransactionId(transaction.getId());
        } else {
            debitRepository.findFirstByTransactionId(transaction.getId()).ifPresentOrElse(debit -> {
                debitMapper.fromEncryptTransactionToEntity(transaction, debit);
                debit.setCategory(transaction.getCategory());
                debit.setTransactionGroup(transaction.getTransactionGroup());
                debitRepository.save(debit);
            }, () -> createDebitByTransaction(transaction));
        }
    }

    public void updateExpirationDate(com.tenant.storage.tenant.model.Service service) {
        if (!FinanceConstant.SERVICE_PERIOD_KIND_FIX_DAY.equals(service.getPeriodKind())) {
            service.setExpirationDate(calculateExpirationDate(service.getStartDate(), service.getPeriodKind()));
            service.setIsPaid(FinanceConstant.BOOLEAN_FALSE);
        } else {
            service.setIsPaid(service.getExpirationDate().before(new Date()) ?
                    FinanceConstant.BOOLEAN_TRUE :
                    FinanceConstant.BOOLEAN_FALSE);
        }
        serviceRepository.save(service);
    }

    public Date getNextValidExpirationDate(Date startDate, Date expirationDate, Integer periodKind) {
        LocalDate start = DateUtils.convertDate2LocalDate(startDate);
        LocalDate exp = DateUtils.convertDate2LocalDate(expirationDate);
        if (FinanceConstant.SERVICE_PERIOD_KIND_MONTH.equals(periodKind)) {
            exp = exp.plusMonths(1);
        } else if (FinanceConstant.SERVICE_PERIOD_KIND_YEAR.equals(periodKind)) {
            exp = exp.plusYears(1);
        }
        if (start.getDayOfMonth() > 28) {
            int startDay = start.getDayOfMonth();
            exp = exp.withDayOfMonth(Math.min(exp.lengthOfMonth(), startDay));
        }
        return DateUtils.convertLocalDate2Date(exp);
    }

    public Date calculateExpirationDate(Date startDate, Integer periodKind) {
        LocalDate start = DateUtils.convertDate2LocalDate(startDate);
        LocalDate expDate = periodKind.equals(FinanceConstant.SERVICE_PERIOD_KIND_MONTH) ? start.plusMonths(1) : start.plusYears(1);
        LocalDate currentDate = LocalDate.now();
        while (expDate.isBefore(currentDate)) {
            expDate = DateUtils.convertDate2LocalDate(getNextValidExpirationDate(startDate, DateUtils.convertLocalDate2Date(expDate), periodKind));
        }
        return DateUtils.convertLocalDate2Date(expDate);
    }

    public boolean isNotValidExpirationDate(Date startDate, Date newExpirationDate, Integer periodKind) {
        if (newExpirationDate == null) {
            return true;
        }
        LocalDate expDate = DateUtils.convertDate2LocalDate(calculateExpirationDate(startDate, periodKind));
        LocalDate newExpDate = DateUtils.convertDate2LocalDate(newExpirationDate);
        while (expDate.isBefore(newExpDate)) {
            expDate = DateUtils.convertDate2LocalDate(getNextValidExpirationDate(startDate, DateUtils.convertLocalDate2Date(expDate), periodKind));
        }
        return !newExpDate.equals(expDate);
    }
}
