package model;

import java.io.Serializable;
import java.util.ArrayList;

@SuppressWarnings("serial")
public class Cart implements Serializable {

	private ArrayList<LineItem> items;

	public Cart() {
		items = new ArrayList<LineItem>();
	}

	public ArrayList<LineItem> getItems() {
		return items;
	}

	public int getCount() {
		return items.size();
	}

	public void addItem(LineItem item) {
		String code = item.getProduct().getCode();
		int quantity = item.getQuantity();
		for (LineItem cartItem : items) {
			if (cartItem.getProduct().getCode().equals(code)) {
				cartItem.setQuantity(quantity);
				return;
			}
		}
		items.add(item);
	}

	public int getQuantity(String producCode) {
		for (LineItem cartItem : items) {
			if (cartItem.getProduct().getCode().equals(producCode)) {
				return cartItem.getQuantity();
			}
		}
		return -1;
	}

	public void removeItem(LineItem item) {
		String code = item.getProduct().getCode();
		for (int i = 0; i < items.size(); i++) {
			LineItem lineItem = items.get(i);
			if (lineItem.getProduct().getCode().equals(code)) {
				items.remove(i);
				return;
			}
		}
	}
}