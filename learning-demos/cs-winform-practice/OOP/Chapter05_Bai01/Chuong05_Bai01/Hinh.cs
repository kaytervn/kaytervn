using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_Bai01
{
    internal abstract class Hinh
    {
        //Fields
        protected Diem dA;
        protected Diem dB;
        protected int iTrucX;
        protected int iTrucY;
        protected double dDienTich;

        //Properties
        public Diem a
        {
            get { return this.dA; }
            set { this.dA = value; }
        }

        public Diem b
        {
            get { return this.dB; }
            set { this.dB = value; }
        }

        public double DienTich
        {
            get { return this.dDienTich; }
            set { this.dDienTich = value; }
        }

        //Constructors
        public Hinh() { }

        public Hinh(Diem A, Diem B)
        {
            this.dA = A;
            this.dB = B;
            TinhKichThuoc();
            TinhDienTich();
        }

        //Destructors
        ~Hinh() { }

        //Input
        public virtual void Nhap()
        {
            Console.WriteLine("Nhap diem thu nhat: ");
            this.dA.Nhap();
            Console.WriteLine("Nhap diem thu hai: ");
            this.dB.Nhap();

            TinhKichThuoc();
            TinhDienTich();
        }

        public void Nhap(Diem A, Diem B)
        {
            this.dA = A;
            this.dB = B;
            TinhKichThuoc();
            TinhDienTich();
        }

        //Output
        public virtual void Xuat()
        {
            Console.WriteLine("\nDiem 1: ");
            this.dA.Xuat();
            Console.WriteLine("\nDiem 2: ");
            this.dB.Xuat();
        }

        //Methods
        public abstract void Ve();

        public virtual void TinhKichThuoc()
        {
            this.iTrucX = Math.Abs(this.dA.x - this.dB.x);
            this.iTrucY = Math.Abs(this.dA.y - this.dB.y);
        }

        public virtual void TinhDienTich()
        {
            this.dDienTich = this.iTrucX * this.iTrucY;
        }

        //Operators
        public static bool operator ==(Hinh a, Hinh b)
        {
            return (a.DienTich == b.DienTich);
        }

        public static bool operator !=(Hinh a, Hinh b)
        {
            return !(a == b);
        }

        public static bool operator >(Hinh a, Hinh b)
        {
            return (a.DienTich > b.DienTich);
        }

        public static bool operator <(Hinh a, Hinh b)
        {
            return (a.DienTich < b.DienTich);
        }

        public static bool operator >=(Hinh a, Hinh b)
        {
            return (a > b) || (a == b);
        }

        public static bool operator <=(Hinh a, Hinh b)
        {
            return (a < b) || (a == b);
        }
    }
}