package com.javatpoint.OneToMany;

import java.util.ArrayList;

import javax.persistence.*;

import com.javatpoint.mapping.Student;
import com.javatpoint.mapping.Library;

public class OneToManyExample {

	public static void main(String[] args) {

		EntityManagerFactory emf = Persistence.createEntityManagerFactory("books_issued");
		EntityManager em = emf.createEntityManager();
	
		em.getTransaction().begin();

		Library lib1 = new Library();
		lib1.setB_id(101);
		lib1.setB_name("Data Structure");

		Library lib2 = new Library();
		lib2.setB_id(102);
		lib2.setB_name("DBMS");

		em.merge(lib1);
		em.merge(lib2);

		ArrayList<Library> list = new ArrayList<Library>();
		list.add(lib1);
		list.add(lib2);

		Student st1 = new Student();
		st1.setS_id(1);
		st1.setS_name("Vipul");
		st1.setBooks_issued(list);

		em.merge(st1);

		em.getTransaction().commit();
		em.close();
		emf.close();

	}

}