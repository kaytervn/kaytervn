using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BaiTapTuan03
{
    internal class Truong
    {
        //Fields
        string sTenTruong;
        List<Khoa> lDSK;

        //Properties
        public string TenTruong
        {
            get { return this.sTenTruong; }
            set { this.sTenTruong = value; }
        }

        public List<Khoa> DSK
        {
            get { return this.lDSK; }
            set { this.lDSK = value; }
        }

        //Constructors
        public Truong()
        {
            this.lDSK = new List<Khoa>();
        }

        public Truong(string TenTruong, List<Khoa> DSK)
        {
            this.sTenTruong = TenTruong;
            this.lDSK = DSK;
        }

        //Destructors
        ~Truong()
        { }

        //Input
        public void Nhap()
        {
            Console.WriteLine("Nhap ten truong: ");
            this.sTenTruong = Console.ReadLine();

            int soKhoa = 0;
            Console.WriteLine("Nhap so khoa cua truong: ");
            soKhoa = Convert.ToInt32(Console.ReadLine());

            Console.WriteLine("Nhap thong tin khoa: ");
            for (int i = 0; i < soKhoa; i++)
            {
                Khoa k = new Khoa();
                k.Nhap();
                this.lDSK.Add(k);
            }
        }

        public void Nhap(string TenTruong, List<Khoa> DSK)
        {
            this.sTenTruong = TenTruong;
            this.lDSK = DSK;
        }

        //Output
        public void Xuat()
        {
            Console.WriteLine("Ten truong: " + this.sTenTruong);
            Console.WriteLine("Danh sach khoa: ");
            for (int i = 0; i < lDSK.Count; i++)
            {
                this.lDSK[i].Xuat();
            }
        }

        public Khoa TimKhoaTheoTen(string TenKhoa)
        {
            for(int i=0;i<this.lDSK.Count;i++)
            {
                if (this.lDSK[i].TenKhoa == TenKhoa)
                    return this.lDSK[i];
            }
            return null;
        }

        public SinhVien TimSVDiemCaoNhat()
        {
            SinhVien svmax = this.lDSK[0].TimSVDiemCaoNhat();
            for (int i = 1; i < this.lDSK.Count; i++)
            {
                SinhVien sv = this.lDSK[i].TimSVDiemCaoNhat();
                if (svmax.DiemTB < sv.DiemTB)
                    svmax = sv;
            }
            return svmax;
        }

        public Lop TimLopDongNhat()
        {
            Lop lpmax = this.lDSK[0].TimLopDongNhat();
            for(int i=1;i < this.lDSK.Count;i++)
            {
                Lop lp = this.lDSK[i].TimLopDongNhat();
                if(lpmax.DSSV.Count < lp.DSSV.Count)
                    lpmax = lp;
            }
            return lpmax;
        }
    }
}
