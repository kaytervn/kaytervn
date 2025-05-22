using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal class Table
    {
        //fields
        private string sID = "TB";
        private string sStatus;
        private List<Order> lOrder;

        //properties
        public string ID
        {
            get { return sID; }
            set { sID = value; }
        }
        public string Status
        {
            get { return sStatus; }
            set { sStatus = value; }
        }

        public List<Order> ListOrder { get { return lOrder; } set { lOrder = value; } }


        //constructor
        public Table()
        {
            lOrder = new List<Order>();
        }

        public Table(string id, string status, List<Order> lorder)
        {
            sID = id;
            sStatus = status;
            lOrder = lorder;
        }

        public Table(string id, string status)
        {
            sID = id;
            sStatus = status;
            lOrder = new List<Order>();
        }

        //destructor
        ~Table() { }

        //Input
        public void InputStatus()
        {
            Console.WriteLine("Status ([0] Empty - [1] Served): ");
            int st = Program.InputNumber(0, 1);
            switch (st)
            {
                case 0:
                    sStatus = "Empty";
                    break;
                case 1:
                    sStatus = "Served";
                    break;
            }
        }

        public void Input()
        {
            if (Cafe.ltables.Count() == 0)
                sID += Cafe.ltables.Count().ToString();
            else
                sID += (Convert.ToInt32(FindMaxTableID() + 1)).ToString();
            Console.WriteLine("Current Table ID: " + sID);
            InputStatus();
        }

        static public int FindMaxTableID()
        {
            int id = 0;
            for (int i = 0; i < Cafe.ltables.Count(); i++)
            {
                if (Convert.ToInt32(Cafe.ltables[i].ID.Substring(2)) > id)
                    id = Convert.ToInt32(Cafe.ltables[i].ID.Substring(2));
            }
            return id;
        }

        //Output
        public void Output()
        {
            Console.WriteLine("\t" + this.sID.PadRight(20) + this.sStatus);
        }

        //Sort
        static public void SortID()
        {
            for (int i = 0; i < Cafe.ltables.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.ltables.Count(); j++)
                {
                    if (string.Compare(Cafe.ltables[i].ID, Cafe.ltables[j].ID) > 0)
                    {
                        Table tmp = Cafe.ltables[i];
                        Cafe.ltables[i] = Cafe.ltables[j];
                        Cafe.ltables[j] = tmp;
                    }
                }
            }
        }

        static public void SortStatus()
        {
            for (int i = 0; i < Cafe.ltables.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.ltables.Count(); j++)
                {
                    if (string.Compare(Cafe.ltables[i].Status, Cafe.ltables[j].Status) > 0)
                    {
                        Table tmp = Cafe.ltables[i];
                        Cafe.ltables[i] = Cafe.ltables[j];
                        Cafe.ltables[j] = tmp;
                    }
                }
            }
        }

        //Methods
        static public int ServedTableCount()
        {
            int dem = 0;
            for (int i = 0; i < Cafe.ltables.Count(); i++)
            {
                if (Cafe.ltables[i].sStatus == "Served") ;
                dem++;
            }
            return dem;
        }

        //Login_Methods
        static public int SearchTable(string id)
        {
            id = id.ToLower();
            for (int i = 0; i < Cafe.ltables.Count(); i++)
            {
                if (Cafe.ltables[i].ID.ToLower() == id)
                {
                    return i;
                }
            }
            return -1;
        }

        static public void AddNewTable()
        {
            Console.WriteLine("\n\t[ADDING NEW TABLE]\n");
            Table tb = new Table();
            tb.Input();
            Cafe.ltables.Add(tb);
        }

        static public int SelectTable()
        {
            string id;
            int pos;
            do
            {
                try
                {
                    Console.Write(" => Now Enter Table ID: ");
                    id = Console.ReadLine();
                    pos = SearchTable(id);
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

        static public void ResetTableID()
        {
            for (int i = 0; i < Cafe.ltables.Count(); i++)
            {
                Cafe.ltables[i].ID = "TB" + i.ToString();
            }
        }

        //FILES
        static public void WriteDataTable()
        {
            string[] wt = new string[Cafe.ltables.Count()];
            for (int i = 0; i < Cafe.ltables.Count(); i++)
            {
                wt[i] = Cafe.ltables[i].ID + ";" + Cafe.ltables[i].Status.ToString();
                if (Cafe.ltables[i].ListOrder.Count() != 0)
                {
                    for (int j = 0; j < Cafe.ltables[i].ListOrder.Count(); j++)
                    {
                        wt[i] += ";" + Cafe.ltables[i].ListOrder[j].ServiceName
                                + ";" + Cafe.ltables[i].ListOrder[j].Amount.ToString()
                                + ";" + Cafe.ltables[i].ListOrder[j].Price.ToString()
                                + ";" + Cafe.ltables[i].ListOrder[j].Cost.ToString();
                    }
                }
            }

            File.WriteAllLines("Table.txt", wt);
        }

        static public void ReadDataTable()
        {
            string[] a = File.ReadAllLines("Table.txt");
            for (int i = 0; i < a.Length; i++)
            {
                string[] b = a[i].Split(';');
                Table tb = new Table(b[0], b[1]);
                if (b.Length > 2)
                {
                    for (int j = 2; j < b.Length; j += 4)
                    {
                        Order od = new Order(b[j],
                            Convert.ToInt32(b[j + 1]),
                            Convert.ToDouble(b[j + 2]),
                            Convert.ToDouble(b[j + 3]));
                        tb.lOrder.Add(od);
                    }
                }
                Cafe.ltables.Add(tb);
            }
        }
    }
}