using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal partial class Admin : Staff, ITable, IOrder
    {
        //Fields

        //Properties

        //Constructors
        public Admin() { }

        public Admin(string sID, string sName, string sIDCard, string sSex, Date dBirth, string sPhoneNumber, string sAddress, string sType, Account aAccount) : base(sID, sName, sIDCard, sSex, dBirth, sPhoneNumber, sAddress, sType, aAccount)
        {

        }

        //Methods
        public override void Login()
        {
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            
            Console.WriteLine("[0]. Staff Manager");
            Console.WriteLine("[1]. Table Manager");
            Console.WriteLine("[2]. Service Manager");
            Console.WriteLine("[3]. Income Manager");
            Console.WriteLine("[4]. Log out");

            int num = Program.InputNumber(0, 4);
            switch (num)
            {
                case 0:
                    ShowStaffList();
                    break;
                case 1:
                    ShowTableList();
                    break;
                case 2:
                    ShowServiceList();
                    break;
                case 3:
                    ShowBillList();
                    break;
                case 4:
                    Program.Login();
                    break;
            }
        }
    }
}
