using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal class Date
    {
        //Fields
        private int iDay;
        private int iMonth;
        private int iYear;

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
        public Date() { }

        public Date(int d, int m, int y)
        {
            this.iDay = d;
            this.iMonth = m;
            this.iYear = y;
        }

        //Destructors
        ~Date() { }

        //Input
        public void Input()
        {
            string a;
            string[] b;
            do
            {
                try
                {
                    Console.Write("Date [dd/mm/yyyy]: ");
                    a = Console.ReadLine();
                    b = a.Split('/');

                    this.iDay = Convert.ToInt32(b[0]);
                    this.iMonth = Convert.ToInt32(b[1]);
                    this.iYear = Convert.ToInt32(b[2]);
                    if (IsDate(this.iDay, this.iMonth, this.iYear) == false)
                        continue;
                    else
                        break;
                }
                catch
                {
                    continue;
                }
            } while (true);
        }

        //Output
        public void Output()
        {
            Console.WriteLine(this.iDay + "/" + this.iMonth + "/" + this.iYear);
        }

        //DATE methods
        static public bool IsDate(int Day, int Month, int Year)
        {
            return Day > 0 && Day <= DaysInMonth(Month, Year) && Month > 0 && Month < 13 && Year > 0;
        }

        static bool IsLeapYear(int y)
        {
            return (y % 4 == 0) && (y % 100 != 0 || y % 400 == 0);
        }

        static int DaysInYear(int y)
        {
            if (IsLeapYear(y))
                return 366;
            else
                return 365;
        }

        static int DaysInMonth(int m, int y)
        {
            if (m == 4 || m == 6 || m == 9 || m == 11)
                return 30;
            else
                if (m == 2)
            {
                if (IsLeapYear(y))
                    return 29;
                else
                    return 28;
            }
            else
                return 31;
        }

        //Operators
        public static bool operator ==(Date a, Date b)
        {
            return (a.Day == b.Day) && (a.Month == b.Month) && (a.Year == b.Year);
        }

        public static bool operator !=(Date a, Date b)
        {
            return !(a == b);
        }

        public static bool operator >(Date a, Date b)
        {
            if (a.Year > b.Year)
                return true;
            else if (a.Year < b.Year)
                return false;

            if (a.Month > b.Month)
                return true;
            else if (a.Month < b.Month)
                return false;

            if (a.Day > b.Day)
                return true;
            else
                return false;
        }

        public static bool operator <(Date a, Date b)
        {
            return !(a > b || a == b);
        }

        public static bool operator >=(Date a, Date b)
        {
            return (a > b) || (a == b);
        }

        public static bool operator <=(Date a, Date b)
        {
            return (a < b) || (a == b);
        }

        public static Date operator +(Date a, int num)
        {
            Date b = a;
            for (int i = 0; i < num; i++)
                b++;

            return b;
        }

        public static Date operator ++(Date a)
        {
            a.Day++;
            if (a.Day > DaysInMonth(a.Month, a.Year))
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

        public static Date operator -(Date a, int num)
        {
            Date b = a;
            for (int i = 0; i < num; i++)
                b--;

            return b;
        }

        public static Date operator --(Date a)
        {
            a.Day--;
            if (a.Day < 1)
            {
                a.Day = DaysInMonth(a.Month, a.Year);
                a.Month--;

                if (a.Month < 1)
                {
                    a.Month = 1;
                    a.Year--;
                }
            }

            return a;
        }

        public static implicit operator int(Date a)
        {
            int dem = a.Day - 1;
            for (int i = 1; i < a.Month; i++)
                dem = dem + DaysInMonth(i, a.Year);

            for (int i = 1; i < a.Year; i++)
                dem = dem + DaysInYear(i);

            return dem;
        }

        public static implicit operator string(Date a)
        {
            string day = "";
            day += a.Day + "/" + a.Month + "/" + a.Year;
            return day;
        }

        public static implicit operator Date(string a)
        {
            Date d = new Date();
            string[] b = a.Split('/');

            d.Day = Convert.ToInt32(b[0]);
            d.Month = Convert.ToInt32(b[1]);
            d.Year = Convert.ToInt32(b[2]);

            return d;
        }
    }
}
