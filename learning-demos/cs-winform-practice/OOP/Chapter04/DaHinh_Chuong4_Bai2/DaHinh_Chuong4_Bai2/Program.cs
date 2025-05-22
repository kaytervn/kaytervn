using DaHinh_Chuong4_Bai2;
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
                Diem d2 = new Diem(6, 7);
                Diem d3 = new Diem(-5, 3);
                Diem d4 = new Diem(9, 0);
                Diem d5 = new Diem(2, -12);
                Diem d6 = new Diem(8, 6);

                DoanThang h1 = new DoanThang(d1, d2);
                HinhChuNhat h2 = new HinhChuNhat(d3,d4);
                HinhTamGiac h3 = new HinhTamGiac(d5, d6);

                List<Hinh> lh = new List<Hinh>();
                lh.Add(h1);
                lh.Add(h2);
                lh.Add(h3);

                Graphic.DSH = lh;
                Graphic.TinhKichThuoc();
                Graphic.Xuat();
                Graphic.Ve();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
