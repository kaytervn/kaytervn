using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_BTTL
{
    internal class DoanThang: Hinh
    {
        //Fields

        //Properties

        //Constructors
        public DoanThang() : base()
        { }

        public DoanThang(Diem x, Diem y, string Mau) : base(x, y, Mau) { }

        //Destructors
        ~DoanThang() { }

        //Input
        public override void Nhap()
        {
            Console.WriteLine("Nhap thong tin doan thang: ");
            base.Nhap();
        }

        //Output
        public override void Xuat()
        {
            Console.WriteLine("\nDoan thang: ");
            base.Xuat();
        }

        //Methods
        public override void Ve()
        {
            Console.WriteLine();
            Console.WriteLine("Ve Doan thang");
            Console.WriteLine("Ve khung hinh: \n");

            for (int i = 0; i < this.iTrucX; i++)
            {
                for (int j = 0; j < iTrucY; j++)
                {
                    if (i == 0 || i == this.iTrucX - 1 || j == 0 || j == iTrucY - 1)
                        Console.Write("*");
                    else
                        Console.Write(" ");
                }
                Console.WriteLine();
            }
        }
    }
}
