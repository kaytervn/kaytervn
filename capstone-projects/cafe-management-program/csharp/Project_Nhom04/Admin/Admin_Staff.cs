using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal partial class Admin
    {
        //Staff
        public void EditStaff(Staff staff, int pos)
        {
            Staff.WriteDataStaff();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t[STAFF EDITING]");
            Staff.OutputFields();
            staff.Output();
            Console.WriteLine();

            if (staff.Type == "Staff")
            {
                Console.WriteLine("[0]. Edit Staff Name");
                Console.WriteLine("[1]. Edit Staff ID Card");
                Console.WriteLine("[2]. Edit Staff Sex");
                Console.WriteLine("[3]. Edit Staff Birth");
                Console.WriteLine("[4]. Edit Staff Phone Number");
                Console.WriteLine("[5]. Edit Staff Address");
                Console.WriteLine("[6]. Edit Staff Username");
                Console.WriteLine("[7]. Edit Staff Password");
                Console.WriteLine("[8]. Edit Staff Wage");
                Console.WriteLine("[9]. Edit Staff Working Days");
                Console.WriteLine("[10]. Edit All");
                Console.WriteLine("[11]. Back");
                int num = Program.InputNumber(0, 11);
                switch (num)
                {
                    case 0:
                        staff.InputName();
                        EditStaff(staff, pos);
                        break;
                    case 1:
                        staff.InputIDCard();
                        EditStaff(staff, pos);
                        break;
                    case 2:
                        staff.InputSex();
                        EditStaff(staff, pos);
                        break;
                    case 3:
                        staff.InputBirth();
                        EditStaff(staff, pos);
                        break;
                    case 4:
                        staff.InputPhoneNumber();
                        EditStaff(staff, pos);
                        break;
                    case 5:
                        staff.InputAddress();
                        EditStaff(staff, pos);
                        break;
                    case 6:
                        staff.Account.AddUsername();
                        EditStaff(staff, pos);
                        break;
                    case 7:
                        staff.Account.InputPassword();
                        EditStaff(staff, pos);
                        break;
                    case 8:
                        ((StaffService)staff).InputSalary();
                        EditStaff(staff, pos);
                        break;
                    case 9:
                        ((StaffService)staff).InputWorkingDays();
                        EditStaff(staff, pos);
                        break;
                    case 10:
                        staff.InputName();
                        staff.InputIDCard();
                        staff.InputSex();
                        staff.InputBirth();
                        staff.InputPhoneNumber();
                        staff.InputAddress();
                        staff.Account.AddUsername();
                        staff.Account.InputPassword();
                        ((StaffService)staff).InputSalary();
                        ((StaffService)staff).InputWorkingDays();
                        EditStaff(staff, pos);
                        break;
                    case 11:
                        OpenStaff(staff, pos);
                        break;
                }
            }
            else
            {
                Console.WriteLine("[0]. Edit Staff Name");
                Console.WriteLine("[1]. Edit Staff ID Card");
                Console.WriteLine("[2]. Edit Staff Sex");
                Console.WriteLine("[3]. Edit Staff Birth");
                Console.WriteLine("[4]. Edit Staff Phone Number");
                Console.WriteLine("[5]. Edit Staff Address");
                Console.WriteLine("[6]. Edit Staff Username");
                Console.WriteLine("[7]. Edit Staff Password");
                Console.WriteLine("[8]. Edit All");
                Console.WriteLine("[9]. Back");
                int num = Program.InputNumber(0, 9);
                switch (num)
                {
                    case 0:
                        staff.InputName();
                        EditStaff(staff, pos);
                        break;
                    case 1:
                        staff.InputIDCard();
                        EditStaff(staff, pos);
                        break;
                    case 2:
                        staff.InputSex();
                        EditStaff(staff, pos);
                        break;
                    case 3:
                        staff.InputBirth();
                        EditStaff(staff, pos);
                        break;
                    case 4:
                        staff.InputPhoneNumber();
                        EditStaff(staff, pos);
                        break;
                    case 5:
                        staff.InputAddress();
                        EditStaff(staff, pos);
                        break;
                    case 6:
                        staff.Account.AddUsername();
                        EditStaff(staff, pos);
                        break;
                    case 7:
                        staff.Account.InputPassword();
                        EditStaff(staff, pos);
                        break;
                    case 8:
                        staff.InputName();
                        staff.InputIDCard();
                        staff.InputSex();
                        staff.InputBirth();
                        staff.InputPhoneNumber();
                        staff.InputAddress();
                        staff.Account.AddUsername();
                        staff.Account.InputPassword();
                        EditStaff(staff, pos);
                        break;
                    case 9:
                        OpenStaff(staff, pos);
                        break;
                }
            }
            
        }

        public void SortStaff()
        {
            Staff.WriteDataStaff();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t[STAFF SORTING]");
            Staff.OutputFields();
            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                Cafe.lstaffs[i].Output();
            }
            Console.WriteLine();
            Console.WriteLine("[0]. Sort (ID)");
            Console.WriteLine("[1]. Sort (Name)");
            Console.WriteLine("[2]. Sort (ID Card)");
            Console.WriteLine("[3]. Sort (Sex)");
            Console.WriteLine("[4]. Sort (Birth)");
            Console.WriteLine("[5]. Sort (Phone Number)");
            Console.WriteLine("[6]. Sort (Address)");
            Console.WriteLine("[7]. Sort (Type)");
            Console.WriteLine("[8]. Sort (Wage)");
            Console.WriteLine("[9]. Sort (Working Days)");
            Console.WriteLine("[10]. Sort (Salary)");
            Console.WriteLine("[11]. Back");
            int num = Program.InputNumber(0, 11);
            switch (num)
            {
                case 0:
                    Staff.SortID();
                    SortStaff();
                    break;
                case 1:
                    Staff.SortName();
                    SortStaff();
                    break;
                case 2:
                    Staff.SortIDCard();
                    SortStaff();
                    break;
                case 3:
                    Staff.SortSex();
                    SortStaff();
                    break;
                case 4:
                    Staff.SortBirth();
                    SortStaff();
                    break;
                case 5:
                    Staff.SortPhoneNumber();
                    SortStaff();
                    break;
                case 6:
                    Staff.SortAddress();
                    SortStaff();
                    break;
                case 7:
                    Staff.SortType();
                    SortStaff();
                    break;
                case 8:
                    Staff.SortSalary();
                    SortStaff();
                    break;
                case 9:
                    Staff.SortWorkingDays();
                    SortStaff();
                    break;
                case 10:
                    Staff.SortOfficialSalary();
                    SortStaff();
                    break;
                case 11:
                    ShowStaffList();
                    break;
            }
        }

        public void OpenStaff(Staff staff, int pos)
        {
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t[STAFF SETTINGS]");
            Staff.OutputFields();
            staff.Output();
            Console.WriteLine();
            if (staff.Type == "Staff")
            {
                Console.WriteLine("[0]. Edit Staff");
                Console.WriteLine("[1]. Delete Staff");
                Console.WriteLine("[2]. Back");

                int num = Program.InputNumber(0, 2);
                switch (num)
                {
                    case 0:
                        EditStaff(staff, pos);
                        break;
                    case 1:
                        Cafe.lstaffs.RemoveAt(pos);
                        ShowStaffList();
                        break;
                    case 2:
                        ShowStaffList();
                        break;
                }
            }
            else
            {
                Console.WriteLine("[0]. Edit Staff");
                Console.WriteLine("[1]. Back");

                int num = Program.InputNumber(0, 1);
                switch (num)
                {
                    case 0:
                        EditStaff(staff, pos);
                        break;
                    case 1:
                        ShowStaffList();
                        break;
                }
            }
            
        }

        public void SearchStaffOption(string a)
        {
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);

            a = a.ToLower();
            bool check = false;
            int num;

            Console.WriteLine("\t\t[SERVICE SEARCHING]");

            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                if (Cafe.lstaffs[i].ID.ToLower().Contains(a)
                || Cafe.lstaffs[i].Name.ToLower().Contains(a)
                || Cafe.lstaffs[i].IDCard.ToLower().Contains(a)
                || Cafe.lstaffs[i].Sex.ToLower().Contains(a)
                || ((string)Cafe.lstaffs[i].Birth).Contains(a)
                || Cafe.lstaffs[i].PhoneNumber.ToLower().Contains(a)
                || Cafe.lstaffs[i].Address.ToLower().Contains(a)
                || Cafe.lstaffs[i].Type.ToLower().Contains(a)
                || Cafe.lstaffs[i].Account.Username.ToLower().Contains(a)
                || Cafe.lstaffs[i].Account.Password.ToLower().Contains(a))
                {
                    check = true;
                    break;
                }
                if (Cafe.lstaffs[i].Type == "Staff")
                {
                    if (((StaffService)Cafe.lstaffs[i]).Salary.ToString().ToLower().Contains(a)
                    || ((StaffService)Cafe.lstaffs[i]).WorkingDays.ToString().ToLower().Contains(a)
                    || ((StaffService)Cafe.lstaffs[i]).OfficialSalary.ToString().ToLower().Contains(a))
                    {
                        check = true;
                        break;
                    }
                }
            }

            if (check)
            {
                Staff.OutputFields();
                for (int i = 0; i < Cafe.lstaffs.Count(); i++)
                {
                    if (Cafe.lstaffs[i].ID.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Name.ToLower().Contains(a)
                        || Cafe.lstaffs[i].IDCard.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Sex.ToLower().Contains(a)
                        || ((string)Cafe.lstaffs[i].Birth).Contains(a)
                        || Cafe.lstaffs[i].PhoneNumber.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Address.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Type.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Account.Username.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Account.Password.ToLower().Contains(a)
                        )
                    {
                        Cafe.lstaffs[i].Output();
                    }
                    else if (Cafe.lstaffs[i].Type == "Staff"
                        &&
                        (Cafe.lstaffs[i].ID.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Name.ToLower().Contains(a)
                        || Cafe.lstaffs[i].IDCard.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Sex.ToLower().Contains(a)
                        || ((string)Cafe.lstaffs[i].Birth).Contains(a)
                        || Cafe.lstaffs[i].PhoneNumber.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Address.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Type.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Account.Username.ToLower().Contains(a)
                        || Cafe.lstaffs[i].Account.Password.ToLower().Contains(a)
                        || ((StaffService)Cafe.lstaffs[i]).Salary.ToString().ToLower().Contains(a)
                        || ((StaffService)Cafe.lstaffs[i]).WorkingDays.ToString().ToLower().Contains(a)
                        || ((StaffService)Cafe.lstaffs[i]).OfficialSalary.ToString().ToLower().Contains(a))
                        )
                    {
                        Cafe.lstaffs[i].Output();
                    }
                }
                Console.WriteLine();
                Console.WriteLine("[0]. Select Staff");
                Console.WriteLine("[1]. Search Again");
                Console.WriteLine("[2]. Back");

                num = Program.InputNumber(0, 2);
                switch (num)
                {
                    case 0:
                        int pos = Staff.SelectStaff();
                        OpenStaff(Cafe.lstaffs[pos], pos);
                        break;
                    case 1:
                        Console.Write(" => Searching Staff Bar: ");
                        string b = Console.ReadLine();
                        SearchStaffOption(b);
                        break;
                    case 2:
                        ShowStaffList();
                        break;
                }
            }
            else
            {
                Console.WriteLine("\n\t\tNo Search Result\n");
                Console.WriteLine("[0]. Search Again");
                Console.WriteLine("[1]. Back");

                num = Program.InputNumber(0, 1);
                switch (num)
                {
                    case 0:
                        Console.Write(" => Searching Staff Bar: ");
                        string b = Console.ReadLine();
                        SearchStaffOption(b);
                        break;
                    case 1:
                        ShowStaffList();
                        break;
                }
            }
        }

        public void ShowStaffList()
        {
            Staff.WriteDataStaff();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t[STAFF LIST]");
            int num;
            if (Staff.StaffCount() == 0)
            {
                Staff.OutputFields();
                for (int i = 0; i < Cafe.lstaffs.Count(); i++)
                {
                    Cafe.lstaffs[i].Output();
                }
                Console.WriteLine();
                Console.WriteLine("[0]. Add Staff");
                Console.WriteLine("[1]. Select Staff");
                Console.WriteLine("[2]. Back");
                num = Program.InputNumber(0, 2);

                switch (num)
                {
                    case 0:
                        AddNewStaff();
                        ShowStaffList();
                        break;
                    case 1:
                        int pos = Staff.SelectStaff();
                        OpenStaff(Cafe.lstaffs[pos], pos);
                        break;
                    case 2:
                        Login();
                        break;
                }
            }
            else
            {
                Staff.OutputFields();
                for (int i = 0; i < Cafe.lstaffs.Count(); i++)
                {
                    Cafe.lstaffs[i].Output();
                }
                Console.WriteLine();
                Console.WriteLine("[0]. Add Staff");
                Console.WriteLine("[1]. Select Staff");
                Console.WriteLine("[2]. Search Staff");
                Console.WriteLine("[3]. Sort Staff");
                Console.WriteLine("[4]. Reset Staff ID");
                Console.WriteLine("[5]. Back");
                num = Program.InputNumber(0, 5);

                switch (num)
                {
                    case 0:
                        AddNewStaff();
                        ShowStaffList();
                        break;
                    case 1:
                        int pos = Staff.SelectStaff();
                        OpenStaff(Cafe.lstaffs[pos], pos);
                        break;
                    case 2:
                        Console.Write(" => Searching Staff Bar: ");
                        string a = Console.ReadLine();
                        SearchStaffOption(a);
                        break;
                    case 3:
                        SortStaff();
                        break;
                    case 4:
                        ResetStaffID();
                        ShowStaffList();
                        break;
                    case 5:
                        Login();
                        break;
                }
            }
        }
    }
}
