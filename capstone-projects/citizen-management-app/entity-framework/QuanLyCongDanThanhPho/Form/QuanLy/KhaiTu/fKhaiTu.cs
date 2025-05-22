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
    public partial class fKhaiTu : Form
    {
        CongDan cd = new CongDan();
        CongDanDAO cdDAO = new CongDanDAO();
        KhaiTuDAO ktDAO = new KhaiTuDAO();
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        KhaiTu kt = new KhaiTu();

        public fKhaiTu(CongDan cd)
        {
            InitializeComponent();
            this.cd = cd;
        }

        public fKhaiTu(CongDan cd, KhaiTu kt)
        {
            InitializeComponent();
            this.cd = cd;
            this.kt = kt;
        }

        void ChonTheoKhaiTu()
        {
            for (int i = 0; i < dtgvKhaiTu.Rows.Count; i++)
            {
                if (kt.MaCD == (int)dtgvKhaiTu.Rows[i].Cells[0].Value)
                {
                    dtgvKhaiTu.Rows[i].Selected = true;
                    dtgvKhaiTu_CellClick(null, null);
                }
            }
        }

        void ResetThongTin()
        {
            tbHoTen.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbNoiSinh.Text = "";
            rbNam.Checked = true;
            rbConSong.Checked = true;
            rbDocThan.Checked = true;
            ptHinh.Image = null;
        }

        void ResetThongTinKhaiTu()
        {
            tbNguyenNhan.Text = "";
            dtpkNgayTu.Value = DateTime.Today;
            dtpkNgayKhai.Value = DateTime.Today;
            cbNguoiKhai.Text = "";
            tbQuanHeVoiNguoiDuocKhai.Text = "";
        }

        void LoadThongTin(CongDan cd)
        {
            tbHoTen.Text = cd.HoTen;
            dtpkNgaySinh.Value = cd.NgaySinh;
            tbNoiSinh.Text = cd.NoiSinh;

            if (cd.GioiTinh == (int)CongDan.enCD.Nam)
                rbNam.Checked = true;
            else
                rbNu.Checked = true;

            if (cd.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSong.Checked = true;
            else
                rbQuaDoi.Checked = true;

            if (cd.HonNhan == (int)CongDan.enCD.DocThan)
                rbDocThan.Checked = true;
            else
                rbDaKetHon.Checked = true;

            if (cd.Hinh != null)
                ptHinh.Image = Image.FromStream(new MemoryStream(cd.Hinh));
            else
                ptHinh.Image = null;
        }

        private void fKhaiTu_Load(object sender, EventArgs e)
        {
            cbMaCD.DataSource = cdDAO.LayDanhSach();
            cbMaCD.ValueMember = "MaCD";
            cbMaCD.Text = "";

            cbNguoiKhai.DataSource = cccdDAO.LayDanhSach();
            cbNguoiKhai.ValueMember = "CCCD";
            cbNguoiKhai.Text = "";

            dtgvKhaiTu.DataSource = ktDAO.LayDanhSach();

            if (kt != null)
                ChonTheoKhaiTu();
        }

        private void cbMaCD_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CongDan cd = cdDAO.LayThongTinCongDanBangMaCD(Convert.ToInt32(cbMaCD.Text));
                if (cd != null)
                    LoadThongTin(cd);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTin();
            }
        }

        private void dtgvKhaiTu_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            cbMaCD.Text = dtgvKhaiTu.SelectedRows[0].Cells[0].Value.ToString();
            tbNguyenNhan.Text = dtgvKhaiTu.SelectedRows[0].Cells[5].Value.ToString();
            dtpkNgayTu.Value = (DateTime)dtgvKhaiTu.SelectedRows[0].Cells[9].Value;
            dtpkNgayKhai.Value = (DateTime)dtgvKhaiTu.SelectedRows[0].Cells[10].Value;
            cbNguoiKhai.Text = dtgvKhaiTu.SelectedRows[0].Cells[6].Value.ToString();
            tbQuanHeVoiNguoiDuocKhai.Text = dtgvKhaiTu.SelectedRows[0].Cells[8].Value.ToString();
        }

        void ResetThongTinRong()
        {
            cbMaCD.Text = "";
            ResetThongTin();
            ResetThongTinKhaiTu();
        }

        private void btDatLai_Click(object sender, EventArgs e)
        {
            ResetThongTinRong();
        }

        bool KiemTraThongTinHopLe(KhaiTu kt)
        {
            if (
                kt.NguyenNhan == "" ||
                kt.QuanHeVoiNguoiDuocKhai == "" ||
                kt.CanCuocCongDan.CongDan.MaCD == kt.MaCD ||
                kt.CanCuocCongDan.CongDan.TinhTrang == (int)CongDan.enCD.QuaDoi
            )
                return false;
            return true;
        }

        private void btThem_Click(object sender, EventArgs e)
        {
            try
            {
                KhaiTu kt = new KhaiTu(Convert.ToInt32(cbMaCD.Text), tbNguyenNhan.Text, dtpkNgayTu.Value, DateTime.Today, cbNguoiKhai.Text, tbQuanHeVoiNguoiDuocKhai.Text);
                if (KiemTraThongTinHopLe(kt) == true)
                {
                    ktDAO.Them(kt);

                    kt.CongDan.TinhTrang = (int)CongDan.enCD.QuaDoi;
                    cdDAO.Sua(kt.CongDan);

                    dtgvKhaiTu.DataSource = ktDAO.LayDanhSach();
                    ResetThongTinRong();
                }
                else
                    MessageBox.Show("Thông tin khai tử không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thêm thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            try
            {
                KhaiTu kt = new KhaiTu(Convert.ToInt32(cbMaCD.Text), tbNguyenNhan.Text, dtpkNgayTu.Value, dtpkNgayKhai.Value, cbNguoiKhai.Text, tbQuanHeVoiNguoiDuocKhai.Text);

                DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (dialogResult == DialogResult.Yes)
                {
                    ktDAO.Xoa(kt);

                    kt.CongDan.TinhTrang = (int)CongDan.enCD.ConSong;
                    cdDAO.Sua(kt.CongDan);

                    dtgvKhaiTu.DataSource = ktDAO.LayDanhSach();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Xóa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            dtgvKhaiTu.DataSource = ktDAO.TimKiem(tbTimKiem.Text);
        }

        private void btIn_Click(object sender, EventArgs e)
        {
            try
            {
                KhaiTu kt = ktDAO.LayThongTinKhaiTuBangMaCD(Convert.ToInt32(cbMaCD.Text));

                if (kt != null)
                {
                    fGiayKhaiTu form = new fGiayKhaiTu(kt);
                    form.ShowDialog();
                }
                else
                    throw new Exception();
            }
            catch (Exception ex)
            {
                MessageBox.Show("In thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        void LoadThongTin_NguoiKhai(CanCuocCongDan cccd)
        {
            tbMaCDNK.Text = cccd.CongDan.MaCD.ToString();
            tbHoTenNK.Text = cccd.CongDan.HoTen;
            dtpkNgaySinhNK.Value = cccd.CongDan.NgaySinh;
            tbNoiSinhNK.Text = cccd.CongDan.NoiSinh;

            if (cccd.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                rbNamNK.Checked = true;
            else
                rbNuNK.Checked = true;

            if (cccd.CongDan.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSongNK.Checked = true;
            else
                rbQuaDoiNK.Checked = true;

            if (cccd.CongDan.HonNhan == (int)CongDan.enCD.DocThan)
                rbDocThanNK.Checked = true;
            else
                rbDaKetHonNK.Checked = true;
        }

        void ResetThongTin_NguoiKhai()
        {
            tbMaCDNK.Text = "";
            tbHoTenNK.Text = "";
            dtpkNgaySinhNK.Value = DateTime.Today;
            tbNoiSinhNK.Text = "";
            rbNamNK.Checked = true;
            rbConSongNK.Checked = true;
            rbDocThanNK.Checked = true;
        }

        private void cbNguoiKhai_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(cbNguoiKhai.Text);
                if (cccd != null)
                    LoadThongTin_NguoiKhai(cccd);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTin_NguoiKhai();
            }
        }

        private void btSua_Click(object sender, EventArgs e)
        {
            try
            {
                KhaiTu kt = new KhaiTu(Convert.ToInt32(cbMaCD.Text), tbNguyenNhan.Text, dtpkNgayTu.Value, dtpkNgayKhai.Value, cbNguoiKhai.Text, tbQuanHeVoiNguoiDuocKhai.Text);
                if (KiemTraThongTinHopLe(kt) == true)
                {
                    ktDAO.Sua(kt);
                    dtgvKhaiTu.DataSource = ktDAO.LayDanhSach();
                    ResetThongTinRong();
                }
                else
                    MessageBox.Show("Thông tin khai tử không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Sửa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
