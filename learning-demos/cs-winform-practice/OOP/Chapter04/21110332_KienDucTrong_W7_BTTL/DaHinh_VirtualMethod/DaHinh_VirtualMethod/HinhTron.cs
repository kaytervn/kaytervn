using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai2
{
    internal class HinhTron: Hinh
    {
        //Fields
        int iBanKinh;

        //Properties
        public int BanKinh
        {
            get { return this.iBanKinh; }
            set { this.iBanKinh = value; }
        }

        //Constructors
        public HinhTron() : base()
        { }

        public HinhTron(int BanKinh)
        {
            this.iBanKinh = BanKinh;
        }

        public HinhTron(Diem x, Diem y) : base(x, y) { }

        //Destructors
        ~HinhTron() { }

        //Input
        public override void Nhap()
        {
            Console.WriteLine("Nhap thong tin hinh tron: ");
            base.Nhap();
        }

        //Output
        public override void Xuat()
        {
            Console.WriteLine("\nHinh tron: ");
            base.Xuat();
            Console.WriteLine("\nBanKinh: " + this.iBanKinh);
        }

        //Cals
        public void TinhKichThuoc()
        {
            this.iBanKinh = Math.Abs(base.dA.x - base.dB.x) / 2;
        }

        public double TinhDienTich()
        {
            return Math.PI * this.iBanKinh * this.iBanKinh;
        }

        //Methods
        public override void Ve()
        {
            Console.WriteLine("Ve hinh tron");
            base.Ve();
        }
    }
}
