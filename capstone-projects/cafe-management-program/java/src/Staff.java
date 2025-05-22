import java.io.*;
import java.util.Objects;
import java.util.*;

public class Staff {
    //Fields
    private String sID;
    private String sName;
    private String sIDCard;
    private String sSex;
    private Date dBirth;
    private String sPhoneNumber;
    private String sAddress;
    private String sType;
    private Account aAccount;

    //Properties
    public String getsID() {
        return sID;
    }

    public void setsID(String sID) {
        this.sID = sID;
    }

    public String getsName() {
        return sName;
    }

    public void setsName(String sName) {
        this.sName = sName;
    }

    public String getsIDCard() {
        return sIDCard;
    }

    public void setsIDCard(String sIDCard) {
        this.sIDCard = sIDCard;
    }

    public String getsSex() {
        return sSex;
    }

    public void setsSex(String sSex) {
        this.sSex = sSex;
    }

    public Date getdBirth() {
        return dBirth;
    }

    public String getsPhoneNumber() {
        return sPhoneNumber;
    }

    public void setsPhoneNumber(String sPhoneNumber) {
        this.sPhoneNumber = sPhoneNumber;
    }

    public String getsAddress() {
        return sAddress;
    }

    public void setsAddress(String sAddress) {
        this.sAddress = sAddress;
    }

    public String getsType() {
        return sType;
    }

    public void setsType(String sType) {
        this.sType = sType;
    }

    public Account getaAccount() {
        return aAccount;
    }

    public void setaAccount(Account aAccount) {
        this.aAccount = aAccount;
    }

    //Contrustors
    public Staff() {
    }

    public Staff(String sID, String sName, String sIDCard, String sSex, Date dBirth, String sPhoneNumber, String sAddress, String sType, Account aAccount) {
        this.sID = sID;
        this.sName = sName;
        this.sIDCard = sIDCard;
        this.sSex = sSex;
        this.dBirth = dBirth;
        this.sPhoneNumber = sPhoneNumber;
        this.sAddress = sAddress;
        this.sType = sType;
        this.aAccount = aAccount;
    }

    //input
    public void InputName() {
        System.out.print("Staff Name: ");
        this.setsName(Main.InputString());
    }

    public void InputIDCard() {
        System.out.print("ID Card Number: ");
        this.setsIDCard(Main.InputString());
    }

    public void InputSex() {
        System.out.println("Gender ([0] Male - [1] Female): ");
        int tp = Main.InputNumber(0, 1);
        switch (tp) {
            case 0 -> this.setsSex("Male");
            case 1 -> this.setsSex("Female");
        }
    }

    public void InputBirth() {
        System.out.print("Birth Of ");
        this.dBirth = new Date();
        this.dBirth.Input();
    }

    public void InputPhoneNumber() {
        System.out.print("Phone Number: ");
        this.setsPhoneNumber(Main.InputString());
    }

    public void InputAddress() {
        System.out.print("Address: ");
        this.setsAddress(Main.InputString());
    }

    static public int StaffCount() {
        int dem = 0;
        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            if (Objects.equals(Cafe.getlStaffs().get(i).getsType(), "Staff"))
                dem++;
        }
        return dem;
    }

    static public int FindMaxStaffID() {
        int id = 0;
        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            if (Objects.equals(Cafe.getlStaffs().get(i).getsType(), "Staff") && Integer.parseInt(Cafe.getlStaffs().get(i).getsID().substring(2)) > id)
                id = Integer.parseInt(Cafe.getlStaffs().get(i).getsID().substring(2));
        }
        return id;
    }

    public void Input() {
        this.sID = "ST";
        if (StaffCount() == 0)
            this.sID += "0";
        else
            this.sID += String.valueOf(FindMaxStaffID() + 1);
        System.out.println("Current Staff ID: " + this.sID);
        InputName();
        InputIDCard();
        InputSex();
        InputBirth();
        InputPhoneNumber();
        InputAddress();
        this.setaAccount(new Account());
        this.getaAccount().AddAccount();
        this.setsType("Staff");
    }

    //Output
    public int FindPadRight() {
        int max = 1;
        while (this.sID.length() > max
                || this.sName.length() > max
                || this.sIDCard.length() > max
                || this.sSex.length() > max
                || Date.ToString(this.dBirth).length() > max
                || this.sPhoneNumber.length() > max
                || this.sAddress.length() > max
                || this.sType.length() > max
                || this.aAccount.getsUsername().length() > max
                || this.aAccount.getsPassword().length() > max) {
            max++;
        }
        return max;
    }

    static public int PadRightMax() {
        int len = Cafe.getlStaffs().get(0).FindPadRight();
        for (int i = 1; i < Cafe.getlStaffs().size(); i++) {
            if (Cafe.getlStaffs().get(i).FindPadRight() > len)
                len = Cafe.getlStaffs().get(i).FindPadRight();
        }
        return len + 2;
    }

    public void Output() {
        System.out.println(Main.padRight(this.sID, PadRightMax()) +
                Main.padRight(this.sName, PadRightMax()) +
                Main.padRight(this.sIDCard, PadRightMax()) +
                Main.padRight(this.sSex, PadRightMax()) +
                Main.padRight(Date.ToString(this.dBirth), PadRightMax()) +
                Main.padRight(this.sPhoneNumber, PadRightMax()) +
                Main.padRight(this.sAddress, PadRightMax()) +
                Main.padRight(this.sType, PadRightMax()) +
                Main.padRight(this.aAccount.getsUsername(), PadRightMax()) +
                Main.padRight(this.aAccount.getsPassword(), PadRightMax()));
    }

    //Methods
    //Sorts
    static public void SortSalary() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Objects.equals(Cafe.getlStaffs().get(i).getsType(), "Staff")
                        && Objects.equals(Cafe.getlStaffs().get(j).getsType(), "Staff")) {
                    StaffService sv1 = (StaffService) Cafe.getlStaffs().get(i);
                    StaffService sv2 = (StaffService) Cafe.getlStaffs().get(j);
                    if (sv1.getdSalary() > sv2.getdSalary()) {
                        Staff tmp = Cafe.getlStaffs().get(i);
                        Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                        Cafe.getlStaffs().set(j, tmp);
                    }
                }
            }
        }
    }

    static public void SortWorkingDays() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Objects.equals(Cafe.getlStaffs().get(i).getsType(), "Staff")
                        && Objects.equals(Cafe.getlStaffs().get(j).getsType(), "Staff")) {
                    StaffService sv1 = (StaffService) Cafe.getlStaffs().get(i);
                    StaffService sv2 = (StaffService) Cafe.getlStaffs().get(j);
                    if (sv1.getiWorkingDays() > sv2.getiWorkingDays()) {
                        Staff tmp = Cafe.getlStaffs().get(i);
                        Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                        Cafe.getlStaffs().set(j, tmp);
                    }
                }
            }
        }
    }

    static public void SortOfficialSalary() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Objects.equals(Cafe.getlStaffs().get(i).getsType(), "Staff")
                        && Objects.equals(Cafe.getlStaffs().get(j).getsType(), "Staff")) {
                    StaffService sv1 = (StaffService) Cafe.getlStaffs().get(i);
                    StaffService sv2 = (StaffService) Cafe.getlStaffs().get(j);
                    if (sv1.getdOfficialSalary() > sv2.getdOfficialSalary()) {
                        Staff tmp = Cafe.getlStaffs().get(i);
                        Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                        Cafe.getlStaffs().set(j, tmp);
                    }
                }
            }
        }
    }

    static public void SortType() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Cafe.getlStaffs().get(i).getsType().compareTo(Cafe.getlStaffs().get(j).getsType()) > 0) {
                    Staff tmp = Cafe.getlStaffs().get(i);
                    Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                    Cafe.getlStaffs().set(j, tmp);
                }
            }
        }
    }

    static public void SortID() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Cafe.getlStaffs().get(i).getsID().compareTo(Cafe.getlStaffs().get(j).getsID()) > 0) {
                    Staff tmp = Cafe.getlStaffs().get(i);
                    Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                    Cafe.getlStaffs().set(j, tmp);
                }
            }
        }
    }

    static public void SortName() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Cafe.getlStaffs().get(i).getsName().compareTo(Cafe.getlStaffs().get(j).getsName()) > 0) {
                    Staff tmp = Cafe.getlStaffs().get(i);
                    Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                    Cafe.getlStaffs().set(j, tmp);
                }
            }
        }
    }

    static public void SortIDCard() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Cafe.getlStaffs().get(i).getsIDCard().compareTo(Cafe.getlStaffs().get(j).getsIDCard()) > 0) {
                    Staff tmp = Cafe.getlStaffs().get(i);
                    Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                    Cafe.getlStaffs().set(j, tmp);
                }
            }
        }
    }

    static public void SortSex() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Cafe.getlStaffs().get(i).getsSex().compareTo(Cafe.getlStaffs().get(j).getsSex()) > 0) {
                    Staff tmp = Cafe.getlStaffs().get(i);
                    Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                    Cafe.getlStaffs().set(j, tmp);
                }
            }
        }
    }

    static public void SortPhoneNumber() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Cafe.getlStaffs().get(i).getsPhoneNumber().compareTo(Cafe.getlStaffs().get(j).getsPhoneNumber()) > 0) {
                    Staff tmp = Cafe.getlStaffs().get(i);
                    Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                    Cafe.getlStaffs().set(j, tmp);
                }
            }
        }
    }

    static public void SortAddress() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Cafe.getlStaffs().get(i).getsAddress().compareTo(Cafe.getlStaffs().get(j).getsAddress()) > 0) {
                    Staff tmp = Cafe.getlStaffs().get(i);
                    Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                    Cafe.getlStaffs().set(j, tmp);
                }
            }
        }
    }

    static public void SortBirth() {
        for (int i = 0; i < Cafe.getlStaffs().size() - 1; i++) {
            for (int j = i + 1; j < Cafe.getlStaffs().size(); j++) {
                if (Date.IsMore(Cafe.getlStaffs().get(i).getdBirth(), Cafe.getlStaffs().get(j).getdBirth())) {
                    Staff tmp = Cafe.getlStaffs().get(i);
                    Cafe.getlStaffs().set(i, Cafe.getlStaffs().get(j));
                    Cafe.getlStaffs().set(j, tmp);
                }
            }
        }
    }

    //Methods
    static public int SelectStaff() {
        Scanner sc = new Scanner(System.in);
        String id;
        int pos;
        do {
            try {
                System.out.print(" => Now Enter Staff ID: ");
                id = sc.nextLine();
                pos = SearchStaff(id);
                if (pos == -1)
                    continue;
                else
                    return pos;
            } catch (Exception e) {
                continue;
            }
        } while (true);
    }

    static public void AddNewStaff() {
        System.out.println("\n\t[ADDING NEW STAFF]\n");
        Staff staff = new StaffService();
        staff.Input();
        Cafe.getlStaffs().add(staff);
    }

    static public void OutputFields() {
        System.out.println(Main.padRight("\n[ID]", PadRightMax()) +
                Main.padRight("[NAME]", PadRightMax()) +
                Main.padRight("[ID CARD]", PadRightMax()) +
                Main.padRight("[SEX]", PadRightMax()) +
                Main.padRight("[BIRTH]", PadRightMax()) +
                Main.padRight("[PHONE]", PadRightMax()) +
                Main.padRight("[ADDRESS]", PadRightMax()) +
                Main.padRight("[TYPE]", PadRightMax()) +
                Main.padRight("[USERNAME]", PadRightMax()) +
                Main.padRight("[PASSWORD]", PadRightMax()) +
                Main.padRight("[WAGE]", PadRightMax()) +
                Main.padRight("[WORKDAYS]", PadRightMax()) +
                "[SALARY]");
    }

    public void Login() throws IOException {
    }

    static public void ResetStaffID() {
        int dem = 0;
        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            if (Objects.equals(Cafe.getlStaffs().get(i).getsType(), "Staff")) {
                Cafe.getlStaffs().get(i).setsID("ST" + dem);
                dem++;
            }
        }
    }

    static public int SearchStaff(String id) {
        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            if (Cafe.getlStaffs().get(i).getsID().equalsIgnoreCase(id)) {
                return i;
            }
        }
        return -1;
    }

    //FILES
    static public void WriteDataStaff() throws IOException {
        String[] wt = new String[Cafe.getlStaffs().size()];
        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            wt[i] = Cafe.getlStaffs().get(i).getsID() +
                    ";" + Cafe.getlStaffs().get(i).getsName() +
                    ";" + Cafe.getlStaffs().get(i).getsIDCard() +
                    ";" + Cafe.getlStaffs().get(i).getsSex() +
                    ";" + Date.ToString(Cafe.getlStaffs().get(i).getdBirth()) +
                    ";" + Cafe.getlStaffs().get(i).getsPhoneNumber() +
                    ";" + Cafe.getlStaffs().get(i).getsAddress() +
                    ";" + Cafe.getlStaffs().get(i).getsType() +
                    ";" + Cafe.getlStaffs().get(i).getaAccount().getsUsername() +
                    ";" + Cafe.getlStaffs().get(i).getaAccount().getsPassword();

            if (Objects.equals(Cafe.getlStaffs().get(i).getsType(), "Staff")) {
                StaffService stsv = (StaffService) Cafe.getlStaffs().get(i);
                wt[i] += ";" + stsv.getdSalary() + ";" + stsv.getiWorkingDays() + ";" + stsv.getdOfficialSalary();
            }
        }

        File file = new File("Staff.txt");
        OutputStream outputStream = new FileOutputStream(file);
        OutputStreamWriter outputStreamWriter = new OutputStreamWriter(outputStream);
        for (String item : wt) {
            outputStreamWriter.write(item);
            // Dùng để xuống hàng
            outputStreamWriter.write("\n");
        }
        outputStreamWriter.flush();
    }

    static public void ReadDataStaff() throws IOException {
        File file = new File("Staff.txt");
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
            Staff st;
            if (b.length == 13) {
                st = new StaffService(b[0], b[1], b[2], b[3], Date.ToDate(b[4]),
                        b[5], b[6], b[7], new Account(b[8], b[9]),
                        Double.parseDouble(b[10]), Integer.parseInt(b[11]), Double.parseDouble(b[12]));
            } else {
                st = new Admin(b[0], b[1], b[2], b[3], Date.ToDate(b[4]),
                        b[5], b[6], b[7], new Account(b[8], b[9]));
            }
            Cafe.getlStaffs().add(st);
        }
    }
}