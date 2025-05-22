using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap3Tuan4Chuong3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                PhanSo a = new PhanSo(314,592);
                PhanSo b = new PhanSo(256,-90);

                a.ToiGian();
                a.Xuat();

                b.ToiGian();
                b.Xuat();

                Console.Write("Tong 2 phan so = ");
                PhanSo Tong = new PhanSo();
                Tong = Tong.Tong2PhanSo(a, b);
                Tong.Xuat();

                Console.Write("Hieu 2 phan so = ");
                PhanSo Hieu = new PhanSo();
                Hieu = Hieu.Hieu2PhanSo(a, b);
                Hieu.Xuat();

                Console.Write("Tich 2 phan so = ");
                PhanSo Tich = new PhanSo();
                Tich = Tich.Tich2PhanSo(a, b);
                Tich.Xuat();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
