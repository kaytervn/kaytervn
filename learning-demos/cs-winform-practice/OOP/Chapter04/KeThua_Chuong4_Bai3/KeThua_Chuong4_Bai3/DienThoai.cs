using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai3
{
    internal class DienThoai: SanPham
    {
        //Fields
        double dBoNho;

        //Properties
        public double BoNho
        {
            get { return this.dBoNho; }
            set { this.dBoNho = value; }
        }

        //Constructors
        public DienThoai() : base() 
        { }

        public DienThoai(string MaSP, string TenSP, string MauSac, double GiaCoBan, double BoNho) : base(MaSP, TenSP, MauSac, GiaCoBan)
        {
            this.dBoNho = BoNho;
        }

        //Destructors
        ~DienThoai() { }

        //Input
        public override void Nhap()
        {
            base.Nhap();
            Console.WriteLine("Nhap bo nho: ");
            this.dBoNho = Convert.ToDouble(Console.ReadLine());
        }

        public void Nhap(string MaSP, string TenSP, string MauSac, double GiaCoBan, double BoNho)
        {
            base.Nhap(MaSP, TenSP, MauSac, GiaCoBan);
            this.dBoNho = BoNho;
        }

        //Output
        public override void Xuat()
        {
            base.Xuat();
            Console.WriteLine("Bo nho: " + this.dBoNho + " GB");
            Console.WriteLine("Gia ban: " + this.TinhGia() + " VND");
        }

        //Cals
        public double TinhGia()
        {
            return base.dGiaCoBan + this.dBoNho * 0.2;
        }
    }
}
