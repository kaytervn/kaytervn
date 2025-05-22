package com.example.demo.service;

import com.example.demo.constant.AppConst;
import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.request.SignInRequest;
import com.example.demo.dto.response.RegisterResponse;
import com.example.demo.dto.response.TokenResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.VerificationToken;
import com.example.demo.event.OnRegistrationCompleteEvent;
import com.example.demo.exception.AppException;
import com.example.demo.mapper.UserMapper;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.VerificationTokenRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    AuthenticationManager authenticationManager;
    JwtService jwtService;
    ApplicationEventPublisher eventPublisher;
    VerificationTokenRepository verificationTokenRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    public TokenResponse authenticate(SignInRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword()
            ));
        } catch (BadCredentialsException e) {
            throw new AppException("token.error.bad-cred", HttpStatus.BAD_REQUEST);
        }
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException("user.error.not-found", HttpStatus.NOT_FOUND));
        String token = jwtService.generateToken(user);
        return TokenResponse.builder()
                .token(token)
                .userId(user.getId())
                .build();
    }

    public RegisterResponse registerUser(RegisterRequest request) {
        User user = userMapper.toUser(request);
        HashSet<Role> roles = new HashSet<>();
        roleRepository.findByName(AppConst.ROLE_USER).ifPresent(roles::add);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(roles);
        user.setEnabled(false);

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = verificationTokenRepository
                .save(VerificationToken.builder()
                        .user(userRepository.save(user))
                        .token(token)
                        .build());

        eventPublisher.publishEvent(new OnRegistrationCompleteEvent(verificationToken));

        return userMapper.toRegisterResponse(verificationToken);
    }

    public RegisterResponse resendRegistrationToken(String existingToken) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(existingToken)
                .orElseThrow(() -> new AppException("verify-token.error.not-found", HttpStatus.NOT_FOUND));
        verificationToken.setToken(UUID.randomUUID().toString());
        verificationToken.resetExpiryDate();
        eventPublisher.publishEvent(new OnRegistrationCompleteEvent(
                verificationTokenRepository.save(verificationToken)
        ));

        return userMapper.toRegisterResponse(verificationToken);
    }

    public void confirmRegistration(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException("verify-token.error.not-found", HttpStatus.NOT_FOUND));
        if (verificationToken.isExpired()) {
            throw new AppException("verify-token.error.expired", HttpStatus.BAD_REQUEST);
        }
        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);
    }
}
