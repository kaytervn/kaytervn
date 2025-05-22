package com.javacodegeeks.patterns.prototypepattern;

public interface Prototype extends Cloneable {

	public AccessControl clone() throws CloneNotSupportedException;

}