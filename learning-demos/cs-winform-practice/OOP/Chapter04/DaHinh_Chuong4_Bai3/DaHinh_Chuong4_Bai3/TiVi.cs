using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai3
{
    internal class TiVi: SanPham
    {
        //Fields
        double dKichThuoc;

        //Properties
        public double KichThuoc
        {
            get { return this.dKichThuoc; }
            set { this.dKichThuoc = value; }
        }

        //Constructors
        public TiVi() : base() 
        { }

        public TiVi(string MaSP, string TenSP, string MauSac, double GiaCoBan, double KichThuoc) : base(MaSP,TenSP,MauSac,GiaCoBan)
        {
            this.dKichThuoc = KichThuoc;
        }

        //Destructors
        ~TiVi() { }

        //Input
        public override void Nhap()
        {
            base.Nhap();
            Console.WriteLine("Nhap kich thuoc: ");
            this.dKichThuoc=Convert.ToDouble(Console.ReadLine());
        }

        public void Nhap(string MaSP, string TenSP, string MauSac, double GiaCoBan, double KichThuoc)
        {
            base.Nhap(MaSP, TenSP, MauSac, GiaCoBan);
            this.dKichThuoc = KichThuoc;
        }

        //Output
        public override void Xuat()
        {
            base.Xuat();
            Console.WriteLine("Kich thuoc: " + this.dKichThuoc + " Inch");
        }

        //Cals
        public override void TinhGia()
        {
            this.dGiaBan = this.dGiaCoBan + this.dKichThuoc * 0.1;
        }
    }
}
