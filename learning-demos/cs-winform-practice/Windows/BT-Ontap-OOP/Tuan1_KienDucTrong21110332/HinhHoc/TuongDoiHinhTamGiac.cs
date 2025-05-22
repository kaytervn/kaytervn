using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal partial class HinhHoc
    {
        static void TuongDoiHinhTamGiac(HinhHoc a, HinhHoc b)
        {
            if (b.GetType() == typeof(Diem))
            {
                switch (Diem_HinhTamGiac((Diem)b, (HinhTamGiac)a))
                {
                    case 1:
                        Console.WriteLine("-> Diem nam tren canh cua hinh tam giac.");
                        break;
                    case 2:
                        Console.WriteLine("-> Diem nam trong hinh tam giac.");
                        break;
                    case 3:
                        Console.WriteLine("-> Diem nam ngoai hinh tam giac.");
                        break;
                }
            }
            if (b.GetType() == typeof(DuongThang))
            {
                DuongThang_HinhTamGiac((DuongThang)b, (HinhTamGiac)a);
            }
            if (b.GetType() == typeof(HinhTron))
            {
                HinhTron_HinhTamGiac((HinhTron)b, (HinhTamGiac)a);
            }
            if (b.GetType() == typeof(HinhTamGiac))
            {
                HinhTamGiac_HinhTamGiac((HinhTamGiac)a, (HinhTamGiac)b);
            }
            if (b.GetType() == typeof(HinhVuong))
            {
                HinhTamGiac_HinhVuong((HinhTamGiac)a, (HinhVuong)b);
            }
            if (b.GetType() == typeof(HinhChuNhat))
            {
                HinhTamGiac_HinhChuNhat((HinhTamGiac)a, (HinhChuNhat)b);
            }
        }

        static void HinhTamGiac_HinhTamGiac(HinhTamGiac a, HinhTamGiac b)
        {
            int tx = a.DemDiemTiepXuc(b);
            int tr = a.DemDiemNamTrong(b);
            int ng = a.DemDiemNamNgoai(b);

            if (tr == 3)
            {
                Console.WriteLine("-> Hinh tam giac nam trong hinh tam giac.");
            }
            else if (ng == 3)
            {
                Console.WriteLine("-> Hai hinh tam giac khong giao nhau.");
            }
            else if (tx >= 1 && ng == 0)
            {
                Console.WriteLine("-> Hai hinh tam giac tiep xuc trong.");
            }
            else if (tx >= 1 && tr == 0)
            {
                Console.WriteLine("-> Hai hinh tam giac tiep xuc ngoai.");
            }
            else
            {
                Console.WriteLine("-> Hai hinh tam giac giao nhau.");
            }    
        }

        public static void HinhTamGiac_HinhVuong(HinhTamGiac a, HinhVuong b)
        {
            int TGtxHV = a.DemDiemTiepXuc(b);
            int TGntHV = a.DemDiemNamTrong(b);
            int TGngHV = a.DemDiemNamNgoai(b);

            int HVtxTG = b.DemDiemTiepXuc(a);
            int HVntTG = b.DemDiemNamTrong(a);
            int HVngTG = b.DemDiemNamNgoai(a);

            if (TGngHV == 0)
            {
                Console.WriteLine("-> Hinh tam giac nam trong hinh vuong.");
            }
            else if (HVngTG == 0)
            {
                Console.WriteLine("-> Hinh vuong nam trong tam giac.");
            }
            else if (TGtxHV >= 1 && TGntHV == 0 && HVtxTG >= 1 && HVntTG == 0)
            {
                Console.WriteLine("-> Hinh tam giac va hinh vuong tiep xuc ngoai.");
            }
            else if (HVngTG == 4 && TGngHV == 3)
            {
                Console.WriteLine("-> Hinh tam giac va hinh vuong khong tiep xuc nhau.");
            }
            else
            {
                Console.WriteLine("-> Hinh tam giac va hinh vuong giao nhau.");
            }
        }

        public static void HinhTamGiac_HinhChuNhat(HinhTamGiac a, HinhChuNhat b)
        {

        }
    }
}
