package javatpoint.dao;

public class S {
	private String n;
	private int r;

	S(String n, int r) {
		this.n = n;
		this.r = r;
	}

	public String getName() {
		return n;
	}

	public void setName(String n) {
		this.n = n;
	}

	public int getRollNo() {
		return r;
	}

	public void setRollNo(int r) {
		this.r = r;
	}
}