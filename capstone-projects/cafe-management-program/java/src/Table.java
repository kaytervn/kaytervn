import java.io.*;
import java.util.*;

public class Table {
    //fields
    private String sID = "TB";
    private String sStatus;
    private List<Order> lOrder;

    public String getsID() {
        return sID;
    }

    public void setsID(String sID) {
        this.sID = sID;
    }

    public String getsStatus() {
        return sStatus;
    }

    public void setsStatus(String sStatus) {
        this.sStatus = sStatus;
    }

    public List<Order> getlOrder() {
        return lOrder;
    }

    //constructor
    public Table() {
        lOrder = new ArrayList<>();
    }

    public Table(String id, String status) {
        sID = id;
        sStatus = status;
        lOrder = new ArrayList<>();
    }

    //Input
    public void InputStatus() {
        System.out.println("Status ([0] Empty - [1] Served): ");
        int st = Main.InputNumber(0, 1);
        switch (st) {
            case 0 -> sStatus = "Empty";
            case 1 -> sStatus = "Served";
        }
    }

    public void Input() {
        if (Cafe.getlTables().size() == 0)
            sID += "0";
        else {
            sID += String.valueOf(FindMaxTableID() + 1);
        }

        System.out.println("Current Table.Table ID: " + sID);
        InputStatus();
    }

    static public int FindMaxTableID() {
        int id = 0;
        for (int i = 0; i < Cafe.getlTables().size(); i++) {
            if (Integer.parseInt(Cafe.getlTables().get(i).getsID().substring(2)) > id)
                id = Integer.parseInt(Cafe.getlTables().get(i).getsID().substring(2));
        }
        return id;
    }

    //Output
    public void Output() {
        System.out.println("\t" + Main.padRight(this.getsID(), 20) + this.getsStatus());
    }

    //Sort
    static public void SortID() {
        for (int i = 0; i < Cafe.getlTables().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlTables().size(); j++) {
                if (Cafe.getlTables().get(i).getsID().compareTo(Cafe.getlTables().get(j).getsID()) > 0) {
                    Table tmp = Cafe.getlTables().get(i);
                    Cafe.getlTables().set(i, Cafe.getlTables().get(j));
                    Cafe.getlTables().set(j, tmp);
                }
            }
        }
    }

    static public void SortStatus() {
        for (int i = 0; i < Cafe.getlTables().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlTables().size(); j++) {
                if (Cafe.getlTables().get(i).getsStatus().compareTo(Cafe.getlTables().get(j).getsStatus()) > 0) {
                    Table tmp = Cafe.getlTables().get(i);
                    Cafe.getlTables().set(i, Cafe.getlTables().get(j));
                    Cafe.getlTables().set(j, tmp);
                }
            }
        }
    }

    //Methods
    //Login_Methods
    static public int SearchTable(String id) {
        id = id.toLowerCase();
        for (int i = 0; i < Cafe.getlTables().size(); i++) {
            if (Cafe.getlTables().get(i).getsID().toLowerCase().equals(id)) {
                return i;
            }
        }
        return -1;
    }

    static public void AddNewTable() {
        System.out.println("\n\t[ADDING NEW TABLE]\n");
        Table tb = new Table();
        tb.Input();
        Cafe.getlTables().add(tb);
    }

    static public int SelectTable() {
        String id;
        int pos;
        do {
            try {
                Scanner sc = new Scanner(System.in);
                System.out.print(" => Now Enter Table ID: ");
                id = sc.nextLine();
                pos = SearchTable(id);
                if (pos == -1)
                    continue;
                else
                    return pos;
            } catch (Exception e) {
                continue;
            }
        } while (true);

    }

    static public void ResetTableID() {
        for (int i = 0; i < Cafe.getlTables().size(); i++) {
            Cafe.getlTables().get(i).setsID("TB" + i);
        }
    }

    //FILES
    static public void WriteDataTable() throws IOException {
        String[] wt = new String[Cafe.getlTables().size()];
        for (int i = 0; i < Cafe.getlTables().size(); i++) {
            wt[i] = Cafe.getlTables().get(i).getsID() + ";" + Cafe.getlTables().get(i).getsStatus();
            if (Cafe.getlTables().get(i).getlOrder().size() != 0) {
                for (int j = 0; j < Cafe.getlTables().get(i).getlOrder().size(); j++) {
                    wt[i] += ";" + Cafe.getlTables().get(i).getlOrder().get(j).getsServiceName()
                            + ";" + Cafe.getlTables().get(i).getlOrder().get(j).getiAmount()
                            + ";" + Cafe.getlTables().get(i).getlOrder().get(j).getdPrice()
                            + ";" + Cafe.getlTables().get(i).getlOrder().get(j).getdCost();
                }
            }
        }
        File file = new File("Table.txt");
        OutputStream outputStream = new FileOutputStream(file);
        OutputStreamWriter outputStreamWriter = new OutputStreamWriter(outputStream);
        for (String item : wt) {
            outputStreamWriter.write(item);
            outputStreamWriter.write("\n");
        }
        outputStreamWriter.flush();
    }

    static public void ReadDataTable() throws IOException {

        File file = new File("Table.txt");
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
            Table tb = new Table(b[0], b[1]);
            if (b.length > 2) {
                for (int j = 2; j < b.length; j += 4) {
                    Order od = new Order(b[j],
                            Integer.parseInt(b[j + 1]),
                            Double.parseDouble(b[j + 2]),
                            Double.parseDouble(b[j + 3]));
                    tb.getlOrder().add(od);
                }
            }
            Cafe.getlTables().add(tb);
        }
    }
}
