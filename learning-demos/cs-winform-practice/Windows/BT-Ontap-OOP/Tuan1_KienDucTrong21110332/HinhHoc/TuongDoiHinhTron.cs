using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal partial class HinhHoc
    {
        static void TuongDoiHinhTron(HinhHoc a, HinhHoc b)
        {
            if (b.GetType() == typeof(Diem))
            {
                switch (Diem_HinhTron((Diem)b, (HinhTron)a))
                {
                    case 1:
                        Console.WriteLine("-> Diem nam tren hinh tron.");
                        break;
                    case 2:
                        Console.WriteLine("-> Diem nam trong hinh tron.");
                        break;
                    case 3:
                        Console.WriteLine("-> Diem nam ngoai hinh tron.");
                        break;
                }
            }
            if (b.GetType() == typeof(DuongThang))
            {
                switch (DuongThang_HinhTron((DuongThang)b, (HinhTron)a))
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
            if (b.GetType() == typeof(HinhTron))
            {
                HinhTron_HinhTron((HinhTron)a, (HinhTron)b);
            }
            if (b.GetType() == typeof(HinhTamGiac))
            {
                HinhTron_HinhTamGiac((HinhTron)a, (HinhTamGiac)b);
            }
            if (b.GetType() == typeof(HinhVuong))
            {
                HinhTron_HinhVuong((HinhTron)a, (HinhVuong)b);
            }
            if (b.GetType() == typeof(HinhChuNhat))
            {
                HinhTron_HinhChuNhat((HinhTron)a, (HinhChuNhat)b);
            }
        }

        static void HinhTron_HinhTron(HinhTron a, HinhTron b)
        {
            double distance, Ra, Rd;
            distance = Diem.TinhKhoangCachGiuaHaiDiem(a.Tam, b.Tam);
            Ra = Math.Abs(a.BanKinh - b.BanKinh);
            Rd = a.BanKinh + b.BanKinh;

            if (a.Tam == b.Tam && a.BanKinh == b.BanKinh)
            {
                Console.WriteLine("-> Hai hinh tron trung nhau.");
            }
            else if (distance == Rd)
            {
                Console.WriteLine("-> Hai hinh tron tiep xuc ngoai.");
            }
            else if (distance == Ra)
            {
                Console.WriteLine("-> Hai hinh tron tiep xuc trong.");
            }
            else if (distance > Ra && distance < Rd)
            {
                Console.WriteLine("-> Hai hinh tron giao nhau.");
            }
            else if (distance < Ra)
            {
                Console.WriteLine("-> Hinh tron nam trong hinh tron.");
            }
            else if (distance > Rd)
            {
                Console.WriteLine("-> Hai hinh tron khong giao nhau.");
            }
        }

        public static void HinhTron_HinhTamGiac(HinhTron a, HinhTamGiac b)
        {
            int tx = HinhTron.DemDiemTiepXuc(a, b);
            int tr = HinhTron.DemDiemTiepXuc(a, b);
            int ng = HinhTron.DemDiemTiepXuc(a, b);

            double dA = Diem.TinhKhoangCachTuDiemDenDuongThang(a.Tam, b.dgA);
            double dB = Diem.TinhKhoangCachTuDiemDenDuongThang(a.Tam, b.dgB);
            double dC = Diem.TinhKhoangCachTuDiemDenDuongThang(a.Tam, b.dgC);

            bool mot_canh_tam_giac_tiep_tuyen_hinh_tron = DuongThang_HinhTron(b.dgA, a) == 2 || DuongThang_HinhTron(b.dgB, a) == 2 || DuongThang_HinhTron(b.dgC, a) == 2;

            if (dA == dB && dB == dC)
            {
                Console.WriteLine("-> Hinh tron noi tiep hinh tam giac.");
            }
            else if (tx == 3)
            {
                Console.WriteLine("-> Hinh tron ngoai tiep hinh tam giac.");
            }
            else if ((ng == 3 && tx == 0 && mot_canh_tam_giac_tiep_tuyen_hinh_tron == true)
                    || tx == 1 && tr == 0)
            {
                Console.WriteLine("-> Hinh tron tiep xuc ngoai hinh tam giac.");
            }
            else if (ng == 3 && Diem_HinhTamGiac(a.Tam, b) == 2)
            {
                if (mot_canh_tam_giac_tiep_tuyen_hinh_tron == true)
                {
                    Console.WriteLine("-> Hinh tron tiep xuc trong hinh tam giac.");
                }
                else
                {
                    Console.WriteLine("-> Hinh tron nam trong hinh tam giac.");
                }
            }
            else if (ng == 3 && Diem_HinhTamGiac(a.Tam, b) == 3)
            {
                Console.WriteLine("-> Hinh tron va hinh tam giac khong giao nhau.");
            }
            else if (ng == 0 && tx >= 1)
            {
                Console.WriteLine("-> Hinh tam giac tiep xuc trong hinh tron.");
            }
            else if (tr == 3)
            {
                Console.WriteLine("-> Hinh tam giac nam trong hinh tron.");
            }
            else
            {
                Console.WriteLine("-> Hinh tron va hinh tam giac giao nhau.");
            }
        }

        public static void HinhTron_HinhVuong(HinhTron a, HinhVuong b)
        {
            int tx = HinhTron.DemDiemTiepXuc(a, b);
            int tr = HinhTron.DemDiemTiepXuc(a, b);
            int ng = HinhTron.DemDiemTiepXuc(a, b);

            double d = Diem.TinhKhoangCachGiuaHaiDiem(a.Tam, b.tam);
            double RaddDcheo = a.BanKinh + DuongThang.TinhDoDaiDoanThang(b.dgA) / 2;

            bool TiepTuyen = DuongThang_HinhTron(b.dgA, a) == 2 || DuongThang_HinhTron(b.dgB, a) == 2 || DuongThang_HinhTron(b.dgC, a) == 2 || DuongThang_HinhTron(b.dgD, a) == 2;

            if (a.Tam == b.tam && a.BanKinh == DuongThang.TinhDoDaiDoanThang(b.dgA) / 2)
            {
                Console.WriteLine("-> Hinh tron noi tiep hinhh vuong.");
            }
            else if (tx == 4)
            {
                Console.WriteLine("-> Hinh tron ngoai tiep hinhh vuong.");
            }
            else if (ng == 4 && !(DuongThang_HinhTron(b.dgA, a) == 1) && !(DuongThang_HinhTron(b.dgB, a) == 1) && !(DuongThang_HinhTron(b.dgC, a) == 1) && !(DuongThang_HinhTron(b.dgD, a) == 1))
            {
                Console.WriteLine("-> Hinh tron nam trong hinh vuong.");
            }
            else if (ng == 0 && tr >= 0 && tr <= 4 && tx >= 0 && tx <= 4)
            {
                Console.WriteLine("-> Hinh vuong nam trong hinh tron.");
            }
            else if (d > RaddDcheo)
            {
                Console.WriteLine("-> Hinh tron va hinh vuong khong tiep xuc nhau.");
            }
            else if (TiepTuyen == true || (tx == 1 && tr == 0))
            {
                Console.WriteLine("-> Hinh tron va hinh vuong tiep xuc ngoai.");
            }
            else
            {
                Console.WriteLine("-> Hinh tron va hinh vuong giao nhau.");
            }
        }

        public static void HinhTron_HinhChuNhat(HinhTron a, HinhChuNhat b)
        {

        }
    }
}
