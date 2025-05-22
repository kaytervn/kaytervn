using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap5
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

            Console.WriteLine(MinDuong(A, n));

        }

        static int MinDuong(int[] A, int n)
        {
            int md =-1;
            for (int i = 0; i < A.Length; i++)
            {
                if (A[i] > 0)
                {
                    md = A[i];
                    break;
                }
            }    
            for (int i = 0; i < A.Length; i++)
            {
                if (A[i]>0 && A[i] < md)
                {
                    md = A[i];
                }
            }

            return md;
        }
    }
}
