using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai3
{
    internal static class CongTy
    {
        //Fields
        static string sTenCT;
        static List<SanPham> lSP;

        //Properties
        public static string TenCT
        {
            get { return CongTy.sTenCT; }
            set { CongTy.sTenCT = value; }
        }

        public static List<SanPham> DSSP
        {
            get { return CongTy.lSP; }
            set { CongTy.lSP = value; }
        }

        //Input
        public static void Nhap()
        {
            Console.WriteLine("Nhap ten cong ty: ");
            CongTy.sTenCT = Console.ReadLine();

            Console.WriteLine("Nhap so luong Tivi: ");
            int soTV = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soTV; i++)
            {
                TiVi tv = new TiVi();
                tv.Nhap();
                CongTy.lSP.Add(tv);
            }

            Console.WriteLine("Nhap so luong dien thoai: ");
            int soDT = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soDT; i++)
            {
                DienThoai dt = new DienThoai();
                dt.Nhap();
                CongTy.lSP.Add(dt);
            }

            Console.WriteLine("Nhap so luong may lanh: ");
            int soML = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soML; i++)
            {
                MayLanh ml = new MayLanh();
                ml.Nhap();
                CongTy.lSP.Add(ml);
            }
        }

        //Output
        public static void Xuat()
        {
            Console.WriteLine("Ten cong ty: " + CongTy.TenCT);

            Console.WriteLine("\nDanh sach san pham: ");
            for (int i = 0; i < lSP.Count(); i++)
            {
                lSP[i].Xuat();
            }
        }

        //Methods
        public static void TinhGia()
        {
            for (int i = 0; i < CongTy.lSP.Count(); i++)
            {
                CongTy.lSP[i].TinhGia();
            }
        }

        public static void SapXepTheoGia()
        {
            for (int i = 0; i < CongTy.lSP.Count-1; i++)
            {
                for (int j = i + 1; j < CongTy.lSP.Count; j++)
                {
                    if (CongTy.lSP[j].GiaBan < CongTy.lSP[i].GiaBan)
                    {
                        SanPham tmp = CongTy.lSP[j];
                        CongTy.lSP[j] = CongTy.lSP[i];
                        CongTy.lSP[i] = tmp;
                    }
                }
            }
        }

        public static SanPham TimTheoSPTheoTen(string TenSP)
        {
            for (int i = 0; i < CongTy.lSP.Count; i++)
            {
                if (CongTy.lSP[i].TenSP == TenSP)
                    return CongTy.lSP[i];
            }
            return null;
        }

        public static List<SanPham> TimSPGiaCaoNhat()
        {
            List<SanPham> spmax = new List<SanPham>();
            double giamax = CongTy.lSP[0].GiaBan;
            for (int i = 1; i < CongTy.lSP.Count; i++)
            {
                if (CongTy.lSP[i].GiaBan > giamax)
                    giamax = CongTy.lSP[i].GiaBan;
            }

            for (int i = 0; i < CongTy.lSP.Count; i++)
            {
                if (CongTy.lSP[i].GiaBan == giamax)
                    spmax.Add(CongTy.lSP[i]);
            }
            return spmax;
        }
    }
}
