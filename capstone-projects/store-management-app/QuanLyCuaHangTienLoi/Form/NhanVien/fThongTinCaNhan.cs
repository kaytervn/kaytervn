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
using static System.Net.Mime.MediaTypeNames;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ListView;

namespace QuanLyCuaHangTienLoi
{
    public partial class fThongTinCaNhan : Form
    {
        NhanVien nv = new NhanVien();
        NhanVienDAO nvDAO = new NhanVienDAO();
        ChucVuDAO cvDAO = new ChucVuDAO();

        void LoadThongTin()
        {
            tbMaNV.Text = nv.MaNV;
            tbTenNV.Text = nv.TenNV;
            tbSDT.Text = nv.Sdt;
            dtpkNgaySinh.Value = nv.NgaySinh;

            if (nv.Phai == true)
                chbPhai.Checked = true;
            else
                chbPhai.Checked = false;

            tbEmail.Text = nv.Email;

            ChucVu cv = cvDAO.LayThongTinChucVuBangMaCV(nv.MaCV);
            cbMaCV.Text = cv.TenCV;

            if (nv.TrangThai == true)
                chbTrangThai.Checked = true;
            else
                chbTrangThai.Checked = false;

            tbTenTK.Text = nv.TenTK;
            tbMatKhau.Text = nv.MatKhau;

            tbTenTK.Text = nv.TenTK;
            tbMatKhau.Text = nv.MatKhau;

            if (nv.Hinh != null)
                ptHinh.Image = System.Drawing.Image.FromStream(new MemoryStream(nv.Hinh));
        }

        public fThongTinCaNhan(NhanVien nv)
        {
            InitializeComponent();
            this.nv = nv;
        }

        private void cbHienMatKhau_CheckedChanged(object sender, EventArgs e)
        {
            if (cbHienMatKhau.Checked == true)
            {
                tbMatKhau.UseSystemPasswordChar = false;
            }
            else
            {
                tbMatKhau.UseSystemPasswordChar = true;
            }
        }

        private void fThongTinCaNhan_Load(object sender, EventArgs e)
        {
            LoadThongTin();
        }

        private void btTaiLen_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Title = "Chọn ảnh";
            ofd.Filter = "Image Files(*.gif; *.jpg; *.jpeg; *.bmp; *.wmf; *.png) | *.gif; *.jpg; *.jpeg; *.bmp; *.wmf; *.png";
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                ptHinh.ImageLocation = ofd.FileName;
            }
        }

        private void btLuu_Click(object sender, EventArgs e)
        {
            try
            {
                byte[] anh = nvDAO.ChuyenAnhThanhMangByte(ptHinh);
                nvDAO.LuuAnh(nv, anh);
                LoadThongTin();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Lưu ảnh thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
