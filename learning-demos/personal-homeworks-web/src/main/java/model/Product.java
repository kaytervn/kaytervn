package model;

import java.io.Serializable;
import java.text.NumberFormat;
import java.util.Locale;

@SuppressWarnings("serial")
public class Product implements Serializable {
	private String code;
	private String description;
	private double price;

	public Product() {
		code = "";
		description = "";
		price = 0;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public double getPrice() {
		return price;
	}

	public String getPriceCurrencyFormat() {
		NumberFormat currency = NumberFormat.getCurrencyInstance(Locale.US);
		return currency.format(price);
	}
}