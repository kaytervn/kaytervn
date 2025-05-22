using Baitap3Tuan4Chuong3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap2Tuan5Chuong3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                PhanSo a = new PhanSo(314, 592);
                PhanSo b = new PhanSo(256, -90);

                PhanSo.ToiGian(a);
                a.Xuat();

                PhanSo.ToiGian(b);
                b.Xuat();

                Console.Write("Tong 2 phan so = ");
                PhanSo Tong = new PhanSo();
                Tong = PhanSo.Tong2PhanSo(a, b);
                Tong.Xuat();

                Console.Write("Hieu 2 phan so = ");
                PhanSo Hieu = new PhanSo();
                Hieu = PhanSo.Hieu2PhanSo(a, b);
                Hieu.Xuat();

                Console.Write("Tich 2 phan so = ");
                PhanSo Tich = new PhanSo();
                Tich = PhanSo.Tich2PhanSo(a, b);
                Tich.Xuat();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
