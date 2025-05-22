using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCuaHangTienLoi
{
    public partial class fQLLuong : Form
    {
        NhanVienDAO nhanVienDAO = new NhanVienDAO();
        ChucVuDAO chucVuDAO = new ChucVuDAO();
        TinhLuongDAO tinhLuongDAO = new TinhLuongDAO();

        public fQLLuong()
        {
            InitializeComponent();
        }

        private void fQLLuong_Load(object sender, EventArgs e)
        {
            cbMaNV.DataSource = nhanVienDAO.LayDanhSach();
            cbMaNV.ValueMember = "MaNV";
            cbMaNV.Text = "";

            dtgvTinhLuong.DataSource = tinhLuongDAO.LayDanhSach();
        }

        void LoadThongTinNV(NhanVien nv)
        {
            this.tbTenNV.Text = nv.TenNV;
            this.tbSDT.Text = nv.Sdt;
            this.chbPhai.Checked = nv.Phai;
            this.dtpkNgaySinh.Value = nv.NgaySinh;
            this.tbEmail.Text = nv.Email;

            ChucVu cv = chucVuDAO.LayThongTinChucVuBangMaCV(nv.MaCV);
            this.tbTenCV.Text = cv.TenCV;

            this.chbTrangThai.Checked = nv.TrangThai;
            this.tbTenTK.Text = nv.TenTK;
            this.tbMatKhau.Text = nv.MatKhau;

            if (nv.Hinh != null)
                ptHinh.Image = Image.FromStream(new MemoryStream((nv.Hinh)));
            else
                ptHinh.Image = null;
        }

        void ResetThongTinNV()
        {
            this.tbTenNV.Text = "";
            this.tbSDT.Text = "";
            this.dtpkNgaySinh.Value = DateTime.Today;
            this.tbEmail.Text = "";
            this.tbTenCV.Text = "";
            this.tbTenTK.Text = "";
            this.tbMatKhau.Text = "";
            ptHinh.Image = null;
        }

        private void cbMaNV_TextChanged(object sender, EventArgs e)
        {
            try
            {
                NhanVien nv = nhanVienDAO.LayThongTinNhanVienBangMaNV(cbMaNV.Text);
                if (nv != null)
                {
                    LoadThongTinNV(nv);
                    dtgvTinhLuong.DataSource = tinhLuongDAO.LayDanhSach(nv.MaNV);
                }
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTinNV();
            }
        }

        private void btXemTatCa_Click(object sender, EventArgs e)
        {
            dtgvTinhLuong.DataSource = tinhLuongDAO.LayDanhSach();
            cbMaNV.Text = "";
        }

        private void dtgvTinhLuong_DataSourceChanged(object sender, EventArgs e)
        {
            double tongluong = 0;
            for (int i = 0; i < dtgvTinhLuong.Rows.Count; i++)
            {
                tongluong += (double)dtgvTinhLuong.Rows[i].Cells[2].Value;
            }
            tbTongLuong.Text = tongluong.ToString();
        }
    }
}
