package service.impl;

import DAO.impl.UserDAOImpl;
import model.User;
import service.IUserService;
import utility.Upload;

public class UserServiceImpl extends BaseServiceImpl<User> implements IUserService {

	UserDAOImpl userDAO = new UserDAOImpl();
	Upload upload = new Upload();

	@Override
	public User login(String email, String password) {
		User user = this.findByEmail(email);
		if (user != null && password.equals(user.getPassword())) {
			return user;
		}
		return null;
	}

	@Override
	public User findByEmail(String email) {
		return userDAO.findByEmail(email);
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean register(String name, String email, String password, String code){
		if (userDAO.checkExistEmail(email))
			return false;
		userDAO.insert(new User(name, User.Role.USER, User.Gender.UNKNOWN, email, password, code, User.Status.INACTIVE));
		return true;
	}

	@Override
	public boolean checkExistEmail(String email) {
		return userDAO.checkExistEmail(email);
	}

	@Override
	public boolean checkExistPhone(String phoneNumber) {
		return userDAO.checkExistPhone(phoneNumber);
	}
}
