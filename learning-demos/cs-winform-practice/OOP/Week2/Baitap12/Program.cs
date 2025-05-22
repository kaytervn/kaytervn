using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap12
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Nhap n: ");
            int n = Convert.ToInt32(Console.ReadLine());
            int[] A = new int[n];

            Console.WriteLine("Nhap danh sach cac so nguyen: ");
            for (int i = 0; i < A.Length; i++)
            {
                A[i] = Convert.ToInt32(Console.ReadLine());
            }

            if (CheckDuong(A,n) == true)
                Console.WriteLine("Toan so duong");
            else
                Console.WriteLine("Khong toan so duong");
        }

        static bool CheckDuong(int[] A, int n)
        {
            for (int i = 0; i < A.Length; i++)
            {
                if (A[i] < 0)
                    return false;
            }

            return true;
        }
    }
}
