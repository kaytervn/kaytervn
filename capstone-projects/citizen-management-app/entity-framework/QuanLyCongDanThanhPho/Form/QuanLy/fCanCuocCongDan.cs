using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    public partial class fCanCuocCongDan : Form
    {
        CongDanDAO cdDAO = new CongDanDAO();
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        ThuongTruDAO ttDAO = new ThuongTruDAO();
        CanCuocCongDan cccd = new CanCuocCongDan();

        public fCanCuocCongDan()
        {
            InitializeComponent();
        }

        void ChonTheoCCCD()
        {
            for (int i = 0; i < dtgvCanCuocCongDan.Rows.Count; i++)
            {
                if (cccd.CCCD == dtgvCanCuocCongDan.Rows[i].Cells[0].Value.ToString())
                {
                    dtgvCanCuocCongDan.Rows[i].Selected = true;
                    dtgvCanCuocCongDan_CellClick(null, null);
                }
            }
        }

        public fCanCuocCongDan(CanCuocCongDan cccd)
        {
            InitializeComponent();
            this.cccd = cccd;
        }

        void ResetThongTinDangKy()
        {
            tbHoTen.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbNoiSinh.Text = "";
            rbNam.Checked = true;
            tbThuongTru.Text = "";
            tbTinhThanh.Text = "";
            tbQuanHuyen.Text = "";
            tbPhuongXa.Text = "";
        }

        void CapNhatCellError()
        {
            for (int i = 0; i < dtgvCanCuocCongDan.Rows.Count; i++)
            {
                DateTime dt;
                CongDan cd = cdDAO.LayThongTinCongDanBangMaCD(Convert.ToInt32(dtgvCanCuocCongDan.Rows[i].Cells[1].Value));
                DateTime.TryParse(dtgvCanCuocCongDan.Rows[i].Cells[6].Value.ToString(), out dt);
                if (dt.AddDays(5475).Date < DateTime.Today.Date)
                    dtgvCanCuocCongDan.Rows[i].Cells[6].ErrorText = "Thẻ đã quá hạn 15 năm!";
                if (cd.TinhTrang == (int)CongDan.enCD.QuaDoi)
                    dtgvCanCuocCongDan.Rows[i].Cells[1].ErrorText = "Công dân đã qua đời!"; 
            }
        }

        void ReloadData()
        {
            if (cbLoai.Text == "Tất cả")
                dtgvCanCuocCongDan.DataSource = cccdDAO.LayDanhSach();
            else if (cbLoai.Text == "Còn hạn")
                dtgvCanCuocCongDan.DataSource = cccdDAO.LayDanhSach_ConHan();
            else
                dtgvCanCuocCongDan.DataSource = cccdDAO.LayDanhSach_QuaHan();

            CapNhatCellError();
        }

        void LoadThongTinDangKy(CongDan cd)
        {
            tbHoTen.Text = cd.HoTen;
            dtpkNgaySinh.Value = cd.NgaySinh;
            tbNoiSinh.Text = cd.NoiSinh;

            if (cd.GioiTinh == (int)CongDan.enCD.Nam)
                rbNam.Checked = true;
            else
                rbNu.Checked = true;

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(cd.MaCD);
            if (tt != null)
            {
                tbThuongTru.Text = tt.MaHo.ToString();
                tbTinhThanh.Text = tt.HoKhau.TinhThanh;
                tbQuanHuyen.Text = tt.HoKhau.QuanHuyen;
                tbPhuongXa.Text = tt.HoKhau.PhuongXa;
            }
            else
            {
                tbThuongTru.Text = "";
                tbTinhThanh.Text = "";
                tbQuanHuyen.Text = "";
                tbPhuongXa.Text = "";
            }    
        }

        void ResetThongTinThe()
        {
            btCCCD.Text = "";
            btMaCD.Text = "";
            btHoTen.Text = "";
            btNgaySinh.Text = "";
            btNoiSinh.Text = "";
            btGioiTinh.Text = "";
            btThuongTru.Text = "";
            btCoGiaTriDen.Text = "";
            btNgayDangKy.Text = "";
            ptHinh.Image = null;
        }

        void LoadThongTinThe(CanCuocCongDan cccd)
        {
            btCCCD.Text = cccd.CCCD;
            btMaCD.Text = cccd.CongDan.MaCD.ToString();
            btHoTen.Text = cccd.CongDan.HoTen;
            btNgaySinh.Text = cccd.CongDan.NgaySinh.ToString("dd-MM-yyyy");
            btNoiSinh.Text = cccd.CongDan.NoiSinh;

            if (cccd.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                btGioiTinh.Text = "Nam";
            else
                btGioiTinh.Text = "Nữ";

            btCoGiaTriDen.Text = (cccd.NgayDangKy.AddDays(5475)).ToString("dd-MM-yyyy");
            btNgayDangKy.Text = cccd.NgayDangKy.ToString("dd-MM-yyyy");
            
            if (cccd.CongDan.Hinh != null)
                ptHinh.Image = Image.FromStream(new MemoryStream(cccd.CongDan.Hinh));
            else
                ptHinh.Image = null;

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(cccd.CongDan.MaCD);
            if (tt != null)
                btThuongTru.Text = String.Format($"Hộ {tt.MaHo.ToString()}, {tt.HoKhau.TinhThanh}, Q/h {tt.HoKhau.QuanHuyen}, P/x {tt.HoKhau.PhuongXa}");
            else
                btThuongTru.Text = "";
        }

        private void fCanCuocCongDan_Load(object sender, EventArgs e)
        {
            cbMaCD.DataSource = cdDAO.LayDanhSach();
            cbMaCD.ValueMember = "MaCD";
            btDatLai_Click(null, null);
            cbLoai.Text = "Tất cả";
            ReloadData();

            if (cccd != null)
                ChonTheoCCCD();
        }

        private void btThem_Click(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = new CanCuocCongDan(btCCCD.Text, Convert.ToInt32(cbMaCD.Text), DateTime.Today);
                if (DateTime.Today.Year - cccd.CongDan.NgaySinh.Year >= 14)
                {
                    cccdDAO.Them(cccd);
                    ReloadData();
                    ResetThongTinDangKy();
                    cbMaCD.Text = "";
                }
                else
                    MessageBox.Show("Công dân chưa đủ tuổi để đăng ký!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thêm thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void cbMaCD_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CongDan cd = cdDAO.LayThongTinCongDanBangMaCD(Convert.ToInt32(cbMaCD.Text));
                if (cd != null)
                    LoadThongTinDangKy(cd);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTinDangKy();
            }
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = new CanCuocCongDan(btCCCD.Text, Convert.ToInt32(btMaCD.Text), DateTime.ParseExact(btNgayDangKy.Text, "dd-MM-yyyy", CultureInfo.InvariantCulture));

                DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (dialogResult == DialogResult.Yes)
                {
                    cccdDAO.Xoa(cccd);
                    ReloadData();
                    ResetThongTinThe();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Xóa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void dtgvCanCuocCongDan_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(dtgvCanCuocCongDan.SelectedRows[0].Cells[0].Value.ToString());
            LoadThongTinThe(cccd);
        }

        private void btDatLai_Click(object sender, EventArgs e)
        {
            ResetThongTinDangKy();
            ResetThongTinThe();
            cbMaCD.Text = "";
        }

        private void btGiaHan_Click(object sender, EventArgs e)
        {
            try
            {
                DateTime ngaydangky = DateTime.ParseExact(btNgayDangKy.Text, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                if (ngaydangky.AddDays(5475) >= DateTime.Today)
                {
                    MessageBox.Show("Thẻ vẫn còn hạn, gia hạn không thành công!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else
                {
                    CanCuocCongDan cccd = new CanCuocCongDan(btCCCD.Text, Convert.ToInt32(btMaCD.Text), ngaydangky);
                    cccdDAO.GiaHan(cccd);
                    ReloadData();
                    ResetThongTinThe();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Gia hạn thất bại!\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            if (cbLoai.Text == "Tất cả")
                dtgvCanCuocCongDan.DataSource = cccdDAO.TimKiem(tbTimKiem.Text);
            else if (cbLoai.Text == "Còn hạn")
                dtgvCanCuocCongDan.DataSource = cccdDAO.TimKiem_ConHan(tbTimKiem.Text);
            else
                dtgvCanCuocCongDan.DataSource = cccdDAO.TimKiem_QuaHan(tbTimKiem.Text);

            CapNhatCellError();
        }

        private void cbLoai_TextChanged(object sender, EventArgs e)
        {
            ReloadData();
        }
    }
}
