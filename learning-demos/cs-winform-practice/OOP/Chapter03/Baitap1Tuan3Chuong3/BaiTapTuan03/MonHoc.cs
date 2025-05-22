using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace BaiTapTuan03
{
    internal class MonHoc
    {
        //Fields
        string sTenMon;
        string sMaMon;
        int iSoTC;

        //Properties
        public string TenMon
        {
            get { return this.sTenMon; }
            set { this.sTenMon = value; }
        }

        public string MaMon
        {
            get { return this.sMaMon; }
            set { this.sMaMon = value; }
        }

        public int SoTC
        {
            get { return this.iSoTC; }
            set
            {
                if (value < 1 || value > 4)
                    throw new ArgumentOutOfRangeException(
                    $"{nameof(value)} must be between 1 and 4.");
                this.iSoTC = value;
            }
        }

        //Constructors
        public MonHoc()
        { }

        public MonHoc(string tenMon, string maMon, int soTc)
        {
            this.sTenMon = tenMon;
            this.sMaMon = maMon;
            this.iSoTC = soTc;
        }

        //Destructors
        ~MonHoc()
        { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap ten mon hoc: ");
            this.sTenMon = Console.ReadLine();
            Console.WriteLine("Nhap ma mon hoc: ");
            this.sMaMon = Console.ReadLine();
            Console.WriteLine("Nhap so tin chi: ");
            this.iSoTC = Convert.ToInt32(Console.ReadLine());
        }

        public void Nhap(string tenMon, string maMon, int soTc)
        {
            this.sTenMon = tenMon;
            this.sMaMon = maMon;
            this.iSoTC = soTc;
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine("Ten mon hoc: " + this.sTenMon);
            Console.WriteLine("Ma mon hoc: " + this.sMaMon);
            Console.WriteLine("So tin chi: " + this.iSoTC);
        }
    }
}
