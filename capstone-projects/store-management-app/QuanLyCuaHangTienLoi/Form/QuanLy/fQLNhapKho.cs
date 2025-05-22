using QuanLyCuaHangTienLoi.DAO;
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
    public partial class fQLNhapKho : Form
    {
        SanPhamDAO spDAO = new SanPhamDAO();
        KhoDAO khoDAO = new KhoDAO();
        NhanVienDAO nvDAO = new NhanVienDAO();
        NhaSanXuatDAO nsxDAO = new NhaSanXuatDAO();
        public fQLNhapKho()
        {
            InitializeComponent();
        }

        private void fQLNhapKho_Load(object sender, EventArgs e)
        {
            LoadDataSP();
            LoadData();
            cbLoai.Text = "Tất cả";
            cbLoaiKho.Text = "Tất cả";
            dtgvNSX.DataSource = nsxDAO.LayDanhSach();
        }

        private void LoadDataSP()
        {
            LoadSanPham();
        }
        private void LoadData()
        {
            LoadKho();
        }

        private void btnReset_Click(object sender, EventArgs e)
        {
            tbMaSP.ResetText();
            tbTenSP.ResetText();
            tbMaNSX.ResetText();
            tbMaLoai.ResetText();
            tbGiaBan.ResetText();
            tbGiaGoc.ResetText();
            chbTrangThaiSP.Checked = true;
            LoadDataSP();
            this.tbMaSP.Focus();
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            SanPham sp = new SanPham(tbTenSP.Text, Convert.ToInt32(tbMaNSX.Text), Convert.ToInt32(tbMaLoai.Text),
                Convert.ToInt32(tbGiaBan.Text), Convert.ToInt32(tbGiaGoc.Text), chbTrangThaiSP.Checked,
                (ptHinhSP.Image != null) ? nvDAO.ChuyenAnhThanhMangByte(ptHinhSP) : null);
            spDAO.Them(sp);
            LoadDataSP();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            SanPham sp = new SanPham(Convert.ToInt32(tbMaSP.Text), tbTenSP.Text, Convert.ToInt32(tbMaNSX.Text), Convert.ToInt32(tbMaLoai.Text),
                Convert.ToInt32(tbGiaBan.Text), Convert.ToInt32(tbGiaGoc.Text), chbTrangThaiSP.Checked,
                (ptHinhSP.Image != null) ? nvDAO.ChuyenAnhThanhMangByte(ptHinhSP) : null);
            spDAO.Sua(sp);
            LoadDataSP();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            SanPham sp = new SanPham(Convert.ToInt32(tbMaSP.Text));
            spDAO.Xoa(sp);
            LoadDataSP();
        }

        private void btnResetKho_Click(object sender, EventArgs e)
        {
            tbMaSPKho.ResetText();
            dtpkNSXKho.ResetText();
            dtpkHSDKho.ResetText();
            dtpkNgayNhapKho.ResetText();
            tbSLTonKho.ResetText();
            LoadData();
            this.tbMaSPKho.Focus();
        }

        private void btnNhapKho_Click(object sender, EventArgs e)
        {
            Kho k = new Kho(Convert.ToInt32(tbMaSPKho.Text), dtpkNSXKho.Value, dtpkHSDKho.Value, dtpkNgayNhapKho.Value, chbLoaiKho.Checked, Convert.ToInt32(tbSLTonKho.Text));
            khoDAO.NhapKho(k);
            LoadData();
        }

        private void btnSuaKho_Click(object sender, EventArgs e)
        {
            Kho k = new Kho(Convert.ToInt32(tbMaSPKho.Text), dtpkNSXKho.Value, dtpkHSDKho.Value, dtpkNgayNhapKho.Value, chbLoaiKho.Checked, Convert.ToInt32(tbSLTonKho.Text));
            khoDAO.Sua(k);
            LoadData();
        }

        private void btnXoaKho_Click(object sender, EventArgs e)
        {
            Kho k = new Kho(Convert.ToInt32(tbMaSPKho.Text), dtpkNSXKho.Value, dtpkHSDKho.Value);
            khoDAO.Xoa(k);
            LoadData();
        }

        private void dgvSanPham_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            int r = dgvSanPham.CurrentCell.RowIndex;

            this.tbMaSP.Text = dgvSanPham.Rows[r].Cells[0].Value.ToString();
            this.tbTenSP.Text = dgvSanPham.Rows[r].Cells[1].Value.ToString();
            this.tbMaNSX.Text = dgvSanPham.Rows[r].Cells[2].Value.ToString();
            this.tbMaLoai.Text = dgvSanPham.Rows[r].Cells[3].Value.ToString();
            this.tbGiaBan.Text = dgvSanPham.Rows[r].Cells[4].Value.ToString();
            this.tbGiaGoc.Text = dgvSanPham.Rows[r].Cells[5].Value.ToString();
            this.chbTrangThaiSP.Checked = (bool)dgvSanPham.Rows[r].Cells[6].Value;

            if (!Convert.IsDBNull(dgvSanPham.SelectedRows[0].Cells[7].Value))
            {
                ptHinhSP.Image = Image.FromStream(new MemoryStream((byte[])dgvSanPham.SelectedRows[0].Cells[7].Value));
            }
            else
            {
                ptHinhSP.Image = null;
            }
        }

        private void dgvKho_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            int r = dgvKho.CurrentCell.RowIndex;

            this.tbMaSPKho.Text = dgvKho.Rows[r].Cells[0].Value.ToString();
            this.dtpkNSXKho.Value = (DateTime)dgvKho.Rows[r].Cells[2].Value;
            this.dtpkHSDKho.Value = (DateTime)dgvKho.Rows[r].Cells[3].Value;
            this.dtpkNgayNhapKho.Value = (DateTime)dgvKho.Rows[r].Cells[4].Value;
            this.chbLoaiKho.Checked = (bool)dgvKho.Rows[r].Cells[5].Value;
            this.tbSLTonKho.Text = dgvKho.Rows[r].Cells[6].Value.ToString();

            SanPham sp = spDAO.LayThongTinSanPhamBangMaSP(Convert.ToInt32(tbMaSPKho.Text));
            if (sp.Hinh != null)
            {
                ptHinhKho.Image = Image.FromStream(new MemoryStream(sp.Hinh));
            }
            else
            {
                ptHinhKho.Image = null;
            }
        }

        private void btTaiLen_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Title = "Chọn ảnh";
            ofd.Filter = "Image Files(*.gif; *.jpg; *.jpeg; *.bmp; *.wmf; *.png) | *.gif; *.jpg; *.jpeg; *.bmp; *.wmf; *.png";
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                ptHinhSP.ImageLocation = ofd.FileName;
            }
        }

        void LoadSanPham()
        {
            if (cbLoai.Text == "Tất cả")
            {
                dgvSanPham.DataSource = spDAO.LayDanhSach();
            }
            else if (cbLoai.Text == "Còn bán")
            {
                dgvSanPham.DataSource = spDAO.LayDanhSach(1);
            }
            else
                dgvSanPham.DataSource = spDAO.LayDanhSach(0);
        }

        void TimKiemSP()
        {
            if (cbLoai.Text == "Tất cả")
            {
                dgvSanPham.DataSource = spDAO.TimKiem(tbTimKiem.Text);
            }
            else if (cbLoai.Text == "Còn bán")
            {
                dgvSanPham.DataSource = spDAO.TimKiem(tbTimKiem.Text, 1);
            }
            else
                dgvSanPham.DataSource = spDAO.TimKiem(tbTimKiem.Text, 0);
        }

        private void cbLoai_TextChanged(object sender, EventArgs e)
        {
            LoadSanPham();
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            TimKiemSP();
        }

        void TimKiemKho()
        {
            if (cbLoaiKho.Text == "Tất cả")
            {
                dgvKho.DataSource = khoDAO.TimKiem(btTimKiemKho.Text);
            }
            else if (cbLoaiKho.Text == "Còn hạn")
            {
                dgvKho.DataSource = khoDAO.TimKiem_ConHan(btTimKiemKho.Text);
            }
            else
                dgvKho.DataSource = khoDAO.TimKiem_HetHan(btTimKiemKho.Text);
        }

        void LoadKho()
        {
            if (cbLoaiKho.Text == "Tất cả")
            {
                dgvKho.DataSource = khoDAO.LayDanhSach();
            }
            else if (cbLoaiKho.Text == "Còn hạn")
            {
                dgvKho.DataSource = khoDAO.LayDanhSach_ConHan();
            }
            else
                dgvKho.DataSource = khoDAO.LayDanhSach_HetHan();
        }

        private void btTimKiemKho_TextChanged(object sender, EventArgs e)
        {
            TimKiemKho();
        }

        private void cbLoaiKho_TextChanged(object sender, EventArgs e)
        {
            LoadKho();
        }

        private void dataGridView1_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            dtgvNSX.CurrentRow.Selected = true;
            this.tbMaNSX1.Text = dtgvNSX.SelectedRows[0].Cells[0].Value.ToString();
            this.tbTenNSX.Text = dtgvNSX.SelectedRows[0].Cells[1].Value.ToString();
            this.tbDiaChi.Text = dtgvNSX.SelectedRows[0].Cells[2].Value.ToString();
        }

        private void btThemNSX_Click(object sender, EventArgs e)
        {
            NhaSanXuat nsx = new NhaSanXuat(0, tbTenNSX.Text, tbDiaChi.Text);
            nsxDAO.Them(nsx);
            tbTenNSX.Text = "";
            tbMaNSX1.Text = "";
            tbDiaChi.Text = "";
            dtgvNSX.DataSource = nsxDAO.LayDanhSach();
        }

        private void btXoaNSX_Click(object sender, EventArgs e)
        {
            NhaSanXuat nsx = new NhaSanXuat(Convert.ToInt32(tbMaNSX1.Text), tbTenNSX.Text, tbDiaChi.Text);
            nsxDAO.Xoa(nsx);
            tbTenNSX.Text = "";
            tbMaNSX1.Text = "";
            tbDiaChi.Text = "";
            dtgvNSX.DataSource = nsxDAO.LayDanhSach();
        }

        private void btSuaNSX_Click(object sender, EventArgs e)
        {
            NhaSanXuat nsx = new NhaSanXuat(Convert.ToInt32(tbMaNSX1.Text), tbTenNSX.Text, tbDiaChi.Text);
            nsxDAO.Sua(nsx);
            tbTenNSX.Text = "";
            tbMaNSX1.Text = "";
            tbDiaChi.Text = "";
            dtgvNSX.DataSource = nsxDAO.LayDanhSach();
        }
    }
}
