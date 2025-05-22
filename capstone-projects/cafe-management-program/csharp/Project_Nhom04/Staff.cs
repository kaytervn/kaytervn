using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal class Staff
    {
        //Fields
        private string sID;
        private string sName;
        private string sIDCard;
        private string sSex;
        private Date dBirth;
        private string sPhoneNumber;
        private string sAddress;
        private string sType;
        private Account aAccount;

        //Properties
        public string ID
        {
            get { return this.sID; }
            set { this.sID = value; }
        }

        public string Name
        {
            get { return this.sName; }
            set { this.sName = value; }
        }

        public string IDCard
        {
            get { return this.sIDCard; }
            set { this.sIDCard = value; }
        }

        public string Sex
        {
            get { return this.sSex; }
            set { this.sSex = value; }
        }

        public Date Birth
        {
            get { return this.dBirth; }
            set { this.dBirth = value; }
        }

        public string PhoneNumber
        {
            get { return this.sPhoneNumber; }
            set { this.sPhoneNumber = value; }
        }

        public string Address
        {
            get { return this.sAddress; }
            set { this.sAddress = value; }
        }

        public string Type
        {
            get { return this.sType; }
            set { this.sType = value; }
        }

        public Account Account
        {
            get { return this.aAccount; }
            set { this.aAccount = value; }
        }

        //Contrustors
        public Staff() { }

        public Staff(string sID, string sName, string sIDCard, string sSex, Date dBirth, string sPhoneNumber, string sAddress, string sType, Account aAccount)
        {
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

        //Destructors
        ~Staff() { }

        //input
        public void InputName()
        {
            Console.Write("Staff Name: ");
            this.Name = Program.InputString();
        }

        public void InputIDCard()
        {
            Console.Write("ID Card Number: ");
            this.IDCard = Program.InputString();
        }

        public void InputSex()
        {
            Console.WriteLine("Gender ([0] Male - [1] Female): ");
            int tp = Program.InputNumber(0, 1);
            switch (tp)
            {
                case 0:
                    this.Sex = "Male";
                    break;
                case 1:
                    this.Sex = "Female";
                    break;
            }
        }

        public void InputBirth()
        {
            Console.Write("Birth Of ");
            this.dBirth = new Date();
            this.dBirth.Input();
        }

        public void InputPhoneNumber()
        {
            Console.Write("Phone Number: ");
            this.PhoneNumber = Program.InputString();
        }

        public void InputAddress()
        {
            Console.Write("Address: ");
            this.Address = Program.InputString();
        }

        public virtual void Input()
        {
            this.sID = "ST";
            if (StaffCount() == 0)
                this.sID += (StaffCount()).ToString();
            else
                this.sID += Convert.ToInt32(FindMaxStaffID() + 1).ToString();
            Console.WriteLine("Current Staff ID: " + this.sID);
            InputName();
            InputIDCard();
            InputSex();
            InputBirth();
            InputPhoneNumber();
            InputAddress();
            this.Account = new Account();
            this.Account.AddAccount();
            this.Type = "Staff";
        }

        //Output
        public virtual void Output()
        {
            Console.WriteLine(this.sID.PadRight(PadRightMax()) + this.sName.PadRight(PadRightMax()) + this.sIDCard.PadRight(PadRightMax()) + this.Sex.PadRight(PadRightMax()) + ((string)this.dBirth).PadRight(PadRightMax()) + this.sPhoneNumber.PadRight(PadRightMax()) + this.sAddress.PadRight(PadRightMax()) + this.Type.PadRight(PadRightMax()) + this.Account.Username.PadRight(PadRightMax()) + this.Account.Password);
        }

        //Methods
        //Sorts
        static public void SortSalary()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (Cafe.lstaffs[i].Type == "Staff" && Cafe.lstaffs[j].Type == "Staff")
                    {
                        StaffService sv1 = (StaffService)Cafe.lstaffs[i];
                        StaffService sv2 = (StaffService)Cafe.lstaffs[j];
                        if (sv1.Salary > sv2.Salary)
                        {
                            Staff tmp = Cafe.lstaffs[i];
                            Cafe.lstaffs[i] = Cafe.lstaffs[j];
                            Cafe.lstaffs[j] = tmp;
                        }
                    }


                }
            }
        }

        static public void SortWorkingDays()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (Cafe.lstaffs[i].Type == "Staff" && Cafe.lstaffs[j].Type == "Staff")
                    {
                        StaffService st1 = (StaffService)Cafe.lstaffs[i];
                        StaffService st2 = (StaffService)Cafe.lstaffs[j];
                        if (st1.WorkingDays > st2.WorkingDays)
                        {
                            Staff tmp = Cafe.lstaffs[i];
                            Cafe.lstaffs[i] = Cafe.lstaffs[j];
                            Cafe.lstaffs[j] = tmp;
                        }
                    }
                }
            }
        }

        static public void SortOfficialSalary()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (Cafe.lstaffs[i].Type == "Staff" && Cafe.lstaffs[j].Type == "Staff")
                    {
                        StaffService st1 = (StaffService)Cafe.lstaffs[i];
                        StaffService st2 = (StaffService)Cafe.lstaffs[j];
                        if (st1.OfficialSalary > st2.OfficialSalary)
                        {
                            Staff tmp = Cafe.lstaffs[i];
                            Cafe.lstaffs[i] = Cafe.lstaffs[j];
                            Cafe.lstaffs[j] = tmp;
                        }
                    }
                }
            }
        }

        static public void SortType()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (String.Compare(Cafe.lstaffs[i].Type, Cafe.lstaffs[j].Type) > 0)
                    {
                        Staff tmp = Cafe.lstaffs[i];
                        Cafe.lstaffs[i] = Cafe.lstaffs[j];
                        Cafe.lstaffs[j] = tmp;
                    }
                }
            }
        }
        static public void SortID()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (String.Compare(Cafe.lstaffs[i].ID, Cafe.lstaffs[j].ID) > 0)
                    {
                        Staff tmp = Cafe.lstaffs[i];
                        Cafe.lstaffs[i] = Cafe.lstaffs[j];
                        Cafe.lstaffs[j] = tmp;
                    }
                }
            }
        }
        static public void SortName()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (String.Compare(Cafe.lstaffs[i].Name, Cafe.lstaffs[j].Name) > 0)
                    {
                        Staff tmp = Cafe.lstaffs[i];
                        Cafe.lstaffs[i] = Cafe.lstaffs[j];
                        Cafe.lstaffs[j] = tmp;
                    }
                }
            }
        }

        static public void SortIDCard()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (String.Compare(Cafe.lstaffs[i].IDCard, Cafe.lstaffs[j].IDCard) > 0)
                    {
                        Staff tmp = Cafe.lstaffs[i];
                        Cafe.lstaffs[i] = Cafe.lstaffs[j];
                        Cafe.lstaffs[j] = tmp;
                    }
                }
            }
        }

        static public void SortSex()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (String.Compare(Cafe.lstaffs[i].Sex, Cafe.lstaffs[j].Sex) > 0)
                    {
                        Staff tmp = Cafe.lstaffs[i];
                        Cafe.lstaffs[i] = Cafe.lstaffs[j];
                        Cafe.lstaffs[j] = tmp;
                    }
                }
            }
        }

        static public void SortPhoneNumber()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (String.Compare(Cafe.lstaffs[i].PhoneNumber, Cafe.lstaffs[j].PhoneNumber) > 0)
                    {
                        Staff tmp = Cafe.lstaffs[i];
                        Cafe.lstaffs[i] = Cafe.lstaffs[j];
                        Cafe.lstaffs[j] = tmp;
                    }
                }
            }
        }

        static public void SortAddress()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (String.Compare(Cafe.lstaffs[i].Address, Cafe.lstaffs[j].Address) > 0)
                    {
                        Staff tmp = Cafe.lstaffs[i];
                        Cafe.lstaffs[i] = Cafe.lstaffs[j];
                        Cafe.lstaffs[j] = tmp;
                    }
                }
            }
        }

        static public void SortBirth()
        {
            for (int i = 0; i < Cafe.lstaffs.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lstaffs.Count(); j++)
                {
                    if (Cafe.lstaffs[i].Birth > Cafe.lstaffs[j].Birth)
                    {
                        Staff tmp = Cafe.lstaffs[i];
                        Cafe.lstaffs[i] = Cafe.lstaffs[j];
                        Cafe.lstaffs[j] = tmp;
                    }
                }
            }
        }

        //Methods
        static public int FindMaxStaffID()
        {
            int id = 0;
            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                if (Cafe.lstaffs[i].Type == "Staff" && Convert.ToInt32(Cafe.lstaffs[i].ID.Substring(2)) > id)
                    id = Convert.ToInt32(Cafe.lstaffs[i].ID.Substring(2));
            }
            return id;
        }

        static public int StaffCount()
        {
            int dem = 0;
            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                if (Cafe.lstaffs[i].Type == "Staff")
                    dem++;
            }
            return dem;
        }

        public virtual int FindPadRight()
        {
            int max = 1;
            while (this.sID.Length > max
                || this.sName.Length > max
                || this.sIDCard.Length > max
                || this.sSex.ToString().Length > max
                || ((string)this.dBirth).Length > max
                || this.sPhoneNumber.Length > max
                || this.sAddress.Length > max
                || this.sType.Length > max
                || this.Account.Username.Length > max
                || this.Account.Password.Length > max)
            {
                max++;
            }
            return max;
        }

        static public int PadRightMax()
        {
            int len = Cafe.lstaffs[0].FindPadRight();
            for (int i = 1; i < Cafe.lstaffs.Count(); i++)
            {
                if (Cafe.lstaffs[i].FindPadRight() > len)
                    len = Cafe.lstaffs[i].FindPadRight();
            }
            return len + 2;
        }

        static public int SelectStaff()
        {
            string id;
            int pos;
            do
            {
                try
                {
                    Console.Write(" => Now Enter Staff ID: ");
                    id = Console.ReadLine();
                    pos = SearchStaff(id);
                    if (pos == -1)
                        continue;
                    else
                        return pos;
                }
                catch
                {
                    continue;
                }
            } while (true);
        }

        static public void AddNewStaff()
        {
            Console.WriteLine("\n\t[ADDING NEW STAFF]\n");
            Staff staff = new StaffService();
            staff.Input();
            Cafe.lstaffs.Add(staff);
        }

        static public void OutputFields()
        {
            Console.WriteLine("\n[ID]".PadRight(PadRightMax()) +
                "[NAME]".PadRight(PadRightMax()) +
                "[ID CARD]".PadRight(PadRightMax()) +
                "[SEX]".PadRight(PadRightMax()) +
                "[BIRTH]".PadRight(PadRightMax()) +
                "[PHONE]".PadRight(PadRightMax()) +
                "[ADDRESS]".PadRight(PadRightMax()) +
                "[TYPE]".PadRight(PadRightMax()) +
                "[USERNAME]".PadRight(PadRightMax()) +
                "[PASSWORD]".PadRight(PadRightMax()) +
                "[WAGE]".PadRight(PadRightMax()) +
                "[WORKDAYS]".PadRight(PadRightMax()) +
                "[SALARY]");
        }

        public virtual void Login() { }

        static public void ResetStaffID()
        {
            int dem = 0;
            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                if(Cafe.lstaffs[i].Type == "Staff")
                {
                    Cafe.lstaffs[i].ID = "ST" + dem.ToString();
                    dem++;
                }
            }
        }

        static public int SearchStaff(string id)
        {
            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                if (Cafe.lstaffs[i].ID.ToLower() == id.ToLower())
                {
                    return i;
                }
            }
            return -1;
        }

        //FILES
        static public void WriteDataStaff()
        {
            string[] wt = new string[Cafe.lstaffs.Count()];
            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                wt[i] = Cafe.lstaffs[i].ID +
                    ";" + Cafe.lstaffs[i].Name +
                    ";" + Cafe.lstaffs[i].IDCard +
                    ";" + Cafe.lstaffs[i].Sex +
                    ";" + (string)Cafe.lstaffs[i].Birth +
                    ";" + Cafe.lstaffs[i].PhoneNumber +
                    ";" + Cafe.lstaffs[i].Address +
                    ";" + Cafe.lstaffs[i].Type +
                    ";" + Cafe.lstaffs[i].Account.Username +
                    ";" + Cafe.lstaffs[i].Account.Password;

                if (Cafe.lstaffs[i].Type == "Staff")
                {
                    StaffService stsv = (StaffService)Cafe.lstaffs[i];
                    wt[i] += ";" + stsv.Salary + ";" + stsv.WorkingDays + ";" + stsv.OfficialSalary;
                }
            }

            File.WriteAllLines("Staff.txt", wt);
        }

        static public void ReadDataStaff()
        {
            string[] a = File.ReadAllLines("Staff.txt");

            for (int i = 0; i < a.Length; i++)
            {
                string[] b = a[i].Split(';');
                Staff st;
                if (b.Length == 13)
                {
                    st = new StaffService(b[0], b[1], b[2], b[3], (Date)b[4],
                                          b[5], b[6], b[7], new Account(b[8], b[9]),
                                          Convert.ToDouble(b[10]), Convert.ToInt32(b[11]), Convert.ToDouble(b[12]));
                }
                else
                {
                    st = new Admin(b[0], b[1], b[2], b[3], (Date)b[4],
                                    b[5], b[6], b[7], new Account(b[8], b[9]));
                }
                Cafe.lstaffs.Add(st);
            }
        }
    }
}
