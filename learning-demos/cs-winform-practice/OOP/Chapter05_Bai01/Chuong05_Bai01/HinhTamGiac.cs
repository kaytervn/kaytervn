using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_Bai01
{
    internal class HinhTamGiac: Hinh
    {
        //Fields
        int iCanhDay;
        int iChieuCao;

        //Properties
        public int CanhDay
        {
            get { return this.iCanhDay; }
            set { this.iCanhDay = value; }
        }

        public int ChieuCao
        {
            get { return this.iChieuCao; }
            set { this.iChieuCao = value; }
        }

        //Constructors
        public HinhTamGiac() : base()
        { }

        public HinhTamGiac(int Day, int Cao)
        {
            this.iCanhDay = Day;
            this.iChieuCao = Cao;
        }

        public HinhTamGiac(Diem x, Diem y) : base(x, y)
        {

        }

        //Destructors
        ~HinhTamGiac() { }

        //Input
        public override void Nhap()
        {
            Console.WriteLine("Nhap thong tin hinh tam giac: ");
            base.Nhap();
        }

        public void Nhap(int Day, int Cao)
        {
            this.iCanhDay = Day;
            this.iChieuCao = Cao;
        }

        //Output
        public override void Xuat()
        {
            Console.WriteLine("\nHinh tam giac: ");
            base.Xuat();
            Console.WriteLine("\nCanh day: " + this.iCanhDay);
            Console.WriteLine("Chieu cao: " + this.iChieuCao);
            Console.WriteLine("Dien tich: " + this.DienTich + " (dvdt)");
        }

        //Cals
        public override void TinhKichThuoc()
        {
            base.TinhKichThuoc();
            this.iCanhDay = this.iTrucX;
            this.iChieuCao = this.iTrucY;
        }

        public override void TinhDienTich()
        {
            this.dDienTich = this.iChieuCao * this.iCanhDay / 2;
        }

        //Methods
        public override void Ve()
        {
            Console.WriteLine();
            Console.WriteLine("Ve hinh tam giac");
            Console.WriteLine("Ve khung hinh: \n");
            for (int i = 0; i < this.iChieuCao; i++)
            {
                for (int j = 0; j < this.iCanhDay; j++)
                {
                    if (i == 0 || i == this.iChieuCao - 1 || j == 0 || j == this.iCanhDay - 1)
                        Console.Write("*");
                    else
                        Console.Write(" ");
                }
                Console.WriteLine();
            }
        }

        //Operators
        public static HinhTamGiac operator ++(HinhTamGiac a)
        {
            a.DienTich = a.DienTich + 1;
            return a;
        }

        public static HinhTamGiac operator --(HinhTamGiac a)
        {
            a.DienTich = a.DienTich - 1;
            return a;
        }
    }
}
