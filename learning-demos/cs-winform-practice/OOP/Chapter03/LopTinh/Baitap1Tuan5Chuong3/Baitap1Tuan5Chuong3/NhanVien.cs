using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap2Tuan4Chuong3
{
    internal class NhanVien
    {
        //Fields
        string sTenNV;
        string sCMND;
        double iLuongCoBan;
        int iSoNgayCong;
        double iLuongChinhThuc;

        //Properties
        public string TenNV
        {
            get { return this.sTenNV; }
            set { this.sTenNV = value; }
        }

        public string CMND
        {
            get { return this.sCMND; }
            set { this.sCMND = value; }
        }

        public double LuongCoBan
        {
            get { return this.iLuongCoBan; }
            set { this.iLuongCoBan = value; }
        }

        public int SoNgayCong
        {
            get { return this.iSoNgayCong; }
            set { this.iSoNgayCong = value; }
        }

        public double LuongChinhThuc
        {
            get { return this.iLuongChinhThuc; }
        }

        //Constructors
        public NhanVien()
        { }

        public NhanVien(string TenNV, string CMND, double LuongCB, int SoNC)
        {
            this.sTenNV = TenNV;
            this.sCMND = CMND;
            this.iLuongCoBan = LuongCB;
            this.iSoNgayCong = SoNC;
        }

        //Destructors
        ~NhanVien()
        { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap ten nhan vien: ");
            this.sTenNV = Console.ReadLine();
            Console.WriteLine("Nhap so CMND: ");
            this.sCMND = Console.ReadLine();
            Console.WriteLine("Nhap luong co ban: ");
            this.iLuongCoBan = Convert.ToDouble(Console.ReadLine());
            Console.WriteLine("Nhap so ngay cong: ");
            this.iSoNgayCong = Convert.ToInt32(Console.ReadLine());
        }

        public void Nhap(string TenNV, string CMND, double LuongCB, int SoNC)
        {
            this.sTenNV = TenNV;
            this.sCMND = CMND;
            this.iLuongCoBan = LuongCB;
            this.iSoNgayCong = SoNC;
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine("\nTen nhan vien: " + this.sTenNV);
            Console.WriteLine("So CMND: " + this.sCMND);
            Console.WriteLine("Luong co ban: " + this.iLuongCoBan + " VND");
            Console.WriteLine("So ngay cong: " + this.iSoNgayCong);

            Console.WriteLine("Luong chinh thuc: " + this.iLuongChinhThuc + " VND");
        }

        //Tinh luong
        public void TinhLuongNV()
        {
            this.iLuongChinhThuc = (this.iLuongCoBan/30) *this.iSoNgayCong;
        }
    }
}
