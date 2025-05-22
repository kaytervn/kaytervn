using Chuong05_BTTL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Chuong05_BTTL
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
                Diem d5 = new Diem(2, 12);
                Diem d6 = new Diem(8, 6);

                Diem d7 = new Diem(3, 7);
                Diem d8 = new Diem(6, 2);
                Diem d9 = new Diem(9, 8);
                Diem d10 = new Diem(5, 4);
                Diem d11 = new Diem(7, 11);
                Diem d12 = new Diem(12, 6);

                DoanThang h1 = new DoanThang(d1, d2,"Do");
                HinhChuNhat h2 = new HinhChuNhat(d3,d4,"Xanh duong");
                HinhTamGiac h3 = new HinhTamGiac(d5, d6,"Vang");

                DoanThang h4 = new DoanThang(d7, d8, "Xanh la");
                HinhChuNhat h5 = new HinhChuNhat(d9, d10, "Hong");
                HinhTamGiac h6 = new HinhTamGiac(d11, d12, "Cam");

                HinhPhucHop hph1 = new HinhPhucHop();

                hph1.Merge(h1);
                hph1.Merge(h2);
                hph1.Merge(h3);

                List<Hinh> lh = new List<Hinh>();
                lh.Add(h4);
                lh.Add(h5);
                lh.Add(h6);

                HinhPhucHop hph2 = new HinhPhucHop(lh);

                hph1.TinhKichThuoc();
                hph1.TimToaDo();
                hph1.TinhDienTich();
                hph1.Xuat();

                Console.WriteLine("\n\tDoi mau Hinh phuc hop sang mau 'Tim': ");
                hph1.DoiMau("Tim");
                hph1.Xuat();

                Diem pos = new Diem(2,2);
                Console.Write("\nDiem tinh tien: ");
                pos.Xuat();

                Console.WriteLine("\n\n\tHinh phuc hop sau khi di chuyen: ");
                hph1.Move(pos);
                hph1.Xuat();

                Console.WriteLine("\n\tHinh phuc hop sau khi tach hinh cuoi cung: ");
                Hinh ht1 = hph1.Divided(hph1);
                hph1.Xuat();

                Console.WriteLine("\n\tHinh da duoc tach: ");
                ht1.Xuat();

                hph1.Merge(h4);
                hph1.Merge(h5);
                hph1.Merge(h6);
                Console.WriteLine("\n\tHinh phuc hop sau gop them 3 hinh nua: ");
                hph1.Xuat();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
