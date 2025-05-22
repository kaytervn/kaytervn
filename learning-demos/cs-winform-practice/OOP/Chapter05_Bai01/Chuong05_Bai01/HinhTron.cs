using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_Bai01
{
    internal class HinhTron: Hinh
    {
        //Fields
        int iBanKinh;

        //Properties
        public int BanKinh
        {
            get { return this.iBanKinh; }
            set { this.iBanKinh = value; }
        }

        //Constructors
        public HinhTron() : base()
        { }

        public HinhTron(int BanKinh)
        {
            this.iBanKinh = BanKinh;
        }

        public HinhTron(double DienTich)
        {
            this.dDienTich = DienTich;
        }

        public HinhTron(Diem x, Diem y) : base(x, y)
        {

        }

        //Destructors
        ~HinhTron() { }

        //Input
        public override void Nhap()
        {
            Console.WriteLine("Nhap thong tin hinh tron: ");
            base.Nhap();
        }

        //Output
        public override void Xuat()
        {
            Console.WriteLine("\nHinh tron: ");
            base.Xuat();
            Console.WriteLine("\nBanKinh: " + this.iBanKinh);
        }

        //Cals
        public override void TinhKichThuoc()
        {
            base.TinhKichThuoc();
            this.iBanKinh = Math.Abs(base.dA.x - base.dB.x) / 2;
        }

        public override void TinhDienTich()
        {
            this.dDienTich = Math.PI * this.iBanKinh * this.iBanKinh;
        }

        //Methods
        public override void Ve()
        {
            Console.WriteLine();
            Console.WriteLine("Ve hinh tron");
            Console.WriteLine("Ve khung hinh: \n");
            for (int i = 0; i < this.iTrucX; i++)
            {
                for (int j = 0; j < this.iTrucY; j++)
                {
                    if (i == 0 || i == this.iTrucX - 1 || j == 0 || j == this.iTrucY - 1)
                        Console.Write("*");
                    else
                        Console.Write(" ");
                }
                Console.WriteLine();
            }
        }

        //Operators
        public static HinhTron operator ++(HinhTron a)
        {
            a.DienTich = a.DienTich + 1;
            return a;
        }

        public static HinhTron operator --(HinhTron a)
        {
            a.DienTich = a.DienTich - 1;
            return a;
        }
    }
}
