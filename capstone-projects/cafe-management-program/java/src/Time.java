import java.util.*;

public class Time {
    //Fields
    private int iHour;
    private int iMinute;
    private int iSecond;

    //Properties
    public int getiHour() {
        return iHour;
    }

    public void setiHour(int iHour) {
        this.iHour = iHour;
    }

    public int getiMinute() {
        return iMinute;
    }

    public void setiMinute(int iMinute) {
        this.iMinute = iMinute;
    }

    public int getiSecond() {
        return iSecond;
    }

    public void setiSecond(int iSecond) {
        this.iSecond = iSecond;
    }

    //Constructors
    public Time() {

    }

    //Input
    public void Input() {
        Scanner sc = new Scanner(System.in);
        String a;
        String[] b;
        while (true) {
            try {
                System.out.print("Time [hh:mm:ss]: ");
                a = sc.nextLine();
                b = a.split(":");

                this.iHour = Integer.parseInt(b[0]);
                this.iMinute = Integer.parseInt(b[1]);
                this.iSecond = Integer.parseInt(b[2]);

                if (!IsTime(this.iHour, this.iMinute, this.iSecond))
                    continue;
                else
                    break;
            } catch (Exception e) {
                continue;
            }
        }
    }

    //Output
    public void Output() {
        System.out.println(this.iHour + ":" + this.iMinute + ":" + this.iSecond);
    }

    //Methods
    boolean IsTime(int Hour, int Minute, int Second) {
        return Hour >= 0 && Hour <= 23 && Minute >= 0 && Minute <= 59 && Second >= 0 && Second <= 59;
    }

    //Operators
    public static boolean IsMore(Time a, Time b) {
        if (a.getiHour() > b.getiHour())
            return true;
        else if (a.getiHour() < b.getiHour())
            return false;

        if (a.getiMinute() > b.getiMinute())
            return true;
        else if (a.getiMinute() < b.getiMinute())
            return false;

        return a.getiSecond() > b.getiSecond();
    }

    public static String ToString(Time a) {
        String tg = "";
        tg += a.getiHour() + ":" + a.getiMinute() + ":" + a.getiSecond();
        return tg;
    }

    public static Time ToTime(String a) {
        Time d = new Time();
        String[] b = a.split(":");

        d.setiHour(Integer.parseInt(b[0]));
        d.setiMinute(Integer.parseInt(b[1]));
        d.setiSecond(Integer.parseInt(b[2]));

        return d;
    }
}