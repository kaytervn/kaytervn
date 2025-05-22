<h2>Persistence Operations | JAVA PERSISTENCE API (JPA)</h2>

**1.** Create Maven Project.

**2.** Add dependencies to file `pom.xml`.

```xml
<dependencies>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.33</version>
    </dependency>
    <dependency>
        <groupId>org.hibernate</groupId>
        <artifactId>hibernate-core</artifactId>
        <version>5.6.15.Final</version>
    </dependency>
</dependencies>
```

**3.** Add Entity Java Classes.

**4.** From directory `../src/main/resources`, create folder `META-INF`.

**5.** Create file `persistence.xml`.

```xml
<persistence xmlns="http://java.sun.com/xml/ns/persistence"
	version="2.0">
	<persistence-unit name="Student_details">
		<provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>
		<class>com.javatpoint.jpa.student.StudentEntity</class>
		<properties>
			<property name="javax.persistence.jdbc.driver"
				value="com.mysql.cj.jdbc.Driver" />
			<property name="javax.persistence.jdbc.url"
				value="jdbc:mysql://localhost:3306/JPA_db2" />
			<property name="javax.persistence.jdbc.user" value="root" />
			<property name="javax.persistence.jdbc.password"
				value="1234" />

			<property name="hibernate.dialect"
				value="org.hibernate.dialect.MySQL5Dialect" />
			<property name="hibernate.show_sql" value="true" />
			<property name="hibernate.format_sql" value="true" />
			<property name="hibernate.connection.CharSet" value="utf8" />
			<property name="hibernate.connection.characterEncoding"
				value="utf8" />
			<property name="hibernate.hbm2ddl.auto" value="update" />
		</properties>
	</persistence-unit>
</persistence>
```

**6.** Create database named "JPA_db2" in MySQL Workbench.

**7.** Run As -> Maven clean/ Maven verify.

**8.** Persist the JPA Entity.

```java
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
```

**9.** Run As -> Java Aplication.

<i><b>Not working?:</b> refresh file `pom.xml`, file `persistence.xml`, clean and verify Maven</i>

<i><b>One to Many:</b> replace command `persist` with the command `merge`</i>
