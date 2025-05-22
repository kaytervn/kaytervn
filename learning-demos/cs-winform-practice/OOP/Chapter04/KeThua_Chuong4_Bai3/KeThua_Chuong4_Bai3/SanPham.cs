using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai3
{
    internal class SanPham
    {

        //Fields
        protected string sMaSP;
        protected string sTenSP;
        protected string sMauSac;
        protected double dGiaCoBan;

        //Properties
        public string MaSP
        {
            get { return this.sMaSP; }
            set { this.sMaSP = value; }
        }

        public string TenSP
        {
            get { return this.sTenSP; }
            set { this.sTenSP = value; }
        }

        public string MauSac
        {
            get { return this.sMauSac; }
            set { this.sMauSac = value; }
        }

        public double GiaCoBan
        {
            get { return this.dGiaCoBan; }
            set { this.dGiaCoBan = value; }
        }

        //Constructors
        public SanPham() { }

        public SanPham(string MaSP, string TenSP, string MauSac, double GiaCoBan)
        {
            this.sMaSP = MaSP;
            this.sTenSP = TenSP;
            this.sMauSac = MauSac;
            this.dGiaCoBan = GiaCoBan;
        }

        //Destructors
        ~SanPham() { }

        //Input
        public virtual void Nhap()
        {
            Console.WriteLine("Nhap ma san pham: ");
            this.sMaSP = Console.ReadLine();
            Console.WriteLine("Nhap ten san pham: ");
            this.sTenSP = Console.ReadLine();
            Console.WriteLine("Nhap mau sac: ");
            this.sMauSac = Console.ReadLine();
            Console.WriteLine("Nhap gia co ban: ");
            this.dGiaCoBan = Convert.ToDouble(Console.ReadLine());
        }

        public void Nhap(string MaSP, string TenSP, string MauSac, double GiaCoBan)
        {
            this.sMaSP = MaSP;
            this.sTenSP = TenSP;
            this.sMauSac = MauSac;
            this.dGiaCoBan = GiaCoBan;
        }

        //Output
        public virtual void Xuat()
        {
            Console.WriteLine("\nMa san pham: " + this.sMaSP);
            Console.WriteLine("Ten san pham: " + this.sTenSP);
            Console.WriteLine("Mau sac: " + this.sMauSac);
            Console.WriteLine("Gia co ban: " + this.dGiaCoBan + " VND");
        }
    }
}
