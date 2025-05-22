using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap11
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
            Console.Write("\n");
            Console.WriteLine("Max = " + Max(A, n));
            Console.Write("\n");
            Console.WriteLine("Tong duong = " + tongDuong(A, n));
        }

        static int tongDuong(int[] A, int n)
        {
            int s = 0;
            for (int i = 0; i < A.Length; i++)
            {
                if (A[i] > 0)
                {
                    s += A[i];
                }
            }

            return s;
        }

        static int Max(int[] A, int n)
        {
            int max = A[0];
            for (int i = 0; i < A.Length; i++)
            {
                if (A[i] > max)
                {
                    max = A[i];
                }
            }

            return max;
        }
    }
}
