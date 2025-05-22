package javadesignpatterns.adapter;

import java.util.logging.Logger;

public class FishingBoat {
	public void sail() {
		Logger logger = Logger.getLogger(FishingBoat.class.getName());
		logger.info("The fishing boat is sailing");
	}
}
