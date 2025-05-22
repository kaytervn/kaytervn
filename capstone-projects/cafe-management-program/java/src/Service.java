import java.io.*;
import java.util.ArrayList;
import java.util.Scanner;

public class Service {
    //fields
    protected String sID = "SV";
    protected String sName;
    protected String sType;
    protected int iAmount;
    protected double dPrice;

    //properties
    public String getsID() {
        return sID;
    }

    public void setsID(String sID) {
        this.sID = sID;
    }

    public String getsName() {
        return sName;
    }

    public String getsType() {
        return sType;
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

    //constructor
    public Service() {
    }

    public Service(String sID, String sName, String sType, int iAmount, double dPrice) {
        this.sID = sID;
        this.sName = sName;
        this.sType = sType;
        this.iAmount = iAmount;
        this.dPrice = dPrice;
    }

    //methods
    //Input
    public void InputName() {
        System.out.print("Service Name: ");
        this.sName = Main.InputString();
    }

    public void InputType() {
        System.out.println("Type Of Service ([0] Food - [1] Drink): ");
        int tp = Main.InputNumber(0, 1);
        switch (tp) {
            case 0 -> this.sType = "Food";
            case 1 -> this.sType = "Drink";
        }
    }

    public void InputAmount() {
        System.out.print("Amount: ");
        this.iAmount = Main.InputNumber_Int();
    }

    public void InputPrice() {
        System.out.print("Price (VND): ");
        this.dPrice = Main.InputNumber_Double();
    }

    // output
    public int FindPadRight() {
        int max = 1;
        while (this.sID.length() > max
                || this.sName.length() > max
                || this.sType.length() > max
                || String.valueOf(this.iAmount).length() > max
                || String.valueOf(this.dPrice).length() > max
        ) {
            max++;
        }
        return max;
    }

    static public int PadRightMax() {
        int len = Cafe.getlServices().get(0).FindPadRight();
        for (int i = 1; i < Cafe.getlServices().size(); i++) {
            if (Cafe.getlServices().get(i).FindPadRight() > len)
                len = Cafe.getlServices().get(i).FindPadRight();
        }
        return len + 10;
    }

    public void Output() {
        System.out.println("\t" + Main.padRight(this.sID, PadRightMax()) +
                Main.padRight(this.sName, PadRightMax()) +
                Main.padRight(this.sType, PadRightMax()) +
                Main.padRight(String.valueOf(this.iAmount), PadRightMax()) +
                Main.padRight(String.valueOf(this.dPrice), PadRightMax()));
    }

    static public void OutputFields() {
        System.out.println("\n\t" + Main.padRight("[ID]", PadRightMax()) +
                Main.padRight("[NAME]", PadRightMax()) +
                Main.padRight("[TYPE]", PadRightMax()) +
                Main.padRight("[AMOUNT]", PadRightMax()) +
                "[PRICE]");
    }

    public void Input() {
        if (Cafe.getlServices().size() == 0)
            this.sID += 0;
        else
            this.sID += String.valueOf(FindMaxServiceID() + 1);
        System.out.println("Current Service ID: " + this.sID);
        InputName();
        InputType();
        InputAmount();
        InputPrice();
    }

    static public int FindMaxServiceID() {
        int id = 0;
        for (int i = 0; i < Cafe.getlServices().size(); i++) {
            if (Integer.parseInt(Cafe.getlServices().get(i).getsID().substring(2)) > id)
                id = Integer.parseInt(Cafe.getlServices().get(i).getsID().substring(2));
        }
        return id;
    }

    //Methods SORT
    static public void SortID() {
        for (int i = 0; i < Cafe.getlServices().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlServices().size(); j++) {
                if (Cafe.getlServices().get(i).getsID().compareTo(Cafe.getlServices().get(j).getsID()) > 0) {
                    Service tmp = Cafe.getlServices().get(i);
                    Cafe.getlServices().set(i, Cafe.getlServices().get(j));
                    Cafe.getlServices().set(j, tmp);
                }
            }
        }
    }

    static public void SortType() {
        for (int i = 0; i < Cafe.getlServices().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlServices().size(); j++) {
                if (Cafe.getlServices().get(i).getsType().compareTo(Cafe.getlServices().get(j).getsType()) > 0) {
                    Service tmp = Cafe.getlServices().get(i);
                    Cafe.getlServices().set(i, Cafe.getlServices().get(j));
                    Cafe.getlServices().set(j, tmp);
                }
            }
        }
    }

    static public void SortName() {
        for (int i = 0; i < Cafe.getlServices().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlServices().size(); j++) {
                if (Cafe.getlServices().get(i).getsName().compareTo(Cafe.getlServices().get(j).getsName()) > 0) {
                    Service tmp = Cafe.getlServices().get(i);
                    Cafe.getlServices().set(i, Cafe.getlServices().get(j));
                    Cafe.getlServices().set(j, tmp);
                }
            }
        }
    }

    static public void SortAmount() {
        for (int i = 0; i < Cafe.getlServices().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlServices().size(); j++) {
                if (Cafe.getlServices().get(i).getiAmount() > Cafe.getlServices().get(j).getiAmount()) {
                    Service tmp = Cafe.getlServices().get(i);
                    Cafe.getlServices().set(i, Cafe.getlServices().get(j));
                    Cafe.getlServices().set(j, tmp);
                }
            }
        }
    }

    static public void SortPrice() {
        for (int i = 0; i < Cafe.getlServices().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlServices().size(); j++) {
                if (Cafe.getlServices().get(i).getdPrice() > Cafe.getlServices().get(j).getdPrice()) {
                    Service tmp = Cafe.getlServices().get(i);
                    Cafe.getlServices().set(i, Cafe.getlServices().get(j));
                    Cafe.getlServices().set(j, tmp);
                }
            }
        }
    }

    //Login_Methods
    static public int SearchService(String id) {
        id = id.toLowerCase();
        for (int i = 0; i < Cafe.getlServices().size(); i++) {
            if (Cafe.getlServices().get(i).getsID().toLowerCase().equals(id)) {
                return i;
            }
        }
        return -1;
    }

    static public void AddNewService() {
        System.out.println("\n\t[ADDING NEW SERVICE]\n");
        Service sv = new Service();
        sv.Input();
        Cafe.getlServices().add(sv);
    }

    static public int SelectService() {
        String id;
        int pos;
        do {
            try {
                Scanner sc = new Scanner(System.in);
                System.out.print(" => Now Enter Service ID: ");
                id = sc.nextLine();
                pos = SearchService(id);
                if (pos == -1)
                    continue;
                else
                    return pos;
            } catch (Exception e) {
                continue;
            }
        } while (true);

    }

    static public void ResetServiceID() {
        for (int i = 0; i < Cafe.getlServices().size(); i++) {
            Cafe.getlServices().get(i).setsID("SV" + i);
        }
    }

    //Methods FILES
    static public void WriteDataService() throws IOException {
        String[] wt = new String[Cafe.getlServices().size()];
        for (int i = 0; i < Cafe.getlServices().size(); i++) {
            wt[i] = Cafe.getlServices().get(i).getsID() + ";"
                    + Cafe.getlServices().get(i).getsName() + ";"
                    + Cafe.getlServices().get(i).getsType() + ";"
                    + Cafe.getlServices().get(i).getiAmount() + ";"
                    + Cafe.getlServices().get(i).getdPrice();
        }


        File file = new File("Service.txt");
        OutputStream outputStream = new FileOutputStream(file);
        OutputStreamWriter outputStreamWriter = new OutputStreamWriter(outputStream);
        for (String item : wt) {
            outputStreamWriter.write(item);
            // Dùng để xuống hàng
            outputStreamWriter.write("\n");
        }
        outputStreamWriter.flush();
    }

    static public void ReadDataService() throws IOException {
        File file = new File("Service.txt");
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
            Service sv = new Service(b[0], b[1], b[2], Integer.parseInt(b[3]), Double.parseDouble(b[4]));
            Cafe.getlServices().add(sv);
        }
    }


}
