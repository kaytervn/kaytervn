package com.javacodegeeks.patterns.abstractfactorypattern;

public interface AbstractParserFactory {

	public XMLParser getParserInstance(String parserType);
}