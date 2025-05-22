using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal class HinhTron : HinhHoc
    {
        double iBanKinh;
        Diem dTam;

        public double BanKinh
        {
            get { return this.iBanKinh; }
            set { this.iBanKinh = value; }
        }

        public Diem Tam
        {
            get { return this.dTam; }
            set { this.dTam = value; }
        }

        public HinhTron(Diem dTam, double iBanKinh)
        {
            this.iBanKinh = iBanKinh;
            this.dTam = dTam;
        }

        ~HinhTron() { }

        static public int DemDiemTiepXuc(HinhTron a, HinhTamGiac b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTron(b.a, a) == 1)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.b, a) == 1)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.c, a) == 1)
            {
                dem++;
            }
            return dem;
        }

        static public int DemDiemNamTrong(HinhTron a, HinhTamGiac b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTron(b.a, a) == 2)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.b, a) == 2)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.c, a) == 2)
            {
                dem++;
            }
            return dem;
        }

        static public int DemDiemNamNgoai(HinhTron a, HinhTamGiac b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTron(b.a, a) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.b, a) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.c, a) == 3)
            {
                dem++;
            }
            return dem;
        }

        static public int DemDiemTiepXuc(HinhTron a, HinhVuong b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTron(b.a, a) == 1)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.b, a) == 1)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.c, a) == 1)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.d, a) == 1)
            {
                dem++;
            }
            return dem;
        }

        static public int DemDiemNamTrong(HinhTron a, HinhVuong b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTron(b.a, a) == 2)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.b, a) == 2)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.c, a) == 2)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.d, a) == 2)
            {
                dem++;
            }
            return dem;
        }

        static public int DemDiemNamNgoai(HinhTron a, HinhVuong b)
        {
            int dem = 0;
            if (HinhHoc.Diem_HinhTron(b.a, a) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.b, a) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.c, a) == 3)
            {
                dem++;
            }
            if (HinhHoc.Diem_HinhTron(b.d, a) == 3)
            {
                dem++;
            }
            return dem;
        }

        public override void Xuat()
        {
            Console.WriteLine("Hinh tron co:");
            Console.WriteLine("Chu vi:");
            Console.WriteLine("\t" + Math.Round(TinhChuVi(), 3));
            Console.WriteLine("Dien tich:");
            Console.WriteLine("\t" + Math.Round(TinhDienTich(), 3));
            Console.WriteLine("Tam:");
            Console.Write("\t");
            this.dTam.Xuat();
            Console.WriteLine("Ban kinh:");
            Console.WriteLine("\t" + this.iBanKinh);
        }

        public double TinhChuVi()
        {
            return 2 * Math.PI * this.iBanKinh;
        }

        public double TinhDienTich()
        {
            return Math.PI * Math.Pow(this.iBanKinh, 2);
        }
    }
}
