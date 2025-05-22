using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal partial class StaffService
    {
        public void SortTable()
        {
            Service.WriteDataService();
            Console.Clear();
            Program.OutputInfor(Name, ID);
            Console.WriteLine("\t\t[TABLE SORTING]");
            Console.WriteLine("\n\t[ID]".PadRight(20) + "[STATUS]");
            for (int i = 0; i < Cafe.ltables.Count(); i++)
            {
                Cafe.ltables[i].Output();
            }
            Console.WriteLine();
            Console.WriteLine("[0]. Sort (ID)");
            Console.WriteLine("[1]. Sort (Status)");
            Console.WriteLine("[2]. Back");
            int num = Program.InputNumber(0, 2);
            switch (num)
            {
                case 0:
                    Table.SortID();
                    SortTable();
                    break;
                case 1:
                    Table.SortStatus();
                    SortTable();
                    break;
                case 2:
                    ShowTableList();
                    break;
            }
        }

        public void OpenTable(Table tb, int pos)
        {
            Table.WriteDataTable();
            Console.Clear();
            Program.OutputInfor(Name, ID);
            Console.WriteLine("\t\t[TABLE SETTINGS]");
            Console.WriteLine("\n\t[ID]".PadRight(20) + "[STATUS]");
            tb.Output();
            Console.WriteLine();
            Console.WriteLine("[0]. Order Service");
            Console.WriteLine("[1]. Back");

            int num = Program.InputNumber(0, 1);
            switch (num)
            {
                case 0:
                    OrderService(tb, pos);
                    break;
                case 1:
                    ShowTableList();
                    break;
            }
        }

        public void SearchTableOption(string a)
        {
            Console.Clear();
            Program.OutputInfor(Name, ID);

            a = a.ToLower();
            bool check = false;
            int num;

            Console.WriteLine("\t\t[TABLE SEARCHING]");

            for (int i = 0; i < Cafe.ltables.Count(); i++)
            {
                if (Cafe.ltables[i].ID.ToLower().Contains(a)
                || Cafe.ltables[i].Status.ToLower().Contains(a))
                {
                    check = true;
                    break;
                }
            }

            if (check)
            {
                Console.WriteLine("\n\t[ID]".PadRight(20) + "[STATUS]");
                for (int i = 0; i < Cafe.ltables.Count(); i++)
                {
                    if (Cafe.ltables[i].ID.ToLower().Contains(a)
                    || Cafe.ltables[i].Status.ToLower().Contains(a))
                    {
                        Cafe.ltables[i].Output();
                    }
                }
                Console.WriteLine();
                Console.WriteLine("[0]. Select Table");
                Console.WriteLine("[1]. Search Again");
                Console.WriteLine("[2]. Back");

                num = Program.InputNumber(0, 2);
                switch (num)
                {
                    case 0:
                        int pos = Table.SelectTable();
                        OpenTable(Cafe.ltables[pos], pos);
                        break;
                    case 1:
                        Console.Write(" => Searching Table Bar: ");
                        string b = Console.ReadLine();
                        SearchTableOption(b);
                        break;
                    case 2:
                        ShowTableList();
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
                        Console.Write(" => Searching Table Bar: ");
                        string b = Console.ReadLine();
                        SearchTableOption(b);
                        break;
                    case 1:
                        ShowTableList();
                        break;
                }
            }
        }

        public void ShowTableList()
        {
            Table.WriteDataTable();
            Console.Clear();
            Program.OutputInfor(Name, ID);
            Console.WriteLine("\t\t[TABLE LIST]");
            int num;
            if (Cafe.ltables.Count() > 0)
            {
                Console.WriteLine("\n\t[ID]".PadRight(20) + "[STATUS]");
                for (int i = 0; i < Cafe.ltables.Count(); i++)
                {
                    Cafe.ltables[i].Output();
                }

                Console.WriteLine();
                Console.WriteLine("[0]. Select Table");
                Console.WriteLine("[1]. Search Table");
                Console.WriteLine("[2]. Sort Table");
                Console.WriteLine("[3]. Back");

                num = Program.InputNumber(0, 3);

                switch (num)
                {
                    case 0:
                        int pos = Table.SelectTable();
                        OpenTable(Cafe.ltables[pos], pos);
                        break;
                    case 1:
                        Console.Write(" => Searching Table Bar: ");
                        string b = Console.ReadLine();
                        SearchTableOption(b);
                        break;
                    case 2:
                        SortTable();
                        break;
                    case 3:
                        Login();
                        break;
                }
            }
            else
            {
                Console.WriteLine("\n\t\tNo Table Added\n");
                Console.WriteLine("[0]. Back");
                num = Program.InputNumber(0, 0);
                Login();
            }
        }
    }
}
