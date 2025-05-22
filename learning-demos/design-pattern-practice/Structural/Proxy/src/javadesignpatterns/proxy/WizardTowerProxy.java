package javadesignpatterns.proxy;

public class WizardTowerProxy implements WizardTower {

	private static final int NUM_WIZARDS_ALLOWED = 3;

	private int numWizards;

	private final WizardTower tower;

	public WizardTowerProxy(WizardTower tower) {
		this.tower = tower;
	}

	@Override
	public void enter(Wizard wizard) {
		if (numWizards < NUM_WIZARDS_ALLOWED) {
			tower.enter(wizard);
			numWizards++;
		} else {
			System.out.println(wizard + " is not allowed to enter!");
		}
	}
}