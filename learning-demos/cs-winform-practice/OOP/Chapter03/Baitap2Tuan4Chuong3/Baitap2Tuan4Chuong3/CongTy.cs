using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap2Tuan4Chuong3
{
    internal class CongTy
    {
        //Fields
        string sTenCT;
        List<Phong> lDSP;
        NhanVien nvGiamDoc;
        NhanVien nvPhoGiamDoc;

        //Properties
        public string TenCT
        {
            get { return this.sTenCT; }
            set { this.sTenCT = value; }
        }

        public List<Phong> DSP
        {
            get { return this.lDSP; }
            set { this.lDSP = value; }
        }

        public NhanVien GiamDoc
        {
            get { return this.nvGiamDoc; }
            set { this.nvGiamDoc = value; }
        }

        public NhanVien PhoGiamDoc
        {
            get { return this.nvPhoGiamDoc; }
            set { this.nvPhoGiamDoc = value; }
        }

        //Constructors
        public CongTy()
        {
            this.lDSP = new List<Phong>();
        }

        public CongTy(string TenCT, List<Phong> DSP, NhanVien GiamDoc, NhanVien PhoGiamDoc)
        {
            this.sTenCT = TenCT;
            this.lDSP = DSP;
            this.nvGiamDoc = GiamDoc;
            this.nvPhoGiamDoc = PhoGiamDoc;
        }

        //Destructors
        ~CongTy()
        { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap ten cong ty: ");
            this.sTenCT = Console.ReadLine();
            Console.WriteLine("Nhap so phong: ");
            int soP = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap thong tin phong: ");
            for (int i=0;i<soP;i++)
            {
                Phong p = new Phong();
                p.Nhap();
                this.lDSP.Add(p);
            }
            Console.WriteLine("Nhap thong tin giam doc: ");
            this.nvGiamDoc.Nhap();
            Console.WriteLine("Nhap thong tin pho giam doc: ");
            this.nvPhoGiamDoc.Nhap();
        }

        public void Nhap(string TenCT, List<Phong> DSP, NhanVien GiamDoc, NhanVien PhoGiamDoc)
        {
            this.sTenCT = TenCT;
            this.lDSP = DSP;
            this.nvGiamDoc = GiamDoc;
            this.nvPhoGiamDoc = PhoGiamDoc;
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine("Ten cong ty: " + this.sTenCT);
            Console.WriteLine("\nDanh sach phong: ");
            for (int i = 0; i < this.lDSP.Count; i++)
            {
                lDSP[i].Xuat();
            }
            Console.WriteLine("\nGiam doc: ");
            this.nvGiamDoc.Xuat();
            Console.WriteLine("\nPho giam doc: ");
            this.nvPhoGiamDoc.Xuat();
        }

        public void TinhLuongNV()
        {
            for (int i = 0; i < this.lDSP.Count; i++)
            {
                this.lDSP[i].TinhLuongNV();
            }
        }

        public NhanVien TimNVNgayCongCaoNhat()
        {
            NhanVien nvmax = this.lDSP[0].TimNVNgayCongCaoNhat();
            for (int i = 1; i < this.lDSP.Count; i++)
            {
                NhanVien tmp = this.lDSP[i].TimNVNgayCongCaoNhat();
                if(nvmax.SoNgayCong < tmp.SoNgayCong)
                    nvmax = tmp;
            }
            return nvmax;
        }

        public double TongLuong()
        {
            double tong = 0;
            for (int i = 0; i < this.lDSP.Count; i++)
            {
                tong += this.lDSP[i].TongLuong();
            }
            return tong;
        }

        public Phong SapXepNVTheoLuong()
        {
            Phong sx = new Phong();
            for (int i = 0; i < this.lDSP.Count; i++)
            {
                this.lDSP[i].SapXepNVTheoLuong();
                sx.DSNV.AddRange(this.lDSP[i].DSNV);
            }
            sx.SapXepNVTheoLuong();
            return sx;
        }

        public List<NhanVien> DanhSachNVKhongDu30Ngay()
        {
            List<NhanVien> DS = new List<NhanVien>();

            for (int i = 0; i < this.lDSP.Count; i++)
            {
                DS.AddRange(lDSP[i].DanhSachNVKhongDu30Ngay());
            }
            return DS;
        }
    }
}
