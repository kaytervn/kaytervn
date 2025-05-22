using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_Bai01
{
    internal class HinhChuNhat: Hinh
    {
        //Fields
        int iChieuDai;
        int iChieuRong;

        //Properties
        public int ChieuDai
        {
            get { return this.iChieuDai; }
            set { this.iChieuDai = value; }
        }

        public int ChieuRong
        {
            get { return this.iChieuRong; }
            set { this.iChieuRong = value; }
        }

        //Constructors
        public HinhChuNhat() : base()
        { }

        public HinhChuNhat(Diem x, Diem y, int CD, int CR) : base(x, y) 
        {
            this.iChieuDai = CD;
            this.iChieuRong = CR;
        }

        public HinhChuNhat(int CD, int CR)
        {
            this.iChieuDai = CD;
            this.iChieuRong = CR;
        }

        public HinhChuNhat(Diem x, Diem y) : base(x, y) 
        {

        }

        //Destructors
        ~HinhChuNhat() { }

        //Input
        public override void Nhap()
        {
            Console.WriteLine("Nhap thong tin hinh chu nhat: ");
            base.Nhap();
        }

        public void Nhap(int CD, int CR)
        {
            this.iChieuDai = CD;
            this.iChieuRong = CR;
        }

        //Output
        public override void Xuat()
        {
            Console.WriteLine("\nHinh chu nhat: ");
            base.Xuat();
            Console.WriteLine("\nChieu dai: " + this.iChieuDai);
            Console.WriteLine("Chieu rong: " + this.iChieuRong);
            Console.WriteLine("Dien tich: " + this.dDienTich + " (dvdt)");
        }

        //Cals
        public override void TinhKichThuoc()
        {
            base.TinhKichThuoc();
            this.iChieuDai = Math.Max(this.iTrucX, this.iTrucY);
            this.iChieuRong = Math.Min(this.iTrucX, this.iTrucY);
        }

        //Methods
        public override void Ve()
        {
            Console.WriteLine();
            Console.WriteLine("Ve hinh chu nhat");
            Console.WriteLine("Ve khung hinh: \n");
            for (int i = 0; i < this.iChieuRong; i++)
            {
                for (int j = 0; j < this.iChieuDai; j++)
                {
                    if (i == 0 || i == this.iChieuRong - 1 || j == 0 || j == this.iChieuDai - 1)
                        Console.Write("*");
                    else
                        Console.Write(" ");
                }
                Console.WriteLine();
            }
        }

        //Operators
        public static HinhChuNhat operator ++(HinhChuNhat a)
        {
            a.DienTich = a.DienTich + 1;
            return a;
        }

        public static HinhChuNhat operator --(HinhChuNhat a)
        {
            a.DienTich = a.DienTich - 1;
            return a;
        }
    }
}
