using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Nhom04
{
    internal class Time
    {
        //Fields
        int iHour;
        int iMinute;
        int iSecond;

        //Properties
        public int Hour
        {
            get { return this.iHour; }
            set { this.iHour = value; }
        }

        public int Minute
        {
            get { return this.iMinute; }
            set { this.iMinute = value; }
        }

        public int Second
        {
            get { return this.iSecond; }
            set { this.iSecond = value; }
        }

        //Constructors
        public Time()
        {

        }

        public Time(int Hour, int Minute, int Second)
        {
            this.iHour = Hour;
            this.iMinute = Minute;
            this.iSecond = Second;
        }

        //Destructors
        ~Time() { }

        //Input
        public void Input()
        {
            string a;
            string[] b;
            while(true)
            {
                try
                {
                    Console.Write("Time [hh:mm:ss]: ");
                    a = Console.ReadLine();
                    b = a.Split(':');

                    this.iHour = Convert.ToInt32(b[0]);
                    this.iMinute = Convert.ToInt32(b[1]);
                    this.iSecond = Convert.ToInt32(b[2]);

                    if (IsTime(this.iHour, this.iMinute, this.iSecond) == false)
                        continue;
                    else
                        break;
                }
                catch
                {
                    continue;
                }
            }
        }

        //Output
        public void Output()
        {
            Console.WriteLine(this.iHour + ":" + this.iMinute + ":" + this.iSecond);
        }

        //Methods
        bool IsTime(int Hour, int Minute, int Second)
        {
            return Hour >= 0 && Hour <= 23 && Minute >= 0 && Minute <= 59 && Second >= 0 && Second <= 59;
        }

        //Operators
        public static bool operator ==(Time a, Time b)
        {
            return (a.Hour == b.Hour) && (a.Minute == b.Minute) && (a.Second == b.Second);
        }

        public static bool operator !=(Time a, Time b)
        {
            return !(a == b);
        }

        public static bool operator >(Time a, Time b)
        {
            if (a.Hour > b.Hour)
                return true;
            else if (a.Hour < b.Hour)
                return false;

            if (a.Minute > b.Minute)
                return true;
            else if (a.Minute < b.Minute)
                return false;

            if (a.Second > b.Second)
                return true;
            else
                return false;
        }

        public static bool operator <(Time a, Time b)
        {
            return !(a > b || a == b); ;
        }

        public static bool operator >=(Time a, Time b)
        {
            return (a > b) || (a == b);
        }

        public static bool operator <=(Time a, Time b)
        {
            return (a < b) || (a == b);
        }

        public static Time operator +(Time a, int num)
        {
            Time b = a;
            for (int i = 0; i < num; i++)
                b++;

            return b;
        }

        public static Time operator ++(Time a)
        {
            a.Second++;
            if (a.Second == 60)
            {
                a.Second = 0;
                a.Minute++;

                if (a.Minute == 60)
                {
                    a.Minute = 0;
                    a.Hour++;
                }

                if (a.Hour == 24)
                {
                    a.Hour = 0;
                }
            }

            return a;
        }

        public static Time operator -(Time a, int num)
        {
            Time b = a;
            for (int i = 0; i < num; i++)
                b--;

            return b;
        }

        public static Time operator --(Time a)
        {
            a.Second--;
            if (a.Second < 0)
            {
                a.Second = 59;
                a.Minute--;

                if (a.Minute < 0)
                {
                    a.Minute = 59;
                    a.Hour--;
                }

                if (a.Hour < 0)
                {
                    a.Hour = 23;
                }
            }

            return a;
        }

        public static implicit operator string(Time a)
        {
            string tg = "";
            tg += a.Hour + ":" + a.Minute + ":" + a.Second;
            return tg;
        }

        public static implicit operator Time(string a)
        {
            Time d = new Time();
            string[] b = a.Split(':');

            d.Hour = Convert.ToInt32(b[0]);
            d.Minute = Convert.ToInt32(b[1]);
            d.Second = Convert.ToInt32(b[2]);

            return d;
        }
    }
}
