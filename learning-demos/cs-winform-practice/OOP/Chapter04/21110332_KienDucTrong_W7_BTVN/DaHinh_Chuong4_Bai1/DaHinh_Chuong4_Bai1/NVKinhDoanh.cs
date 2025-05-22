using Baitap01Chuong04;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai1
{
    internal class NVKinhDoanh: NhanVien
    {
        //Fields
        int iSoHD;
        
        //Properties
        public int SoHD
        {
            set { this.iSoHD = value; }
            get { return this.iSoHD; }
        }

        //Constructors
        public NVKinhDoanh(): base()
        { }

        public NVKinhDoanh(string TenNV, string CMND, int NamSinh, double LuongCB, int soHD) : base(TenNV, CMND, NamSinh, LuongCB)
        {
            this.iSoHD = soHD;
        }

        //Destructors
        ~NVKinhDoanh() { }

        //Input
        public override void Nhap()
        {
            base.Nhap();
            Console.WriteLine("Nhap so hop dong: ");
            this.iSoHD = Convert.ToInt32(Console.ReadLine());
        }

        public void Nhap(string TenNV, string CMND, int NamSinh, double LuongCB, int SoHD)
        {
            base.Nhap(TenNV, CMND, NamSinh, LuongCB);
            this.iSoHD = SoHD;
        }

        //Output
        public override void Xuat()
        {
            base.Xuat();
            Console.WriteLine("So hop dong: " + this.iSoHD);
        }

        //Cals
        public override void TinhLuong()
        {
            this.dLuongChinhThuc = this.dLuongCoBan + this.iSoHD * 100;
        }
    }
}
