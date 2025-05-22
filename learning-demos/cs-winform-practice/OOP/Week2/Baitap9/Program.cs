using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap9
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Nhap n: ");
            int n = Convert.ToInt32(Console.ReadLine());
            int[] A = new int[n];

            Console.WriteLine("Nhap danh sach cac so nguyen: ");
            for (int i = 0; i < A.Length; i++)
            {
                A[i] = Convert.ToInt32(Console.ReadLine());
            }

            Console.WriteLine("Nhap x: ");
            int x = Convert.ToInt32(Console.ReadLine());

            int co = 0;
            for(int i = 0; i < n; i++)
            {
                if (A[i] == x)
                    co = 1;
            }

            if (co == 1)
                Console.WriteLine("Co X");
            else
                Console.WriteLine("Khong co X");
        }
    }
}
