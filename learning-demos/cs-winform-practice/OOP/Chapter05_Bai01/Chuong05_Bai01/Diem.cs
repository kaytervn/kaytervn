using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_Bai01
{
    internal class Diem
    {
        //Fields
        protected int iX;
        protected int iY;

        //Properties
        public int x
        {
            get { return this.iX; }
            set { this.iX = value; }
        }

        public int y
        {
            get { return this.iY; }
            set { this.iY = value; }
        }

        //Constructors
        public Diem() { }

        public Diem(int x, int y)
        {
            this.iX = x;
            this.iY = y;
        }

        //Detructors
        ~Diem() { }

        //Input
        public virtual void Nhap()
        {
            Console.WriteLine("Nhap x: ");
            this.iX = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap y: ");
            this.iY = Convert.ToInt32(Console.ReadLine());
        }

        public void Nhap(int x, int y)
        {
            this.iX = x;
            this.iY = y;
        }

        //Output
        public virtual void Xuat()
        {
            Console.Write("( " + this.iX + "; " + this.iY + " )");
        }

        //Operators
        public static bool operator == (Diem a, Diem b)
        {
            return (a.x == b.x) && (a.y == b.y);
        }

        public static bool operator != (Diem a, Diem b)
        {
            return (a.x != b.x) && (a.y != b.y);
        }
    }
}
