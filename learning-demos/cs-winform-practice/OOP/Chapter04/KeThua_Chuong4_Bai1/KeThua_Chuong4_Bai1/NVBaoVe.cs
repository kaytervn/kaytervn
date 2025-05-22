using Baitap01Chuong04;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai1
{
    internal class NVBaoVe: NhanVien
    {
        //Fields
        int iCaDK;

        //Properties
        public int CaDK
        {
            set { this.iCaDK = value; }
            get { return this.iCaDK; }
        }

        //Constructors
        public NVBaoVe() : base()
        { }

        public NVBaoVe(string TenNV, string CMND, int NamSinh, double LuongCB, int Cadk) : base(TenNV, CMND, NamSinh, LuongCB)
        {
            this.iCaDK = Cadk;
        }

        //Destructors
        ~NVBaoVe() { }

        //Input
        public override void Nhap()
        {
            base.Nhap();
            Console.WriteLine("Nhap ca dang ky: ");
            this.iCaDK = Convert.ToInt32(Console.ReadLine());
        }

        public void Nhap(string TenNV, string CMND, int NamSinh, double LuongCB, int CaDK)
        {
            base.Nhap(TenNV, CMND, NamSinh, LuongCB);
            this.iCaDK = CaDK;
        }

        //Output
        public override void Xuat()
        {
            base.Xuat();
            Console.WriteLine("Ca dang ky: " + this.iCaDK);
        }
    }
}