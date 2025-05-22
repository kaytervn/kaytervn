using Baitap01Chuong04;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaitapChuong04
{
    internal class NVKeToan: NhanVien
    {
        //Fields
        double dPhuCap;

        //Properties
        public double PhuCap
        {
            get { return this.dPhuCap; }
            set { this.dPhuCap = value; }
        }

        //Constructors
        public NVKeToan(): base()
        { }

        public NVKeToan(string TenNV, string CMND, int NamSinh, double LuongCB, double phucap) : base (TenNV, CMND, NamSinh, LuongCB)
        {
            this.dPhuCap = phucap;
        }

        //Destructors
        ~NVKeToan() { }

        //Input
        public override void Nhap()
        {
            base.Nhap();
            Console.WriteLine("Nhap phu cap: ");
            this.dPhuCap = Convert.ToDouble(Console.ReadLine());
        }

        public void Nhap(string TenNV, string CMND, int NamSinh, double LuongCB, double Phucap)
        {
            base.Nhap(TenNV, CMND, NamSinh, LuongCB);
            this.dPhuCap = Phucap;
        }

        //Output
        public override void Xuat()
        {
            base.Xuat();
            Console.WriteLine("Phu cap: " + this.dPhuCap);
        }

        public override void TinhLuong()
        {
            this.dLuongChinhThuc = this.dLuongCoBan + this.dPhuCap;
        }
    }
}
