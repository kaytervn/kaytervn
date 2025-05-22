using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Tuan1_KienDucTrong21110332
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                HinhHoc d1 = new Diem(1, 2);
                HinhHoc d2 = new Diem(1, 2);
                HinhHoc.XetViTriTuongDoi(d1, d2);

                HinhHoc d3 = new Diem(1, 2);
                HinhHoc d4 = new Diem(-2, 7);
                HinhHoc.XetViTriTuongDoi(d3, d4);

                HinhHoc d5 = new Diem(2.5, 2.5);
                HinhHoc dt5 = new DuongThang(new Diem(0, 0), new Diem(5, 5));
                HinhHoc.XetViTriTuongDoi(d5, dt5);

                HinhHoc d6 = new Diem(2, -6);
                HinhHoc dt6 = new DuongThang(new Diem(3, 5), new Diem(5, 4));
                HinhHoc.XetViTriTuongDoi(d6, dt6);

                HinhHoc d7 = new Diem(3, 4);
                HinhHoc ht14 = new HinhTron(new Diem(0, 0), 5);
                HinhHoc.XetViTriTuongDoi(d7, ht14);

                HinhHoc d8 = new Diem(2, 2);
                HinhHoc ht15 = new HinhTron(new Diem(0, 0), 3);
                HinhHoc.XetViTriTuongDoi(d8, ht15);

                HinhHoc d9 = new Diem(6, 8);
                HinhHoc ht16 = new HinhTron(new Diem(0, 0), 5);
                HinhHoc.XetViTriTuongDoi(d9, ht16);

                HinhHoc dt1 = new DuongThang(new Diem(1, 1), new Diem(3, 3));
                HinhHoc dt2 = new DuongThang(new Diem(1, 2), new Diem(3, 4));
                HinhHoc.XetViTriTuongDoi(dt1, dt2);

                HinhHoc dt7 = new DuongThang(new Diem(1, 1), new Diem(3, 3));
                HinhHoc dt8 = new DuongThang(new Diem(4, 4), new Diem(2, 2));
                HinhHoc.XetViTriTuongDoi(dt7, dt8);

                HinhHoc dt3 = new DuongThang(new Diem(1, 1), new Diem(3, 3));
                HinhHoc dt4 = new DuongThang(new Diem(1, 3), new Diem(3, 1));
                HinhHoc.XetViTriTuongDoi(dt3, dt4);

                HinhHoc dt9 = new DuongThang(new Diem(0, 8), new Diem(4, 8));
                HinhHoc ht17 = new HinhTron(new Diem(0, 0), 5);
                HinhHoc.XetViTriTuongDoi(dt9, ht17);

                HinhHoc dt10 = new DuongThang(new Diem(0, 5), new Diem(4, 5));
                HinhHoc ht18 = new HinhTron(new Diem(0, 0), 5);
                HinhHoc.XetViTriTuongDoi(dt10, ht18);

                HinhHoc dt11 = new DuongThang(new Diem(0, 4), new Diem(2, 4));
                HinhHoc ht19 = new HinhTron(new Diem(0, 0), 5);
                HinhHoc.XetViTriTuongDoi(dt11, ht19);

                HinhHoc ht1 = new HinhTron(new Diem(0, 0), 2);
                HinhHoc ht2 = new HinhTron(new Diem(3, 0), 2);
                HinhHoc.XetViTriTuongDoi(ht1, ht2);

                HinhHoc ht4 = new HinhTron(new Diem(1, 2), 3);
                HinhHoc ht5 = new HinhTron(new Diem(1, 2), 3);
                HinhHoc.XetViTriTuongDoi(ht4, ht5);

                HinhHoc ht6 = new HinhTron(new Diem(0, 0), 2);
                HinhHoc ht7 = new HinhTron(new Diem(4, 0), 2);
                HinhHoc.XetViTriTuongDoi(ht6, ht7);

                HinhHoc ht8 = new HinhTron(new Diem(0, 0), 2);
                HinhHoc ht9 = new HinhTron(new Diem(1, 0), 1);
                HinhHoc.XetViTriTuongDoi(ht8, ht9);

                HinhHoc ht10 = new HinhTron(new Diem(0, 0), 2);
                HinhHoc ht11 = new HinhTron(new Diem(5, 0), 1);
                HinhHoc.XetViTriTuongDoi(ht10, ht11);

                HinhHoc ht12 = new HinhTron(new Diem(0, 0), 4);
                HinhHoc ht13 = new HinhTron(new Diem(2, 0), 1);
                HinhHoc.XetViTriTuongDoi(ht12, ht13);

                HinhHoc d10 = new Diem(6, 0);
                HinhHoc tg1 = new HinhTamGiac(new Diem(0, 0), new Diem(4, 0), new Diem(2, 3));
                HinhHoc.XetViTriTuongDoi(d10, tg1);

                HinhHoc.XetViTriTuongDoi(new Diem(2, 0),
                                        new HinhTamGiac(new Diem(0, 0), new Diem(4, 0), new Diem(2, 3)));

                HinhHoc.XetViTriTuongDoi(new DuongThang(new Diem(1, 2), new Diem(4, 2)),
                                        new HinhTamGiac(new Diem(5, 6), new Diem(7, 6), new Diem(9, 10)));

                HinhHoc.XetViTriTuongDoi(new DuongThang(new Diem(0, 10), new Diem(11, 10)),
                                        new HinhTamGiac(new Diem(5, 6), new Diem(7, 6), new Diem(9, 10)));

                HinhHoc.XetViTriTuongDoi(new DuongThang(new Diem(0, 8), new Diem(11, 8)),
                                        new HinhTamGiac(new Diem(5, 6), new Diem(7, 6), new Diem(6, 10)));

                HinhHoc.XetViTriTuongDoi(new DuongThang(new Diem(5, 6), new Diem(7, 6)),
                                        new HinhTamGiac(new Diem(5, 6), new Diem(7, 6), new Diem(6, 10)));

                HinhHoc.XetViTriTuongDoi(new HinhTron(new Diem(0, 0), 5),
                                        new HinhTamGiac(new Diem(4, 4), new Diem(7, 4), new Diem(6, 6)));

                HinhHoc.XetViTriTuongDoi(new Diem(1, 1),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));
                
                HinhHoc.XetViTriTuongDoi(new Diem(1, 2),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));

                HinhHoc.XetViTriTuongDoi(new Diem(4, 4),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));

                HinhHoc.XetViTriTuongDoi(new DuongThang(new Diem(-2, 2), new Diem(4, 2)),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));

                HinhHoc.XetViTriTuongDoi(new DuongThang(new Diem(-2, 1), new Diem(4, 1)),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));

                HinhHoc.XetViTriTuongDoi(new DuongThang(new Diem(-2, 4), new Diem(6, 4)),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));

                HinhHoc.XetViTriTuongDoi(new HinhTron(new Diem(1, 1), 1),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));

                HinhHoc.XetViTriTuongDoi(new HinhTron(new Diem(0, 0), 1),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));

                HinhHoc.XetViTriTuongDoi(new HinhTron(new Diem(8, 8), 3),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));

                HinhHoc.XetViTriTuongDoi(new HinhTron(new Diem(3, 1), 1),
                                        new HinhVuong(new Diem(0, 2), new Diem(2, 2), new Diem(2, 0), new Diem(0, 0)));

                HinhHoc.XetViTriTuongDoi(new HinhTamGiac(new Diem(2, 2), new Diem(4, 2), new Diem(2, 4)),
                                        new HinhVuong(new Diem(0, 6), new Diem(6, 6), new Diem(6, 0), new Diem(0, 0)));

                

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
