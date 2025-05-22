package com.gpcoder.patterns.behavioral.visitor.singledispatch.example1;

import com.gpcoder.patterns.behavioral.visitor.singledispatch.ProgramingBook;
import com.gpcoder.patterns.behavioral.visitor.singledispatch.example2.Developer2;
import com.gpcoder.patterns.behavioral.visitor.singledispatch.Book;

public class SingleDispatchExample {

	public static void main(String[] args) {
		Book book = new ProgramingBook(); // (1)
		Customer gpcoder = new Developer();
		gpcoder.buy(book);

		ProgramingBook programingBook = new ProgramingBook(); // (2)
		gpcoder.buy(programingBook); // Developer buy a Programing Book

		System.out.println("---");

		gpcoder = new Developer2();
		gpcoder.buy(book);
		gpcoder.buy(programingBook); // Developer buy a Programing Book
	}
}