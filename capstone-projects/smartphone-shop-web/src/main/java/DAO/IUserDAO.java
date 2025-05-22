package DAO;

import model.User;

public interface IUserDAO {
	User findByEmail(String email);
	boolean checkExistEmail(String email);
	boolean checkExistPhone(String phoneNumber);
}
