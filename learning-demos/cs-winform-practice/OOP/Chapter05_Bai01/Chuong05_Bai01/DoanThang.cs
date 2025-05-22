using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_Bai01
{
    internal class DoanThang: Hinh
    {
        //Fields
        double dDoDai;

        //Properties
        public double DoDai
        {
            get { return this.dDoDai; }
            set { this.dDoDai = value; }
        }

        //Constructors
        public DoanThang() : base()
        { }

        public DoanThang(Diem x, Diem y) : base(x, y) 
        {
            TinhKichThuoc();
        }

        public DoanThang(double DoDai)
        {
            this.dDoDai = DoDai;
        }

        //Destructors
        ~DoanThang() { }

        //Input
        public override void Nhap()
        {
            Console.WriteLine("Nhap thong tin doan thang: ");
            base.Nhap();
            TinhKichThuoc();
        }

        //Output
        public override void Xuat()
        {
            Console.WriteLine("\nDoan thang: ");
            base.Xuat();
        }

        public override void TinhKichThuoc()
        {
            base.TinhKichThuoc();
            this.dDoDai = Math.Sqrt(Math.Pow((this.a.x - this.b.x), 2) + Math.Pow((this.a.y - this.b.y), 2));
        }

        //Methods
        public override void Ve()
        {
            Console.WriteLine();
            Console.WriteLine("Ve Doan thang");
            Console.WriteLine("Ve khung hinh: \n");

            for (int i = 0; i < this.iTrucX; i++)
            {
                for (int j = 0; j < iTrucY; j++)
                {
                    if (i == 0 || i == this.iTrucX - 1 || j == 0 || j == iTrucY - 1)
                        Console.Write("*");
                    else
                        Console.Write(" ");
                }
                Console.WriteLine();
            }
        }

        public static bool operator ==(DoanThang a, DoanThang b)
        {
            return (a.DoDai == b.DoDai);
        }

        public static bool operator !=(DoanThang a, DoanThang b)
        {
            return (a.DoDai != b.DoDai);
        }

        public static bool operator >(DoanThang a, DoanThang b)
        {
            return (a.DoDai > b.DoDai);
        }

        public static bool operator <(DoanThang a, DoanThang b)
        {
            return (a.DoDai < b.DoDai);
        }

        public static bool operator >=(DoanThang a, DoanThang b)
        {
            return (a.DoDai > b.DoDai) && a == b;
        }

        public static bool operator <=(DoanThang a, DoanThang b)
        {
            return (a.DoDai < b.DoDai) && a == b;
        }

        public static DoanThang operator ++(DoanThang a)
        {
            a.DoDai = a.DoDai + 1;
            return a;
        }

        public static DoanThang operator --(DoanThang a)
        {
            a.DoDai = a.DoDai - 1;
            return a;
        }
    }
}
