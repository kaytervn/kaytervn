package com.gpcoder.patterns.creational.prototype.board;

public class PrototypeExample {
 
    public static void main(String[] args) {
        long startTime = System.currentTimeMillis();
 
        Board chessBoard = new Board();
 
        long endTime = System.currentTimeMillis();
 
        System.out.println("Time taken to create a board: " + (endTime - startTime) + " millis");
 
        chessBoard.print();
    }
}