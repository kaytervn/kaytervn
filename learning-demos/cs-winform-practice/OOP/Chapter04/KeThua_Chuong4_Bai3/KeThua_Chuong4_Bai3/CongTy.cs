using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai3
{
    internal static class CongTy
    {
        //Fields
        static string sTenCT;
        static List<TiVi> lTV;
        static List<DienThoai> lDT;
        static List<MayLanh> lML;

        //Properties
        public static string TenCT
        {
            get { return CongTy.sTenCT; }
            set { CongTy.sTenCT = value; }
        }

        public static List<TiVi> TV
        {
            get { return CongTy.lTV; }
            set { CongTy.lTV = value; }
        }

        public static List<DienThoai> DT
        {
            get { return CongTy.lDT; }
            set { CongTy.lDT = value; }
        }

        public static List<MayLanh> ML
        {
            get { return CongTy.lML; }
            set { CongTy.lML = value; }
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
                CongTy.lTV.Add(tv);
            }

            Console.WriteLine("Nhap so luong dien thoai: ");
            int soDT = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soDT; i++)
            {
                DienThoai dt = new DienThoai();
                dt.Nhap();
                CongTy.lDT.Add(dt);
            }

            Console.WriteLine("Nhap so luong may lanh: ");
            int soML = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soML; i++)
            {
                MayLanh ml = new MayLanh();
                ml.Nhap();
                CongTy.lML.Add(ml);
            }
        }

        //Output
        public static void Xuat()
        {
            Console.WriteLine("Ten cong ty: " + CongTy.TenCT);

            Console.WriteLine("\nDanh sach Tivi: ");
            for (int i = 0; i < lTV.Count(); i++)
            {
                lTV[i].Xuat();
            }

            Console.WriteLine("\nDanh sach dien thoai: ");
            for (int i = 0; i < lDT.Count(); i++)
            {
                lDT[i].Xuat();
            }

            Console.WriteLine("\nDanh sach may lanh: ");
            for (int i = 0; i < lML.Count(); i++)
            {
                lML[i].Xuat();
            }
        }
    }
}
