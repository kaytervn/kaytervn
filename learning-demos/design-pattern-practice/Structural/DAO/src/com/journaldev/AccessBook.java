package com.journaldev;

import com.journaldev.dao.BookDao;
import com.journaldev.daoimpl.BookDaoImpl;
import com.journaldev.model.Books;

public class AccessBook {

	public static void main(String[] args) {

		BookDao bookDao = new BookDaoImpl();

		for (Books book : bookDao.getAllBooks()) {
			System.out.println("Book ISBN : " + book.getIsbn());
		}

		// update student
		Books book = bookDao.getAllBooks().get(1);
		book.setBookName("Algorithms");
		bookDao.saveBook(book);
	}
}
