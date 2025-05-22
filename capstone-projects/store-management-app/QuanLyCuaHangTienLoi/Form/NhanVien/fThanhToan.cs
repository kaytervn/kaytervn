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
    public partial class fThanhToan : Form
    {

        CuaHangDAO chDAO = new CuaHangDAO();
        ChiTietHoaDonDAO cthdDAO = new ChiTietHoaDonDAO();
        HoaDonDAO hdDAO = new HoaDonDAO();
        NhanVienDAO nvDAO = new NhanVienDAO();
        PTTTDAO ptttDAO = new PTTTDAO();
        NhanVien nv = new NhanVien();
        SanPhamDAO spDAO = new SanPhamDAO();

        public fThanhToan(NhanVien nv)
        {
            InitializeComponent();
            this.nv = nv;
        }

        private void LoadData()
        {

            tbMaNV.Text = this.nv.MaNV;

            cbPTTT.DataSource = ptttDAO.LayDanhSach();
            cbPTTT.DisplayMember = "TenPTTT";
            cbPTTT.ValueMember =  "PTTT";

            LoadDanhSach();
            btnTaoHD.Enabled = true;
            btnOrder.Enabled = false;
            btnHuy.Enabled = false;
            btnThanhToan.Enabled = false;

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
                ptHinh.Image = Image.FromStream(new MemoryStream(sp.Hinh));
            else
                ptHinh.Image = null;
        }

        private void fThanhToan_Load(object sender, EventArgs e)
        {
            LoadData();
            cbLoaiCuaHang.Text = "Tất cả";
        }

        private void btnOrder_Click(object sender, EventArgs e)
        {
            int mahd = hdDAO.MaxHD();
            ChiTietHoaDon cthd = new ChiTietHoaDon(mahd, Convert.ToInt32(tbMaSPCuaHang.Text), (DateTime)this.dtpkNSXCuaHang.Value,
                (DateTime)this.dtpkHSDCuaHang.Value, Convert.ToInt32(this.tbSoLuong.Text));
            cthdDAO.Order(cthd);
            dgvChiTietHoaDon.DataSource = cthdDAO.LayDanhSachThanhToan();
        }

        private void btnThanhToan_Click(object sender, EventArgs e)
        {
            int mahd = hdDAO.MaxHD();
            hdDAO.ThanhToan();
            LoadDanhSach();
            dgvChiTietHoaDon.DataSource = cthdDAO.LayDanhSachThanhToanRong();
            LoadData();
        }

        private void btnHuy_Click(object sender, EventArgs e)
        {
            int mahd = hdDAO.MaxHD();
            hdDAO.HuyThanhToan(mahd);
            dgvChiTietHoaDon.DataSource = null;
            LoadData();
        }

        private void btnTaoHD_Click(object sender, EventArgs e)
        {
            string sdtkh = tbSDTKH.Text.ToString();
            if (sdtkh == "")
                sdtkh = "NULL";
            else
                sdtkh = "'" + sdtkh + "'";
            HoaDon hd = new HoaDon(tbMaNV.Text, sdtkh, Convert.ToInt32(cbPTTT.SelectedValue.ToString()));
            hdDAO.TaoHD(hd);
            btnTaoHD.Enabled = false;
            btnOrder.Enabled = true;
            btnHuy.Enabled = true;
            btnThanhToan.Enabled = true;
        }

        void LoadDanhSach()
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

        void TimKiem()
        {
            if (cbLoaiCuaHang.Text == "Tất cả")
            {
                dgvCuaHang.DataSource = chDAO.TimKiem(tbTimKiem.Text);
            }
            else if (cbLoaiCuaHang.Text == "Còn hạn")
            {
                dgvCuaHang.DataSource = chDAO.TimKiem_ConHan(tbTimKiem.Text);
            }
            else
                dgvCuaHang.DataSource = chDAO.TimKiem_HetHan(tbTimKiem.Text);
        }    

        private void cbLoaiCuaHang_TextChanged(object sender, EventArgs e)
        {
            LoadDanhSach();
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            TimKiem();
        }
    }
}
