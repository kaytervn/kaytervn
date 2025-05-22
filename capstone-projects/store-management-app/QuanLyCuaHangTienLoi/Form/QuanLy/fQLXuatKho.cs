using QuanLyCuaHangTienLoi.DAO;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Entity;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCuaHangTienLoi
{
    public partial class fQLXuatKho : Form
    {
        KhoDAO khoDAO = new KhoDAO();
        CuaHangDAO chDAO = new CuaHangDAO();
        SanPhamDAO spDAO = new SanPhamDAO();

        public fQLXuatKho()
        {
            InitializeComponent();
        }

        private void fQLXuatNhapKho_Load(object sender, EventArgs e)
        {
            LoadData();
            cbLoaiKho.Text = "Tất cả";
            cbLoaiCuaHang.Text = "Tất cả";
        }

        private void LoadData()
        {
            LoadKho();
            LoadCuaHang();
        }

        private void dgvKho_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            int r = dgvKho.CurrentCell.RowIndex;

            this.tbMaSPCuaHang.Text = dgvKho.Rows[r].Cells[0].Value.ToString();
            this.dtpkNSXCuaHang.Value = (DateTime)dgvKho.Rows[r].Cells[2].Value;
            this.dtpkHSDCuaHang.Value = (DateTime)dgvKho.Rows[r].Cells[3].Value;
            this.tbSoLuong.Text = dgvKho.Rows[r].Cells[6].Value.ToString();

            SanPham sp = spDAO.LayThongTinSanPhamBangMaSP(Convert.ToInt32(tbMaSPCuaHang.Text));
            if (sp.Hinh != null)
            {
                ptHinh.Image = Image.FromStream(new MemoryStream(sp.Hinh));
            }
            else
            {
                ptHinh.Image = null;
            }
        }

        private void dgvCuaHang_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            int r = dgvCuaHang.CurrentCell.RowIndex;

            this.tbMaSPCuaHang.Text = dgvCuaHang.Rows[r].Cells[0].Value.ToString();
            this.dtpkNSXCuaHang.Value = (DateTime)dgvCuaHang.Rows[r].Cells[2].Value;
            this.dtpkHSDCuaHang.Value = (DateTime)dgvCuaHang.Rows[r].Cells[3].Value;
            this.dtpkNgayXuatKho.Value = (DateTime)dgvCuaHang.Rows[r].Cells[4].Value;
            this.tbSoLuong.Text = dgvCuaHang.Rows[r].Cells[5].Value.ToString();

            SanPham sp = spDAO.LayThongTinSanPhamBangMaSP(Convert.ToInt32(tbMaSPCuaHang.Text));
            if (sp.Hinh != null)
            {
                ptHinh.Image = Image.FromStream(new MemoryStream(sp.Hinh));
            }
            else
            {
                ptHinh.Image = null;
            }
        }

        private void btnXuatKho_Click(object sender, EventArgs e)
        {
            CuaHang ch = new CuaHang(Convert.ToInt32(tbMaSPCuaHang.Text), this.dtpkNSXCuaHang.Value,
                this.dtpkHSDCuaHang.Value, DateTime.Today, Convert.ToInt32(this.tbSoLuong.Text));
            chDAO.XuatKho(ch);
            LoadData();
        }


        private void btnTraKho_Click(object sender, EventArgs e)
        {
            CuaHang ch = new CuaHang(Convert.ToInt32(tbMaSPCuaHang.Text), this.dtpkNSXCuaHang.Value,
                this.dtpkHSDCuaHang.Value, this.dtpkNgayXuatKho.Value, Convert.ToInt32(this.tbSoLuong.Text));
            chDAO.TraKho(ch);
            LoadData();
        }

        void TimKiemKho()
        {
            if (cbLoaiKho.Text == "Tất cả")
            {
                dgvKho.DataSource = khoDAO.TimKiem(tbTimKiemKho.Text);
            }
            else if (cbLoaiKho.Text == "Còn hạn")
            {
                dgvKho.DataSource = khoDAO.TimKiem_ConHan(tbTimKiemKho.Text);
            }
            else
                dgvKho.DataSource = khoDAO.TimKiem_HetHan(tbTimKiemKho.Text);
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

        private void cbLoaiKho_TextChanged(object sender, EventArgs e)
        {
            LoadKho();
        }

        private void tbTimKiemKho_TextChanged(object sender, EventArgs e)
        {
            TimKiemKho();
        }

        void TimKiemCuaHang()
        {
            if (cbLoaiCuaHang.Text == "Tất cả")
            {
                dgvCuaHang.DataSource = chDAO.TimKiem(tbTimKiemCuaHang.Text);
            }
            else if (cbLoaiCuaHang.Text == "Còn hạn")
            {
                dgvCuaHang.DataSource = chDAO.TimKiem_ConHan(tbTimKiemCuaHang.Text);
            }
            else
                dgvCuaHang.DataSource = chDAO.TimKiem_HetHan(tbTimKiemCuaHang.Text);
        }

        void LoadCuaHang()
        {
            if (cbLoaiCuaHang.Text == "Tất cả")
            {
                dgvCuaHang.DataSource = chDAO.LayDanhSach();
            }
            else if (cbLoaiCuaHang.Text == "Còn hạn")
            {
                dgvCuaHang.DataSource = chDAO.LayDanhSach_ConHan();
            }
            else
                dgvCuaHang.DataSource = chDAO.LayDanhSach_HetHan();
        }

        private void cbLoaiCuaHang_TextChanged(object sender, EventArgs e)
        {
            LoadCuaHang();
        }

        private void tbTimKiemCuaHang_TextChanged(object sender, EventArgs e)
        {
            TimKiemCuaHang();
        }
    }
}
