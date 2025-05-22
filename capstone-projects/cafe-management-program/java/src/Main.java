import java.io.IOException;
import java.util.*;

public class Main {
    static public Date dDate;

    static public void main(String[] args) throws IOException {
        dDate = new Date();

        Cafe.setsCafename("GAMTIME Cafe");
        Cafe.setsOwner("Mr. Trong & Mr. Trung");
        Cafe.setsAddress("3 No. 9, KDC, District 7, Ho Chi Minh City");

        Cafe.setlStaffs(new ArrayList<>());
        Cafe.setlTables(new ArrayList<>());
        Cafe.setlServices(new ArrayList<>());
        Cafe.setlBills(new ArrayList<>());
        ReadData();
        Login();
    }

    public static String padRight(String s, int n) {
        return String.format("%-" + n + "s", s);
    }

    public static void clearScreen() {
        for (int i = 0; i < 20; i++) {
            System.out.println();
        }
    }

    static public void ReadData() throws IOException {
        Table.ReadDataTable();
        Service.ReadDataService();
        Bill.ReadDataBill();
        Staff.ReadDataStaff();
    }

    static public void InputDate(String name, String id) {
        clearScreen();
        OutputInfor(name, id);
        dDate.Input();
    }

    static public void Login() throws IOException {
        clearScreen();
        System.out.println("\t" + Cafe.getsCafename());
        System.out.println("Owner: " + Cafe.getsOwner());
        System.out.println("Addess: " + Cafe.getsAddress());
        System.out.println();
        System.out.println("\tLOGIN");
        Account lg = new Account();
        lg.Input();
        if (!Account.IsExist(lg)) {
            System.out.println("\n\tInvalid Username Or Password!");
            System.out.println("\n[0]. Try Again");
            int num = InputNumber(0, 0);
            Login();
        }
        Account.AccessLogin(lg);
    }

    static public int InputNumber_Int() {
        Scanner sc = new Scanner(System.in);
        int num;
        do {
            try {
                num = Integer.parseInt(sc.nextLine());
                if (num < 0)
                    continue;
                else
                    return num;
            } catch (Exception e) {
                continue;
            }
        } while (true);
    }

    static public double InputNumber_Double() {
        Scanner sc = new Scanner(System.in);
        double num;
        do {
            try {
                num = Double.parseDouble(sc.nextLine());
                if (num < 0)
                    continue;
                else
                    break;
            } catch (Exception e) {
                continue;
            }
        } while (true);
        return num;
    }

    static public int InputNumber(int dau, int cuoi) {
        Scanner sc = new Scanner(System.in);
        System.out.println("--------------------------------");
        int num;
        do {
            try {
                System.out.print("Please Enter A Number");
                if (dau != cuoi)
                    System.out.printf(" From %d To %d", dau, cuoi);
                System.out.print(": ");
                num = Integer.parseInt(sc.nextLine());

                if (num >= dau && num <= cuoi)
                    break;
                else
                    continue;
            } catch (Exception e) {
                continue;
            }
        } while (true);
        return num;
    }

    static public String InputString() {
        Scanner sc = new Scanner(System.in);
        String a;
        do {
            a = sc.nextLine();
        } while (a.contains(";"));
        return a;
    }

    static public void OutputInfor(String name, String id) {
        System.out.println("\t" + Cafe.getsCafename());
        System.out.println("Owner: " + Cafe.getsOwner());
        System.out.println("Addess: " + Cafe.getsAddress());
        System.out.println();
        System.out.println("\tUSER INFORMATION");
        System.out.println("Name: " + name);
        System.out.println("Staff ID: " + id);
        if (Date.IsDate(dDate.getiDay(), dDate.getiMonth(), dDate.getiYear())) {
            System.out.print("Date: ");
            dDate.Output();
        }
        System.out.println();
    }
}