using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai2
{
    internal class DoanThang: Hinh
    {
        //Fields

        //Properties

        //Constructors
        public DoanThang() : base()
        { }

        public DoanThang(Diem x, Diem y) : base(x, y) { }

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
            Console.WriteLine("Ve Doan thang");
            base.Ve();
        }
    }
}
