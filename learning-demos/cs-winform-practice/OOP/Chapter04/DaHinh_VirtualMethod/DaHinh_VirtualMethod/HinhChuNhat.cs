using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai2
{
    internal class HinhChuNhat: Hinh
    {
        //Fields
        int iChieuDai;
        int iChieuRong;

        //Properties
        public int ChieuDai
        {
            get { return this.iChieuDai; }
            set { this.iChieuDai = value; }
        }

        public int ChieuRong
        {
            get { return this.iChieuRong; }
            set { this.iChieuRong = value; }
        }

        //Constructors
        public HinhChuNhat() : base()
        { }

        public HinhChuNhat(Diem x, Diem y, int CD, int CR) : base(x, y) 
        {
            this.iChieuDai = CD;
            this.iChieuRong = CR;
        }

        public HinhChuNhat(int CD, int CR)
        {
            this.iChieuDai = CD;
            this.iChieuRong = CR;
        }

        public HinhChuNhat(Diem x, Diem y) : base(x, y) { }

        //Destructors
        ~HinhChuNhat() { }

        //Input
        public override void Nhap()
        {
            Console.WriteLine("Nhap thong tin hinh chu nhat: ");
            base.Nhap();
        }

        //Output
        public override void Xuat()
        {
            Console.WriteLine("\nHinh chu nhat: ");
            base.Xuat();
            Console.WriteLine("\nChieu dai: " + this.iChieuDai);
            Console.WriteLine("Chieu rong: " + this.iChieuRong);
        }

        //Cals
        public void TinhKichThuoc()
        {
            int a = Math.Abs(base.dA.x - base.dB.x);
            int b = Math.Abs(base.dA.y - base.dB.y);
            this.iChieuDai = Math.Max(a, b);
            this.iChieuRong = Math.Min(a, b);
        }

        public int TinhDienTich()
        {
            return this.iChieuDai * this.iChieuRong;
        }

        //Methods
        public override void Ve()
        {
            Console.WriteLine("Ve hinh chu nhat");
            base.Ve();
        }
    }
}
