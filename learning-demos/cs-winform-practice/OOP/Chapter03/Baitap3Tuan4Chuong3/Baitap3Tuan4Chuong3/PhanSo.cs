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
        int UCLN(int a, int b)
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

        public void ToiGian()
        {
            int m = UCLN(this.dTuSo, this.dMauSo);
            this.dTuSo = this.dTuSo / m;
            this.dMauSo = this.dMauSo / m;

            //Xu ly dau tru
            if (this.dTuSo * this.dMauSo > 0)
            {
                this.dTuSo = Math.Abs(this.dTuSo);
                this.dMauSo = Math.Abs(this.dMauSo);
            }
            else
            {
                if (this.dMauSo < 0)
                {
                    this.dTuSo = -this.dTuSo;
                    this.dMauSo = -this.dMauSo;
                }
            }
        }

        public PhanSo Tong2PhanSo(PhanSo a, PhanSo b)
        {
            PhanSo s = new PhanSo();
            s.TuSo = a.TuSo * b.MauSo + b.TuSo * a.MauSo;
            s.MauSo = a.MauSo * b.MauSo;
            s.ToiGian();
            return s;
        }

        public PhanSo Hieu2PhanSo(PhanSo a, PhanSo b)
        {
            PhanSo s = new PhanSo();
            s.TuSo = a.TuSo * b.MauSo - b.TuSo * a.MauSo;
            s.MauSo = a.MauSo * b.MauSo;
            s.ToiGian();
            return s;
        }

        public PhanSo Tich2PhanSo(PhanSo a, PhanSo b)
        {
            PhanSo s = new PhanSo();
            s.TuSo = a.TuSo * b.TuSo;
            s.MauSo = a.MauSo * b.MauSo;
            s.ToiGian();
            return s;
        }
    }
}
