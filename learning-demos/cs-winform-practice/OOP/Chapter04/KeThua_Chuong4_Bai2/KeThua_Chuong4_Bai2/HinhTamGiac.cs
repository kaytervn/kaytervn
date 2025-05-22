using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai2
{
    internal class HinhTamGiac: Hinh
    {
        //Fields
        int iCanhDay;
        int iChieuCao;

        //Properties
        public int CanhDay
        {
            get { return this.iCanhDay; }
            set { this.iCanhDay = value; }
        }

        public int ChieuCao
        {
            get { return this.iChieuCao; }
            set { this.iChieuCao = value; }
        }

        //Constructors
        public HinhTamGiac() : base()
        { }

        public HinhTamGiac(int Day, int Cao)
        {
            this.iCanhDay = Day;
            this.iChieuCao = Cao;
        }

        public HinhTamGiac(Diem x, Diem y) : base(x, y) { }

        //Destructors
        ~HinhTamGiac() { }

        //Input
        public override void Nhap()
        {
            Console.WriteLine("Nhap thong tin hinh tam giac: ");
            base.Nhap();
        }

        public void Nhap(int Day, int Cao)
        {
            this.iCanhDay = Day;
            this.iChieuCao = Cao;
        }

        //Output
        public override void Xuat()
        {
            Console.WriteLine("\nHinh tam giac: ");
            base.Xuat();
            Console.WriteLine("\nCanh day: " + this.iCanhDay);
            Console.WriteLine("Chieu cao: " + this.iChieuCao);
        }

        //Cals
        public void TinhKichThuoc()
        {
            this.iCanhDay = Math.Abs(base.dA.x - base.dB.x);
            this.iChieuCao = Math.Abs(base.dA.y - base.dB.y);
        }

        public int TinhDienTich()
        {
            return this.iChieuCao * this.iCanhDay / 2;
        }
    }
}
