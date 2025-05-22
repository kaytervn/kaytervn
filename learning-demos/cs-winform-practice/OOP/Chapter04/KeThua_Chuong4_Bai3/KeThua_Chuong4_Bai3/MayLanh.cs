using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai3
{
    internal class MayLanh: SanPham
    {
        //Fields
        double dCongSuat;

        //Properties
        public double CongSuat
        {
            get { return this.dCongSuat; }
            set { this.dCongSuat = value; }
        }

        //Constructors
        public MayLanh() : base()
        { }

        public MayLanh(string MaSP, string TenSP, string MauSac, double GiaCoBan, double CongSuat) : base(MaSP, TenSP, MauSac, GiaCoBan)
        {
            this.dCongSuat = CongSuat;
        }

        //Destructors
        ~MayLanh() { }

        //Input
        public override void Nhap()
        {
            base.Nhap();
            Console.WriteLine("Nhap cong suat: ");
            this.dCongSuat = Convert.ToDouble(Console.ReadLine());
        }

        public void Nhap(string MaSP, string TenSP, string MauSac, double GiaCoBan, double CongSuat)
        {
            base.Nhap(MaSP, TenSP, MauSac, GiaCoBan);
            this.dCongSuat = CongSuat;
        }

        //Output
        public override void Xuat()
        {
            base.Xuat();
            Console.WriteLine("Cong suat: " + this.dCongSuat + " HP");
            Console.WriteLine("Gia ban: " + this.TinhGia() + " VND");
        }

        //Cals
        public double TinhGia()
        {
            return base.dGiaCoBan + this.dCongSuat * 0.1;
        }
    }
}
