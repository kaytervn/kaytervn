MySQL Backup (Dump): `mysqldump -u root -p <database-name> > D:\Downloads\dump_file.sql`

---

Change MySQL Root Password: `mysqladmin -u root -p password <new-password>`

---

Liquibase Export Data Changelog: `mvn liquibase:generateChangeLog -Dliquibase.diffTypes=data`

---

**View Table Relationships:**

```sql
SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME,
       REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'database_name'
  AND TABLE_NAME = 'table_name';
```

---

**Set UTF-8 Encoding for Database and Tables:**

- Set for the entire database: `ALTER DATABASE db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

- Set for a specific table: `ALTER TABLE db_name.table_name CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

- Generate queries for all tables:

  ```sql
  SELECT CONCAT('ALTER TABLE `', table_name, '` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;')
  FROM information_schema.tables
  WHERE table_schema = 'db_name';
  ```

---

**Create User and Grant Permissions:**

```sql
CREATE USER 'user_Po54a'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON db_tenant.* TO 'user_Po54a';
FLUSH PRIVILEGES;
```

---

**Install Timezone Data in MySQL:**

1. Download the timezone SQL package from: https://dev.mysql.com/downloads/timezones.html
2. Extract the ZIP file
3. Open MySQL Workbench (or any client)
4. Select the `mysql` database
5. Import and run the `.sql` file to load timezone info
