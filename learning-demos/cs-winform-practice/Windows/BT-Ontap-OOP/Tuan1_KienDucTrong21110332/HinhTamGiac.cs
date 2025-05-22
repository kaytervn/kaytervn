using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal class HinhTamGiac : HinhHoc
    {
        Diem dA;
        Diem dB;
        Diem dC;
        Diem dTam;
        DuongThang dtA;
        DuongThang dtB;
        DuongThang dtC;

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

        public Diem c
        {
            get { return this.dC; }
            set { this.dC = value; }
        }

        public Diem tam
        {
            get { return this.dTam; }
        }

        public DuongThang dgA
        {
            get { return this.dtA; }
        }

        public DuongThang dgB
        {
            get { return this.dtB; }
        }

        public DuongThang dgC
        {
            get { return this.dtC; }
        }

        public HinhTamGiac(Diem A, Diem B, Diem C)
        {
            this.dA = new Diem(A.x, A.y);
            this.dB = new Diem(B.x, B.y);
            this.dC = new Diem(C.x, C.y);

            this.dtA = new DuongThang(B, C);
            this.dtB = new DuongThang(A, C);
            this.dtC = new DuongThang(A, B);
        }

        ~HinhTamGiac() { }

        public void TinhToaDoTam()
        {
            this.dTam = new Diem((this.a.x + this.b.x + this.c.x) / 3, (this.a.y + this.b.y + this.c.y) / 3);
        }

        public override void Xuat()
        {
            TinhToaDoTam();
            Console.WriteLine("Hinh tam giac co:");
            Console.WriteLine("Chu vi:");
            Console.WriteLine("\t" + Math.Round(TinhChuVi(this.a, this.b, this.c), 3));
            Console.WriteLine("Dien tich:");
            Console.WriteLine("\t" + Math.Round(TinhDienTich(this.a, this.b, this.c), 3));
            Console.WriteLine("Tam:");
            Console.Write("\t");
            this.dTam.Xuat();
            Console.WriteLine("Toa do cac diem:");
            Console.Write("\t");
            this.a.Xuat();
            Console.Write("\t");
            this.b.Xuat();
            Console.Write("\t");
            this.c.Xuat();
        }

        public int DemDiemTiepXuc(HinhVuong b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhVuong(this.a, b) == 2)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhVuong(this.b, b) == 2)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhVuong(this.c, b) == 2)
            {
                dem++;
            }
            return dem;
        }

        public int DemDiemNamTrong(HinhVuong b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhVuong(this.a, b) == 1)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhVuong(this.b, b) == 1)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhVuong(this.c, b) == 1)
            {
                dem++;
            }
            return dem;
        }

        public int DemDiemNamNgoai(HinhVuong b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhVuong(this.a, b) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhVuong(this.b, b) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhVuong(this.c, b) == 3)
            {
                dem++;
            }
            return dem;
        }

        public int DemDiemTiepXuc(HinhTamGiac b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTamGiac(this.a, b) == 1)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTamGiac(this.b, b) == 1)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTamGiac(this.c, b) == 1)
            {
                dem++;
            }
            return dem;
        }

        public int DemDiemNamTrong(HinhTamGiac b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTamGiac(this.a, b) == 2)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTamGiac(this.b, b) == 2)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTamGiac(this.c, b) == 2)
            {
                dem++;
            }
            return dem;
        }

        public int DemDiemNamNgoai(HinhTamGiac b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTamGiac(this.a, b) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTamGiac(this.b, b) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTamGiac(this.c, b) == 3)
            {
                dem++;
            }
            return dem;
        }

        static public double TinhChuVi(Diem a, Diem b, Diem c)
        {
            double ab = Diem.TinhKhoangCachGiuaHaiDiem(a, b);
            double ac = Diem.TinhKhoangCachGiuaHaiDiem(a, c);
            double bc = Diem.TinhKhoangCachGiuaHaiDiem(c, b);

            return ab + ac + bc;
        }

        static public double TinhDienTich(Diem a, Diem b, Diem c)
        {
            double ab = Diem.TinhKhoangCachGiuaHaiDiem(a, b);
            double ac = Diem.TinhKhoangCachGiuaHaiDiem(a, c);
            double bc = Diem.TinhKhoangCachGiuaHaiDiem(c, b);
            double p = TinhChuVi(a, b, c) / 2;
            return Math.Sqrt(p * (p - ab) * (p - ac) * (p - bc));
        }
    }
}
