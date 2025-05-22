package com.javatpoint.jpa.persist;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import com.javatpoint.jpa.student.StudentEntity;  
public class UpdateStudent {  

	public static void main(String args[])  
	{  
		EntityManagerFactory emf=
				Persistence.createEntityManagerFactory("Student_details");  
		EntityManager em=emf.createEntityManager();  

		em.getTransaction().begin(); 


		StudentEntity s=em.find(StudentEntity.class,102);  
		System.out.println("Before Updation");  
		System.out.println("Student id = "+s.getS_id());  
		System.out.println("Student Name = "+s.getS_name());  
		System.out.println("Student Age = "+s.getS_age());  

		s.setS_age(30);  

		System.out.println("After Updation");  
		System.out.println("Student id = "+s.getS_id());  
		System.out.println("Student Name = "+s.getS_name());  
		System.out.println("Student Age = "+s.getS_age());  
		em.getTransaction().commit();  

		emf.close();  
		em.close(); 

	}  

}  