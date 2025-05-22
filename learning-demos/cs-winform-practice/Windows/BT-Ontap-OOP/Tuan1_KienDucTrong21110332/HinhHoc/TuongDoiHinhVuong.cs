using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal partial class HinhHoc
    {
        static void TuongDoiHinhVuong(HinhHoc a, HinhHoc b)
        {
            if (b.GetType() == typeof(Diem))
            {
                Diem_HinhVuong((Diem)b, (HinhVuong)a);
            }
            if (b.GetType() == typeof(DuongThang))
            {
                DuongThang_HinhVuong((DuongThang)b, (HinhVuong)a);
            }
            if (b.GetType() == typeof(HinhTron))
            {
                HinhTron_HinhVuong((HinhTron)b, (HinhVuong)a);
            }
            if (b.GetType() == typeof(HinhTamGiac))
            {
                HinhTamGiac_HinhVuong((HinhTamGiac)b, (HinhVuong)a);
            }
            if (b.GetType() == typeof(HinhVuong))
            {
                HinhVuong_HinhVuong((HinhVuong)a, (HinhVuong)b);
            }
            if (b.GetType() == typeof(HinhChuNhat))
            {
                HinhVuong_HinhChuNhat((HinhVuong)a, (HinhChuNhat)b);
            }
        }

        public static void HinhVuong_HinhVuong(HinhVuong a, HinhVuong b)
        {
            int tx = a.DemDiemTiepXuc(b);
            int tr = a.DemDiemNamTrong(b);
            int ng = a.DemDiemNamNgoai(b);

            if (tr == 4)
            {
                Console.WriteLine("-> Hinh vuong nam trong hinh vuong.");
            }
            else if (ng == 4)
            {
                Console.WriteLine("-> Hai hinh vuong khong giao nhau.");
            }
            else if (tx >= 1 && ng == 0)
            {
                Console.WriteLine("-> Hai hinh vuong tiep xuc trong.");
            }
            else if (tx >= 1 && tr == 0)
            {
                Console.WriteLine("-> Hai hinh vuong tiep xuc ngoai.");
            }
            else
            {
                Console.WriteLine("-> Hai hinh vuong giao nhau.");
            }
        }

        public static void HinhVuong_HinhChuNhat(HinhVuong a, HinhChuNhat b)
        {

        }
    }
}
