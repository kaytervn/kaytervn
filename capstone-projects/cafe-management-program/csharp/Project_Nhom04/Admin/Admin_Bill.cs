using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal partial class Admin
    {
        public void Statistic(int d, int m, int y)
        {
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t\t[INCOME STATISTIC]");

            double total = 0;
            int billcount = 0;
            bool check = false;
            int num;

            for (int i = 0; i < Cafe.lbills.Count(); i++)
            {
                if ((Cafe.lbills[i].date.Day == d && Cafe.lbills[i].date.Month == m && Cafe.lbills[i].date.Year == y)
                || (Cafe.lbills[i].date.Month == m && Cafe.lbills[i].date.Year == y && d == -1)
                || (Cafe.lbills[i].date.Year == y && d == -1 && m == -1))
                {
                    check = true;
                    break;
                }
            }

            if (check)
            {
                Bill.OutputFields();
                for (int i = 0; i < Cafe.lbills.Count(); i++)
                {
                    if ((Cafe.lbills[i].date.Day == d && Cafe.lbills[i].date.Month == m && Cafe.lbills[i].date.Year == y)
                    || (Cafe.lbills[i].date.Month == m && Cafe.lbills[i].date.Year == y && d == -1)
                    || (Cafe.lbills[i].date.Year == y && d == -1 && m == -1))
                    {
                        Cafe.lbills[i].Output();
                        billcount++;
                        total += Cafe.lbills[i].Total;
                    }
                }

                Console.WriteLine("\t--------------------------------");
                Console.WriteLine("\tFinal Total: " + total + " (VND)");
                Console.WriteLine("\tBills Count: " + billcount);
            }
            else
            {
                Console.WriteLine("\n\t\tNo Statistic Result");
            }
            Console.WriteLine();
            Console.WriteLine("[0]. Get Statistic Again");
            Console.WriteLine("[1]. Back");
            num = Program.InputNumber(0, 1);
            switch (num)
            {
                case 0:
                    SelectStatistical(d, m, y);
                    break;
                case 1:
                    ShowBillList();
                    break;
            }
        }

        public void SelectStatistical(int d, int m, int y)
        {
            Console.WriteLine();
            Console.WriteLine("\t\t[SELECT STATISTICS]");
            Console.WriteLine("[0]. Statistical Date");
            Console.WriteLine("[1]. Statistical Month - Year");
            Console.WriteLine("[2]. Statistical Year");
            int num = Program.InputNumber(0, 2);
            switch (num)
            {
                case 0:
                    Console.Write(" => Enter Day: ");
                    d = Program.InputNumber_Int();
                    Console.Write(" => Enter Month: ");
                    m = Program.InputNumber_Int();
                    Console.Write(" => Enter Year: ");
                    y = Program.InputNumber_Int();
                    break;
                case 1:
                    d = -1;
                    Console.Write(" => Enter Month: ");
                    m = Program.InputNumber_Int();
                    Console.Write(" => Enter Year: ");
                    y = Program.InputNumber_Int();
                    break;
                case 2:
                    d = -1;
                    m = -1;
                    Console.Write(" => Enter Year: ");
                    y = Program.InputNumber_Int();
                    break;
            }
            Statistic(d, m, y);
        }

        public void SortBill()
        {
            Bill.WriteDataBill();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t\t[BILL SORTING]");
            Bill.OutputFields();
            for (int i = 0; i < Cafe.lbills.Count(); i++)
            {
                Cafe.lbills[i].Output();
            }
            Console.WriteLine();
            Console.WriteLine("[0]. Sort (ID)");
            Console.WriteLine("[1]. Sort (Staff Name)");
            Console.WriteLine("[2]. Sort (Date)");
            Console.WriteLine("[3]. Sort (Total)");
            Console.WriteLine("[4]. Back");
            int num = Program.InputNumber(0, 4);
            switch (num)
            {
                case 0:
                    Bill.SortID();
                    SortBill();
                    break;
                case 1:
                    Bill.SortStaffName();
                    SortBill();
                    break;
                case 2:
                    Bill.SortDate();
                    SortBill();
                    break;
                case 3:
                    Bill.SortTotal();
                    SortBill();
                    break;
                case 4:
                    ShowBillList();
                    break;
            }
        }

        public void ShowBillList()
        {
            Bill.WriteDataBill();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t\t[INCOME MANAGER]");
            int num;
            if (Cafe.lbills.Count() == 0)
            {
                Console.WriteLine("\n\t\tNo Bill Created\n");
                Console.WriteLine("[0]. Back");
                num = Program.InputNumber(0, 0);
                Login();
            }
            else
            {
                Bill.OutputFields();
                for (int i = 0; i < Cafe.lbills.Count(); i++)
                {
                    Cafe.lbills[i].Output();
                }
                Console.WriteLine("\t--------------------------------");
                Console.WriteLine("\tFinal Total: " + Cafe.total + " (VND)");
                Console.WriteLine("\tBills Count: " + Cafe.lbills.Count());
                Console.WriteLine();
                Console.WriteLine("[0]. Get Statistic");
                Console.WriteLine("[1]. Sort Bill");
                Console.WriteLine("[2]. Back");

                num = Program.InputNumber(0, 2);

                switch (num)
                {
                    case 0:
                        int d = -1;
                        int m = -1;
                        int y = -1;
                        SelectStatistical(d, m, y);
                        break;
                    case 1:
                        SortBill();
                        break;
                    case 2:
                        Login();
                        break; 
                }
            }
        }
    }
}
