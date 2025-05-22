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
    public partial class fThanhToan : Form
    {

        CuaHangDAO chDAO = new CuaHangDAO();
        ChiTietHoaDonDAO cthdDAO = new ChiTietHoaDonDAO();
        HoaDonDAO hdDAO = new HoaDonDAO();
        NhanVienDAO nvDAO = new NhanVienDAO();
        PTTTDAO ptttDAO = new PTTTDAO();
        public fThanhToan()
        {
            InitializeComponent();
        }

        private void LoadData()
        {
            
            cbMaNV.DataSource = nvDAO.LayDanhSach();
            cbMaNV.DisplayMember = "MaNV";
            cbMaNV.ValueMember = "MaNV";

            cbPTTT.DataSource = ptttDAO.LayDanhSach();
            cbPTTT.DisplayMember = "TenPTTT";
            cbPTTT.ValueMember =  "PTTT";

            dgvCuaHang.DataSource = chDAO.LayDanhSach();
            btnTaoHD.Enabled = true;
            btnOrder.Enabled = false;

        }

        private void dgvCuaHang_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            int r = dgvCuaHang.CurrentCell.RowIndex;

            this.tbMaSPCuaHang.Text = dgvCuaHang.Rows[r].Cells[0].Value.ToString();
            this.dtpkNSXCuaHang.Value = (DateTime)dgvCuaHang.Rows[r].Cells[2].Value;
            this.dtpkHSDCuaHang.Value = (DateTime)dgvCuaHang.Rows[r].Cells[3].Value;
            this.dtpkNgayXuatKho.Value = (DateTime)dgvCuaHang.Rows[r].Cells[4].Value;
            this.tbSoLuong.Text = dgvCuaHang.Rows[r].Cells[5].Value.ToString();
        }

        private void fThanhToan_Load(object sender, EventArgs e)
        {
            LoadData();

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
            dgvCuaHang.DataSource = chDAO.LayDanhSach();
            dgvChiTietHoaDon.DataSource = cthdDAO.LayDanhSachThanhToanRong();
            LoadData();
        }

        private void btnHuy_Click(object sender, EventArgs e)
        {
            int mahd = hdDAO.MaxHD();
            hdDAO.HuyThanhToan(mahd);
            LoadData();
        }

        private void btnTaoHD_Click(object sender, EventArgs e)
        {
            
            string sdtkh = tbSDTKH.Text.ToString();
            if (sdtkh == "")
                sdtkh = "NULL";
            else
                sdtkh = "'" + sdtkh + "'";
            HoaDon hd = new HoaDon(cbMaNV.SelectedValue.ToString(), sdtkh, Convert.ToInt32(cbPTTT.SelectedValue.ToString()));
            hdDAO.TaoHD(hd);
            btnTaoHD.Enabled = false;
            btnOrder.Enabled = true;
        }

        private void btnOrder_EnabledChanged(object sender, EventArgs e)
        {
            

        }
    }
}
