using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace KeThua_Chuong4_Bai2
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Diem d1 = new Diem(2, 3);
                Diem d2 = new Diem(7, 4);
                Diem d3 = new Diem(-5, 3);
                Diem d4 = new Diem(9, 0);
                Diem d5 = new Diem(2, -12);
                Diem d6 = new Diem(8, 6);

                DoanThang h1 = new DoanThang(d1, d2);
                h1.Xuat();

                HinhChuNhat h2 = new HinhChuNhat(d3,d4);
                h2.TinhKichThuoc();
                h2.Xuat();

                int dt1 = h2.TinhDienTich();
                Console.WriteLine("\nDien tich hinh chu nhat: " + dt1);

                HinhTamGiac h3 = new HinhTamGiac(d5,d6);
                h3.TinhKichThuoc();
                h3.Xuat();

                int dt2 = h3.TinhDienTich();
                Console.WriteLine("\nDien tich hinh tam giac: " + dt2);

            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
