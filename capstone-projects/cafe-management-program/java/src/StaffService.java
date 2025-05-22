import java.io.IOException;
import java.util.Scanner;

public class StaffService extends Staff implements ITable, IOrder {
    //Fields
    private double dSalary;
    private double dOfficialSalary;
    private int iWorkingDays;

    public double getdSalary() {
        return dSalary;
    }

    public void setdSalary(double dSalary) {
        this.dSalary = dSalary;
    }

    public double getdOfficialSalary() {
        return dOfficialSalary;
    }

    public int getiWorkingDays() {
        return iWorkingDays;
    }

    //constructor
    public StaffService() {
    }

    public StaffService(String sID, String sName, String sIDCard, String sSex, Date dBirth, String sPhoneNumber, String sAddress, String sType, Account aAccount, double dSalary, int iWorkingDays, double dOfficialSalary) {
        super(sID, sName, sIDCard, sSex, dBirth, sPhoneNumber, sAddress, sType, aAccount);
        this.dSalary = dSalary;
        this.dOfficialSalary = dOfficialSalary;
        this.iWorkingDays = iWorkingDays;
    }

    @Override
    public void Login() throws IOException {
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());

        System.out.println("[0]. Information");
        System.out.println("[1]. Table Manager");
        System.out.println("[2]. Log out");

        int num = Main.InputNumber(0, 2);
        switch (num) {
            case 0 -> {
                System.out.println("\n\t\t[STAFF INFORMATION]");
                Staff.OutputFields();
                Output();
                System.out.println();
                System.out.println("[0]. Back");
                int num2 = Main.InputNumber(0, 0);
                Login();
            }
            case 1 -> ShowTableList();
            case 2 -> Main.Login();
        }
    }

    public void SolveOfficialSalary() {
        this.dOfficialSalary = this.dSalary * this.iWorkingDays;
    }

    @Override
    public int FindPadRight() {
        int max = super.FindPadRight();
        while (String.valueOf(this.dSalary).length() > max || String.valueOf(this.iWorkingDays).length() > max || String.valueOf(this.dOfficialSalary).length() > max) {
            max++;
        }
        return max;
    }

    public void InputSalary() {
        System.out.print("Wage (VND): ");
        this.setdSalary(Main.InputNumber_Double());
        SolveOfficialSalary();
    }

    public void InputWorkingDays() {
        System.out.print("Working Days: ");
        iWorkingDays = Main.InputNumber_Int();
        SolveOfficialSalary();
    }

    @Override
    public void Input() {
        super.Input();
        InputSalary();
        InputWorkingDays();
        SolveOfficialSalary();
    }

    @Override
    public void Output() {
        System.out.println(Main.padRight(this.getsID(), PadRightMax()) + Main.padRight(this.getsName(), PadRightMax()) + Main.padRight(this.getsIDCard(), PadRightMax()) + Main.padRight(this.getsSex(), PadRightMax()) + Main.padRight(Date.ToString(this.getdBirth()), PadRightMax()) + Main.padRight(this.getsPhoneNumber(), PadRightMax()) + Main.padRight(this.getsAddress(), PadRightMax()) + Main.padRight(this.getsType(), PadRightMax()) + Main.padRight(this.getaAccount().getsUsername(), PadRightMax()) + Main.padRight(this.getaAccount().getsPassword(), PadRightMax()) + Main.padRight(String.valueOf(this.getdSalary()), PadRightMax()) + Main.padRight(String.valueOf(this.getiWorkingDays()), PadRightMax()) + this.getdOfficialSalary());
    }

    //Order
    @Override
    public void OrderService(Table tb, int pos) throws IOException {
        Table.WriteDataTable();
        Service.WriteDataService();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("Current Table ID: " + tb.getsID());
        System.out.println();
        System.out.println("\t\t[SERVICE ORDERING]");

        int num;

        if (tb.getlOrder().size() == 0) {
            System.out.println("\n\t\tNo Service Ordered");
            System.out.println();
            System.out.println("[0]. Make New Order");
            System.out.println("[1]. Back");
            num = Main.InputNumber(0, 1);
            switch (num) {
                case 0 -> MakeNewOrder(tb, pos);
                case 1 -> OpenTable(tb, pos);
            }
        } else {
            Order.OutputFields(tb.getlOrder());
            for (int i = 0; i < tb.getlOrder().size(); i++) {
                tb.getlOrder().get(i).Output(tb.getlOrder());
            }

            System.out.println();
            System.out.println("[0]. Make New Order");
            System.out.println("[1]. Pay Off");
            System.out.println("[2]. Back");
            num = Main.InputNumber(0, 2);
            switch (num) {
                case 0 -> MakeNewOrder(tb, pos);
                case 1 -> PayOff(tb, pos);
                case 2 -> OpenTable(tb, pos);
            }
        }
    }

    @Override
    public void MakeNewOrder(Table tb, int pos) throws IOException {
        Table.WriteDataTable();
        Service.WriteDataService();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("Current Table ID: " + tb.getsID());
        System.out.println();
        System.out.println("\t\t[SERVICE MENU]");

        int num;
        if (Cafe.getlServices().size() == 0) {
            System.out.println("\n\t\tNo Service Added\n");
            System.out.println("[0]. Back");
            num = Main.InputNumber(0, 0);
            OrderService(tb, pos);
        } else {
            Service.OutputFields();
            for (int i = 0; i < Cafe.getlServices().size(); i++) {
                Cafe.getlServices().get(i).Output();
            }
            System.out.println();
            System.out.println("[0]. Select Service");
            System.out.println("[1]. Back");

            num = Main.InputNumber(0, 1);
            switch (num) {
                case 0 -> {
                    tb.setsStatus("Served");
                    System.out.println("\n\t[ORDER SERVICE]\n");
                    int SVpos = Order.SelectService();
                    Order od = new Order();
                    od.setsServiceName(Cafe.getlServices().get(SVpos).getsName());
                    od.InputAmount(SVpos);
                    od.setdPrice(Cafe.getlServices().get(SVpos).getdPrice());
                    od.CalsCost();
                    tb.getlOrder().add(od);
                    MakeNewOrder(tb, pos);
                }
                case 1 -> OrderService(tb, pos);
            }
        }
    }

    @Override
    public void PayOff(Table tb, int pos) throws IOException {
        Bill bl = new Bill();
        bl.Input();
        bl.setsStaffName(this.getsName());
        bl.setdDate(Main.dDate);
        bl.CalsTotal(tb.getlOrder());
        Cafe.getlBills().add(bl);

        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.printf("\t\t[BILL - ID: %s]\n", bl.getsID());
        System.out.println("\tCurrent Table ID: " + tb.getsID());
        System.out.print("\tDate: ");
        bl.dDate.Output();
        System.out.print("\tTime: ");
        bl.tTime.Output();
        System.out.println();
        System.out.println("\t\t[SERVICE ORDERED]");
        Order.OutputFields(tb.getlOrder());
        for (int i = 0; i < tb.getlOrder().size(); i++) {
            tb.getlOrder().get(i).Output(tb.getlOrder());
        }
        System.out.println("\t--------------------------------");
        System.out.println("\tTotal: " + bl.getdTotal() + " (VND)");

        tb.getlOrder().clear();
        tb.setsStatus("Empty");
        Table.WriteDataTable();

        Bill.CalsToTalIncome();
        Bill.WriteDataBill();

        System.out.println();
        System.out.println("[0]. Continue");
        int num = Main.InputNumber(0, 0);
        ShowTableList();
    }

    //Table
    @Override
    public void ShowTableList() throws IOException {
        Table.WriteDataTable();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[TABLE LIST]");
        int num;
        if (Cafe.getlTables().size() > 0) {
            System.out.println("\n\t" + Main.padRight("[ID]", 20) + "[STATUS]");
            for (int i = 0; i < Cafe.getlTables().size(); i++) {
                Cafe.getlTables().get(i).Output();
            }

            System.out.println();
            System.out.println("[0]. Select Table");
            System.out.println("[1]. Search Table");
            System.out.println("[2]. Sort Table");
            System.out.println("[3]. Back");

            num = Main.InputNumber(0, 3);

            switch (num) {
                case 0 -> {
                    int pos = Table.SelectTable();
                    OpenTable(Cafe.getlTables().get(pos), pos);
                }
                case 1 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Table Bar: ");
                    String b = sc.nextLine();
                    SearchTableOption(b);
                }
                case 2 -> SortTable();
                case 3 -> Login();
            }
        } else {
            System.out.println("\n\t\tNo Table Added\n");
            System.out.println("[0]. Back");
            num = Main.InputNumber(0, 0);
            Login();
        }
    }

    @Override
    public void SearchTableOption(String a) throws IOException {
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());

        a = a.toLowerCase();
        boolean check = false;
        int num;

        System.out.println("\t\t[TABLE SEARCHING]");

        for (int i = 0; i < Cafe.getlTables().size(); i++) {
            if (Cafe.getlTables().get(i).getsID().toLowerCase().contains(a) || Cafe.getlTables().get(i).getsStatus().toLowerCase().contains(a)) {
                check = true;
                break;
            }
        }

        if (check) {
            System.out.println("\n\t" + Main.padRight("[ID]", 20) + "[STATUS]");
            for (int i = 0; i < Cafe.getlTables().size(); i++) {
                if (Cafe.getlTables().get(i).getsID().toLowerCase().contains(a) || Cafe.getlTables().get(i).getsStatus().toLowerCase().contains(a)) {
                    Cafe.getlTables().get(i).Output();
                }
            }
            System.out.println();
            System.out.println("[0]. Select Table");
            System.out.println("[1]. Search Again");
            System.out.println("[2]. Back");

            num = Main.InputNumber(0, 2);
            switch (num) {
                case 0 -> {
                    int pos = Table.SelectTable();
                    OpenTable(Cafe.getlTables().get(pos), pos);
                }
                case 1 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Table Bar: ");
                    String b = sc.nextLine();
                    SearchTableOption(b);
                }
                case 2 -> ShowTableList();
            }
        } else {
            System.out.println("\n\t\tNo Search Result\n");
            System.out.println("[0]. Search Again");
            System.out.println("[1]. Back");

            num = Main.InputNumber(0, 1);
            switch (num) {
                case 0 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Table Bar: ");
                    String b = sc.nextLine();
                    SearchTableOption(b);
                }
                case 1 -> ShowTableList();
            }
        }
    }

    @Override
    public void OpenTable(Table tb, int pos) throws IOException {
        Table.WriteDataTable();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[TABLE SETTINGS]");
        System.out.println("\n\t" + Main.padRight("[ID]", 20) + "[STATUS]");
        tb.Output();
        System.out.println();
        System.out.println("[0]. Order Service");
        System.out.println("[1]. Back");

        int num = Main.InputNumber(0, 1);
        switch (num) {
            case 0 -> OrderService(tb, pos);
            case 1 -> ShowTableList();
        }
    }

    @Override
    public void SortTable() throws IOException {
        Service.WriteDataService();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[TABLE SORTING]");
        System.out.println("\n\t" + Main.padRight("[ID]", 20) + "[STATUS]");
        for (int i = 0; i < Cafe.getlTables().size(); i++) {
            Cafe.getlTables().get(i).Output();
        }
        System.out.println();
        System.out.println("[0]. Sort (ID)");
        System.out.println("[1]. Sort (Status)");
        System.out.println("[2]. Back");
        int num = Main.InputNumber(0, 2);
        switch (num) {
            case 0 -> {
                Table.SortID();
                SortTable();
            }
            case 1 -> {
                Table.SortStatus();
                SortTable();
            }
            case 2 -> ShowTableList();
        }
    }
}
