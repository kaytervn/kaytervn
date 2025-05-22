using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai2
{
    internal abstract class Hinh
    {
        //Fields
        protected Diem dA;
        protected Diem dB;
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

        //Constructors
        public Hinh() { }

        public Hinh(Diem A, Diem B)
        {
            this.dA = A;
            this.dB = B;
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
        }

        public void Nhap(Diem A, Diem B)
        {
            this.dA = A;
            this.dB = B;
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
    }
}