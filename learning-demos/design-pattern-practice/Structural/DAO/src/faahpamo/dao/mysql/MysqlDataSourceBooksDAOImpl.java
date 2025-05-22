package faahpamo.dao.mysql;

import faahpamo.dao.*;
import java.util.ArrayList;
import faahpamo.model.Book;
import java.sql.*;

public class MysqlDataSourceBooksDAOImpl implements BooksDAO {

    public int insertBook(Book book) {
        MysqlDataSourceDAOFactory daoFactory = MysqlDataSourceDAOFactory.getInstance();
        Connection c = daoFactory.getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;
        String query = "INSERT INTO books(title) values(?)";

        try {
            ps = c.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, book.getTitle());
            ps.executeUpdate();
            rs = ps.getGeneratedKeys();
            int id = 0;
            if (rs.next()) {
                id = rs.getInt(1);
            }
            return id;
        } catch (SQLException e) {
            e.printStackTrace();
            return 0;
        } finally {
            daoFactory.freeConnection(c);
        }
    }

    public boolean updateBook(Book b) {
        return false;
    }

    public boolean deleteBook(Book b) {
        return false;
    }

    public Book findBook(int id) {
        MysqlDataSourceDAOFactory daoFactory = MysqlDataSourceDAOFactory.getInstance();
        Connection c = daoFactory.getConnection();
        PreparedStatement ps = null;
        ResultSet rs = null;
        String query = "SELECT * FROM books WHERE book_id=?";
        Book book = null;
        try {
            ps = c.prepareStatement(query);
            ps.setInt(1, id);
            rs = ps.executeQuery();
            book = new Book();
            while (rs.next()) {
                book.setBookID(rs.getInt("book_id"));
                book.setTitle(rs.getString("title"));
            }
            return book;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        } finally {
            daoFactory.freeConnection(c);
        }
    }

    public ArrayList<Book> getAllBooks() {
        MysqlDataSourceDAOFactory daoFactory = MysqlDataSourceDAOFactory.getInstance();
        Connection c = daoFactory.getConnection();

        PreparedStatement ps = null;
        ResultSet rs = null;
        String query = "SELECT * FROM books";
        ArrayList<Book> bookList = new ArrayList<Book>();
        try {
            ps = c.prepareStatement(query);
            rs = ps.executeQuery();
            while (rs.next()) {
                Book book = new Book();
                book.setBookID(rs.getInt("book_id"));
                book.setTitle(rs.getString("title"));
                bookList.add(book);
            }
            return bookList;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        } finally {
            daoFactory.freeConnection(c);
        }
    }
}