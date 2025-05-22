using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal partial class HinhHoc
    {
        public virtual void Xuat() { }

        static public void XetViTriTuongDoi(HinhHoc a, HinhHoc b)
        {
            Console.WriteLine("\t[DOI TUONG THU 1]");
            a.Xuat();
            Console.WriteLine();
            Console.WriteLine("\t[DOI TUONG THU 2]");
            b.Xuat();
            Console.WriteLine();

            if (a.GetType() == typeof(Diem))
            {
                TuongDoiDiem(a, b);
            }
            if(a.GetType() == typeof(DuongThang))
            {
                TuongDoiDuongThang(a, b);
            }
            if (a.GetType() == typeof(HinhTron))
            {
                TuongDoiHinhTron(a, b);
            }
            if (a.GetType() == typeof(HinhTamGiac))
            {
                TuongDoiHinhTamGiac(a, b);
            }
            if (a.GetType() == typeof(HinhVuong))
            {
                TuongDoiHinhVuong(a, b);
            }
            if (a.GetType() == typeof(HinhChuNhat))
            {
                TuongDoiHinhChuNhat(a, b);
            }
            Console.WriteLine();
            Console.WriteLine("----------------------------------------");
            Console.WriteLine();
        }
    }
}
