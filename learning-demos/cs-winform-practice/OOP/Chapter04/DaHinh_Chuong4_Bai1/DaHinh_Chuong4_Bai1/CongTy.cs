using Baitap01Chuong04;
using BaitapChuong04;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai1
{
    internal static class CongTy
    {
        //Fields
        static string sTenCT;
        static List<NhanVien> lNV;

        //Properties
        public static string TenCT
        {
            get { return CongTy.sTenCT; }
            set { CongTy.sTenCT = value; }
        }

        public static List<NhanVien> DSNV
        {
            get { return CongTy.lNV; }
            set { CongTy.lNV = value; }
        }

        //Input
        public static void Nhap()
        {
            Console.WriteLine("Nhap ten cong ty: ");
            CongTy.sTenCT = Console.ReadLine();

            Console.WriteLine("Nhap so luong nhan vien ke toan: ");
            int soKT = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soKT; i++)
            {
                NVKeToan nvkt = new NVKeToan();
                nvkt.Nhap();
                CongTy.lNV.Add(nvkt);
            }

            Console.WriteLine("Nhap so luong nhan vien kinh doanh: ");
            int soKD = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soKD; i++)
            {
                NVKinhDoanh nvkd = new NVKinhDoanh();
                nvkd.Nhap();
                CongTy.lNV.Add(nvkd);
            }

            Console.WriteLine("Nhap so luong nhan vien bao ve: ");
            int soBV = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soBV; i++)
            {
                NVBaoVe nvbv = new NVBaoVe();
                nvbv.Nhap();
                CongTy.lNV.Add(nvbv);
            }
        }

        //Output
        public static void Xuat()
        {
            Console.WriteLine("Ten cong ty: " + CongTy.TenCT);

            Console.WriteLine("\nDanh sach nhan vien: ");
            for (int i = 0; i < lNV.Count(); i++)
            {
                lNV[i].Xuat();
            }
        }

        //Cals
        public static void TinhLuong()
        {
            for (int i = 0; i < lNV.Count(); i++)
            {
                lNV[i].TinhLuong();
            }
        }

        //Methods
        public static void SapXepNVTheoLuong()
        {
            for (int i = 0; i < CongTy.lNV.Count - 1; i++)
            {
                for (int j = i + 1; j < CongTy.lNV.Count; j++)
                {
                    if (CongTy.lNV[j].LuongChinhThuc < CongTy.lNV[i].LuongChinhThuc)
                    {
                        NhanVien tmp = CongTy.lNV[j];
                        CongTy.lNV[j] = CongTy.lNV[i];
                        CongTy.lNV[i] = tmp;
                    }
                }
            }
        }

        public static NhanVien TimTheoNVTheoTen(string TenNV)
        {
            for (int i = 0; i < CongTy.lNV.Count; i++)
            {
                if (CongTy.lNV[i].TenNV == TenNV)
                    return CongTy.lNV[i];
            }
            return null;
        }

        public static List<NhanVien> TimNVLuongCaoNhat()
        {
            List<NhanVien> nvmax = new List<NhanVien>();
            double luongmax = CongTy.lNV[0].LuongChinhThuc;
            for (int i = 1; i < CongTy.lNV.Count; i++)
            {
                if (CongTy.lNV[i].LuongChinhThuc > luongmax)
                    luongmax = CongTy.lNV[i].LuongChinhThuc;
            }

            for (int i = 0; i < CongTy.lNV.Count; i++)
            {
                if (CongTy.lNV[i].LuongChinhThuc == luongmax)
                    nvmax.Add(CongTy.lNV[i]);
            }
            return nvmax;
        }
    }
}
