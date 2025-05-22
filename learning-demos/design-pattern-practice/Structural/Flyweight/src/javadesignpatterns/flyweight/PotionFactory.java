package javadesignpatterns.flyweight;

import java.util.EnumMap;
import java.util.Map;

public class PotionFactory {

	private final Map<PotionType, Potion> potions;

	public PotionFactory() {
		potions = new EnumMap<>(PotionType.class);
	}

	Potion createPotion(PotionType type) {
		return potions.computeIfAbsent(type, t -> {
			switch (t) {
			case HEALING:
				return new HealingPotion();
			case HOLY_WATER:
				return new HolyWaterPotion();
			case INVISIBILITY:
				return new InvisibilityPotion();
			case STRENGTH:
				return new StrengthPotion();
			case POISON:
				return new PoisonPotion();
			default:
				throw new IllegalArgumentException("Unrecognized potion type: " + t);
			}
		});
	}
}
