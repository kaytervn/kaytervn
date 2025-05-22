package com.javacodegeeks.patterns.decoratorpattern;

public class SimplyVegPizza implements Pizza {

	@Override
	public String getDesc() {
		return "SimplyVegPizza (230)";
	}

	@Override
	public double getPrice() {
		return 230;
	}

}