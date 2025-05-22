<h2>Hibernate Configuration</h2>

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

**4.** From the directory `../src/main/resources`, create file `hibernate.cfg.xml`.

```xml
<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE hibernate-configuration PUBLIC "-//Hibernate/Hibernate Configuration DTD//EN" "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
	<session-factory>
		<property name="hibernate.connection.driver_class">com.mysql.cj.jdbc.Driver</property>
		<property name="hibernate.connection.url">jdbc:mysql://localhost:3306/jpa_mapping?useSSL=false&amp;useUnicode=true&amp;characterEncoding=UTF-8</property>
		<property name="hibernate.connection.username">root</property>
		<property name="hibernate.connection.password">1234</property>

		<property name="hibernate.current_session_context_class">thread</property>
		<property name="hibernate.dialect">org.hibernate.dialect.MySQL5Dialect</property>
		<property name="hibernate.show_sql">true</property>
		<property name="hibernate.format_sql">true</property>
		<property name="hibernate.connection.CharSet">utf8</property>
		<property name="hibernate.connection.characterEncoding">utf8</property>
		<property name="hibernate.hbm2ddl.auto">create</property>

		<mapping resource="cart.hbm.xml" />
		<mapping resource="items.hbm.xml" />
	</session-factory>
</hibernate-configuration>
```

- Mapping to entity (model) directly **(entity class created with annotation)**:

```xml
<hibernate-configuration>
	<session-factory>
		...
		<mapping class="com.journaldev.hibernate.model.Cart" />
		<mapping class="com.journaldev.hibernate.model.Items" />
	</session-factory>
</hibernate-configuration>
```

---

- Mapping through `.xml` file:

Go to top bar: `Window` -> `Preference` -> `Maven` -> tick the option `Download Artifact Javadoc`, then `Apply & Close`.

```xml
<hibernate-configuration>
	<session-factory>
        ...
		<mapping resource="cart.hbm.xml" />
		<mapping resource="items.hbm.xml" />
	</session-factory>
</hibernate-configuration>
```

From the directory `../src/main/resources`.

Create file `cart.hbm.xml`.

```xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
	"https://hibernate.org/dtd/hibernate-mapping-3.0.dtd">

<hibernate-mapping
	package="com.journaldev.hibernate.model">
	<class name="Cart" table="CART">
		<id name="id" type="long">
			<column name="cart_id" />
			<generator class="identity" />
		</id>
		<property name="total" type="double">
			<column name="total" />
		</property>
		<property name="name" type="string">
			<column name="name" />
		</property>
		<set name="items" table="ITEMS" fetch="select">
			<key>
				<column name="cart_id" not-null="true"></column>
			</key>
			<one-to-many class="Items" />
		</set>
	</class>
</hibernate-mapping>
```

And file `items.hbm.xml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE hibernate-mapping PUBLIC "-//Hibernate/Hibernate Mapping DTD 3.0//EN"
"https://hibernate.org/dtd/hibernate-mapping-3.0.dtd">

<hibernate-mapping
	package="com.journaldev.hibernate.model">
	<class name="Items" table="ITEMS">
		<id name="id" type="long">
			<column name="id" />
			<generator class="identity" />
		</id>
		<property name="itemId" type="string">
			<column name="item_id"></column>
		</property>
		<property name="itemTotal" type="double">
			<column name="item_total"></column>
		</property>
		<property name="quantity" type="integer">
			<column name="quantity"></column>
		</property>

		<many-to-one name="cart" class="Cart">
			<column name="cart_id" not-null="true"></column>
		</many-to-one>
	</class>
</hibernate-mapping>
```

---

**5.** Create hibernate SessionFactory utility class `HibernateUtil.java`.

```java
package com.journaldev.hibernate.util;

import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

public class HibernateUtil {

	public static SessionFactory factory;

	private HibernateUtil() {
	}

	private static SessionFactory buildSessionFactory() {
		try {
			Configuration configuration = new Configuration();
			configuration.configure("hibernate.cfg.xml");
			return configuration.buildSessionFactory();
		} catch (Throwable ex) {
			System.err.println("Initial SessionFactory creation failed." + ex);
			throw new ExceptionInInitializerError(ex);
		}
	}

	public static SessionFactory getSessionFactory() {
		if (factory == null)
			factory = buildSessionFactory();
		return factory;
	}
}
```

**6.** Create database named "JPA_mapping" in MySQL Workbench.

**8.** Test program.
