using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap01Chuong04
{
    internal class NhanVien
    {
        //Fields
        protected string sTenNV;
        protected string sCMND;
        protected int iNamSinh;
        protected double dLuongCoBan;
        protected double dLuongChinhThuc;

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

        public int NamSinh
        {
            get { return this.iNamSinh; }
            set { this.iNamSinh = value; }
        }

        public double LuongCoBan
        {
            get { return this.dLuongCoBan; }
            set { this.dLuongCoBan = value; }
        }

        //Constructors
        public NhanVien()
        { }

        public NhanVien(string TenNV, string CMND, int NamSinh, double LuongCB)
        {
            this.sTenNV = TenNV;
            this.sCMND = CMND;
            this.dLuongCoBan = LuongCB;
            this.iNamSinh = NamSinh;
        }

        //Destructors
        ~NhanVien()
        { }

        //Input
        public virtual void Nhap()
        {
            Console.WriteLine("Nhap ten nhan vien: ");
            this.sTenNV = Console.ReadLine();
            Console.WriteLine("Nhap so CMND: ");
            this.sCMND = Console.ReadLine();
            Console.WriteLine("Nhap nam sinh: ");
            this.iNamSinh = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap luong co ban: ");
            this.dLuongCoBan = Convert.ToDouble(Console.ReadLine());
        }

        public virtual void Nhap(string TenNV, string CMND, int NamSinh, double LuongCB)
        {
            this.sTenNV = TenNV;
            this.sCMND = CMND;
            this.dLuongCoBan = LuongCB;
            this.iNamSinh = NamSinh;
        }

        //Output
        public virtual void Xuat()
        {
            Console.WriteLine("\nTen nhan vien: " + this.sTenNV);
            Console.WriteLine("So CMND: " + this.sCMND);
            Console.WriteLine("Nam sinh: " + this.iNamSinh);
            Console.WriteLine("Luong co ban: " + this.dLuongCoBan + " VND");
            Console.WriteLine("Luong chinh thuc: " + this.dLuongChinhThuc + " VND");
        }

        //Tinh luong
        public virtual void TinhLuong()
        {
            this.dLuongChinhThuc = this.dLuongCoBan;
        }
    }
}
