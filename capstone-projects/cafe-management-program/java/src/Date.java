import java.util.*;

public class Date {
    //Fields
    private int iDay;
    private int iMonth;
    private int iYear;

    public int getiDay() {
        return iDay;
    }

    public void setiDay(int iDay) {
        this.iDay = iDay;
    }

    public int getiMonth() {
        return iMonth;
    }

    public void setiMonth(int iMonth) {
        this.iMonth = iMonth;
    }

    public int getiYear() {
        return iYear;
    }

    public void setiYear(int iYear) {
        this.iYear = iYear;
    }

    //Constructors
    public Date() {
    }

    //Input
    public void Input() {
        Scanner sc = new Scanner(System.in);
        String a;
        String[] b;
        do {
            try {
                System.out.print("Date [dd/mm/yyyy]: ");
                a = sc.nextLine();
                b = a.split("/");

                this.iDay = Integer.parseInt(b[0]);
                this.iMonth = Integer.parseInt(b[1]);
                this.iYear = Integer.parseInt(b[2]);
                if (!IsDate(this.iDay, this.iMonth, this.iYear)) continue;
                else break;
            } catch (Exception e) {
                continue;
            }
        } while (true);
    }

    //Output
    public void Output() {
        System.out.println(this.iDay + "/" + this.iMonth + "/" + this.iYear);
    }

    //DATE methods
    static public boolean IsDate(int Day, int Month, int Year) {
        return Day > 0 && Day <= DaysInMonth(Month, Year) && Month > 0 && Month < 13 && Year > 0;
    }

    static boolean IsLeapYear(int y) {
        return (y % 4 == 0) && (y % 100 != 0 || y % 400 == 0);
    }

    static int DaysInMonth(int m, int y) {
        if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
        else if (m == 2) {
            if (IsLeapYear(y)) return 29;
            else return 28;
        } else return 31;
    }

    //Operators
    public static boolean IsEqual(Date a, Date b) {
        return (a.getiDay() == b.getiDay()) && (a.getiMonth() == b.getiMonth()) && (a.getiYear() == b.getiYear());
    }

    public static boolean IsMore(Date a, Date b) {
        if (a.getiYear() > b.getiYear()) return true;
        else if (a.getiYear() < b.getiYear()) return false;

        if (a.getiMonth() > b.getiMonth()) return true;
        else if (a.getiMonth() < b.getiMonth()) return false;

        return a.getiDay() > b.getiDay();
    }

    public static String ToString(Date a) {
        String day = "";
        day += a.getiDay() + "/" + a.getiMonth() + "/" + a.getiYear();
        return day;
    }

    public static Date ToDate(String a) {
        Date d = new Date();
        String[] b = a.split("/");

        d.setiDay(Integer.parseInt(b[0]));
        d.setiMonth(Integer.parseInt(b[1]));
        d.setiYear(Integer.parseInt(b[2]));

        return d;
    }
}
