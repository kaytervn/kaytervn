using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaiTapTuan03
{
    internal class SinhVien
    {
        //Fields
        string sTenSV;
        string sMSSV;
        List<MonHoc> lDSMH;
        List<double> lDSD;
        double dDiemTB;

        //Properties
        public string TenSV
        {
            get { return this.sTenSV; }
            set { sTenSV = value; }
        }

        public string MSSV
        {
            get { return this.sMSSV; }
            set { sMSSV = value; }
        }

        public List<MonHoc> DSMH
        {
            get { return this.lDSMH; }
            set { this.lDSMH = value; }
        }

        public List<double> DSD
        {
            get { return this.lDSD; }
            set { this.lDSD = value; }
        }

        public double DiemTB
        {

            get { return this.dDiemTB; }
        }

        //Constructors
        public SinhVien()
        {
            this.lDSMH = new List<MonHoc> ();
            this.lDSD = new List<double> ();
        }

        public SinhVien(string tenSV, string MSSV, List<MonHoc> DSMH, List<double> DSD)
        {
            this.sTenSV = tenSV;
            this.sMSSV = MSSV;
            this.lDSMH = DSMH;
            this.lDSD = DSD;
        }

        public SinhVien(List<MonHoc> DSMH, List<double> DSD)
        {
            this.lDSMH = DSMH;
            this.lDSD = DSD;
        }

        public SinhVien(string tenSV, string MSSV)
        {
            this.sTenSV = tenSV;
            this.sMSSV = MSSV;
        }

        //Destructors
        ~SinhVien()
        { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap ho ten sinh vien: ");
            this.sTenSV = Console.ReadLine();
            Console.WriteLine("Nhap ma so sinh vien: ");
            this.sMSSV = Console.ReadLine();

            int soMH = 0;
            Console.WriteLine("Nhap so mon hoc da dang ky: ");
            soMH = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Nhap thong tin mon hoc: ");
            for(int i=0 ; i<soMH ; i++)
            {
                MonHoc mh = new MonHoc();
                mh.Nhap();
                Console.WriteLine("Nhap diem: ");
                double d = Convert.ToDouble(Console.ReadLine());
                this.lDSMH.Add(mh);
                this.lDSD.Add(d);
            }
        }

        public void Nhap(string tenSV, string MSSV, List<MonHoc> DSMH, List<double> DSD)
        {
            this.sTenSV = tenSV;
            this.sMSSV = MSSV;
            this.lDSMH = DSMH;
            this.lDSD = DSD;
        }

        public void Nhap(string tenSV, string MSSV)
        {
            this.sTenSV = tenSV;
            this.sMSSV = MSSV;
        }

        public void Nhap(List<MonHoc> DSMH, List<double> DSD)
        {
            this.lDSMH = DSMH;
            this.lDSD = DSD;
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine("Ho ten sinh vien: " + this.sTenSV);
            Console.WriteLine("MSSV: " + this.sMSSV);
            Console.WriteLine("Danh sach cac mon hoc da dang ky: ");
            for (int i = 0; i < this.lDSMH.Count; i++)
            {
                this.lDSMH[i].Xuat();
                Console.WriteLine("Diem: " + this.lDSD[i]);
            }

            Console.WriteLine("Diem trung binh: " + this.dDiemTB);
        }

        //Hàm tính toán
        public void TinhDiemTB()
        {
            double s = 0;
            for (int i = 0; i < this.lDSD.Count; i++)
            {
                s += this.lDSD[i];
            }
            this.dDiemTB = (s / lDSMH.Count);
        }
    }
}
