using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Baitap2Tuan4Chuong3
{
    internal class Phong
    {
        //Fields
        string sTenPhong;
        NhanVien nvTruongPhong;
        List<NhanVien> lDSNV;

        //Properties
        public string TenPhong
        {
            get { return this.sTenPhong; }
            set { this.sTenPhong = value; }
        }

        public NhanVien TruongPhong
        {
            get { return this.nvTruongPhong; }
            set { this.nvTruongPhong = value; }
        }

        public List<NhanVien> DSNV
        {
            get { return this.lDSNV; }
            set { this.lDSNV = value; }
        }

        //Constructors
        public Phong()
        {
            this.lDSNV = new List<NhanVien>();
        }

        //Destructors
        ~Phong()
        { }

        public Phong(string TenPhong, NhanVien TruongPhong, List<NhanVien> DSNV)
        {
            this.sTenPhong = TenPhong;
            this.nvTruongPhong = TruongPhong;
            this.lDSNV = DSNV;
        }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap ten phong: ");
            this.sTenPhong = Console.ReadLine();
            Console.WriteLine("Nhap thong tin truong phong: ");
            this.nvTruongPhong.Nhap();

            int sonv = 0;
            Console.WriteLine("Nhap so luong nhan vien: ");
            sonv = Convert.ToInt32(Console.ReadLine());

            for(int i=0;i<sonv;i++)
            {
                NhanVien nv = new NhanVien();
                nv.Nhap();
                this.lDSNV.Add(nv);
            }
        }

        public void Nhap(string TenPhong, NhanVien TruongPhong, List<NhanVien> DSNV)
        {
            this.sTenPhong = TenPhong;
            this.nvTruongPhong = TruongPhong;
            this.lDSNV = DSNV;
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine("\nTen phong: " + this.sTenPhong);
            Console.WriteLine("\nTruong phong: ");
            this.nvTruongPhong.Xuat();
            Console.WriteLine("\nDanh sach nhan vien: ");
            for(int i=0;i<this.lDSNV.Count;i++)
            {
                lDSNV[i].Xuat();
            }
        }

        public void Xuat(List<NhanVien> DSNV)
        {
            Console.WriteLine("\nDanh sach nhan vien: ");
            for (int i = 0; i < DSNV.Count; i++)
            {
                DSNV[i].Xuat();
            }
        }

        public NhanVien TimNVNgayCongCaoNhat()
        {
            NhanVien nv = this.lDSNV[0];
            for(int i=1;i<this.lDSNV.Count;i++)
            {
                if (this.lDSNV[i].SoNgayCong > nv.SoNgayCong)
                    nv = this.lDSNV[i];
            }
            return nv;
        }

        public void TinhLuongNV()
        {
            for(int i=0;i<this.lDSNV.Count;i++)
            {
                this.lDSNV[i].TinhLuongNV();
            }
        }

        public void SapXepNVTheoLuong()
        {

            for (int i = 0; i < this.lDSNV.Count - 1; i++)
            {
                for (int j = i + 1; j < this.lDSNV.Count; j++)
                {
                    if (this.lDSNV[i].LuongChinhThuc < this.lDSNV[j].LuongChinhThuc)
                    {
                        NhanVien tmp = new NhanVien();
                        tmp = this.lDSNV[i];
                        this.lDSNV[i] = this.lDSNV[j];
                        this.lDSNV[j] = tmp;
                    }
                }
            }
        }
        
        public List<NhanVien> DanhSachNVKhongDu30Ngay()
        {
            List<NhanVien> DS = new List<NhanVien>();

            for(int i=0;i<this.lDSNV.Count;i++)
            {
                if (this.lDSNV[i].SoNgayCong < 30)
                {
                    DS.Add(this.lDSNV[i]);
                }
            }
            return DS;
        }

        public double TongLuong()
        {
            double tong = 0;
            for(int i=0;i<lDSNV.Count;i++)
            {
                tong += lDSNV[i].LuongChinhThuc;
            }
            return tong;
        }
    }
}
