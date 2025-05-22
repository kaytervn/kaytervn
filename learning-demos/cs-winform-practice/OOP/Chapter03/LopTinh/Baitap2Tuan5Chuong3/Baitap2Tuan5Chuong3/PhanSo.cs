using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap3Tuan4Chuong3
{
    internal class PhanSo
    {
        //Fields
        int dTuSo;
        int dMauSo;

        //Properties
        public int TuSo
        {
            get { return this.dTuSo; }
            set { dTuSo = value; }
        }

        public int MauSo
        {
            get { return this.dMauSo; }
            set
            {
                if (value == 0)
                    throw new ArgumentOutOfRangeException("Mau so phai khac 0!");
                this.dMauSo = value;
            }
        }

        //Constructors
        public PhanSo()
        { }

        public PhanSo(int TuSo, int MauSo)
        {
            this.dTuSo = TuSo;
            this.dMauSo = MauSo;
        }

        public PhanSo(PhanSo a)
        {
            this.dTuSo = a.TuSo;
            this.dMauSo = a.MauSo;
        }

        //Destructors
        ~PhanSo()
        { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap tu so: ");
            this.dTuSo = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap mau so: ");
            this.dMauSo = Convert.ToInt32(Console.ReadLine());
        }

        public void Nhap(int TuSo, int MauSo)
        {
            this.dTuSo = TuSo;
            this.dMauSo = MauSo;
        }

        public void Nhap(PhanSo a)
        {
            this.dTuSo = a.TuSo;
            this.dMauSo = a.MauSo;
        }

        //Output
        public void Xuat()
        {
            Console.Write(this.dTuSo);
            if (this.dTuSo != 0 && this.dMauSo != 1)
                Console.WriteLine("/" + this.dMauSo);
            else
                Console.Write("\n");
        }

        //Ham tinh toan
        static int UCLN(int a, int b)
        {
            a = Math.Abs(a);
            b = Math.Abs(b);

            if (a * b == 0)
            {
                return a + b;
            }

            while (a != b)
            {
                if (a > b)
                    a -= b;
                else
                    b -= a;
            }
            return a;
        }

        public static void ToiGian(PhanSo a)
        {
            int m = UCLN(a.TuSo, a.MauSo);
            a.TuSo = a.TuSo / m;
            a.MauSo = a.MauSo / m;

            //Xu ly dau tru
            if (a.TuSo * a.MauSo > 0)
            {
                a.TuSo = Math.Abs(a.TuSo);
                a.MauSo = Math.Abs(a.MauSo);
            }
            else
            {
                if (a.MauSo < 0)
                {
                    a.TuSo = -a.TuSo;
                    a.MauSo = -a.MauSo;
                }
            }
        }

        public static PhanSo Tong2PhanSo(PhanSo a, PhanSo b)
        {
            PhanSo s = new PhanSo();
            s.TuSo = a.TuSo * b.MauSo + b.TuSo * a.MauSo;
            s.MauSo = a.MauSo * b.MauSo;
            PhanSo.ToiGian(s);
            return s;
        }

        public static PhanSo Hieu2PhanSo(PhanSo a, PhanSo b)
        {
            PhanSo s = new PhanSo();
            s.TuSo = a.TuSo * b.MauSo - b.TuSo * a.MauSo;
            s.MauSo = a.MauSo * b.MauSo;
            PhanSo.ToiGian(s);
            return s;
        }

        public static PhanSo Tich2PhanSo(PhanSo a, PhanSo b)
        {
            PhanSo s = new PhanSo();
            s.TuSo = a.TuSo * b.TuSo;
            s.MauSo = a.MauSo * b.MauSo;
            PhanSo.ToiGian(s);
            return s;
        }
    }
}
