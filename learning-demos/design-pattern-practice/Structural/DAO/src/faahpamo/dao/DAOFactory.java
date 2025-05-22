package faahpamo.dao;

import faahpamo.dao.mysql.MysqlDataSourceDAOFactory;

public abstract class DAOFactory {

	public static final int MySQLDataSource = 1;

	public abstract BooksDAO getBooksDAO();

	public static DAOFactory getDAOFactory(int whichFactory) {
		switch (whichFactory) {
		case MySQLDataSource:
			return MysqlDataSourceDAOFactory.getInstance();
		default:
			return null;
		}
	}
}