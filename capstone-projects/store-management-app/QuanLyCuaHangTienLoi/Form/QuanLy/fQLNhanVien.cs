using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCuaHangTienLoi
{
    public partial class fQLNhanVien : Form
    {
        NhanVienDAO nvDAO = new NhanVienDAO();
        ChucVuDAO cvDAO = new ChucVuDAO();
        public fQLNhanVien()
        {
            InitializeComponent();
        }

        private void fQuanLyNhanVien_Load(object sender, EventArgs e)
        {
            dgvNhanVien.DataSource = nvDAO.LayDanhSach();

            DataTable dtcv = new DataTable();
            dtcv = cvDAO.LayDanhSach();
            cbMaCV.DataSource = dtcv;
            cbMaCV.DisplayMember = "TenCV";
            cbMaCV.ValueMember = "MaCV";

            (dgvNhanVien.Columns["MaCV"] as DataGridViewComboBoxColumn).DataSource = dtcv;
            (dgvNhanVien.Columns["MaCV"] as DataGridViewComboBoxColumn).DisplayMember = "TenCV";
            (dgvNhanVien.Columns["MaCV"] as DataGridViewComboBoxColumn).ValueMember = "MaCV";

            cbLoai.Text = "Tất cả";
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            NhanVien nv = new NhanVien(tbTenNV.Text, tbSDT.Text, chbPhai.Checked, dtpkNgaySinh.Value, tbEmail.Text, cbMaCV.SelectedIndex+1, chbTrangThai.Checked, tbTenTK.Text, tbMatKhau.Text, (ptHinh.Image != null) ? nvDAO.ChuyenAnhThanhMangByte(ptHinh) : null);
            nvDAO.Them(nv);
            LoadDanhSach();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            NhanVien nv = new NhanVien(tbMaNV.Text, tbTenNV.Text, tbSDT.Text, chbPhai.Checked, dtpkNgaySinh.Value, tbEmail.Text, cbMaCV.SelectedIndex + 1, chbTrangThai.Checked, tbTenTK.Text, tbMatKhau.Text, (ptHinh.Image != null) ? nvDAO.ChuyenAnhThanhMangByte(ptHinh) : null);
            nvDAO.Sua(nv);
            LoadDanhSach();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            NhanVien nv = new NhanVien(tbMaNV.Text);
            nvDAO.Xoa(nv);
            LoadDanhSach();

        }

        private void btnReLoad_Click(object sender, EventArgs e)
        {
            LoadDanhSach();
            dgvNhanVien_CellClick(null, null);
        }

        private void dgvNhanVien_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            
            dgvNhanVien.CurrentRow.Selected = true;
            this.tbMaNV.Text = dgvNhanVien.SelectedRows[0].Cells[0].Value.ToString();
            this.tbTenNV.Text = dgvNhanVien.SelectedRows[0].Cells[1].Value.ToString();
            this.tbSDT.Text = dgvNhanVien.SelectedRows[0].Cells[2].Value.ToString();
            this.chbPhai.Checked = (bool)dgvNhanVien.SelectedRows[0].Cells[3].Value;
            this.dtpkNgaySinh.Value = (DateTime)(dgvNhanVien.SelectedRows[0].Cells[4].Value);
            this.tbEmail.Text = dgvNhanVien.SelectedRows[0].Cells[5].Value.ToString();
            this.cbMaCV.SelectedValue = dgvNhanVien.SelectedRows[0].Cells[6].Value.ToString();
            this.chbTrangThai.Checked = (bool)dgvNhanVien.SelectedRows[0].Cells[7].Value;
            this.tbTenTK.Text = dgvNhanVien.SelectedRows[0].Cells[8].Value.ToString();
            this.tbMatKhau.Text = dgvNhanVien.SelectedRows[0].Cells[9].Value.ToString();

            if (!Convert.IsDBNull(dgvNhanVien.SelectedRows[0].Cells[10].Value))
                ptHinh.Image = Image.FromStream(new MemoryStream((byte[])dgvNhanVien.SelectedRows[0].Cells[10].Value));
            else
                ptHinh.Image = null;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void btnReset_Click(object sender, EventArgs e)
        {
            this.tbTenNV.ResetText();
            this.tbSDT.ResetText();
            this.chbPhai.Checked = false;
            this.dtpkNgaySinh.ResetText();
            this.cbMaCV.SelectedIndex = 0;
            this.tbEmail.ResetText();
            this.cbMaCV.SelectedIndex = 0;
            this.chbTrangThai.Checked = true;
            this.tbTenTK.ResetText();
            this.tbMatKhau.ResetText();
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

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            TimKiem();
        }

        void TimKiem()
        {
            if (cbLoai.Text == "Tất cả")
            {
                dgvNhanVien.DataSource = nvDAO.TimKiem(tbTimKiem.Text);
            }
            else if (cbLoai.Text == "Còn làm việc")
            {
                dgvNhanVien.DataSource = nvDAO.TimKiem(tbTimKiem.Text, 1);
            }
            else
                dgvNhanVien.DataSource = nvDAO.TimKiem(tbTimKiem.Text, 0);

            DataTable dtcv = new DataTable();
            dtcv = cvDAO.LayDanhSach();
            (dgvNhanVien.Columns["MaCV"] as DataGridViewComboBoxColumn).DataSource = dtcv;
            (dgvNhanVien.Columns["MaCV"] as DataGridViewComboBoxColumn).DisplayMember = "TenCV";
            (dgvNhanVien.Columns["MaCV"] as DataGridViewComboBoxColumn).ValueMember = "MaCV";
        }

        void LoadDanhSach()
        {
            if (cbLoai.Text == "Tất cả")
            {
                dgvNhanVien.DataSource = nvDAO.LayDanhSach();
            }
            else if (cbLoai.Text == "Còn làm việc")
            {
                dgvNhanVien.DataSource = nvDAO.LayDanhSach(1);
            }
            else
                dgvNhanVien.DataSource = nvDAO.LayDanhSach(0);

            DataTable dtcv = new DataTable();
            dtcv = cvDAO.LayDanhSach();
            (dgvNhanVien.Columns["MaCV"] as DataGridViewComboBoxColumn).DataSource = dtcv;
            (dgvNhanVien.Columns["MaCV"] as DataGridViewComboBoxColumn).DisplayMember = "TenCV";
            (dgvNhanVien.Columns["MaCV"] as DataGridViewComboBoxColumn).ValueMember = "MaCV";
        }

        private void cbLoai_TextChanged(object sender, EventArgs e)
        {
            LoadDanhSach();
        }
    }
}
