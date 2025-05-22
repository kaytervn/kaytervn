using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCuaHangTienLoi
{
    public partial class fQLKhachHang : Form
    {
        KhachHangDAO khDAO = new KhachHangDAO();
        HoaDonDAO hdDAO = new HoaDonDAO();
        ChiTietHoaDonDAO cthdDAO = new ChiTietHoaDonDAO();
        SanPhamDAO spDAO = new SanPhamDAO();
        
        public fQLKhachHang()
        {
            InitializeComponent();
        }

        private void btnReset_Click(object sender, EventArgs e)
        {
            LoadData();
            this.tbSDT.ResetText();
            this.tbTenKH.ResetText();
            this.tbDTL.ResetText();
            this.tbSDT.Focus();
        }

        private void fQLKhachHang_Load(object sender, EventArgs e)
        {
            LoadData();
        }

        private void LoadData()
        {
            dgvKhachHang.DataSource = khDAO.LayDanhSach();        
        }

        private void dgvKhachHang_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            dgvKhachHang.CurrentRow.Selected = true;
            this.tbSDT.Text = dgvKhachHang.SelectedRows[0].Cells[0].Value.ToString();
            this.tbTenKH.Text = dgvKhachHang.SelectedRows[0].Cells[1].Value.ToString();
            this.tbDTL.Text = dgvKhachHang.SelectedRows[0].Cells[2].Value.ToString();

            dgvHoaDon.DataSource = hdDAO.LayDanhSachTheoKhachHang(Convert.ToInt32(this.tbSDT.Text));
            
            if (dgvHoaDon.Rows.Count != 0)
            {
                DataTable dtsp = new DataTable();
                dtsp = spDAO.LayDanhSach();
                (dgvChiTietHoaDon.Columns["MaSP"] as DataGridViewComboBoxColumn).DataSource = dtsp;
                (dgvChiTietHoaDon.Columns["MaSP"] as DataGridViewComboBoxColumn).DisplayMember = "TenSP";
                (dgvChiTietHoaDon.Columns["MaSP"] as DataGridViewComboBoxColumn).ValueMember = "MaSP";
                int r = dgvHoaDon.CurrentCell.RowIndex;
                dgvChiTietHoaDon.DataSource = cthdDAO.LayDanhSachTheoHoaDon(Convert.ToInt32(dgvHoaDon.Rows[r].Cells[0].Value.ToString()));
            }
            else
            {
                dgvChiTietHoaDon.DataSource = cthdDAO.LayDanhSachTheoHoaDon(-1);
            }
            
        }

        private void btnThem_Click(object sender, EventArgs e)
        {
            KhachHang kh = new KhachHang(tbSDT.Text, tbTenKH.Text, Convert.ToDouble(tbDTL.Text.ToString()));
            khDAO.Them(kh);
            LoadData();
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            KhachHang kh = new KhachHang(tbSDT.Text, tbTenKH.Text, Convert.ToInt32(tbDTL.Text.ToString()));
            khDAO.Sua(kh);
            LoadData();
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            KhachHang kh = new KhachHang(tbSDT.Text);
            khDAO.Xoa(kh);
            LoadData();
        }

        private void dgvHoaDon_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            DataTable dtsp = new DataTable();
            dtsp = spDAO.LayDanhSach();

            (dgvChiTietHoaDon.Columns["MaSP"] as DataGridViewComboBoxColumn).DataSource = dtsp;
            (dgvChiTietHoaDon.Columns["MaSP"] as DataGridViewComboBoxColumn).DisplayMember = "TenSP";
            (dgvChiTietHoaDon.Columns["MaSP"] as DataGridViewComboBoxColumn).ValueMember = "MaSP";
            
            int r = dgvHoaDon.CurrentCell.RowIndex;
            
            dgvChiTietHoaDon.DataSource = cthdDAO.LayDanhSachTheoHoaDon(Convert.ToInt32(dgvHoaDon.Rows[r].Cells[0].Value.ToString()));
            
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            dgvKhachHang.DataSource = khDAO.TimKiem(tbTimKiem.Text);
        }
    }
}
