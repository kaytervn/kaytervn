package faahpamo.model;

public class Book {
	private Integer bookID;
	private String title;

	public Book() {

	}

	public void setBookID(int id) {
		this.bookID = id;
	}

	public Integer getBookID() {
		return this.bookID;
	}

	public void setTitle(String name) {
		this.title = name;
	}

	public String getTitle() {
		return this.title;
	}

	@Override
	public String toString() {
		return this.bookID + ", " + this.title;
	}
}