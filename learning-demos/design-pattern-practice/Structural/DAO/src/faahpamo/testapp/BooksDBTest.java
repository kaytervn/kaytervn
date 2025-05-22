package faahpamo.testapp;

import java.sql.*;

public class BooksDBTest {

	public static void main(String[] args) {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			Connection conn = DriverManager
					.getConnection("jdbc:mysql://localhost:3306/booklib?user=root&password=1234");
			Statement stmt = conn.createStatement();
			String query = "SELECT book_id, title FROM books";
			ResultSet rs = stmt.executeQuery(query);
			while (rs.next()) {
				System.out.println("Book ID: " + rs.getInt("book_id") + " Title: " + rs.getString("title"));
			}
			rs.close();
			stmt.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}