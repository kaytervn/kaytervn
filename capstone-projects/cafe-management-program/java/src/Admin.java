import java.io.IOException;
import java.util.Objects;
import java.util.Scanner;

public class Admin extends Staff implements ITable, IOrder {
    public Admin() {
    }

    public Admin(String sID, String sName, String sIDCard, String sSex, Date dBirth, String sPhoneNumber, String sAddress, String sType, Account aAccount) {
        super(sID, sName, sIDCard, sSex, dBirth, sPhoneNumber, sAddress, sType, aAccount);
    }

    //Methods
    public void Login() throws IOException {
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());

        System.out.println("[0]. Staff Manager");
        System.out.println("[1]. Table Manager");
        System.out.println("[2]. Service Manager");
        System.out.println("[3]. Income Manager");
        System.out.println("[4]. Log out");

        int num = Main.InputNumber(0, 4);
        switch (num) {
            case 0 -> ShowStaffList();
            case 1 -> ShowTableList();
            case 2 -> ShowServiceList();
            case 3 -> ShowBillList();
            case 4 -> Main.Login();
        }
    }

    //Admin_Bill
    public void Statistic(int d, int m, int y) throws IOException {
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[INCOME STATISTIC]");

        double total = 0;
        int billcount = 0;
        boolean check = false;
        int num;

        for (int i = 0; i < Cafe.getlBills().size(); i++) {
            if ((Cafe.getlBills().get(i).dDate.getiDay() == d && Cafe.getlBills().get(i).dDate.getiMonth() == m && Cafe.getlBills().get(i).dDate.getiYear() == y)
                    || (Cafe.getlBills().get(i).dDate.getiMonth() == m && Cafe.getlBills().get(i).dDate.getiYear() == y && d == -1)
                    || (Cafe.getlBills().get(i).dDate.getiYear() == y && d == -1 && m == -1)) {
                check = true;
                break;
            }
        }

        if (check) {
            Bill.OutputFields();
            for (int i = 0; i < Cafe.getlBills().size(); i++) {
                if ((Cafe.getlBills().get(i).dDate.getiDay() == d && Cafe.getlBills().get(i).dDate.getiMonth() == m && Cafe.getlBills().get(i).dDate.getiYear() == y)
                        || (Cafe.getlBills().get(i).dDate.getiMonth() == m && Cafe.getlBills().get(i).dDate.getiYear() == y && d == -1)
                        || (Cafe.getlBills().get(i).dDate.getiYear() == y && d == -1 && m == -1)) {
                    Cafe.getlBills().get(i).Output();
                    billcount++;
                    total += Cafe.getlBills().get(i).getdTotal();
                }
            }

            System.out.println("\t--------------------------------");
            System.out.println("\tFinal Total: " + total + " (VND)");
            System.out.println("\tBills Count: " + billcount);
        } else {
            System.out.println("\n\t\tNo Statistic Result");
        }
        System.out.println();
        System.out.println("[0]. Get Statistic Again");
        System.out.println("[1]. Back");
        num = Main.InputNumber(0, 1);
        switch (num) {
            case 0 -> SelectStatistical(d, m, y);
            case 1 -> ShowBillList();
        }
    }

    public void SelectStatistical(int d, int m, int y) throws IOException {
        System.out.println();
        System.out.println("\t\t[SELECT STATISTICS]");
        System.out.println("[0]. Statistical Date");
        System.out.println("[1]. Statistical Month - Year");
        System.out.println("[2]. Statistical Year");
        int num = Main.InputNumber(0, 2);
        switch (num) {
            case 0 -> {
                System.out.print(" => Enter Day: ");
                d = Main.InputNumber_Int();
                System.out.print(" => Enter Month: ");
                m = Main.InputNumber_Int();
                System.out.print(" => Enter Year: ");
                y = Main.InputNumber_Int();
            }
            case 1 -> {
                d = -1;
                System.out.print(" => Enter Month: ");
                m = Main.InputNumber_Int();
                System.out.print(" => Enter Year: ");
                y = Main.InputNumber_Int();
            }
            case 2 -> {
                d = -1;
                m = -1;
                System.out.print(" => Enter Year: ");
                y = Main.InputNumber_Int();
            }
        }
        Statistic(d, m, y);
    }

    public void SortBill() throws IOException {
        Bill.WriteDataBill();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[BILL SORTING]");
        Bill.OutputFields();
        for (int i = 0; i < Cafe.getlBills().size(); i++) {
            Cafe.getlBills().get(i).Output();
        }
        System.out.println();
        System.out.println("[0]. Sort (ID)");
        System.out.println("[1]. Sort (Staff Name)");
        System.out.println("[2]. Sort (Date)");
        System.out.println("[3]. Sort (Total)");
        System.out.println("[4]. Back");
        int num = Main.InputNumber(0, 4);
        switch (num) {
            case 0 -> {
                Bill.SortID();
                SortBill();
            }
            case 1 -> {
                Bill.SortStaffName();
                SortBill();
            }
            case 2 -> {
                Bill.SortDate();
                SortBill();
            }
            case 3 -> {
                Bill.SortTotal();
                SortBill();
            }
            case 4 -> ShowBillList();
        }
    }

    public void ShowBillList() throws IOException {
        Bill.WriteDataBill();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[INCOME MANAGER]");
        int num;
        if (Cafe.getlBills().size() == 0) {
            System.out.println("\n\t\tNo Bill Created\n");
            System.out.println("[0]. Back");
            num = Main.InputNumber(0, 0);
            Login();
        } else {
            Bill.OutputFields();
            for (int i = 0; i < Cafe.getlBills().size(); i++) {
                Cafe.getlBills().get(i).Output();
            }
            System.out.println("\t--------------------------------");
            System.out.println("\tFinal Total: " + Cafe.getdTotal() + " (VND)");
            System.out.println("\tBills Count: " + Cafe.getlBills().size());
            System.out.println();
            System.out.println("[0]. Get Statistic");
            System.out.println("[1]. Sort Bill");
            System.out.println("[2]. Back");

            num = Main.InputNumber(0, 2);

            switch (num) {
                case 0 -> {
                    int d = -1;
                    int m = -1;
                    int y = -1;
                    SelectStatistical(d, m, y);
                }
                case 1 -> SortBill();
                case 2 -> Login();
            }
        }
    }

    //Admin_Service
    public void SearchServiceOption(String a) throws IOException {
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());

        a = a.toLowerCase();
        boolean check = false;
        int num;

        System.out.println("\t\t[SERVICE SEARCHING]");

        for (int i = 0; i < Cafe.getlServices().size(); i++) {
            if (Cafe.getlServices().get(i).getsID().toLowerCase().contains(a)
                    || Cafe.getlServices().get(i).getsName().toLowerCase().contains(a)
                    || Cafe.getlServices().get(i).getsType().toLowerCase().contains(a)
                    || String.valueOf(Cafe.getlServices().get(i).getiAmount()).contains(a)
                    || String.valueOf(Cafe.getlServices().get(i).getdPrice()).contains(a)) {
                check = true;
                break;
            }
        }

        if (check) {
            Service.OutputFields();
            for (int i = 0; i < Cafe.getlServices().size(); i++) {
                if (Cafe.getlServices().get(i).getsID().toLowerCase().contains(a)
                        || Cafe.getlServices().get(i).getsName().toLowerCase().contains(a)
                        || Cafe.getlServices().get(i).getsType().toLowerCase().contains(a)
                        || String.valueOf(Cafe.getlServices().get(i).getiAmount()).contains(a)
                        || String.valueOf(Cafe.getlServices().get(i).getdPrice()).contains(a)) {
                    Cafe.getlServices().get(i).Output();
                }
            }
            System.out.println();
            System.out.println("[0]. Select Service");
            System.out.println("[1]. Search Again");
            System.out.println("[2]. Back");

            num = Main.InputNumber(0, 2);
            switch (num) {
                case 0 -> {
                    int pos = Service.SelectService();
                    OpenService(Cafe.getlServices().get(pos), pos);
                }
                case 1 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Service Bar: ");
                    String b = sc.nextLine();
                    SearchServiceOption(b);
                }
                case 2 -> ShowServiceList();
            }
        } else {
            System.out.println("\n\t\tNo Search Result\n");
            System.out.println("[0]. Search Again");
            System.out.println("[1]. Back");

            num = Main.InputNumber(0, 1);
            switch (num) {
                case 0 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Service Bar: ");
                    String b = sc.nextLine();
                    SearchServiceOption(b);
                }
                case 1 -> ShowServiceList();
            }
        }
    }

    public void EditService(Service sv, int pos) throws IOException {
        Service.WriteDataService();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[SERVICE EDITING]");
        Service.OutputFields();
        sv.Output();
        System.out.println();
        System.out.println("[0]. Edit Service Name");
        System.out.println("[1]. Edit Service Type");
        System.out.println("[2]. Edit Service Amount");
        System.out.println("[3]. Edit Service Price");
        System.out.println("[4]. Edit All");
        System.out.println("[5]. Back");
        int num = Main.InputNumber(0, 5);

        switch (num) {
            case 0 -> {
                sv.InputName();
                EditService(sv, pos);
            }
            case 1 -> {
                sv.InputType();
                EditService(sv, pos);
            }
            case 2 -> {
                sv.InputAmount();
                EditService(sv, pos);
            }
            case 3 -> {
                sv.InputPrice();
                EditService(sv, pos);
            }
            case 4 -> {
                sv.InputName();
                sv.InputType();
                sv.InputAmount();
                sv.InputPrice();
                EditService(sv, pos);
            }
            case 5 -> OpenService(sv, pos);
        }
    }

    public void SortService() throws IOException {
        Service.WriteDataService();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[SERVICE SORTING]");
        Service.OutputFields();
        for (int i = 0; i < Cafe.getlServices().size(); i++) {
            Cafe.getlServices().get(i).Output();
        }
        System.out.println();
        System.out.println("[0]. Sort (ID)");
        System.out.println("[1]. Sort (Name)");
        System.out.println("[2]. Sort (Type)");
        System.out.println("[3]. Sort (Amount)");
        System.out.println("[4]. Sort (Price)");
        System.out.println("[5]. Back");
        int num = Main.InputNumber(0, 5);
        switch (num) {
            case 0 -> {
                Service.SortID();
                SortService();
            }
            case 1 -> {
                Service.SortName();
                SortService();
            }
            case 2 -> {
                Service.SortType();
                SortService();
            }
            case 3 -> {
                Service.SortAmount();
                SortService();
            }
            case 4 -> {
                Service.SortPrice();
                SortService();
            }
            case 5 -> ShowServiceList();
        }
    }

    public void OpenService(Service sv, int pos) throws IOException {
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[SERVICE SETTINGS]");
        Service.OutputFields();
        sv.Output();
        System.out.println();
        System.out.println("[0]. Edit Service");
        System.out.println("[1]. Delete Service");
        System.out.println("[2]. Back");

        int num = Main.InputNumber(0, 2);
        switch (num) {
            case 0 -> EditService(sv, pos);
            case 1 -> {
                Cafe.getlServices().remove(pos);
                ShowServiceList();
            }
            case 2 -> ShowServiceList();
        }
    }

    public void ShowServiceList() throws IOException {
        Service.WriteDataService();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[SERVICE LIST]");
        int num;
        if (Cafe.getlServices().size() == 0) {
            System.out.println("\n\t\tNo Service Added\n");
            System.out.println("[0]. Add Service");
            System.out.println("[1]. Back");
            num = Main.InputNumber(0, 1);
            switch (num) {
                case 0 -> {
                    Service.AddNewService();
                    ShowServiceList();
                }
                case 1 -> Login();
            }
        } else {
            Service.OutputFields();
            for (int i = 0; i < Cafe.getlServices().size(); i++) {
                Cafe.getlServices().get(i).Output();
            }
            System.out.println();
            System.out.println("[0]. Add Service");
            System.out.println("[1]. Select Service");
            System.out.println("[2]. Search Service");
            System.out.println("[3]. Sort Service");
            System.out.println("[4]. Reset Service ID");
            System.out.println("[5]. Back");

            num = Main.InputNumber(0, 5);

            switch (num) {
                case 0 -> {
                    Service.AddNewService();
                    ShowServiceList();
                }
                case 1 -> {
                    int pos = Service.SelectService();
                    OpenService(Cafe.getlServices().get(pos), pos);
                }
                case 2 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Service Bar: ");
                    String a = sc.nextLine();
                    SearchServiceOption(a);
                }
                case 3 -> SortService();
                case 4 -> {
                    Service.ResetServiceID();
                    ShowServiceList();
                }
                case 5 -> Login();
            }
        }
    }

    //Admin_Staff
    public void EditStaff(Staff staff, int pos) throws IOException {
        Staff.WriteDataStaff();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t[STAFF EDITING]");
        Staff.OutputFields();
        staff.Output();
        System.out.println();

        if (Objects.equals(staff.getsType(), "Staff")) {
            System.out.println("[0]. Edit Staff Name");
            System.out.println("[1]. Edit Staff ID Card");
            System.out.println("[2]. Edit Staff Sex");
            System.out.println("[3]. Edit Staff Birth");
            System.out.println("[4]. Edit Staff Phone Number");
            System.out.println("[5]. Edit Staff Address");
            System.out.println("[6]. Edit Staff Username");
            System.out.println("[7]. Edit Staff Password");
            System.out.println("[8]. Edit Staff Wage");
            System.out.println("[9]. Edit Staff Working Days");
            System.out.println("[10]. Edit All");
            System.out.println("[11]. Back");
            int num = Main.InputNumber(0, 11);
            switch (num) {
                case 0 -> {
                    staff.InputName();
                    EditStaff(staff, pos);
                }
                case 1 -> {
                    staff.InputIDCard();
                    EditStaff(staff, pos);
                }
                case 2 -> {
                    staff.InputSex();
                    EditStaff(staff, pos);
                }
                case 3 -> {
                    staff.InputBirth();
                    EditStaff(staff, pos);
                }
                case 4 -> {
                    staff.InputPhoneNumber();
                    EditStaff(staff, pos);
                }
                case 5 -> {
                    staff.InputAddress();
                    EditStaff(staff, pos);
                }
                case 6 -> {
                    staff.getaAccount().AddUsername();
                    EditStaff(staff, pos);
                }
                case 7 -> {
                    staff.getaAccount().InputPassword();
                    EditStaff(staff, pos);
                }
                case 8 -> {
                    ((StaffService) staff).InputSalary();
                    EditStaff(staff, pos);
                }
                case 9 -> {
                    ((StaffService) staff).InputWorkingDays();
                    EditStaff(staff, pos);
                }
                case 10 -> {
                    staff.InputName();
                    staff.InputIDCard();
                    staff.InputSex();
                    staff.InputBirth();
                    staff.InputPhoneNumber();
                    staff.InputAddress();
                    staff.getaAccount().AddUsername();
                    staff.getaAccount().InputPassword();
                    ((StaffService) staff).InputSalary();
                    ((StaffService) staff).InputWorkingDays();
                    EditStaff(staff, pos);
                }
                case 11 -> OpenStaff(staff, pos);
            }
        } else {
            System.out.println("[0]. Edit Staff Name");
            System.out.println("[1]. Edit Staff ID Card");
            System.out.println("[2]. Edit Staff Sex");
            System.out.println("[3]. Edit Staff Birth");
            System.out.println("[4]. Edit Staff Phone Number");
            System.out.println("[5]. Edit Staff Address");
            System.out.println("[6]. Edit Staff Username");
            System.out.println("[7]. Edit Staff Password");
            System.out.println("[8]. Edit All");
            System.out.println("[9]. Back");
            int num = Main.InputNumber(0, 9);
            switch (num) {
                case 0 -> {
                    staff.InputName();
                    EditStaff(staff, pos);
                }
                case 1 -> {
                    staff.InputIDCard();
                    EditStaff(staff, pos);
                }
                case 2 -> {
                    staff.InputSex();
                    EditStaff(staff, pos);
                }
                case 3 -> {
                    staff.InputBirth();
                    EditStaff(staff, pos);
                }
                case 4 -> {
                    staff.InputPhoneNumber();
                    EditStaff(staff, pos);
                }
                case 5 -> {
                    staff.InputAddress();
                    EditStaff(staff, pos);
                }
                case 6 -> {
                    staff.getaAccount().AddUsername();
                    EditStaff(staff, pos);
                }
                case 7 -> {
                    staff.getaAccount().InputPassword();
                    EditStaff(staff, pos);
                }
                case 8 -> {
                    staff.InputName();
                    staff.InputIDCard();
                    staff.InputSex();
                    staff.InputBirth();
                    staff.InputPhoneNumber();
                    staff.InputAddress();
                    staff.getaAccount().AddUsername();
                    staff.getaAccount().InputPassword();
                    EditStaff(staff, pos);
                }
                case 9 -> OpenStaff(staff, pos);
            }
        }

    }

    public void SortStaff() throws IOException {
        Staff.WriteDataStaff();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t[STAFF SORTING]");
        Staff.OutputFields();
        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            Cafe.getlStaffs().get(i).Output();
        }
        System.out.println();
        System.out.println("[0]. Sort (ID)");
        System.out.println("[1]. Sort (Name)");
        System.out.println("[2]. Sort (ID Card)");
        System.out.println("[3]. Sort (Sex)");
        System.out.println("[4]. Sort (Birth)");
        System.out.println("[5]. Sort (Phone Number)");
        System.out.println("[6]. Sort (Address)");
        System.out.println("[7]. Sort (Type)");
        System.out.println("[8]. Sort (Wage)");
        System.out.println("[9]. Sort (Working Days)");
        System.out.println("[10]. Sort (Salary)");
        System.out.println("[11]. Back");
        int num = Main.InputNumber(0, 11);
        switch (num) {
            case 0 -> {
                Staff.SortID();
                SortStaff();
            }
            case 1 -> {
                Staff.SortName();
                SortStaff();
            }
            case 2 -> {
                Staff.SortIDCard();
                SortStaff();
            }
            case 3 -> {
                Staff.SortSex();
                SortStaff();
            }
            case 4 -> {
                Staff.SortBirth();
                SortStaff();
            }
            case 5 -> {
                Staff.SortPhoneNumber();
                SortStaff();
            }
            case 6 -> {
                Staff.SortAddress();
                SortStaff();
            }
            case 7 -> {
                Staff.SortType();
                SortStaff();
            }
            case 8 -> {
                Staff.SortSalary();
                SortStaff();
            }
            case 9 -> {
                Staff.SortWorkingDays();
                SortStaff();
            }
            case 10 -> {
                Staff.SortOfficialSalary();
                SortStaff();
            }
            case 11 -> ShowStaffList();
        }
    }

    public void OpenStaff(Staff staff, int pos) throws IOException {
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t[STAFF SETTINGS]");
        Staff.OutputFields();
        staff.Output();
        System.out.println();
        if (Objects.equals(staff.getsType(), "Staff")) {
            System.out.println("[0]. Edit Staff");
            System.out.println("[1]. Delete Staff");
            System.out.println("[2]. Back");

            int num = Main.InputNumber(0, 2);
            switch (num) {
                case 0 -> EditStaff(staff, pos);
                case 1 -> {
                    Cafe.getlStaffs().remove(pos);
                    ShowStaffList();
                }
                case 2 -> ShowStaffList();
            }
        } else {
            System.out.println("[0]. Edit Staff");
            System.out.println("[1]. Back");

            int num = Main.InputNumber(0, 1);
            switch (num) {
                case 0 -> EditStaff(staff, pos);
                case 1 -> ShowStaffList();
            }
        }

    }

    public void SearchStaffOption(String a) throws IOException {
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());

        a = a.toLowerCase();
        boolean check = false;
        int num;

        System.out.println("\t\t[SERVICE SEARCHING]");

        for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
            if (Cafe.getlStaffs().get(i).getsID().toLowerCase().contains(a)
                    || Cafe.getlStaffs().get(i).getsName().toLowerCase().contains(a)
                    || Cafe.getlStaffs().get(i).getsIDCard().toLowerCase().contains(a)
                    || Cafe.getlStaffs().get(i).getsSex().toLowerCase().contains(a)
                    || String.valueOf(Cafe.getlStaffs().get(i).getdBirth()).contains(a)
                    || Cafe.getlStaffs().get(i).getsPhoneNumber().toLowerCase().contains(a)
                    || Cafe.getlStaffs().get(i).getsAddress().toLowerCase().contains(a)
                    || Cafe.getlStaffs().get(i).getsType().toLowerCase().contains(a)
                    || Cafe.getlStaffs().get(i).getaAccount().getsUsername().toLowerCase().contains(a)
                    || Cafe.getlStaffs().get(i).getaAccount().getsPassword().toLowerCase().contains(a)) {
                check = true;
                break;
            }
            if (Objects.equals(Cafe.getlStaffs().get(i).getsType(), "Staff")) {
                if (String.valueOf(((StaffService) Cafe.getlStaffs().get(i)).getdSalary()).contains(a)
                        || String.valueOf(((StaffService) Cafe.getlStaffs().get(i)).getiWorkingDays()).contains(a)
                        || String.valueOf(((StaffService) Cafe.getlStaffs().get(i)).getdOfficialSalary()).contains(a)) {
                    check = true;
                    break;
                }
            }
        }

        if (check) {
            Staff.OutputFields();
            for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
                if (Cafe.getlStaffs().get(i).getsID().toLowerCase().contains(a)
                        || Cafe.getlStaffs().get(i).getsName().toLowerCase().contains(a)
                        || Cafe.getlStaffs().get(i).getsIDCard().toLowerCase().contains(a)
                        || Cafe.getlStaffs().get(i).getsSex().toLowerCase().contains(a)
                        || String.valueOf(Cafe.getlStaffs().get(i).getdBirth()).contains(a)
                        || Cafe.getlStaffs().get(i).getsPhoneNumber().toLowerCase().contains(a)
                        || Cafe.getlStaffs().get(i).getsAddress().toLowerCase().contains(a)
                        || Cafe.getlStaffs().get(i).getsType().toLowerCase().contains(a)
                        || Cafe.getlStaffs().get(i).getaAccount().getsUsername().toLowerCase().contains(a)
                        || Cafe.getlStaffs().get(i).getaAccount().getsPassword().toLowerCase().contains(a)) {
                    Cafe.getlStaffs().get(i).Output();
                } else if (Objects.equals(Cafe.getlStaffs().get(i).getsType(), "Staff")
                        &&
                        (Cafe.getlStaffs().get(i).getsID().toLowerCase().contains(a)
                                || Cafe.getlStaffs().get(i).getsName().toLowerCase().contains(a)
                                || Cafe.getlStaffs().get(i).getsIDCard().toLowerCase().contains(a)
                                || Cafe.getlStaffs().get(i).getsSex().toLowerCase().contains(a)
                                || String.valueOf(Cafe.getlStaffs().get(i).getdBirth()).contains(a)
                                || Cafe.getlStaffs().get(i).getsPhoneNumber().toLowerCase().contains(a)
                                || Cafe.getlStaffs().get(i).getsAddress().toLowerCase().contains(a)
                                || Cafe.getlStaffs().get(i).getsType().toLowerCase().contains(a)
                                || Cafe.getlStaffs().get(i).getaAccount().getsUsername().toLowerCase().contains(a)
                                || Cafe.getlStaffs().get(i).getaAccount().getsPassword().toLowerCase().contains(a)
                                || String.valueOf(((StaffService) Cafe.getlStaffs().get(i)).getdSalary()).contains(a)
                                || String.valueOf(((StaffService) Cafe.getlStaffs().get(i)).getiWorkingDays()).contains(a)
                                || String.valueOf(((StaffService) Cafe.getlStaffs().get(i)).getdOfficialSalary()).contains(a))
                ) {
                    Cafe.getlStaffs().get(i).Output();
                }
            }
            System.out.println();
            System.out.println("[0]. Select Staff");
            System.out.println("[1]. Search Again");
            System.out.println("[2]. Back");

            num = Main.InputNumber(0, 2);
            switch (num) {
                case 0 -> {
                    int pos = Staff.SelectStaff();
                    OpenStaff(Cafe.getlStaffs().get(pos), pos);
                }
                case 1 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Staff Bar: ");
                    String b = sc.nextLine();
                    SearchStaffOption(b);
                }
                case 2 -> ShowStaffList();
            }
        } else {
            System.out.println("\n\t\tNo Search Result\n");
            System.out.println("[0]. Search Again");
            System.out.println("[1]. Back");

            num = Main.InputNumber(0, 1);
            switch (num) {
                case 0 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Staff Bar: ");
                    String b = sc.nextLine();
                    SearchStaffOption(b);
                }
                case 1 -> ShowStaffList();
            }
        }
    }

    public void ShowStaffList() throws IOException {
        Staff.WriteDataStaff();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t[STAFF LIST]");
        int num;
        if (Staff.StaffCount() == 0) {
            Staff.OutputFields();
            for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
                Cafe.getlStaffs().get(i).Output();
            }
            System.out.println();
            System.out.println("[0]. Add Staff");
            System.out.println("[1]. Select Staff");
            System.out.println("[2]. Back");
            num = Main.InputNumber(0, 2);

            switch (num) {
                case 0 -> {
                    AddNewStaff();
                    ShowStaffList();
                }
                case 1 -> {
                    int pos = Staff.SelectStaff();
                    OpenStaff(Cafe.getlStaffs().get(pos), pos);
                }
                case 2 -> Login();
            }
        } else {
            Staff.OutputFields();
            for (int i = 0; i < Cafe.getlStaffs().size(); i++) {
                Cafe.getlStaffs().get(i).Output();
            }
            System.out.println();
            System.out.println("[0]. Add Staff");
            System.out.println("[1]. Select Staff");
            System.out.println("[2]. Search Staff");
            System.out.println("[3]. Sort Staff");
            System.out.println("[4]. Reset Staff ID");
            System.out.println("[5]. Back");
            num = Main.InputNumber(0, 5);

            switch (num) {
                case 0 -> {
                    AddNewStaff();
                    ShowStaffList();
                }
                case 1 -> {
                    int pos = Staff.SelectStaff();
                    OpenStaff(Cafe.getlStaffs().get(pos), pos);
                }
                case 2 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Staff Bar: ");
                    String a = sc.nextLine();
                    SearchStaffOption(a);
                }
                case 3 -> SortStaff();
                case 4 -> {
                    ResetStaffID();
                    ShowStaffList();
                }
                case 5 -> Login();
            }
        }
    }

    //Admin_Table
    @Override
    public void ShowTableList() throws IOException {
        Table.WriteDataTable();
        Main.clearScreen();
        Main.OutputInfor(this.getsName(), this.getsID());
        System.out.println("\t\t[TABLE LIST]");
        int num;
        if (Cafe.getlTables().size() == 0) {
            System.out.println("\n\t\tNo Table Added\n");
            System.out.println("[0]. Add Table");
            System.out.println("[1]. Back");
            num = Main.InputNumber(0, 1);
            switch (num) {
                case 0 -> {
                    Table.AddNewTable();
                    ShowTableList();
                }
                case 1 -> Login();
            }
        } else {
            System.out.println("\n\t" + Main.padRight("[ID]", 20) + "[STATUS]");
            for (int i = 0; i < Cafe.getlTables().size(); i++) {
                Cafe.getlTables().get(i).Output();
            }

            System.out.println();
            System.out.println("[0]. Add Table");
            System.out.println("[1]. Select Table");
            System.out.println("[2]. Search Table");
            System.out.println("[3]. Sort Table");
            System.out.println("[4]. Reset Table ID");
            System.out.println("[5]. Back");

            num = Main.InputNumber(0, 5);

            switch (num) {
                case 0 -> {
                    Table.AddNewTable();
                    ShowTableList();
                }
                case 1 -> {
                    int pos = Table.SelectTable();
                    OpenTable(Cafe.getlTables().get(pos), pos);
                }
                case 2 -> {
                    Scanner sc = new Scanner(System.in);
                    System.out.print(" => Searching Table Bar: ");
                    String b = sc.nextLine();
                    SearchTableOption(b);
                }
                case 3 -> SortTable();
                case 4 -> {
                    Table.ResetTableID();
                    ShowTableList();
                }
                case 5 -> Login();
            }
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
            if (Cafe.getlTables().get(i).getsID().toLowerCase().contains(a)
                    || Cafe.getlTables().get(i).getsStatus().toLowerCase().contains(a)) {
                check = true;
                break;
            }
        }

        if (check) {
            System.out.println("\n\t" + Main.padRight("[ID]", 20) + "[STATUS]");
            for (int i = 0; i < Cafe.getlTables().size(); i++) {
                if (Cafe.getlTables().get(i).getsID().toLowerCase().contains(a)
                        || Cafe.getlTables().get(i).getsStatus().toLowerCase().contains(a)) {
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
        System.out.println("[1]. Edit Table Status");
        System.out.println("[2]. Delete Table");
        System.out.println("[3]. Back");

        int num = Main.InputNumber(0, 3);
        switch (num) {
            case 0 -> OrderService(tb, pos);
            case 1 -> {
                System.out.println();
                tb.InputStatus();
                OpenTable(tb, pos);
            }
            case 2 -> {
                Cafe.getlTables().remove(pos);
                ShowTableList();
            }
            case 3 -> ShowTableList();
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

    //Admin_Order
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
}
