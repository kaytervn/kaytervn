using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal class Order
    {
        //fields
        private string sServiceName;
        private int iAmount;
        private double dPrice;
        private double dCost;

        //properties
        public string ServiceName
        {
            get { return sServiceName; }
            set { sServiceName = value; }
        }

        public int Amount
        {
            get { return iAmount; }
            set { iAmount = value; }
        }

        public double Price
        {
            get { return dPrice; }
            set { dPrice = value; }
        }

        public double Cost
        {
            get { return dCost; }
            set { dCost = value; }
        }
        //contructor
        public Order() { }

        public Order(string servicename, int amount, double price, double cost)
        {
            sServiceName = servicename;
            iAmount = amount;
            dPrice = price;
            dCost = cost;
        }

        //destructor
        ~Order() { }

        //Inputs
        public void InputAmount(int pos)
        {
            Console.WriteLine("Amount To Order: ");
            iAmount = Program.InputNumber(1, Cafe.lservices[pos].Amount);
            Cafe.lservices[pos].Amount -= iAmount;
        }

        //Output
        public void Output(List<Order> loders)
        {
            Console.WriteLine("\t" + sServiceName.PadRight(PadRightMax(loders))
                                    + iAmount.ToString().PadRight(PadRightMax(loders))
                                    + dPrice.ToString().PadRight(PadRightMax(loders))
                                    + dCost.ToString().PadRight(PadRightMax(loders)));
        }

        static public void OutputFields(List<Order> loders)
        {
            Console.WriteLine("\n\t" + "[SERVICE NAME]".PadRight(PadRightMax(loders))
                                    + "[AMOUNT]".PadRight(PadRightMax(loders))
                                    + "[PRICE]".PadRight(PadRightMax(loders))
                                    + "[COST]".PadRight(PadRightMax(loders)));
        }

        //Methods
        public int FindPadRight()
        {
            int max = 1;
            while (sServiceName.Length > max
                || iAmount.ToString().Length > max
                || dPrice.ToString().Length > max
                || dCost.ToString().Length > max)
            {
                max++;
            }
            return max;
        }

        static public int PadRightMax(List<Order> loders)
        {
            int len = loders[0].FindPadRight();
            for (int i = 1; i < loders.Count(); i++)
            {
                if (loders[i].FindPadRight() > len)
                    len = loders[i].FindPadRight();
            }
            return len + 10;
        }

        static public int SelectService()
        {
            string id;
            int pos;
            do
            {
                try
                {
                    Console.Write(" => Now Enter Service ID: ");
                    id = Console.ReadLine();
                    pos = Service.SearchService(id);
                    if (pos == -1 || Cafe.lservices[pos].Amount == 0)
                        continue;
                    else
                        break;
                }
                catch
                {
                    continue;
                }
            } while (true);
            return pos;
        }

        public void CalsCost()
        {
            dCost = dPrice * iAmount;
        }
    }
}
