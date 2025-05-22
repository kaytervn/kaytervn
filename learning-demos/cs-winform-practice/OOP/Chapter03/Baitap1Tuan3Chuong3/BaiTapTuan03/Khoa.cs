using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaiTapTuan03
{
    internal class Khoa
    {
        //Fields
        string sTenKhoa;
        List<Lop> lDSL;

        //Properties
        public string TenKhoa
        {
            get { return this.sTenKhoa; }
            set { this.sTenKhoa = value; }
        }

        public List<Lop> DSL
        {
            get { return this.lDSL; }
            set { this.lDSL = value; }
        }

        //Constructors
        public Khoa()
        {
            this.lDSL = new List<Lop>();
        }

        public Khoa(string TenKhoa, List<Lop> DSL)
        {
            this.sTenKhoa = TenKhoa;
            this.lDSL = DSL;
        }

        //Destructors
        ~Khoa()
        { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap ten khoa: ");
            this.sTenKhoa = Console.ReadLine();

            int soLop = 0;
            Console.WriteLine("Nhap so lop cua khoa: ");
            soLop = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Nhap thong tin lop: ");
            for (int i = 0; i < soLop; i++)
            {
                Lop lp = new Lop();
                lp.Nhap();
                this.lDSL.Add(lp);
            }
        }

        public void Nhap(string TenKhoa, List<Lop> DSL)
        {
            this.sTenKhoa = TenKhoa;
            this.lDSL = DSL;
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine("Ten khoa: " + this.sTenKhoa);
            Console.WriteLine("Danh sach lop: ");
            for (int i = 0; i < lDSL.Count; i++)
            {
                this.lDSL[i].Xuat();
            }
        }

        public SinhVien TimSVDiemCaoNhat()
        {
            SinhVien svmax = this.lDSL[0].TimSVDiemCaoNhat();
            for (int i=1; i< this.lDSL.Count; i++)
            {
                SinhVien sv = this.lDSL[i].TimSVDiemCaoNhat();
                if (svmax.DiemTB < sv.DiemTB)
                    svmax = sv;
            }
            return svmax;
        }

        public Lop TimLopTheoTen(string TenLop)
        {
            for(int i=0;i< this.lDSL.Count;i++)
            {
                if (this.lDSL[i].TenLop == TenLop)
                    return this.lDSL[i];
            }
            return null;
        }

        public Lop TimLopDongNhat()
        {
            Lop lpmax = this.lDSL[0];
            for (int i = 0; i < this.lDSL.Count; i++)
            {
                Lop lp = this.lDSL[i];
                if (lpmax.DSSV.Count < lp.DSSV.Count)
                    lpmax = lp;
            }
            return lpmax;
        }
    }
}
