package com.javacodegeeks.patterns.abstractfactorypattern;

public class TestAbstractFactoryPattern {

	public static void main(String[] args) {

		AbstractParserFactory parserFactory = ParserFactoryProducer.getFactory("NYFactory");
		XMLParser parser = parserFactory.getParserInstance("NYORDER");
		String msg = "";
		msg = parser.parse();
		System.out.println(msg);

		System.out.println("************************************");

		parserFactory = ParserFactoryProducer.getFactory("TWFactory");
		parser = parserFactory.getParserInstance("TWFEEDBACK");
		msg = parser.parse();
		System.out.println(msg);
	}

}