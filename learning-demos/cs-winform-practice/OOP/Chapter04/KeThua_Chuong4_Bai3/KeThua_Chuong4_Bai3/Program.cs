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

                List<TiVi> DSTV = new List<TiVi>();
                DSTV.Add(tv1);
                DSTV.Add(tv2);

                DienThoai dt1 = new DienThoai("DT01","Sangsung Galaxy A04s","Hong",3290000,68);
                DienThoai dt2 = new DienThoai("DT02", "Iphone 14 Pro Max", "Tim", 32990000, 128);

                List<DienThoai> DSDT = new List<DienThoai>();
                DSDT.Add(dt1);
                DSDT.Add(dt2);

                MayLanh ml1 = new MayLanh("ML01", "Daikin Inverter", "Trang", 16490000, 1.5);
                MayLanh ml2 = new MayLanh("ML02", "Sharp Inverter", "Trang", 9590000, 1.5);

                List<MayLanh> DSML = new List<MayLanh>();
                DSML.Add(ml1);
                DSML.Add(ml2);

                CongTy.TenCT = "TNHH Mot Thanh Vien";
                CongTy.TV = DSTV;
                CongTy.DT = DSDT;
                CongTy.ML = DSML;

                CongTy.Xuat();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
