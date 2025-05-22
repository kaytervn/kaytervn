using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal class Account
    {
        //Fields
        protected string sUsername;
        protected string sPassword;

        //Propeties
        public string Username
        {
            get { return this.sUsername; }
            set { this.sUsername = value; }
        }

        public string Password
        {
            get { return this.sPassword; }
            set { this.sPassword = value; }
        }

        //Constructors
        public Account() { }

        public Account(string username, string password)
        {
            this.sUsername = username;
            this.sPassword = password;
        }

        //Destructors
        ~Account() { }

        //Input
        public void InputUsername()
        {
            Console.Write("Username: ");
            this.sUsername = Program.InputString().ToLower();
        }

        public void InputPassword()
        {
            Console.Write("Password: ");
            this.sPassword = Program.InputString();
        }

        public void Input()
        {
            InputUsername();
            InputPassword();
        }

        public void AddUsername()
        {
            Console.Write("Username: ");
            string username = Program.InputString().ToLower();
            while (IsExist(username) == true)
            {
                Console.WriteLine("\n\t\tUsername Is Used. Please Type Another Username!\n");
                Console.Write("Username: ");
                username = Program.InputString().ToLower();
            }
            this.Username = username;
        }

        public void AddAccount()
        {
            AddUsername();
            InputPassword();
        }

        //Methods
        static public bool IsExist(string username)
        {
            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                if (username.ToLower() == Cafe.lstaffs[i].Account.Username.ToLower())
                    return true;
            }  
            return false;
        }

        static public bool IsExist(Account account)
        {
            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                if (account == Cafe.lstaffs[i].Account)
                    return true;
            }
            return false;
        }

        static public void AccessLogin(Account login)
        {
            for (int i = 0; i < Cafe.lstaffs.Count(); i++)
            {
                if (login == Cafe.lstaffs[i].Account)
                {
                    if(!Date.IsDate(Program.dDate.Day, Program.dDate.Month, Program.dDate.Year))
                    Program.InputDate(Cafe.lstaffs[i].Name, Cafe.lstaffs[i].ID);
                    Cafe.lstaffs[i].Login();
                }
            }
        }

        //Operator
        public static bool operator ==(Account a, Account b)
        {
            return (a.Username.ToLower() == b.Username.ToLower()) && (a.Password == b.Password);
        }

        public static bool operator !=(Account a, Account b)
        {
            return !(a == b);
        }
    }
}
