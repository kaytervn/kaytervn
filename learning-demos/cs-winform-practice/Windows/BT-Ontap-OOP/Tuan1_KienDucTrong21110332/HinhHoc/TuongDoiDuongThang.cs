using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal partial class HinhHoc
    {
        static void TuongDoiDuongThang(HinhHoc a, HinhHoc b)
        {
            if (b.GetType() == typeof(Diem))
            {
                switch (Diem_DuongThang((Diem)b, (DuongThang)a))
                {
                    case 1:
                        Console.WriteLine("-> Diem nam tren duong thang.");
                        break;
                    case 2:
                        Console.WriteLine("-> Diem nam ngoai duong thang.");
                        break;
                }
            }
            if (b.GetType() == typeof(DuongThang))
            {
                switch (DuongThang_DuongThang((DuongThang)a, (DuongThang)b))
                {
                    case 1:
                        Console.WriteLine("-> Hai duong thang trung nhau.");
                        break;
                    case 2:
                        Console.WriteLine("-> Hai duong thang song song nhau.");
                        break;
                    case 3:
                        Console.WriteLine("-> Hai duong thang cat nhau.");
                        break;
                }
            }
            if (b.GetType() == typeof(HinhTron))
            {
                switch (DuongThang_HinhTron((DuongThang)a, (HinhTron)b))
                {
                    case 1:
                        Console.WriteLine("Duong thang cat hinh tron.");
                        break;
                    case 2:
                        Console.WriteLine("Duong thang tiep tuyen hinh tron.");
                        break;
                    case 3:
                        Console.WriteLine("Duong thang va hinh tron khong giao nhau.");
                        break;
                }
            }
            if (b.GetType() == typeof(HinhTamGiac))
            {
                DuongThang_HinhTamGiac((DuongThang)a, (HinhTamGiac)b);
            }
            if (b.GetType() == typeof(HinhVuong))
            {
                DuongThang_HinhVuong((DuongThang)a, (HinhVuong)b);
            }
            if (b.GetType() == typeof(HinhChuNhat))
            {
                DuongThang_HinhChuNhat((DuongThang)a, (HinhChuNhat)b);
            }
        }

        public static int DuongThang_DuongThang(DuongThang d1, DuongThang d2)
        {
            double k1 = (d1.b.y - d1.a.y) / (d1.b.x - d1.a.x);
            double b1 = d1.b.y - k1 * d1.b.x;

            double k2 = (d2.b.y - d2.a.y) / (d2.b.x - d2.a.x);
            double b2 = d2.b.y - k2 * d2.b.x;

            if (k1 == k2)
            {
                if (b1 == b2)
                {
                    return 1;
                }
                else
                {
                    return 2;
                }
            }
            else
            {
                return 3;
            }
        }

        public static int DuongThang_HinhTron(DuongThang a, HinhTron b)
        {
            double distance = Diem.TinhKhoangCachTuDiemDenDuongThang(b.Tam, a);

            if (distance > b.BanKinh)
            {
                return 3;
            }
            else if (distance == b.BanKinh)
            {
                return 2;
            }
            else
            {
                return 1;
            }
        }

        public static void DuongThang_HinhTamGiac(DuongThang a, HinhTamGiac b)
        {
            double dA = Diem.TinhKhoangCachGiuaHaiDiem(b.tam, b.a);
            double dB = Diem.TinhKhoangCachGiuaHaiDiem(b.tam, b.b);
            double dC = Diem.TinhKhoangCachGiuaHaiDiem(b.tam, b.c);
            double d = Diem.TinhKhoangCachTuDiemDenDuongThang(b.tam, a);

            if (DuongThang_DuongThang(b.dgA, a) == 1 || DuongThang_DuongThang(b.dgB, a) == 1 || DuongThang_DuongThang(b.dgC, a) == 1)
            {
                Console.WriteLine("-> Duong thang trung voi mot canh cua hinh tam giac.");
            }
            else if (Diem_DuongThang(b.a, a) == 1 || Diem_DuongThang(b.b, a) == 1 || Diem_DuongThang(b.c, a) == 1)
            {
                Console.WriteLine("-> Duong thang di qua dinh cua hinh tam giac.");
            }
            else if (d <= Math.Max(Math.Max(dA, dB), dC))
            {
                Console.WriteLine("-> Duong thang cat hinh tam giac.");
            }
            else
            {
                Console.WriteLine("-> Duong thang khong tiep xuc hinh tam giac.");
            }
        }

        public static void DuongThang_HinhVuong(DuongThang a, HinhVuong b)
        {
            double d = Diem.TinhKhoangCachTuDiemDenDuongThang(b.tam, a);

            if (DuongThang_DuongThang(b.dgA, a) == 1 || DuongThang_DuongThang(b.dgB, a) == 1 || DuongThang_DuongThang(b.dgC, a) == 1 || DuongThang_DuongThang(b.dgD, a) == 1)
            {
                Console.WriteLine("-> Duong thang trung voi mot canh cua hinh vuong.");
            }
            else if (Diem_DuongThang(b.a, a) == 1 || Diem_DuongThang(b.b, a) == 1 || Diem_DuongThang(b.c, a) == 1 || Diem_DuongThang(b.d, a) == 1)
            {
                Console.WriteLine("-> Duong thang di qua dinh cua hinh vuong.");
            }
            else if (d <= Diem.TinhKhoangCachGiuaHaiDiem(b.tam, b.a))
            {
                Console.WriteLine("-> Duong thang cat hinh vuong.");
            }
            else
            {
                Console.WriteLine("-> Duong thang khong tiep xuc hinh vuong.");
            }
        }

        static void DuongThang_HinhChuNhat(DuongThang a, HinhChuNhat b)
        {
            
        }
    }
}
