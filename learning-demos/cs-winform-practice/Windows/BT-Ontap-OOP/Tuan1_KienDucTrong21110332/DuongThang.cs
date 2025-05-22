using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal class DuongThang : HinhHoc
    {
        Diem dA;
        Diem dB;

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

        public DuongThang(Diem A, Diem B)
        {
            this.dA = A;
            this.dB = B;
        }

        ~DuongThang() { }

        public override void Xuat()
        {
            Console.WriteLine("Duong thang co:");
            Console.Write("\t");
            this.a.Xuat();
            Console.Write("\t");
            this.b.Xuat();
        }

        static public double TinhDoDaiDoanThang(DuongThang a)
        {
            return Diem.TinhKhoangCachGiuaHaiDiem(a.a, a.b);
        }
    }
}
