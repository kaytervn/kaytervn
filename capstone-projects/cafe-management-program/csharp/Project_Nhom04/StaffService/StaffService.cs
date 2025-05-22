using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal partial class StaffService : Staff, ITable, IOrder
    {
        //Fields
        private double dSalary;
        private double dOfficialSalary;
        private int iWorkingDays;
        public double Salary
        {
            get { return dSalary; }
            set { dSalary = value; }
        }

        public int WorkingDays
        {
            get { return iWorkingDays; }
            set { iWorkingDays = value; }
        }

        public double OfficialSalary
        {
            get { return dOfficialSalary; }
            set { dOfficialSalary = value; }
        }
        //constructor
        public StaffService() { }

        public StaffService(string sID, string sName, string sIDCard, string sSex, Date dBirth, string sPhoneNumber, string sAddress, string sType, Account aAccount,
            double salary, int workingDays, double officialsalary) : base(sID, sName, sIDCard, sSex, dBirth, sPhoneNumber, sAddress, sType, aAccount)
        {
            Salary = salary;
            WorkingDays = workingDays;
            OfficialSalary = officialsalary;
        }
        //Methods
        public override void Login()
        {
            Console.Clear();
            Program.OutputInfor(Name, ID);

            Console.WriteLine("[0]. Information");
            Console.WriteLine("[1]. Table Manager");
            Console.WriteLine("[2]. Log out");

            int num = Program.InputNumber(0, 2);
            switch (num)
            {
                case 0:
                    Console.WriteLine("\n\t\t[STAFF INFORMATION]");
                    Staff.OutputFields();
                    Output();
                    Console.WriteLine();
                    Console.WriteLine("[0]. Back");
                    int num2 = Program.InputNumber(0, 0);
                    Login();
                    break;
                case 1:
                    ShowTableList();
                    break;
                case 2:
                    Program.Login();
                    break;

            }
        }

        public void SolveOfficialSalary()
        {
            OfficialSalary = Salary * WorkingDays;
        }

        public override int FindPadRight()
        {
            int max = base.FindPadRight(); ;
            while (this.Salary.ToString().Length > max 
                || this.WorkingDays.ToString().Length > max 
                || this.OfficialSalary.ToString().Length > max)
            {
                max++;
            }
            return max;
        }

        public void InputSalary()
        {
            Console.Write("Wage (VND): ");
            Salary = Program.InputNumber_Double();
            SolveOfficialSalary();

        }
        public void InputWorkingDays()
        {
            Console.Write("Working Days: ");
            WorkingDays = Program.InputNumber_Int();
            SolveOfficialSalary();
        }
        public override void Input()
        {
            base.Input();
            InputSalary();
            InputWorkingDays();
            SolveOfficialSalary();
        }
        public override void Output()
        {
            Console.WriteLine(ID.PadRight(PadRightMax()) + Name.PadRight(PadRightMax()) + IDCard.PadRight(PadRightMax()) + Sex.PadRight(PadRightMax()) + ((string)Birth).PadRight(PadRightMax()) + PhoneNumber.PadRight(PadRightMax()) + Address.PadRight(PadRightMax()) + Type.PadRight(PadRightMax()) + Account.Username.PadRight(PadRightMax()) + Account.Password.PadRight(PadRightMax()) + Salary.ToString().PadRight(PadRightMax()) + WorkingDays.ToString().PadRight(PadRightMax()) + OfficialSalary.ToString());
        }
    }
}
