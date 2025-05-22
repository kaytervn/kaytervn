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
        static List<NVKeToan> lNVKT;
        static List<NVKinhDoanh> lNVKD;
        static List<NVBaoVe> lNVBV;

        //Properties
        public static string TenCT
        {
            get { return CongTy.sTenCT; }
            set { CongTy.sTenCT = value; }
        }

        public static List<NVKeToan> NVKT
        {
            get { return CongTy.lNVKT; }
            set { CongTy.lNVKT = value; }
        }

        public static List<NVKinhDoanh> NVKD
        {
            get { return CongTy.lNVKD; }
            set { CongTy.lNVKD = value; }
        }

        public static List<NVBaoVe> NVBV
        {
            get { return CongTy.lNVBV; }
            set { CongTy.lNVBV = value; }
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
                CongTy.lNVKT.Add(nvkt);
            }

            Console.WriteLine("Nhap so luong nhan vien kinh doanh: ");
            int soKD = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soKD; i++)
            {
                NVKinhDoanh nvkd = new NVKinhDoanh();
                nvkd.Nhap();
                CongTy.lNVKD.Add(nvkd);
            }

            Console.WriteLine("Nhap so luong nhan vien bao ve: ");
            int soBV = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soBV; i++)
            {
                NVBaoVe nvbv = new NVBaoVe();
                nvbv.Nhap();
                CongTy.lNVBV.Add(nvbv);
            }
        }

        //Output
        public static void Xuat()
        {
            Console.WriteLine("Ten cong ty: " + CongTy.TenCT);

            Console.WriteLine("\nDanh sach nhan vien ke toan: ");
            for (int i = 0; i < lNVKT.Count(); i++)
            {
                lNVKT[i].Xuat();
            }

            Console.WriteLine("\nDanh sach nhan vien kinh doanh: ");
            for (int i = 0; i < lNVKD.Count(); i++)
            {
                lNVKD[i].Xuat();
            }

            Console.WriteLine("\nDanh sach nhan vien bao ve: ");
            for (int i = 0; i < lNVBV.Count(); i++)
            {
                lNVBV[i].Xuat();
            }
        }

        //Cals
        public static void TinhLuong()
        {
            for (int i = 0; i < lNVKT.Count(); i++)
            {
                lNVKT[i].TinhLuong();
            }

            for (int i = 0; i < lNVKD.Count(); i++)
            {
                lNVKD[i].TinhLuong();
            }

            for (int i = 0; i < lNVBV.Count(); i++)
            {
                lNVBV[i].TinhLuong();
            }
        }
    }
}
