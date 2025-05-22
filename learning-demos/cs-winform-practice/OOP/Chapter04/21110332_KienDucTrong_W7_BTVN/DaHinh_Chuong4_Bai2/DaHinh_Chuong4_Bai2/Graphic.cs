using KeThua_Chuong4_Bai2;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DaHinh_Chuong4_Bai2
{
    internal static class Graphic
    {
        //Fields
        static List<Hinh> lH;

        //Properties
        public static List<Hinh> DSH
        {
            set { Graphic.lH = value; }
            get { return Graphic.lH; }
        }

        //Input
        public static void Nhap()
        {
            Console.WriteLine("Nhap so luong doan thang: ");
            int soDT = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soDT; i++)
            {
                DoanThang dt = new DoanThang();
                dt.Nhap();
                Graphic.lH.Add(dt);
            }

            Console.WriteLine("Nhap so luong hinh chu nhat: ");
            int SoHCN = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < SoHCN; i++)
            {
                HinhChuNhat hcn = new HinhChuNhat();
                hcn.Nhap();
                Graphic.lH.Add(hcn);
            }

            Console.WriteLine("Nhap so luong hinh tam giac: ");
            int soTG = Convert.ToInt32(Console.ReadLine());
            for (int i = 0; i < soTG; i++)
            {
                HinhTamGiac tg = new HinhTamGiac();
                tg.Nhap();
                Graphic.lH.Add(tg);
            }
        }

        //Output
        public static void Xuat()
        {
            Console.WriteLine("\nDanh sach cac hinh: ");
            for (int i = 0; i < Graphic.lH.Count; i++)
            {
                Console.WriteLine($"\nHinh thu {i + 1}:");
                Graphic.lH[i].Xuat();
            }
        }

        //Methods
        public static void Ve()
        {
            Console.WriteLine("\nVe cac hinh: ");
            for (int i = 0; i < Graphic.lH.Count; i++)
            {
                Graphic.lH[i].Ve();
            }
        }

        public static void TinhKichThuoc()
        {
            for (int i = 0; i < Graphic.lH.Count; i++)
            {
                Graphic.lH[i].TinhKichThuoc();
            }
        }
    }
}
