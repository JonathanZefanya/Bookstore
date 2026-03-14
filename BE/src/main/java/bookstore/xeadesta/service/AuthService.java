package bookstore.xeadesta.service;

import bookstore.xeadesta.dto.AuthDto;
import bookstore.xeadesta.entity.User;
import bookstore.xeadesta.repository.UserRepository;
import bookstore.xeadesta.security.CustomUserDetails;
import bookstore.xeadesta.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authManager;
    @Autowired private JwtUtil jwtUtil;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .address(request.getAddress())
            .build();

        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);
        return buildAuthResponse(token, user);
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);
            return buildAuthResponse(token, userDetails.getUser());
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    private AuthDto.AuthResponse buildAuthResponse(String token, User user) {
        return new AuthDto.AuthResponse(
            token, "Bearer",
            user.getId(), user.getName(),
            user.getEmail(), user.getRole().name()
        );
    }
}
