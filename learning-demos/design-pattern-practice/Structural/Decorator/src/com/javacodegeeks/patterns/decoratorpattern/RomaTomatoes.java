package com.javacodegeeks.patterns.decoratorpattern;

public class RomaTomatoes extends PizzaDecorator {

	private final Pizza pizza;

	public RomaTomatoes(Pizza pizza) {
		this.pizza = pizza;
	}

	@Override
	public String getDesc() {
		return pizza.getDesc() + ", Roma Tomatoes (5.20)";
	}

	@Override
	public double getPrice() {
		return pizza.getPrice() + 5.20;
	}

}