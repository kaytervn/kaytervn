using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal partial class Admin
    {
        public void PayOff(Table tb, int pos)
        {
            Bill bl = new Bill();
            bl.Input();
            bl.StaffName = this.Name;
            bl.date = Program.dDate;
            bl.CalsTotal(tb.ListOrder);
            Cafe.lbills.Add(bl);

            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("\t\t[BILL - ID: {0}]", bl.ID);
            Console.WriteLine("\tCurrent Table ID: " + tb.ID);
            Console.Write("\tDate: ");
            bl.date.Output();
            Console.Write("\tTime: ");
            bl.Time.Output();
            Console.WriteLine();
            Console.WriteLine("\t\t[SERVICE ORDERED]");
            Order.OutputFields(tb.ListOrder);
            for (int i = 0; i < tb.ListOrder.Count(); i++)
            {
                tb.ListOrder[i].Output(tb.ListOrder);
            }
            Console.WriteLine("\t--------------------------------");
            Console.WriteLine("\tTotal: " + bl.Total + " (VND)");

            tb.ListOrder.Clear();
            tb.Status = "Empty";
            Table.WriteDataTable();

            Bill.CalsToTalIncome();
            Bill.WriteDataBill();

            Console.WriteLine();
            Console.WriteLine("[0]. Continue");
            int num = Program.InputNumber(0, 0);
            ShowTableList();
        }

        public void MakeNewOrder(Table tb, int pos)
        {
            Table.WriteDataTable();
            Service.WriteDataService();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("Current Table ID: " + tb.ID);
            Console.WriteLine();
            Console.WriteLine("\t\t[SERVICE MENU]");

            int num;

            if (Cafe.lservices.Count() == 0)
            {
                Console.WriteLine("\n\t\tNo Service Added\n");
                Console.WriteLine("[0]. Back");
                num = Program.InputNumber(0, 0);
                OrderService(tb, pos);
            }
            else
            {
                Service.OutputFields();
                for (int i = 0; i < Cafe.lservices.Count(); i++)
                {
                    Cafe.lservices[i].Output();
                }
                Console.WriteLine();
                Console.WriteLine("[0]. Select Service");
                Console.WriteLine("[1]. Back");

                num = Program.InputNumber(0, 1);
                switch (num)
                {
                    case 0:
                        tb.Status = "Served";

                        Console.WriteLine("\n\t[ORDER SERVICE]\n");
                        int SVpos = Order.SelectService();

                        Order od = new Order();
                        od.ServiceName = Cafe.lservices[SVpos].Name;
                        od.InputAmount(SVpos);
                        od.Price = Cafe.lservices[SVpos].Price;
                        od.CalsCost();

                        tb.ListOrder.Add(od);
                        MakeNewOrder(tb, pos);
                        break;
                    case 1:
                        OrderService(tb, pos);
                        break;
                }
            }
        }

        public void OrderService(Table tb, int pos)
        {
            Table.WriteDataTable();
            Service.WriteDataService();
            Console.Clear();
            Program.OutputInfor(this.Name, this.ID);
            Console.WriteLine("Current Table ID: " + tb.ID);
            Console.WriteLine();
            Console.WriteLine("\t\t[SERVICE ORDERING]");

            int num;

            if (tb.ListOrder.Count() == 0)
            {
                Console.WriteLine("\n\t\tNo Service Ordered\n");
                Console.WriteLine();
                Console.WriteLine("[0]. Make New Order");
                Console.WriteLine("[1]. Back");
                num = Program.InputNumber(0, 1);
                switch (num)
                {
                    case 0:
                        MakeNewOrder(tb, pos);
                        break;
                    case 1:
                        OpenTable(tb, pos);
                        break;
                }
            }
            else
            {
                Order.OutputFields(tb.ListOrder);
                for (int i = 0; i < tb.ListOrder.Count(); i++)
                {
                    tb.ListOrder[i].Output(tb.ListOrder);
                }

                Console.WriteLine();
                Console.WriteLine("[0]. Make New Order");
                Console.WriteLine("[1]. Pay Off");
                Console.WriteLine("[2]. Back");
                num = Program.InputNumber(0, 3);
                switch (num)
                {
                    case 0:
                        MakeNewOrder(tb, pos);
                        break;
                    case 1:
                        PayOff(tb, pos);
                        break;
                    case 2:
                        OpenTable(tb, pos);
                        break;
                }
            }
        }
    }
}
