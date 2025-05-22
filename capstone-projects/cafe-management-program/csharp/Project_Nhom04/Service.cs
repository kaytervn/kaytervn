using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal class Service : IComparable
    {
        //fields
        protected string sID = "SV";
        protected string sName;
        protected string sType;
        protected int iAmount;
        protected double dPrice;

        //properties
        public string ID { get { return this.sID; } set { this.sID = value; } }
        public string Name { get { return this.sName; } set { this.sName = value; } }
        public string Type { get { return this.sType; } set { this.sType = value; } }
        public int Amount { get { return this.iAmount; } set { this.iAmount = value; } }
        public double Price { get { return this.dPrice; } set { this.dPrice = value; } }

        //contructor
        public Service() { }
        public Service(string id, string name, string type, int amount, double price)
        {
            this.sID = id;
            this.sName = name;
            this.sType = type;
            this.iAmount = amount;
            this.dPrice = price;
        }

        //destructor
        ~Service() { }

        //Input
        public void InputName()
        {
            Console.Write("Service Name: ");
            this.sName = Program.InputString();
        }

        public void InputType()
        {
            Console.WriteLine("Type Of Service ([0] Food - [1] Drink): ");
            int tp = Program.InputNumber(0, 1);
            switch(tp)
            {
                case 0:
                    this.sType = "Food";
                    break;
                case 1:
                    this.sType = "Drink";
                    break;
            }
        }

        public void InputAmount()
        {
            Console.Write("Amount: ");
            this.iAmount = Program.InputNumber_Int();
        }

        public void InputPrice()
        {
            Console.Write("Price (VND): ");
            this.dPrice = Program.InputNumber_Double();
        }

        public void Input()
        {
            if (Cafe.lservices.Count() == 0)
                this.sID += (Cafe.lservices.Count()).ToString();
            else
                this.sID += (Convert.ToInt32(FindMaxServiceID() + 1)).ToString();
            Console.WriteLine("Current Service ID: " + this.sID);
            InputName();
            InputType();
            InputAmount();
            InputPrice();
        }

        static public int FindMaxServiceID()
        {
            int id = 0;
            for (int i = 0; i < Cafe.lservices.Count(); i++)
            {
                if (Convert.ToInt32(Cafe.lservices[i].ID.Substring(2)) > id)
                    id = Convert.ToInt32(Cafe.lservices[i].ID.Substring(2));
            }
            return id;
        }

        public void Output()
        {
            Console.WriteLine("\t" + this.sID.PadRight(PadRightMax()) + this.sName.PadRight(PadRightMax()) + this.sType.PadRight(PadRightMax()) + this.iAmount.ToString().PadRight(PadRightMax()) + this.Price);
        }

        static public void OutputFields()
        {
            Console.WriteLine("\n\t" + "[ID]".PadRight(PadRightMax()) + "[NAME]".PadRight(PadRightMax()) + "[TYPE]".PadRight(PadRightMax()) + "[AMOUNT]".PadRight(PadRightMax()) + "[PRICE]");
        }

        //Methods
        public int FindPadRight()
        {
            int max = 1;
            while(this.sID.Length > max
                || this.sName.Length > max
                || this.sType.Length > max
                || this.iAmount.ToString().Length > max
                || this.dPrice.ToString().Length > max)
            {
                max++;
            }
            return max;
        }

        static public int PadRightMax()
        {
            int len = Cafe.lservices[0].FindPadRight();
            for (int i = 1; i < Cafe.lservices.Count(); i++)
            {
                if (Cafe.lservices[i].FindPadRight() > len)
                    len = Cafe.lservices[i].FindPadRight();
            }
            return len + 10;
        }

        public int CompareTo(object obj)
        {
            if (!(obj is Service))
            {
                throw new ArgumentException("Compared Object is not of Service");
            }
            Service sv = obj as Service;
            return this.Type.CompareTo(sv.Type);
        }

        //Sort
        static public void SortID()
        {
            for (int i = 0; i < Cafe.lservices.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lservices.Count(); j++)
                {
                    if (String.Compare(Cafe.lservices[i].ID, Cafe.lservices[j].ID) > 0)
                    {
                        Service tmp = Cafe.lservices[i];
                        Cafe.lservices[i] = Cafe.lservices[j];
                        Cafe.lservices[j] = tmp;
                    }
                }
            }
        }

        static public void SortName()
        {
            for (int i = 0; i < Cafe.lservices.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lservices.Count(); j++)
                {
                    if (String.Compare(Cafe.lservices[i].Name, Cafe.lservices[j].Name) > 0)
                    {
                        Service tmp = Cafe.lservices[i];
                        Cafe.lservices[i] = Cafe.lservices[j];
                        Cafe.lservices[j] = tmp;
                    }
                }
            }
        }

        static public void SortAmount()
        {
            for (int i = 0; i < Cafe.lservices.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lservices.Count(); j++)
                {
                    if (Cafe.lservices[i].Amount > Cafe.lservices[j].Amount)
                    {
                        Service tmp = Cafe.lservices[i];
                        Cafe.lservices[i] = Cafe.lservices[j];
                        Cafe.lservices[j] = tmp;
                    }
                }
            }
        }

        static public void SortPrice()
        {
            for (int i = 0; i < Cafe.lservices.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lservices.Count(); j++)
                {
                    if (Cafe.lservices[i].Price > Cafe.lservices[j].Price)
                    {
                        Service tmp = Cafe.lservices[i];
                        Cafe.lservices[i] = Cafe.lservices[j];
                        Cafe.lservices[j] = tmp;
                    }
                }
            }
        }

        //Login_Methods
        static public int SearchService(string id)
        {
            id = id.ToLower();
            for (int i = 0; i < Cafe.lservices.Count(); i++)
            {
                if (Cafe.lservices[i].ID.ToLower() == id)
                {
                    return i;
                }
            }
            return -1;
        }

        static public void AddNewService()
        {
            Console.WriteLine("\n\t[ADDING NEW SERVICE]\n");
            Service sv = new Service();
            sv.Input();
            Cafe.lservices.Add(sv);
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
                    pos = SearchService(id);
                    if (pos == -1)
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

        static public void ResetServiceID()
        {
            for (int i = 0; i < Cafe.lservices.Count(); i++)
            {
                Cafe.lservices[i].ID = "SV" + i.ToString();
            }
        }

        //FILES
        static public void WriteDataService()
        {
            string[] wt = new string[Cafe.lservices.Count()];
            for (int i = 0; i < Cafe.lservices.Count(); i++)
            {
                wt[i] = Cafe.lservices[i].ID + ";" + Cafe.lservices[i].Name + ";" + Cafe.lservices[i].Type + ";" + Cafe.lservices[i].Amount.ToString() + ";" + Cafe.lservices[i].Price.ToString();
            }

            File.WriteAllLines("Service.txt", wt);
        }

        static public void ReadDataService()
        {
            string[] a = File.ReadAllLines("Service.txt");

            for (int i = 0; i < a.Length; i++)
            {
                string[] b = a[i].Split(';');
                Service sv = new Service(b[0], b[1], b[2], Convert.ToInt32(b[3]), Convert.ToDouble(b[4]));
                Cafe.lservices.Add(sv);
            }
        }
    }
}
