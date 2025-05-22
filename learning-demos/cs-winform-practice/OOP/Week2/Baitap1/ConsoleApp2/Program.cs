using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Baitap1
{
    class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Nhap n: ");
            int n = Convert.ToInt32(Console.ReadLine());
            int[] A = new int[n];

            Console.WriteLine("Nhap danh sach cac so nguyen: ");
            for (int i=0;i<A.Length;i++)
            {
                A[i] = Convert.ToInt32(Console.ReadLine());
            }
            Console.Write("\n");
            Console.WriteLine("Min= " + Min(A, n));
            Console.Write("\n");
            Console.WriteLine("Max= " + Max(A, n));
            Console.Write("\n");
            soAm(A, n);
            Console.Write("\n");
            DSsnt(A, n);
            Console.Write("\n");
            DSscp(A, n);
        }

        static bool SCP(int n)
        {
            int i = 1;
            while(i*i<=n)
            {
                if (i * i == n)
                    return true;
                i++;
            }
            return false;
        }

        static void soAm(int[] A, int n)
        {
            Console.WriteLine("Danh sach cac so am: ");
            for (int i = 0; i < A.Length; i++)
            {
                if (A[i] < 0)
                {
                    Console.WriteLine(A[i]);
                }
            }
        }

        static void DSscp(int[] A, int n)
        {
            Console.WriteLine("Danh sach cac so chinh phuong: ");
            for (int i = 0; i < A.Length; i++)
            {
                if (SCP(A[i]) == true)
                {
                    Console.WriteLine(A[i]);
                }
            }
        }

        static void DSsnt(int[] A, int n)
        {
            Console.WriteLine("Danh sach cac so nguyen to: ");
            for (int i = 0; i < A.Length; i++)
            {
                if (SNT(A[i]) == true)
                {
                    Console.WriteLine(A[i]);
                }
            }
        }

        static bool SNT(int n)
        {
            if (n < 2)
                return false;

            if (n == 2)
                return true;

            for(int i=1;i<=Math.Sqrt(n);i++)
            {
                if (n % 2 == 0)
                    return false;
            }

            return true;
        }

        static int Min(int[] A, int n)
        {
            int min = A[0];
            for(int i=0;i<A.Length;i++)
            {
                if (A[i]<min)
                {
                    min = A[i];
                }
            }

            return min;
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

        static void xuat(int[] A, int n)
        {
            for(int i=0;i<n;i++)
            {
                Console.Write(A[i] + " ");
            }
        }
    }
}
