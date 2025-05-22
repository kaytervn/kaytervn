import java.util.*;

public class Cafe {
    static private List<Staff> lStaffs;
    static private List<Service> lServices;
    static private List<Table> lTables;
    static private List<Bill> lBills;
    static private String sCafename;
    static private String sOwner;
    static private String sAddress;
    static private double dTotal;

    public static List<Staff> getlStaffs() {
        return lStaffs;
    }

    public static void setlStaffs(List<Staff> lStaffs) {
        Cafe.lStaffs = lStaffs;
    }

    public static List<Service> getlServices() {
        return lServices;
    }

    public static void setlServices(List<Service> lServices) {
        Cafe.lServices = lServices;
    }

    public static List<Table> getlTables() {
        return lTables;
    }

    public static void setlTables(List<Table> lTables) {
        Cafe.lTables = lTables;
    }

    public static List<Bill> getlBills() {
        return lBills;
    }

    public static void setlBills(List<Bill> lBills) {
        Cafe.lBills = lBills;
    }

    public static String getsCafename() {
        return sCafename;
    }

    public static void setsCafename(String sCafename) {
        Cafe.sCafename = sCafename;
    }

    public static String getsOwner() {
        return sOwner;
    }

    public static void setsOwner(String sOwner) {
        Cafe.sOwner = sOwner;
    }

    public static String getsAddress() {
        return sAddress;
    }

    public static void setsAddress(String sAddress) {
        Cafe.sAddress = sAddress;
    }

    public static double getdTotal() {
        return dTotal;
    }

    public static void setdTotal(double dTotal) {
        Cafe.dTotal = dTotal;
    }
}