using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_Bai01
{
    internal class ThoiGian
    {
        //Fields
        int iGio;
        int iPhut;
        int iGiay;
        Ngay nNgay;

        //Properties
        public int Gio
        {
            get { return this.iGio; }
            set { this.iGio = value; }
        }

        public int Phut
        {
            get { return this.iPhut; }
            set { this.iPhut = value; }
        }

        public int Giay
        {
            get { return this.iGiay; }
            set { this.iGiay = value; }
        }

        public Ngay Ngay
        {
            get { return this.nNgay; }
            set
            {
                this.nNgay = value;
            }
        }

        //Constructors
        public ThoiGian()
        {

        }

        public ThoiGian(int Gio, int Phut, int Giay, Ngay Ngay)
        {
            this.iGio = Gio;
            this.iPhut = Phut;
            this.iGiay = Giay;
            this.nNgay = Ngay;
        }

        //Destructors
        ~ThoiGian() { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap gio: ");
            this.iGio = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap phut: ");
            this.iPhut = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap giay: ");
            this.iGiay = Convert.ToInt32(Console.ReadLine());
            this.Ngay.Nhap();
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine(this.iGio + ":" + this.iPhut + ":" + this.iGiay);
            this.nNgay.Xuat();
        }

        //Methods


        //Operators
        public static bool operator ==(ThoiGian a, ThoiGian b)
        {
            return (a.Gio == b.Gio) && (a.Phut == b.Phut) && (a.Giay == b.Giay) && (a.Ngay == b.Ngay);
        }

        public static bool operator !=(ThoiGian a, ThoiGian b)
        {
            return !(a == b);
        }

        public static bool operator >(ThoiGian a, ThoiGian b)
        {
            if (a.Ngay > b.Ngay)
                return true;
            else if (a.Ngay < b.Ngay)
                return false;

            if (a.Gio > b.Gio)
                return true;
            else if (a.Gio < b.Gio)
                return false;

            if (a.Phut > b.Phut)
                return true;
            else if (a.Phut < b.Phut)
                return false;

            if (a.Giay > b.Giay)
                return true;
            else
                return false;
        }

        public static bool operator <(ThoiGian a, ThoiGian b)
        {
            return !(a > b || a == b); ;
        }

        public static bool operator >=(ThoiGian a, ThoiGian b)
        {
            return (a > b) || (a == b);
        }

        public static bool operator <=(ThoiGian a, ThoiGian b)
        {
            return (a < b) || (a == b);
        }

        public static ThoiGian operator +(ThoiGian a, int num)
        {
            ThoiGian b = a;
            for (int i = 0; i < num; i++)
                b++;

            return b;
        }

        public static ThoiGian operator ++(ThoiGian a)
        {
            a.Giay++;
            if (a.Giay == 60)
            {
                a.Giay = 0;
                a.Phut++;

                if (a.Phut == 60)
                {
                    a.Phut = 0;
                    a.Gio++;
                }

                if (a.Gio == 24)
                {
                    a.Gio = 0;
                    a.Ngay++;
                }
            }

            return a;
        }

        public static ThoiGian operator -(ThoiGian a, int num)
        {
            ThoiGian b = a;
            for (int i = 0; i < num; i++)
                b--;

            return b;
        }

        public static ThoiGian operator --(ThoiGian a)
        {
            a.Giay--;
            if (a.Giay < 0)
            {
                a.Giay = 59;
                a.Phut--;

                if (a.Phut < 0)
                {
                    a.Phut = 59;
                    a.Gio--;
                }

                if(a.Gio < 0)
                {
                    a.Gio = 23;
                    a.Ngay--;
                }
            }

            return a;
        }

        //Ep kieu ThoiGian thanh string
        public static implicit operator string(ThoiGian a)
        {
            string tg = "";
            tg += a.Gio + ":" + a.Phut + ":" + a.Giay + "\n" + (string)a.Ngay;
            return tg;
        }

        //Ep kieu string thanh Ngay
        public static implicit operator ThoiGian(string a)
        {
            ThoiGian d = new ThoiGian();
            string[] b = a.Split(':');
            string[] c = b[2].Split('\n');

            d.Gio = Convert.ToInt32(b[0]);
            d.Phut = Convert.ToInt32(b[1]);
            d.Giay = Convert.ToInt32(c[0]);
            d.Ngay = c[1];

            return d;
        }
    }
}
