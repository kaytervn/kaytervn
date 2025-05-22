using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal class Diem : HinhHoc
    {
        //Fields
        protected double iX;
        protected double iY;

        //Properties
        public double x
        {
            get { return this.iX; }
            set { this.iX = value; }
        }

        public double y
        {
            get { return this.iY; }
            set { this.iY = value; }
        }

        //Constructors
        public Diem(double x, double y)
        {
            this.iX = x;
            this.iY = y;
        }

        //Detructors
        ~Diem() { }

        //Operators
        public static bool operator ==(Diem a, Diem b)
        {
            return (a.x == b.x) && (a.y == b.y);
        }

        public static bool operator !=(Diem a, Diem b)
        {
            return (a.x != b.x) && (a.y != b.y);
        }

        //Methods
        public override void Xuat()
        {
            Console.WriteLine("Diem: (" + this.iX + ", " + this.iY + ")");
        }

        public static double TinhKhoangCachGiuaHaiDiem(Diem a, Diem b)
        {
            return Math.Sqrt(Math.Pow((b.x - a.x), 2) + Math.Pow((b.y - a.y), 2));
        }

        public static double TinhKhoangCachTuDiemDenDuongThang(Diem a, DuongThang dt)
        {
            double k = (dt.b.y - dt.a.y) / (dt.b.x - dt.a.x);
            double b = dt.b.y - k * dt.b.x;

            return Math.Abs(-k * a.x + a.y - b) / Math.Sqrt(Math.Pow(k, 2) + 1);
        }
    }
}
