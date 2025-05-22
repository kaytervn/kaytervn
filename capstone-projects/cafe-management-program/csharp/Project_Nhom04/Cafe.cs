using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal static class Cafe
    {
        static private List<Staff> lStaffs;
        static private List<Service> lServices;
        static private List<Table> lTables;
        static private List<Bill> lBills;
        static private string sCafename;
        static private string sOwner;
        static private string sAddress;
        static private double dTotal;

        static public List<Staff> lstaffs
        {
            get { return Cafe.lStaffs; }
            set { Cafe.lStaffs = value; }
        }

        static public List<Service> lservices
        {
            get { return Cafe.lServices; }
            set { Cafe.lServices = value; }
        }

        static public List<Table> ltables
        {
            get { return Cafe.lTables; }
            set { Cafe.lTables = value; }
        }

        static public List<Bill> lbills
        {
            get { return Cafe.lBills; }
            set { Cafe.lBills = value; }
        }

        static public string cafename
        {
            get { return Cafe.sCafename; }
            set { Cafe.sCafename = value; }
        }

        static public double total
        {
            get { return Cafe.dTotal; }
            set { Cafe.dTotal = value; }
        }

        static public string owner
        {
            get { return Cafe.sOwner; }
            set { Cafe.sOwner = value; }
        }

        static public string address
        {
            get { return Cafe.sAddress; }
            set { Cafe.sAddress = value; }
        }
    }
}
