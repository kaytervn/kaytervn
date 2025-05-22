using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_BTTL
{
    internal abstract class Hinh
    {
        //Fields
        protected Diem dA;
        protected Diem dB;
        protected string sMau;
        protected int iTrucX;
        protected int iTrucY;

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

        public string Mau
        {
            set { this.sMau = value; }
            get { return this.sMau; }
        }

        //Constructors
        public Hinh() { }

        public Hinh(Diem A, Diem B)
        {
            this.dA = A;
            this.dB = B;
        }

        public Hinh(Diem A, Diem B, string mau)
        {
            this.dA = A;
            this.dB = B;
            this.sMau = mau;
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
            Console.WriteLine("Nhap mau: ");
            this.sMau = Console.ReadLine();
        }

        public void Nhap(Diem A, Diem B)
        {
            this.dA = A;
            this.dB = B;
        }

        public void Nhap(Diem A, Diem B, string mau)
        {
            this.dA = A;
            this.dB = B;
            this.sMau = mau;
        }

        //Output
        public virtual void Xuat()
        {
            Console.Write("\nDiem 1: ");
            this.dA.Xuat();
            Console.Write("\nDiem 2: ");
            this.dB.Xuat();
            Console.WriteLine("\nMau: " + this.sMau);
        }

        //Methods
        public abstract void Ve();

        public virtual void TinhKichThuoc()
        {
            this.iTrucX = Math.Abs(this.dA.x - this.dB.x);
            this.iTrucY = Math.Abs(this.dA.y - this.dB.y);
        }

        public virtual void Move(Diem pos)
        {
            this.a.x += pos.x;
            this.b.x += pos.x;

            this.a.y += pos.y;
            this.b.y += pos.y;
        }

        public virtual void DoiMau(string Mau)
        {
            this.sMau = Mau;
        }
    }
}