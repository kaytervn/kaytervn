using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;

namespace BaiTapTuan03
{
    internal class Lop
    {
        //Fields
        string sTenLop;
        List<SinhVien> lDSSV;

        //Properties
        public string TenLop
        {
            get { return this.sTenLop; }
            set { this.sTenLop = value; }
        }

        public List<SinhVien> DSSV
        {
            get { return this.lDSSV; }
            set { this.lDSSV = value; }
        }

        //Constuctors
        public Lop()
        {
            this.lDSSV = new List<SinhVien>();
        }

        public Lop(string TenLop, List<SinhVien> DSSV)
        {
            this.sTenLop = TenLop;
            this.lDSSV = DSSV;
        }

        //Destructors
        ~Lop()
        { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap ten lop: ");
            this.sTenLop = Console.ReadLine();

            int soSV = 0;
            Console.WriteLine("Nhap so sinh vien cua lop: ");
            soSV = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Nhap thong tin sinh vien: ");
            for (int i = 0; i<soSV; i++)
            {
                SinhVien sv = new SinhVien();
                sv.Nhap();
                this.lDSSV.Add(sv);
            }
        }

        public void Nhap(string TenLop, List<SinhVien> DSSV)
        {
            this.sTenLop = TenLop;
            this.lDSSV = DSSV;
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine("Ten lop: " + this.sTenLop);
            Console.WriteLine("Danh sach sinh vien: ");
            for (int i= 0; i<lDSSV.Count; i++)
            {
                this.lDSSV[i].Xuat();
            }
        }

        //Ham tinh toan
        public void TinhDiemTB()
        {
            for (int i = 0; i < this.lDSSV.Count; i++)
            {
                this.lDSSV[i].TinhDiemTB();
            }
        }

        public SinhVien TimSVDiemCaoNhat()
        {
            SinhVien sv = this.lDSSV[0];
            for(int i= 1; i < this.lDSSV.Count; i++)
            {
                if(this.lDSSV[i].DiemTB > sv.DiemTB)
                {
                    sv = this.lDSSV[i];
                }
            }
            return sv;
        }
    }
}
