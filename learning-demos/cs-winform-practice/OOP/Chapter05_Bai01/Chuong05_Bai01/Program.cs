using Chuong05_Bai01;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Configuration;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_Bai01
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                
                Diem d1 = new Diem(2, 3);
                Diem d2 = new Diem(6, 7);
                Diem d3 = new Diem(5, 3);
                Diem d4 = new Diem(9, 1);

                DoanThang h1 = new DoanThang(d1, d2);
                DoanThang h2 = new DoanThang(d1, d2);

                HinhChuNhat h3 = new HinhChuNhat(d3, d4);
                HinhChuNhat h4 = new HinhChuNhat(d3, d4);

                HinhTamGiac h5 = new HinhTamGiac(d1, d2);
                HinhTamGiac h6 = new HinhTamGiac(d3, d4);

                HinhTron h7 = new HinhTron(d1, d2);
                HinhTron h8 = new HinhTron(d3, d4);

                Console.WriteLine(h1 == h2);
                h1++;
                h1.Xuat();
                Console.WriteLine();

                Console.WriteLine(h1 == h2);

                Console.WriteLine(h3 != h4);

                Console.WriteLine(h1 != h3);

                Console.WriteLine(h5 > h6);
                

                Ngay d1a = new Ngay(2, 12, 2022);
                Ngay d2a = new Ngay(14, 9, 2022);
                Ngay d3a = new Ngay(1, 1, 2019);
                Ngay d4a = new Ngay(31, 12, 2023);
                Ngay d6a = new Ngay(1, 1, 2024);

                //ThoiGian tg1 = new ThoiGian(14, 25, 31, d1a);
                //ThoiGian tg2 = new ThoiGian(3, 0, 59, d2a);
                //ThoiGian tg3 = new ThoiGian(23, 59, 59, d3a);
                //ThoiGian tg4 = new ThoiGian(0, 0, 0, d4a);
                //ThoiGian tg5 = new ThoiGian(16, 35, 43, d6a);

                //Console.WriteLine(tg1 == tg2);
                //Console.WriteLine(tg2 > tg3);
                //Console.WriteLine(tg3 < tg4);
                //Console.WriteLine(tg4 != tg5);

                //ThoiGian ts = tg1 + 90000;
                //ts.Xuat();

                //ThoiGian ts1 = tg2 - 90000;
                //ts1.Xuat();

                //int nd1 = d1a;
                //Console.WriteLine(nd1);

                //Console.WriteLine(d1a == d2a);
                //Console.WriteLine(d2a > d3a);
                //Console.WriteLine(d3a < d4a);
                //Console.WriteLine(d4a != d6a);

                //d6a++;
                //d6a.Xuat();

                //Ngay d5a = d3a + 1002;
                //d5a.Xuat();

                //d1a++;
                //d1a.Xuat();

                //d2a++;
                //d2a.Xuat();

                //d3a--;
                //d3a.Xuat();

                //d4a++;
                //d4a.Xuat();

                //string s1 = d1a;
                //Console.WriteLine(s1);

                //string s2 = "21/11/2020";
                //Ngay d7 = s2;
                //d7.Xuat();

                //string s3 = tg1;
                //Console.WriteLine(s3);

                //string s4 = "17:25:4\n31/1/2032";
                //ThoiGian d8 = s4;
                //d8.Xuat();

                int d = d1a - d2a;
                Console.Write(d);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
