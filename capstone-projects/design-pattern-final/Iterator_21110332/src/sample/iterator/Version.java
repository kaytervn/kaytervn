package sample.iterator;

import java.util.Date;

public class Version {
	private String content;
	private String timestamp;

	public Version(String content) {
		this.content = content;
		this.timestamp = new Date().toString();
	}

	public String toString() {
		return "Version [content=" + content + ", timestamp=" + timestamp + "]";
	}
}