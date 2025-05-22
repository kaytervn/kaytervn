import java.io.*;
import java.util.*;

public class Bill {
    //fields
    private String sID = "BL";
    private String sStaffName;
    Date dDate;
    Time tTime;
    private double dTotal;

    //properties
    public String getsID() {
        return sID;
    }

    public String getsStaffName() {
        return sStaffName;
    }

    public void setsStaffName(String sStaffName) {
        this.sStaffName = sStaffName;
    }

    public Date getdDate() {
        return dDate;
    }

    public void setdDate(Date dDate) {
        this.dDate = dDate;
    }

    public Time gettTime() {
        return tTime;
    }

    public double getdTotal() {
        return dTotal;
    }

    //constructor
    public Bill() {
    }

    public Bill(String id, String StaffName, Date date, Time time, double total) {
        this.sID = id;
        this.sStaffName = StaffName;
        this.dDate = date;
        this.tTime = time;
        this.dTotal = total;
    }

    // methods
    public void Input() {
        if (Cafe.getlBills().size() == 0)
            this.sID += "0";
        else
            this.sID += String.valueOf(FindMaxBillID() + 1);

        System.out.println("Current Bill ID: " + this.sID);
        this.tTime = new Time();
        this.tTime.Input();
    }

    static public int FindMaxBillID() {
        int id = 0;
        for (int i = 0; i < Cafe.getlBills().size(); i++) {
            if (Integer.parseInt(Cafe.getlBills().get(i).getsID().substring(2)) > id)
                id = Integer.parseInt(Cafe.getlBills().get(i).getsID().substring(2));
        }
        return id;
    }

    //Output
    public void Output() {
        System.out.println(Main.padRight("\t" + this.sID, PadRightMax()) +
                Main.padRight(this.sStaffName, PadRightMax()) +
                Main.padRight(Date.ToString(this.dDate), PadRightMax()) +
                Main.padRight(Time.ToString(this.tTime), PadRightMax()) +
                this.dTotal);
    }

    static public void OutputFields() {
        System.out.println(Main.padRight("\n\t[ID]", PadRightMax()) +
                Main.padRight("[STAFF NAME]", PadRightMax()) +
                Main.padRight("[DATE]", PadRightMax()) +
                Main.padRight("[TIME]", PadRightMax()) +
                "[TOTAL]");
    }

    public void CalsTotal(List<Order> loders) {
        this.dTotal = 0;

        for (Order loder : loders) {
            this.dTotal += loder.getdCost();
        }
    }

    //Methods
    static public void SortID() {
        for (int i = 0; i < Cafe.getlBills().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlBills().size(); j++) {
                if (Cafe.getlBills().get(i).getsID().compareTo(Cafe.getlBills().get(j).getsID()) > 0) {
                    Bill tmp = Cafe.getlBills().get(i);
                    Cafe.getlBills().set(i, Cafe.getlBills().get(j));
                    Cafe.getlBills().set(j, tmp);
                }
            }
        }
    }

    static public void SortStaffName() {
        for (int i = 0; i < Cafe.getlBills().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlBills().size(); j++) {
                if (Cafe.getlBills().get(i).getsStaffName().compareTo(Cafe.getlBills().get(j).getsStaffName()) > 0) {
                    Bill tmp = Cafe.getlBills().get(i);
                    Cafe.getlBills().set(i, Cafe.getlBills().get(j));
                    Cafe.getlBills().set(j, tmp);
                }
            }
        }
    }

    static public void SortDate() {
        for (int i = 0; i < Cafe.getlBills().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlBills().size(); j++) {
                if (Date.IsMore(Cafe.getlBills().get(i).getdDate(), Cafe.getlBills().get(j).getdDate())
                        || Date.IsEqual(Cafe.getlBills().get(i).getdDate(), Cafe.getlBills().get(j).getdDate())
                        && Time.IsMore(Cafe.getlBills().get(i).gettTime(), Cafe.getlBills().get(j).gettTime())) {
                    Bill tmp = Cafe.getlBills().get(i);
                    Cafe.getlBills().set(i, Cafe.getlBills().get(j));
                    Cafe.getlBills().set(j, tmp);
                }
            }
        }
    }

    static public void SortTotal() {
        for (int i = 0; i < Cafe.getlBills().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlBills().size(); j++) {
                if (Cafe.getlBills().get(i).getdTotal() > (Cafe.getlBills().get(j).getdTotal())) {
                    Bill tmp = Cafe.getlBills().get(i);
                    Cafe.getlBills().set(i, Cafe.getlBills().get(j));
                    Cafe.getlBills().set(j, tmp);
                }
            }
        }
    }

    //Login Methods
    public int FindPadRight() {
        int max = 1;
        while (this.sID.length() > max
                || Date.ToString(this.dDate).length() > max
                || Time.ToString(this.tTime).length() > max
                || String.valueOf(this.dTotal).length() > max) {
            max++;
        }
        return max;
    }

    static public int PadRightMax() {
        int len = Cafe.getlBills().get(0).FindPadRight();
        for (int i = 1; i < Cafe.getlBills().size(); i++) {
            if (Cafe.getlBills().get(i).FindPadRight() > len)
                len = Cafe.getlBills().get(i).FindPadRight();
        }
        return len + 10;
    }

    static public void CalsToTalIncome() {
        for (int i = 0; i < Cafe.getlBills().size(); i++) {
            Cafe.setdTotal(Cafe.getdTotal() + Cafe.getlBills().get(i).getdTotal());
        }
    }

    //FILES
    static public void WriteDataBill() throws IOException {
        String[] wt = new String[Cafe.getlBills().size()];
        for (int i = 0; i < Cafe.getlBills().size(); i++) {
            wt[i] = Cafe.getlBills().get(i).getsID() + ";"
                    + Cafe.getlBills().get(i).getsStaffName() + ";"
                    + Date.ToString(Cafe.getlBills().get(i).getdDate()) + ";"
                    + Time.ToString(Cafe.getlBills().get(i).gettTime()) + ";"
                    + Cafe.getlBills().get(i).getdTotal();
        }

        File file = new File("Bill.txt");
        OutputStream outputStream = new FileOutputStream(file);
        OutputStreamWriter outputStreamWriter = new OutputStreamWriter(outputStream);
        for (String item : wt) {
            outputStreamWriter.write(item);
            // Dùng để xuống hàng
            outputStreamWriter.write("\n");
        }
        outputStreamWriter.flush();
    }

    static public void ReadDataBill() throws IOException {
        File file = new File("Bill.txt");
        InputStream inputStream = new FileInputStream(file);
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
        BufferedReader reader = new BufferedReader(inputStreamReader);

        ArrayList<String> a = new ArrayList<>();
        String line;
        while ((line = reader.readLine()) != null) {
            a.add(line);
        }

        for (String s : a) {
            String[] b = s.split(";");
            Bill bl = new Bill(b[0], b[1], Date.ToDate(b[2]), Time.ToTime(b[3]), Double.parseDouble(b[4]));
            Cafe.getlBills().add(bl);
        }

        CalsToTalIncome();
    }
}
