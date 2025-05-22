import java.io.IOException;

public class Account {
    //Fields
    protected String sUsername;
    protected String sPassword;

    //Propeties
    public String getsUsername() {
        return sUsername;
    }

    public void setsUsername(String sUsername) {
        this.sUsername = sUsername;
    }

    public String getsPassword() {
        return sPassword;
    }

    public void setsPassword(String sPassword) {
        this.sPassword = sPassword;
    }

    //Constructors
    public Account() {
    }

    public Account(String username, String password) {
        this.sUsername = username;
        this.sPassword = password;
    }

    //Input
    public void InputUsername() {
        System.out.print("Username: ");
        this.sUsername = Main.InputString().toLowerCase();
    }

    public void InputPassword() {
        System.out.print("Password: ");
        this.sPassword = Main.InputString();
    }

    public void Input() {
        InputUsername();
        InputPassword();
    }

    public void AddUsername() {
        System.out.print("Username: ");
        String username = Main.InputString().toLowerCase();
        while (IsExist(username)) {
            System.out.println("\n\t\tUsername Is Used. Please Type Another Username!\n");
            System.out.print("Username: ");
            username = Main.InputString().toLowerCase();
        }
        this.setsUsername(username);
    }

    public void AddAccount() {
        AddUsername();
        InputPassword();
    }

    //Methods
    static public boolean IsExist(String username) {
        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            if (username.equalsIgnoreCase(Cafe.getlStaffs().get(i).getaAccount().getsUsername()))
                return true;
        }
        return false;
    }

    static public boolean IsExist(Account account) {
        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            if (IsEqual(account, Cafe.getlStaffs().get(i).getaAccount()))
                return true;
        }
        return false;
    }

    static public void AccessLogin(Account login) throws IOException {
        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            if (IsEqual(login, Cafe.getlStaffs().get(i).getaAccount())) {
                if (!Date.IsDate(Main.dDate.getiDay(), Main.dDate.getiMonth(), Main.dDate.getiYear()))
                    Main.InputDate(Cafe.getlStaffs().get(i).getsName(), Cafe.getlStaffs().get(i).getsID());
                Cafe.getlStaffs().get(i).Login();
            }
        }
    }

    //Operator
    public static boolean IsEqual(Account a, Account b) {
        return (a.getsUsername().equalsIgnoreCase(b.getsUsername())) && (a.getsPassword().equals(b.getsPassword()));
    }

    public static boolean IsNotEqual(Account a, Account b) {
        return !(IsEqual(a, b));
    }
}
