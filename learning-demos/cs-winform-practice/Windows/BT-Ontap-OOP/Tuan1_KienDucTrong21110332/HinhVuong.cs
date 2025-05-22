using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal class HinhVuong : HinhHoc
    {
        Diem dA;
        Diem dB;
        Diem dC;
        Diem dD;

        Diem dTam;
        DuongThang dtA;
        DuongThang dtB;
        DuongThang dtC;
        DuongThang dtD;

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

        public Diem d
        {
            get { return this.dD; }
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

        public DuongThang dgD
        {
            get { return this.dtC; }
        }

        public HinhVuong(Diem A, Diem B, Diem C, Diem D)
        {
            this.dA = new Diem(A.x, A.y);
            this.dB = new Diem(B.x, B.y);
            this.dC = new Diem(C.x, C.y);
            this.dD = new Diem(D.x, D.y);

            this.dtA = new DuongThang(A, B);
            this.dtB = new DuongThang(B, C);
            this.dtC = new DuongThang(C, D);
            this.dtD = new DuongThang(D, A);
        }

        ~HinhVuong() { }

        public int DemDiemTiepXuc(HinhVuong b)
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
            if (HinhHoc.Diem_HinhVuong(this.d, b) == 1)
            {
                dem++;
            }
            return dem;
        }

        public int DemDiemNamTrong(HinhVuong b)
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
            if (HinhHoc.Diem_HinhVuong(this.d, b) == 2)
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
            if (HinhHoc.Diem_HinhVuong(this.d, b) == 3)
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
            if (HinhHoc.Diem_HinhTamGiac(this.d, b) == 1)
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
            if (HinhHoc.Diem_HinhTamGiac(this.d, b) == 2)
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
            if (HinhHoc.Diem_HinhTamGiac(this.d, b) == 3)
            {
                dem++;
            }
            return dem;
        }

        static public int DemDiemNamNgoai(HinhVuong a, HinhTamGiac b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTamGiac(a.a, b) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTamGiac(a.b, b) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTamGiac(a.c, b) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTamGiac(a.d, b) == 3)
            {
                dem++;
            }
            return dem;
        }

        public double TinhChuVi()
        {
            double ab = Diem.TinhKhoangCachGiuaHaiDiem(this.a, this.b);
            return ab * 4;
        }

        public double TinhDienTich()
        {
            double ab = Diem.TinhKhoangCachGiuaHaiDiem(this.a, this.b);
            return ab * ab;
        }

        public void TinhToaDoTam()
        {
            double canh = DuongThang.TinhDoDaiDoanThang(this.dgA);
            this.dTam = new Diem(canh / 2, canh / 2);
        }

        public override void Xuat()
        {
            TinhToaDoTam();
            Console.WriteLine("Hinh vuong co:");
            Console.WriteLine("Chu vi:");
            Console.WriteLine("\t" + Math.Round(TinhChuVi(), 3));
            Console.WriteLine("Dien tich:");
            Console.WriteLine("\t" + Math.Round(TinhDienTich(), 3));
            Console.WriteLine("Toa do cac diem:");
            Console.Write("\t");
            this.a.Xuat();
            Console.Write("\t");
            this.b.Xuat();
            Console.Write("\t");
            this.c.Xuat();
            Console.Write("\t");
            this.d.Xuat();
        }
    }
}
