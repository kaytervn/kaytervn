using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaiTapTuan03
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                //Mon Hoc
                MonHoc mon1 = new MonHoc("Toan", "MATH", 3);
                MonHoc mon2 = new MonHoc("Ly", "PHYS", 2);
                MonHoc mon3 = new MonHoc("Hoa", "CHEM", 3);

                //Danh sach mon
                List<MonHoc> DSMH1 = new List<MonHoc>();
                DSMH1.Add(mon1);
                DSMH1.Add(mon2);
                DSMH1.Add(mon3);

                List<MonHoc> DSMH2 = new List<MonHoc>();
                DSMH2.Add(mon1);
                DSMH2.Add(mon3);

                List<MonHoc> DSMH3 = new List<MonHoc>();
                DSMH3.Add(mon1);
                DSMH3.Add(mon2);

                //Danh sach diem
                List<double> DSD1 = new List<double>();
                DSD1.Add(8);
                DSD1.Add(9.5);
                DSD1.Add(4.25);

                List<double> DSD2 = new List<double>();
                DSD2.Add(7);
                DSD2.Add(3.25);

                List<double> DSD3 = new List<double>();
                DSD3.Add(5.62);
                DSD3.Add(4.9);

                //Sinh vien
                SinhVien sv1 = new SinhVien("Nguyen Tran Van Trung", "123", DSMH1, DSD1);
                SinhVien sv2 = new SinhVien("Ao Van Chinh", "234", DSMH2, DSD2);
                SinhVien sv3 = new SinhVien("Mai Quoc Khanh", "567", DSMH3, DSD3);

                //Danh sach lop
                List<SinhVien> DSSV1 = new List<SinhVien>();
                DSSV1.Add(sv1);
                DSSV1.Add(sv2);
                Lop lop1 = new Lop("CL1", DSSV1);

                List<SinhVien> DSSV2 = new List<SinhVien>();
                DSSV2.Add(sv3);
                Lop lop2 = new Lop("CL2", DSSV2);

                //Danh sach khoa
                List<Lop> DSL1 = new List<Lop>();
                DSL1.Add(lop1);
                Khoa k1 = new Khoa("Cong nghe thong tin",DSL1);

                List<Lop> DSL2 = new List<Lop>();
                DSL2.Add(lop2);
                Khoa k2 = new Khoa("Dao tao chat luong cao", DSL2);

                //Truong
                List<Khoa> kt = new List<Khoa>();
                kt.Add(k1);
                kt.Add(k2);
                Truong spkt = new Truong("Su Pham Ky Thuat", kt);

                //Tinh DTB cho tung lop
                lop1.TinhDiemTB();
                lop2.TinhDiemTB();

                //Output
                spkt.Xuat();

                Console.WriteLine("\nSinh vien co diem trung binh cao nhat trong lop");
                SinhVien svmax1 = lop1.TimSVDiemCaoNhat();
                svmax1.Xuat();
                SinhVien svmax2 = lop2.TimSVDiemCaoNhat();
                svmax2.Xuat();

                Console.WriteLine("\nTim lop CL2 trong khoa theo ten");
                Lop findlop = k2.TimLopTheoTen("CL2");
                findlop.Xuat();

                Console.WriteLine("\nTim sinh vien co diem trung binh cao nhat trong khoa");
                SinhVien findsv1 = k1.TimSVDiemCaoNhat();
                findsv1.Xuat();
                SinhVien findsv2 = k2.TimSVDiemCaoNhat();
                findsv2.Xuat();

                Console.WriteLine("\nTim lop co sinh vien dong nhat trong khoa");
                Lop findlop1 = k1.TimLopDongNhat();
                findlop1.Xuat();
                Lop findlop2 = k2.TimLopDongNhat();
                findlop2.Xuat();

                Console.WriteLine("\nTim khoa Cong nghe thong tin trong truong theo ten");
                Khoa findkhoa = spkt.TimKhoaTheoTen("Cong nghe thong tin");
                findkhoa.Xuat();

                Console.WriteLine("\nTim lop co sinh vien dong nhat trong truong");
                Lop flmax = spkt.TimLopDongNhat();
                flmax.Xuat();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
