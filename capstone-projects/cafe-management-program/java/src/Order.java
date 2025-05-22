import java.util.List;
import java.util.*;

public class Order {
    //fields
    private String sServiceName;
    private int iAmount;
    private double dPrice;
    private double dCost;

    //properties
    public String getsServiceName() {
        return sServiceName;
    }

    public void setsServiceName(String sServiceName) {
        this.sServiceName = sServiceName;
    }

    public int getiAmount() {
        return iAmount;
    }

    public void setiAmount(int iAmount) {
        this.iAmount = iAmount;
    }

    public double getdPrice() {
        return dPrice;
    }

    public void setdPrice(double dPrice) {
        this.dPrice = dPrice;
    }

    public double getdCost() {
        return dCost;
    }

    public void setdCost(double dCost) {
        this.dCost = dCost;
    }

    //contructor
    public Order() {
    }

    public Order(String servicename, int amount, double price, double cost) {
        sServiceName = servicename;
        iAmount = amount;
        dPrice = price;
        dCost = cost;
    }

    //Inputs
    public void InputAmount(int pos) {
        System.out.println("Amount To Order: ");
        iAmount = Main.InputNumber(1, Cafe.getlServices().get(pos).getiAmount());
        Cafe.getlServices().get(pos).setiAmount(Cafe.getlServices().get(pos).getiAmount() - iAmount);
    }

    //Output
    public void Output(List<Order> loders) {
        System.out.println("\t" + Main.padRight(sServiceName, PadRightMax(loders))
                + Main.padRight(String.valueOf(iAmount), PadRightMax(loders))
                + Main.padRight(String.valueOf(dPrice), PadRightMax(loders))
                + dCost);
    }

    static public void OutputFields(List<Order> loders) {
        System.out.println(Main.padRight("\n\t[SERVICE NAME]", PadRightMax(loders)) +
                Main.padRight("  [AMOUNT]", PadRightMax(loders)) +
                Main.padRight("  [PRICE]", PadRightMax(loders)) +
                "  [COST]");
    }

    //Methods
    public int FindPadRight() {
        int max = 1;
        while (sServiceName.length() > max
                || String.valueOf(iAmount).length() > max
                || String.valueOf(dPrice).length() > max
                || String.valueOf(dCost).length() > max) {
            max++;
        }
        return max;
    }

    static public int PadRightMax(List<Order> loders) {
        int len = loders.get(0).FindPadRight();
        for (int i = 1; i < loders.size(); i++) {
            if (loders.get(i).FindPadRight() > len)
                len = loders.get(i).FindPadRight();
        }
        return len + 10;
    }

    static public int SelectService() {
        Scanner sc = new Scanner(System.in);
        String id;
        int pos;
        do {
            try {
                System.out.print(" => Now Enter Service ID: ");
                id = sc.nextLine();
                pos = Service.SearchService(id);
                if (pos == -1 || Cafe.getlServices().get(pos).getiAmount() == 0)
                    continue;
                else
                    break;
            } catch (Exception e) {
                continue;
            }
        } while (true);
        return pos;
    }

    public void CalsCost() {
        dCost = dPrice * iAmount;
    }
}
