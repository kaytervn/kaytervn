using Baitap01Chuong04;
using BaitapChuong04;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                NVKeToan nvkt1 = new NVKeToan("Khoa", "0123456789012", 2001, 50000, 20000);
                NVKeToan nvkt2 = new NVKeToan("Trung", "0124456789012", 2002, 32000, 15000);
                NVKeToan nvkt3 = new NVKeToan("Hao", "0125456789012", 1999, 63000, 6000);

                NVKinhDoanh nvkd1 = new NVKinhDoanh("Tri", "0126456789012", 2003, 46000, 2);
                NVKinhDoanh nvkd2 = new NVKinhDoanh("Anh", "0127456789012", 2002, 72000, 3);
                NVKinhDoanh nvkd3 = new NVKinhDoanh("Tuan", "0128456789012", 1998, 81000, 1);

                NVBaoVe nvbv1 = new NVBaoVe("Duc", "0129456789012", 2001, 15000, 4);
                NVBaoVe nvbv2 = new NVBaoVe("Hung", "0127556789012", 1997, 21000, 3);
                NVBaoVe nvbv3 = new NVBaoVe("Dung", "0128656789012", 1999, 25000, 5);

                List<NhanVien> dsnv = new List<NhanVien>();
                dsnv.Add(nvkt1);
                dsnv.Add(nvkt2);
                dsnv.Add(nvkt3);

                dsnv.Add(nvkd1);
                dsnv.Add(nvkd2);
                dsnv.Add(nvkd3);

                dsnv.Add(nvbv1);
                dsnv.Add(nvbv2);
                dsnv.Add(nvbv3);

                CongTy.TenCT = "TNHH G.A.P";
                CongTy.DSNV = dsnv;

                CongTy.TinhLuong();
                CongTy.Xuat();

                Console.WriteLine("\nSap xep nhan vien trong cong ty theo luong: ");
                CongTy.SapXepNVTheoLuong();
                CongTy.Xuat();

                Console.WriteLine("\nTim nhan vien co ten la 'Anh' trong cong ty: ");
                NhanVien findnv1 = CongTy.TimTheoNVTheoTen("Anh");
                findnv1.Xuat();

                Console.WriteLine("\nTim nhung nhan vien co luong cao nhat trong cong ty: ");
                List<NhanVien> findnv2 = CongTy.TimNVLuongCaoNhat();
                for (int i = 0; i < findnv2.Count; i++)
                {
                    findnv2[i].Xuat();
                }
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
