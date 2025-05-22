using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap2Tuan4Chuong3
{
    internal static class CongTy
    {
        //Fields
        static string sTenCT;
        static List<Phong> lDSP;
        static NhanVien nvGiamDoc;
        static NhanVien nvPhoGiamDoc;

        //Properties
        public static string TenCT
        {
            get { return CongTy.sTenCT; }
            set { CongTy.sTenCT = value; }
        }

        public static List<Phong> DSP
        {
            get { return CongTy.lDSP; }
            set { CongTy.lDSP = value; }
        }

        public static NhanVien GiamDoc
        {
            get { return CongTy.nvGiamDoc; }
            set { CongTy.nvGiamDoc = value; }
        }

        public static NhanVien PhoGiamDoc
        {
            get { return CongTy.nvPhoGiamDoc; }
            set { CongTy.nvPhoGiamDoc = value; }
        }

        //Input
        public static void Nhap()
        {
            Console.WriteLine("Nhap ten cong ty: ");
            CongTy.sTenCT = Console.ReadLine();
            Console.WriteLine("Nhap so phong: ");
            int soP = Convert.ToInt32(Console.ReadLine());
            Console.WriteLine("Nhap thong tin phong: ");
            for (int i=0;i<soP;i++)
            {
                Phong p = new Phong();
                p.Nhap();
                CongTy.lDSP.Add(p);
            }
            Console.WriteLine("Nhap thong tin giam doc: ");
            CongTy.nvGiamDoc.Nhap();
            Console.WriteLine("Nhap thong tin pho giam doc: ");
            CongTy.nvPhoGiamDoc.Nhap();
        }

        public static void Nhap(string TenCT, List<Phong> DSP, NhanVien GiamDoc, NhanVien PhoGiamDoc)
        {
            CongTy.sTenCT = TenCT;
            CongTy.lDSP = DSP;
            CongTy.nvGiamDoc = GiamDoc;
            CongTy.nvPhoGiamDoc = PhoGiamDoc;
        }

        //Output
        public static void Xuat()
        {
            Console.WriteLine("Ten cong ty: " + CongTy.sTenCT);
            Console.WriteLine("\nDanh sach phong: ");
            for (int i = 0; i < CongTy.lDSP.Count; i++)
            {
                lDSP[i].Xuat();
            }
            Console.WriteLine("\nGiam doc: ");
            CongTy.nvGiamDoc.Xuat();
            Console.WriteLine("\nPho giam doc: ");
            CongTy.nvPhoGiamDoc.Xuat();
        }

        public static void TinhLuongNV()
        {
            for (int i = 0; i < CongTy.lDSP.Count; i++)
            {
                CongTy.lDSP[i].TinhLuongNV();
            }
        }

        public static NhanVien TimNVNgayCongCaoNhat()
        {
            NhanVien nvmax = CongTy.lDSP[0].TimNVNgayCongCaoNhat();
            for (int i = 1; i < CongTy.lDSP.Count; i++)
            {
                NhanVien tmp = CongTy.lDSP[i].TimNVNgayCongCaoNhat();
                if(nvmax.SoNgayCong < tmp.SoNgayCong)
                    nvmax = tmp;
            }
            return nvmax;
        }

        public static double TongLuong()
        {
            double tong = 0;
            for (int i = 0; i < CongTy.lDSP.Count; i++)
            {
                tong += CongTy.lDSP[i].TongLuong();
            }
            return tong;
        }

        public static Phong SapXepNVTheoLuong()
        {
            Phong sx = new Phong();
            for (int i = 0; i < CongTy.lDSP.Count; i++)
            {
                CongTy.lDSP[i].SapXepNVTheoLuong();
                sx.DSNV.AddRange(CongTy.lDSP[i].DSNV);
            }
            sx.SapXepNVTheoLuong();
            return sx;
        }

        public static List<NhanVien> DanhSachNVKhongDu30Ngay()
        {
            List<NhanVien> DS = new List<NhanVien>();

            for (int i = 0; i < CongTy.lDSP.Count; i++)
            {
                DS.AddRange(lDSP[i].DanhSachNVKhongDu30Ngay());
            }
            return DS;
        }
    }
}
