using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal class Bill
    {
		//fields
		private string sID = "BL";
		private string sStaffName;
		Date dDate;
		Time tTime;
		private double dTotal;

		//properties
		public string ID { get { return this.sID; } set { this.sID = value; } }
		public string StaffName { get { return this.sStaffName; } set { this.sStaffName = value; } }
		public Date date { get { return this.dDate; } set { this.dDate = value; } }
		public Time Time { get { return this.tTime; } set { this.tTime = value; } }
		public double Total { get { return this.dTotal; } set { this.dTotal = value; } }

		//constructor
		public Bill() { }

        public Bill(string id, string StaffName, Date date, Time time, double total)
        {
            this.sID = id;
            this.sStaffName = StaffName;
            this.dDate = date;
            this.tTime = time;
            this.dTotal = total;
        }

        public Bill(string id, string StaffName, double total)
        {
			this.sID = id;
			this.sStaffName = StaffName;
			this.dTotal = total;
        }

        public Bill(string id, string StaffName)
        {
            this.sID = id;
            this.sStaffName = StaffName;
        }

        //destructor
        ~Bill() { }

		// methods
		public void Input()
        {
            if (Cafe.lbills.Count() == 0)
                this.sID += (Cafe.lbills.Count()).ToString();
            else
                this.sID += (Convert.ToInt32(FindMaxBillID() + 1)).ToString();

            Console.WriteLine("Current Bill ID: " + this.sID);
			this.tTime = new Time();
            this.tTime.Input();
        }

        static public int FindMaxBillID()
        {
            int id = 0;
            for (int i = 0; i < Cafe.lbills.Count(); i++)
            {
                if (Convert.ToInt32(Cafe.lbills[i].ID.Substring(2)) > id)
                    id = Convert.ToInt32(Cafe.lbills[i].ID.Substring(2));
            }
            return id;
        }

        //Output
        public void Output()
        {
            Console.WriteLine("\t" + this.sID.PadRight(PadRightMax())
                                    + this.StaffName.PadRight(PadRightMax())
                                    + ((string)this.dDate).PadRight(PadRightMax())
                                    + ((string)this.tTime).PadRight(PadRightMax()) 
                                    + this.dTotal);
        }

        static public void OutputFields()
        {
            Console.WriteLine("\n\t" + "[ID]".PadRight(PadRightMax()) 
                                    + "[STAFF NAME]".PadRight(PadRightMax()) 
                                    + "[DATE]".PadRight(PadRightMax()) 
                                    + "[TIME]".PadRight(PadRightMax()) 
                                    + "[TOTAL]");
        }

        public void CalsTotal(List<Order> loders)
		{
			this.dTotal = 0;

            for (int i = 0; i < loders.Count(); i++)
			{
				this.dTotal += loders[i].Cost;

            }
		}

        //Methods
        static public void SortID()
        {
            for (int i = 0; i < Cafe.lbills.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lbills.Count(); j++)
                {
                    if (String.Compare(Cafe.lbills[i].ID, Cafe.lbills[j].ID) > 0)
                    {
                        Bill tmp = Cafe.lbills[i];
                        Cafe.lbills[i] = Cafe.lbills[j];
                        Cafe.lbills[j] = tmp;
                    }
                }
            }
        }

        static public void SortStaffName()
        {
            for (int i = 0; i < Cafe.lbills.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lbills.Count(); j++)
                {
                    if (String.Compare(Cafe.lbills[i].StaffName, Cafe.lbills[j].StaffName) > 0)
                    {
                        Bill tmp = Cafe.lbills[i];
                        Cafe.lbills[i] = Cafe.lbills[j];
                        Cafe.lbills[j] = tmp;
                    }
                }
            }
        }

        static public void SortDate()
        {
            for (int i = 0; i < Cafe.lbills.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lbills.Count(); j++)
                {
                    if (Cafe.lbills[i].date > Cafe.lbills[j].date
                    || (Cafe.lbills[i].date == Cafe.lbills[j].date && Cafe.lbills[i].Time > Cafe.lbills[j].Time))
                    {
                        Bill tmp = Cafe.lbills[i];
                        Cafe.lbills[i] = Cafe.lbills[j];
                        Cafe.lbills[j] = tmp;
                    }
                }
            }
        }

        static public void SortTotal()
        {
            for (int i = 0; i < Cafe.lbills.Count() - 1; i++)
            {
                for (int j = i + 1; j < Cafe.lbills.Count(); j++)
                {
                    if (Cafe.lbills[i].Total > Cafe.lbills[j].Total)
                    {
                        Bill tmp = Cafe.lbills[i];
                        Cafe.lbills[i] = Cafe.lbills[j];
                        Cafe.lbills[j] = tmp;
                    }
                }
            }
        }

        //Login Methods
        public int FindPadRight()
        {
            int max = 1;
            while (this.sID.Length > max
                || this.sStaffName.Length > max
                || ((string)this.dDate).Length > max
                || ((string)this.tTime).Length > max
                || this.dTotal.ToString().Length > max)
            {
                max++;
            }
            return max;
        }

        static public int PadRightMax()
        {
            int len = Cafe.lbills[0].FindPadRight();
            for (int i = 1; i < Cafe.lbills.Count(); i++)
            {
                if (Cafe.lbills[i].FindPadRight() > len)
                    len = Cafe.lbills[i].FindPadRight();
            }
            return len + 10;
        }

        static public void CalsToTalIncome()
        {
            for (int i = 0; i < Cafe.lbills.Count; i++)
            {
                Cafe.total += Cafe.lbills[i].Total;
            }
        }

        //FILES
        static public void WriteDataBill()
        {
            string[] wt = new string[Cafe.lbills.Count()];
            for (int i = 0; i < Cafe.lbills.Count(); i++)
            {
                wt[i] = Cafe.lbills[i].ID
                + ";" + Cafe.lbills[i].StaffName.ToString()
                + ";" + (string)Cafe.lbills[i].date
                + ";" + (string)Cafe.lbills[i].Time
                + ";" + Cafe.lbills[i].Total.ToString();
            }
            CalsToTalIncome();
            File.WriteAllLines("Bill.txt", wt);
        }

        static public void ReadDataBill()
        {
            string[] a = File.ReadAllLines("Bill.txt");

            for (int i = 0; i < a.Length; i++)
            {
                string[] b = a[i].Split(';');
                Bill bl = new Bill(b[0], b[1], (Date)b[2], (Time)b[3], Convert.ToDouble(b[4]));
                Cafe.lbills.Add(bl);
            }

            CalsToTalIncome();
        }
    }	
}
