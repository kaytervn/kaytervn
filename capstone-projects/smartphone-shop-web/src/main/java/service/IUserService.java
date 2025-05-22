package service;

import model.User;

public interface IUserService {
	User login(String email, String password);

	User findByEmail(String email);

	boolean register(String name, String email, String password, String code);

	boolean checkExistEmail(String email);

	boolean checkExistPhone(String phone);
}
