
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal class HinhChuNhat : HinhHoc
    {
        Diem dA;
        Diem dB;
        Diem dC;
        Diem dD;

        DuongThang cdA;
        DuongThang cdB;
        DuongThang crA;
        DuongThang crB;

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

        public DuongThang daA
        {
            get { return this.cdA; }
        }

        public DuongThang daB
        {
            get { return this.cdB; }
        }

        public DuongThang roA
        {
            get { return this.crA; }
        }

        public DuongThang roB
        {
            get { return this.crB; }
        }

        public HinhChuNhat(Diem A, Diem B, Diem C, Diem D)
        {
            this.dA = new Diem(A.x, A.y);
            this.dB = new Diem(B.x, B.y);
            this.dC = new Diem(C.x, C.y);
            this.dD = new Diem(D.x, D.y);

            this.cdA = new DuongThang(A, B);
            this.crA = new DuongThang(B, C);
            this.cdB = new DuongThang(C, D);
            this.crB = new DuongThang(D, A);
        }

        ~HinhChuNhat() { }

        public double TinhChuVi()
        {
            double ab = Diem.TinhKhoangCachGiuaHaiDiem(this.a, this.b);
            double bc = Diem.TinhKhoangCachGiuaHaiDiem(this.b, this.c);
            return (ab + bc) * 2;
        }

        public double TinhDienTich()
        {
            double ab = Diem.TinhKhoangCachGiuaHaiDiem(this.a, this.b);
            double bc = Diem.TinhKhoangCachGiuaHaiDiem(this.b, this.c);
            return ab * bc;
        }

        public override void Xuat()
        {
            Console.WriteLine("Hinh chu nhat co:");
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
