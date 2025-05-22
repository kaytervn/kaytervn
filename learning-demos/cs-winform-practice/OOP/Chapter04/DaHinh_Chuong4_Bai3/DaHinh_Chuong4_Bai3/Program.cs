using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                TiVi tv1 = new TiVi("TV01", "LG Smart Tivi", "Den", 20990000, 55);
                TiVi tv2 = new TiVi("TV02", "Sony Google Tivi", "Den", 16900000, 50);

                DienThoai dt1 = new DienThoai("DT01", "Sangsung Galaxy A04s", "Hong", 3290000, 68);
                DienThoai dt2 = new DienThoai("DT02", "Iphone 14 Pro Max", "Tim", 32990000, 128);

                MayLanh ml1 = new MayLanh("ML01", "Daikin Inverter", "Trang", 16490000, 1.5);
                MayLanh ml2 = new MayLanh("ML02", "Sharp Inverter", "Trang", 9590000, 1.5);

                List<SanPham> dssp = new List<SanPham>();

                dssp.Add(tv1);
                dssp.Add(tv2);

                dssp.Add(dt1);
                dssp.Add(dt2);

                dssp.Add(ml1);
                dssp.Add(ml2);

                CongTy.TenCT = "TNHH Mot Thanh Vien";
                CongTy.DSSP = dssp;

                CongTy.TinhGia();
                CongTy.Xuat();

                Console.WriteLine("\nSap xep san pham trong cong ty theo gia: ");
                CongTy.SapXepTheoGia();
                CongTy.Xuat();

                Console.WriteLine("\nTim san pham co ten la 'Sangsung Galaxy A04s' trong cong ty: ");
                SanPham findsp1 = CongTy.TimTheoSPTheoTen("Sangsung Galaxy A04s");
                findsp1.Xuat();

                Console.WriteLine("\nTim nhung san pham co gia ban cao nhat trong cong ty: ");
                List<SanPham> findsp2 = CongTy.TimSPGiaCaoNhat();
                for (int i = 0; i < findsp2.Count; i++)
                {
                    findsp2[i].Xuat();
                }
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
