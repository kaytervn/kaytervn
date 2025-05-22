package faahpamo.dao;

import faahpamo.model.*;
import java.util.*;

public interface BooksDAO {
    public int insertBook(Book b);
    public boolean updateBook(Book b);
    public boolean deleteBook(Book b);
    public Book findBook(int id);
    public ArrayList<Book> getAllBooks();
}