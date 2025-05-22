package com.javatpoint.jpa.persist;

import com.javatpoint.jpa.student.*;
import javax.persistence.*;

public class PersistStudent {

	public static void main(String args[]) {
		EntityManagerFactory emf = Persistence.createEntityManagerFactory("Student_details");
		EntityManager em = emf.createEntityManager();

		em.getTransaction().begin();

		StudentEntity s1 = new StudentEntity();
		s1.setS_id(101);
		s1.setS_name("Gaurav");
		s1.setS_age(24);

		StudentEntity s2 = new StudentEntity();
		s2.setS_id(102);
		s2.setS_name("Ronit");
		s2.setS_age(22);

		StudentEntity s3 = new StudentEntity();
		s3.setS_id(103);
		s3.setS_name("Rahul");
		s3.setS_age(26);

		em.persist(s1);
		em.persist(s2);
		em.persist(s3);

		em.getTransaction().commit();

		emf.close();
		em.close();

	}
}