using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_Bai01
{
    internal class Ngay
    {
        //Fields
        int iDay;
        int iMonth;
        int iYear;

        //Properties
        public int Day
        {
            set { this.iDay = value; }
            get { return this.iDay; }
        }
        public int Month
        {
            set { this.iMonth = value; }
            get { return this.iMonth; }
        }

        public int Year
        {
            set { this.iYear = value; }
            get { return this.iYear; }
        }

        //Constructors
        public Ngay() { }

        public Ngay(int d, int m, int y)
        {
            this.iDay = d;
            this.iMonth = m;
            this.iYear = y;
        }

        //Destructors
        ~Ngay() { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap ngay: ");
            this.iDay = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap thang: ");
            this.iMonth = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap nam: ");
            this.iYear = Convert.ToInt32(Console.ReadLine());
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine(this.iDay + "/" + this.iMonth + "/" + this.iYear);
        }

        //DATE methods
        static bool LaNamNhuan(int y)
        {
            return (y % 4 == 0) && (y % 100 != 0 || y % 400 == 0);
        }

        static int SoNgayTrongNam(int y)
        {
            if (LaNamNhuan(y))
                return 366;
            else
                return 365;
        }

        static int TinhNgayTrongThang(int m, int y)
        {
            if (m == 4 || m == 6 || m == 9 || m == 11)
                return 30;
            else
                if (m == 2)
            {
                if (LaNamNhuan(y))
                    return 29;
                else
                    return 28;
            }
            else
                return 31;
        }

        //Operators
        public static bool operator ==(Ngay a, Ngay b)
        {
            return (a.Day == b.Day) && (a.Month == b.Month) && (a.Year == b.Year);
        }

        public static bool operator !=(Ngay a, Ngay b)
        {
            return !(a == b);
        }

        public static bool operator >(Ngay a, Ngay b)
        {
            if (a.Year > b.Year)
                return true;
            else if (a.Year < b.Year)
                return false;

            if (a.Month > b.Month)
                return true;
            else if(a.Month < b.Month)
                return false;

            if (a.Day > b.Day)
                return true;
            else
                return false;
        }

        public static bool operator <(Ngay a, Ngay b)
        {
            return !(a > b || a == b);
        }

        public static bool operator >=(Ngay a, Ngay b)
        {
            return (a > b) || (a == b);
        }

        public static bool operator <=(Ngay a, Ngay b)
        {
            return (a < b) || (a == b);
        }

        public static Ngay operator +(Ngay a, int num)
        {
            Ngay b = a;
            for (int i = 0; i < num; i++)
                b++;

            return b;
        }

        public static Ngay operator ++(Ngay a)
        {
            a.Day++;
            if (a.Day > TinhNgayTrongThang(a.Month, a.Year))
            {
                a.Day = 1;
                a.Month++;

                if (a.Month > 12)
                {
                    a.Month = 1;
                    a.Year++;
                }
            }
                
            return a;
        }

        public static Ngay operator -(Ngay a, int num)
        {
            Ngay b = a;
            for (int i = 0; i < num; i++)
                b--;

            return b;
        }

        public static Ngay operator --(Ngay a)
        {
            a.Day--;
            if (a.Day < 1)
            {
                a.Day = TinhNgayTrongThang(a.Month, a.Year);
                a.Month--;

                if (a.Month < 1)
                {
                    a.Month = 1;
                    a.Year--;
                }
            }

            return a;
        }

        //Ep kieu Ngay thanh so ngay
        public static implicit operator int(Ngay a)
        {
            int dem = a.Day - 1;
            for (int i = 1; i < a.Month; i++)
                dem = dem + TinhNgayTrongThang(i, a.Year);

            for (int i = 1; i < a.Year; i++)
                dem = dem + SoNgayTrongNam(i);

            return dem;
        }

        //Ep kieu Ngay thanh string
        public static implicit operator string(Ngay a)
        {
            string day = "";
            day += a.Day + "/" + a.Month + "/" + a.Year;
            return day;
        }

        //Ep kieu string thanh Ngay
        public static implicit operator Ngay(string a)
        {
            Ngay d = new Ngay();
            string[] b = a.Split('/');

            d.Day = Convert.ToInt32(b[0]);
            d.Month = Convert.ToInt32(b[1]);
            d.Year = Convert.ToInt32(b[2]);

            return d;
        }
    }
}
