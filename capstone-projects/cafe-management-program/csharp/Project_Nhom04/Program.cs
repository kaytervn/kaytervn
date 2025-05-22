using System;
using System.Collections.Specialized;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;

namespace Project_Nhom04 // Note: actual namespace depends on the project name.
{
    internal class Program
    {
        static public Date dDate;

        static void Main(string[] args)
        {
            dDate = new Date();

            Cafe.cafename = "GAMTIME Cafe";
            Cafe.owner = "Mr. Trong & Mr. Trung";
            Cafe.address = "3 No. 9, KDC, District 7, Ho Chi Minh City";

            Cafe.lstaffs = new List<Staff>();
            Cafe.ltables = new List<Table>();
            Cafe.lservices = new List<Service>();
            Cafe.lbills = new List<Bill>();

            ReadData();
            Login();
        }

        static public void ReadData()
        {
            Table.ReadDataTable();
            Service.ReadDataService();
            Bill.ReadDataBill();
            Staff.ReadDataStaff();
        }

        static public void InputDate(string name, string id)
        {
            Console.Clear();
            OutputInfor(name, id);
            dDate.Input();
        }

        static public void Login()
        {
            Console.Clear();
            Console.WriteLine("\t" + Cafe.cafename);
            Console.WriteLine("Owner: " + Cafe.owner);
            Console.WriteLine("Addess: " + Cafe.address);
            Console.WriteLine();
            Console.WriteLine("\tLOGIN");
            Account lg = new Account();
            lg.Input();
            if (Account.IsExist(lg) == false)
            {
                Console.WriteLine("\n\tInvalid Username Or Password!");
                Console.WriteLine("\n[0]. Try Again");
                int num = InputNumber(0, 0);
                Login();
            }
            Account.AccessLogin(lg);
        }

        static public int InputNumber_Int()
        {
            int num;
            do
            {
                try
                {
                    num = Convert.ToInt32(Console.ReadLine());
                    if (num < 0)
                        continue;
                    else
                        break;
                }
                catch
                {
                    continue;
                }
            } while (true);
            return num;
        }

        static public double InputNumber_Double()
        {
            double num;
            do
            {
                try
                {
                    num = Convert.ToDouble(Console.ReadLine());
                    if (num < 0)
                        continue;
                    else
                        break;
                }
                catch
                {
                    continue;
                }
            } while (true);
            return num;
        }

        static public int InputNumber(int dau, int cuoi)
        {
            Console.WriteLine("--------------------------------");
            int num;
            do
            {
                try
                {
                    Console.Write("Please Enter A Number");
                    if (dau != cuoi)
                        Console.Write(" From {0} To {1}", dau, cuoi);
                    Console.Write(": ");
                    num = Convert.ToInt32(Console.ReadLine());

                    if (num >= dau && num <= cuoi)
                        break;
                    else
                        continue;
                }
                catch
                {
                    continue;
                }
            } while (true);
            return num;
        }

        static public string InputString()
        {
            string a;
            do
            {
                a = Console.ReadLine();
            } while (a.Contains(';'));
            return a;
        }

        static public void OutputInfor(string name, string id)
        {
            Console.WriteLine("\t" + Cafe.cafename);
            Console.WriteLine("Owner: " + Cafe.owner);
            Console.WriteLine("Addess: " + Cafe.address);
            Console.WriteLine();
            Console.WriteLine("\tUSER INFORMATION");
            Console.WriteLine("Name: " + name);
            Console.WriteLine("Staff ID: " + id);
            if (Date.IsDate(dDate.Day, dDate.Month, dDate.Year))
            {
                Console.Write("Date: ");
                dDate.Output();
            }
            Console.WriteLine();
        }
    }
}