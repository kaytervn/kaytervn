using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Schema;

namespace Baitap2Tuan4Chuong3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                //Input Nhan vien
                NhanVien gd = new NhanVien("Khoa", "012345678912", 100700000, 30);
                NhanVien pgd = new NhanVien("Trung", "023445678912", 75000000, 29);
                NhanVien tp1 = new NhanVien("Hung", "034545678912", 32000000, 30);
                NhanVien tp2 = new NhanVien("Dung", "045645678912", 28700000, 27);
                NhanVien nv1 = new NhanVien("Tri", "067845678912", 13500000, 28);
                NhanVien nv2 = new NhanVien("Tai", "078945678912", 12000000, 21);
                NhanVien nv3 = new NhanVien("Anh", "091045678912", 12800000, 29);
                NhanVien nv4 = new NhanVien("Minh", "010245678912", 11500000, 25);

                //Input Phong
                List<NhanVien> lnv1 = new List<NhanVien>();
                lnv1.Add(tp1);
                lnv1.Add(nv1);
                lnv1.Add(nv2);
                Phong p1 = new Phong("Nghien cuu", tp1, lnv1);

                List<NhanVien> lnv2 = new List<NhanVien>();
                lnv2.Add(tp2);
                lnv2.Add(nv3);
                lnv2.Add(nv4);
                Phong p2 = new Phong("Bao cao", tp2, lnv2);

                List<NhanVien> lnv3 = new List<NhanVien>();
                lnv3.Add(gd);
                lnv3.Add(pgd);
                Phong p3 = new Phong("Tong giam doc", gd, lnv3);

                //Input Cong ty
                List<Phong> dsp = new List<Phong>();
                dsp.Add(p1);
                dsp.Add(p2);
                dsp.Add(p3);
                CongTy ct = new CongTy("TNHH G.O.A.T", dsp, gd, pgd);

                //Ban dau
                ct.TinhLuongNV();
                ct.Xuat();
                
                //Phuong thuc Cong ty
                NhanVien nvmaxct = ct.TimNVNgayCongCaoNhat();
                Console.WriteLine("\nNhan vien co so ngay cong cao nhat trong cong ty: ");
                nvmaxct.Xuat();

                double TongLuong = ct.TongLuong();
                Console.WriteLine("\nTong luong nhan vien cua toan cong ty: " + TongLuong + " VND");

                Console.WriteLine("\nSap xep nhan vien theo luong trong cong ty: ");
                Phong sx = new Phong();
                sx = ct.SapXepNVTheoLuong();
                sx.Xuat(sx.DSNV);

                List<NhanVien> lnvct = ct.DanhSachNVKhongDu30Ngay();
                Console.WriteLine("\nDanh sach nhan vien lam khong du 30 ngay trong thang cua cong ty: ");
                for(int i=0;i<lnvct.Count;i++)
                {
                    lnvct[i].Xuat();
                }

                //Phuong thuc Phong
                for (int i=0;i<ct.DSP.Count;i++)
                {
                    NhanVien nvmaxp = ct.DSP[i].TimNVNgayCongCaoNhat();
                    Console.WriteLine($"\nNhan vien co so ngay cong cao nhat trong phong {ct.DSP[i].TenPhong}: ");
                    nvmaxp.Xuat();
                }

                for (int i = 0; i < ct.DSP.Count; i++)
                {
                    Console.WriteLine($"\nSap xep nhan vien theo luong trong phong {ct.DSP[i].TenPhong}: ");
                    Phong sxp = ct.DSP[i];
                    sxp.SapXepNVTheoLuong();
                    sxp.Xuat(sxp.DSNV);
                }
                
                for (int i = 0; i < ct.DSP.Count; i++)
                {
                    Console.WriteLine($"\nDanh sach nhan vien lam khong du 30 ngay trong thang cua phong {ct.DSP[i].TenPhong}: ");
                    List<NhanVien> lnvp = ct.DSP[i].DanhSachNVKhongDu30Ngay();
                    
                    for (int j = 0; j < lnvp.Count; j++)
                    {
                        lnvp[j].Xuat();
                    }
                    
                }
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
