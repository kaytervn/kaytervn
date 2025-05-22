using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal partial class HinhHoc
    {
        static void TuongDoiDiem(HinhHoc a, HinhHoc b)
        {
            if (b.GetType() == typeof(Diem))
            {
                Diem_Diem((Diem)a, (Diem)b);
            }
            if (b.GetType() == typeof(DuongThang))
            {
                switch (Diem_DuongThang((Diem)a, (DuongThang)b))
                {
                    case 1:
                        Console.WriteLine("-> Diem nam tren duong thang.");
                        break;
                    case 2:
                        Console.WriteLine("-> Diem nam ngoai duong thang.");
                        break;
                }
            }
            if (b.GetType() == typeof(HinhTron))
            {
                switch (Diem_HinhTron((Diem)a, (HinhTron)b))
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
            if (b.GetType() == typeof(HinhTamGiac))
            {
                switch (Diem_HinhTamGiac((Diem)a, (HinhTamGiac)b))
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
            if (b.GetType() == typeof(HinhVuong))
            {
                switch (Diem_HinhVuong((Diem)a, (HinhVuong)b))
                {
                    case 1:
                        Console.WriteLine("-> Diem nam trong hinh vuong.");
                        break;
                    case 2:
                        Console.WriteLine("-> Diem nam tren hinh vuong.");
                        break;
                    case 3:
                        Console.WriteLine("-> Diem nam ngoai hinh vuong.");
                        break;
                }
            }
            if (b.GetType() == typeof(HinhChuNhat))
            {
                Diem_HinhChuNhat((Diem)a, (HinhChuNhat)b);
            }
        }

        public static void Diem_Diem(Diem a, Diem b)
        {
            if (a == b)
            {
                Console.WriteLine("-> Hai diem trung nhau.");
            }
            else
            {
                Console.WriteLine("-> Hai diem khong trung nhau.");
            }
        }

        public static int Diem_DuongThang(Diem a, DuongThang b)
        {
            double k1 = (a.y - b.a.y) / (a.x - b.a.x);
            double k2 = (a.y - b.b.y) / (a.x - b.b.x);

            if (k1 == k2)
            {
                return 1;
            }
            else
            {
                return 2;
            }
        }

        public static int Diem_HinhTron(Diem a, HinhTron b)
        {
            double distance = Diem.TinhKhoangCachGiuaHaiDiem(a, b.Tam);
            if (distance == b.BanKinh)
            {
                return 1;
            }
            else if (distance < b.BanKinh)
            {
                return 2;
            }
            else
            {
                return 3;
            }
        }

        public static int Diem_HinhTamGiac(Diem a, HinhTamGiac b)
        {
            double dtPAB = HinhTamGiac.TinhDienTich(a, b.a, b.b);
            double dtPAC = HinhTamGiac.TinhDienTich(a, b.a, b.c);
            double dtPBC = HinhTamGiac.TinhDienTich(a, b.b, b.c);
            double dtABC = HinhTamGiac.TinhDienTich(b.a, b.b, b.c);

            double d = dtPAB + dtPAC + dtPBC - dtABC;
            if (d > 0)
            {
                return 3;
            }
            else if (dtPAB == 0 || dtPAC == 0 || dtABC == 0)
            {
                return 1;
            }
            else
            {
                return 2;
            }
        }

        public static int Diem_HinhVuong(Diem a, HinhVuong b)
        {
            HinhTamGiac tg1 = new HinhTamGiac(b.a, b.b, b.d);
            HinhTamGiac tg2 = new HinhTamGiac(b.b, b.c, b.d);
            DuongThang dc1 = new DuongThang(b.b, b.d);
            DuongThang dc2 = new DuongThang(b.a, b.c);

            double d = Diem.TinhKhoangCachGiuaHaiDiem(b.tam, a);

            bool DiemNamTrenHV = Diem_DuongThang(a, b.dgA) == 1 || Diem_DuongThang(a, b.dgB) == 1 || Diem_DuongThang(a, b.dgC) == 1 || Diem_DuongThang(a, b.dgD) == 1;
            bool DiemTrungDinh = a == b.a || a == b.b || a == b.c || a == b.d;

            if ((Diem_HinhTamGiac(a, tg1) == 2 || Diem_HinhTamGiac(a, tg2) == 2 || Diem_DuongThang(a, dc1) == 1 || Diem_DuongThang(a, dc2) == 1) && d <= DuongThang.TinhDoDaiDoanThang(dc1))
            {
                return 1;
            }
            else if ((DiemNamTrenHV == true && d <= DuongThang.TinhDoDaiDoanThang(dc1)) || DiemTrungDinh == true)
            {
                return 2;
            }
            else
            {
                return 3;
            }
        }

        public static void Diem_HinhChuNhat(Diem a, HinhChuNhat b)
        {
            
        }
    }
}