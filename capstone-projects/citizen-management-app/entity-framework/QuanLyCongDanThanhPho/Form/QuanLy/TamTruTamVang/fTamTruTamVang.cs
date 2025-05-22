using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    public partial class fTamTruTamVang : Form
    {
        TamTruTamVangDAO tttvDAO = new TamTruTamVangDAO();
        HoKhauDAO hkDAO = new HoKhauDAO();
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        CongDanDAO cdDAO = new CongDanDAO();

        public fTamTruTamVang()
        {
            InitializeComponent();
        }

        void ResetThongTin_ChuHo()
        {
            tbMaCDCH.Text = "";
            tbHoTenCH.Text = "";
            dtpkNgaySinhCH.Value = DateTime.Today;
            tbNoiSinhCH.Text = "";
            rbNamCH.Checked = true;
            rbConSongCH.Checked = true;
        }

        void LoadThongTin_ChuHo(CongDan cd)
        {
            tbMaCDCH.Text = cd.MaCD.ToString();
            tbHoTenCH.Text = cd.HoTen;
            dtpkNgaySinhCH.Value = cd.NgaySinh;
            tbNoiSinhCH.Text = cd.NoiSinh;

            if (cd.GioiTinh == (int)CongDan.enCD.Nam)
                rbNamCH.Checked = true;
            else
                rbNuCH.Checked = true;

            if (cd.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSongCH.Checked = true;
            else
                rbQuaDoiCH.Checked = true;
        }

        void LoadThongTin_CongDan(CongDan cd)
        {
            tbHoTen.Text = cd.HoTen;
            dtpkNgaySinh.Value = cd.NgaySinh;
            tbNoiSinh.Text = cd.NoiSinh;

            if (cd.GioiTinh == (int)CongDan.enCD.Nam)
                rbNam.Checked = true;
            else
                rbNu.Checked = true;

            tbNgheNghiep.Text = cd.NgheNghiep;
            tbDanToc.Text = cd.DanToc;
            tbTonGiao.Text = cd.TonGiao;

            if (cd.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSong.Checked = true;
            else
                rbQuaDoi.Checked = true;

            if (cd.HonNhan == (int)CongDan.enCD.DocThan)
                rbDocThan.Checked = true;
            else
                rbDaKetHon.Checked = true;
        }

        void ResetThongTin_CongDan()
        {
            tbHoTen.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbNoiSinh.Text = "";
            rbNam.Checked = true;
            tbNgheNghiep.Text = "";
            tbDanToc.Text = "";
            tbTonGiao.Text = "";
            rbConSong.Checked = true;
            rbDocThan.Checked = true;
        }

        void CapNhatCellError()
        {
            for (int i = 0; i < dtgvTamTruTamVang.Rows.Count; i++)
            {
                DateTime dt;
                CongDan cd = cdDAO.LayThongTinCongDanBangMaCD(Convert.ToInt32(dtgvTamTruTamVang.Rows[i].Cells[4].Value));
                DateTime.TryParse(dtgvTamTruTamVang.Rows[i].Cells[8].Value.ToString(), out dt);
                if (dt.AddDays(730).Date < DateTime.Today.Date)
                    dtgvTamTruTamVang.Rows[i].Cells[8].ErrorText = "Đơn đăng ký đã quá hạn 2 năm!";
                if (cd.TinhTrang == (int)CongDan.enCD.QuaDoi)
                    dtgvTamTruTamVang.Rows[i].Cells[4].ErrorText = "Công dân đã qua đời!";
            }
        }

        void ReloadData()
        {
            if (cbLoai.Text == "Tất cả")
                dtgvTamTruTamVang.DataSource = tttvDAO.LayDanhSach();
            else if (cbLoai.Text == "Còn hạn")
                dtgvTamTruTamVang.DataSource = tttvDAO.LayDanhSach_ConHan();
            else
                dtgvTamTruTamVang.DataSource = tttvDAO.LayDanhSach_QuaHan();

            CapNhatCellError();
        }

        private void fTamTruTamVang_Load(object sender, EventArgs e)
        {
            cbMaHo.DataSource = hkDAO.LayDanhSach();
            cbMaHo.ValueMember = "MaHo";
            cbMaHo.Text = "";

            cbMaCD.DataSource = cdDAO.LayDanhSach();
            cbMaCD.ValueMember = "MaCD";
            cbMaCD.Text = "";

            cbLoai.Text = "Tất cả";
        }

        private void cbChuHo_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(tbChuHo.Text);
                if (cccd != null)
                    LoadThongTin_ChuHo(cccd.CongDan);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTin_ChuHo();
            }
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            if (cbLoai.Text == "Tất cả")
                dtgvTamTruTamVang.DataSource = tttvDAO.TimKiem(tbTimKiem.Text);
            else if (cbLoai.Text == "Còn hạn")
                dtgvTamTruTamVang.DataSource = tttvDAO.TimKiem_ConHan(tbTimKiem.Text);
            else
                dtgvTamTruTamVang.DataSource = tttvDAO.TimKiem_QuaHan(tbTimKiem.Text);

            CapNhatCellError();
        }

        void ResetThongTinRong()
        {
            cbMaCD.Text = "";
            cbMaHo.Text = "";
            rbTamTru.Checked = true;
            dtpkNgayDK.Value = DateTime.Today;
        }

        private void btDatLai_Click(object sender, EventArgs e)
        {
            ResetThongTinRong();
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            try
            {
                TamTruTamVang tttv = new TamTruTamVang(
                    Convert.ToInt32(cbMaHo.Text),
                    Convert.ToInt32(cbMaCD.Text),
                    (rbTamTru.Checked == true) ? (int)TamTruTamVang.enTTTV.TamTru : (int)TamTruTamVang.enTTTV.TamVang,
                    dtpkNgayDK.Value
                );

                DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (dialogResult == DialogResult.Yes)
                {
                    tttvDAO.Xoa(tttv);
                    ReloadData();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Xóa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btThem_Click(object sender, EventArgs e)
        {
            try
            {
                TamTruTamVang tttv = new TamTruTamVang(
                    Convert.ToInt32(cbMaHo.Text),
                    Convert.ToInt32(cbMaCD.Text),
                    (rbTamTru.Checked == true) ? (int)TamTruTamVang.enTTTV.TamTru : (int)TamTruTamVang.enTTTV.TamVang,
                    DateTime.Today
                );

                if (hkDAO.KiemTraCongDanCoThuocHo(tttv.MaCD, tttv.MaHo) == true && tttv.TinhTrangCuTru == (int)TamTruTamVang.enTTTV.TamTru)
                    MessageBox.Show("Công dân hiện đang thường trú ở hộ khẩu này!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else if (hkDAO.KiemTraCongDanCoThuocHo(tttv.MaCD, tttv.MaHo) == false && tttv.TinhTrangCuTru == (int)TamTruTamVang.enTTTV.TamVang)
                    MessageBox.Show("Công dân hiện cần đăng ký tạm vắng ở địa chỉ thường trú!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    tttvDAO.Them(tttv);
                    ReloadData();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thêm thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btIn_Click(object sender, EventArgs e)
        {
            try
            {
                TamTruTamVang tttv = tttvDAO.LayThongTinTamTruTamVangBangMaCDVaMaHo(Convert.ToInt32(cbMaCD.Text), Convert.ToInt32(cbMaHo.Text));

                if (tttv != null)
                {
                    fGiayTamTruTamVang form = new fGiayTamTruTamVang(tttv);
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

        private void dtgvTamTruTamVang_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            dtgvTamTruTamVang.CurrentRow.Selected = true;
            cbMaHo.Text = dtgvTamTruTamVang.SelectedRows[0].Cells[0].Value.ToString();
            cbMaCD.Text = dtgvTamTruTamVang.SelectedRows[0].Cells[4].Value.ToString();

            if ((int)dtgvTamTruTamVang.SelectedRows[0].Cells[7].Value == (int)TamTruTamVang.enTTTV.TamTru)
                rbTamTru.Checked = true;
            else
                rbTamVang.Checked = true;

            dtpkNgayDK.Value = (DateTime)dtgvTamTruTamVang.SelectedRows[0].Cells[8].Value;
        }

        private void cbLoai_TextChanged(object sender, EventArgs e)
        {
            ReloadData();
        }

        private void btGiaHan_Click(object sender, EventArgs e)
        {
            try
            {
                if (dtpkNgayDK.Value.AddDays(730) >= DateTime.Today)
                {
                    MessageBox.Show("Đơn đăng ký vẫn còn hạn!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else
                {
                    TamTruTamVang tttv = new TamTruTamVang(
                        Convert.ToInt32(cbMaHo.Text),
                        Convert.ToInt32(cbMaCD.Text),
                        (rbTamTru.Checked == true) ? (int)TamTruTamVang.enTTTV.TamTru : (int)TamTruTamVang.enTTTV.TamVang,
                        dtpkNgayDK.Value
                    );
                    
                    tttvDAO.GiaHan(tttv);
                    ReloadData();
                    ResetThongTinRong();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Gia hạn thất bại!\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        void LoadThongTinHoKhau(HoKhau hk)
        {
            tbChuHo.Text = hk.ChuHo;
            tbTinhThanh.Text = hk.TinhThanh;
            tbQuanHuyen.Text = hk.QuanHuyen;
            tbPhuongXa.Text = hk.PhuongXa;
            dtpkNgayDangKyHK.Value = hk.NgayDangKy;
        }

        void ResetThongTinHoKhau()
        {
            tbChuHo.Text = "";
            tbTinhThanh.Text = "";
            tbQuanHuyen.Text = "";
            tbPhuongXa.Text = "";
            dtpkNgayDangKyHK.Value = DateTime.Today;
        }

        private void cbMaHo_TextChanged(object sender, EventArgs e)
        {
            try
            {
                HoKhau hk = hkDAO.LayThongTinHoKhauBangMaHo(Convert.ToInt32(cbMaHo.Text));
                if (hk != null)
                    LoadThongTinHoKhau(hk);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTinHoKhau();
            }
        }

        private void cbCCCD_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CongDan cd = cdDAO.LayThongTinCongDanBangMaCD(Convert.ToInt32(cbMaCD.Text));
                if (cd != null)
                    LoadThongTin_CongDan(cd);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTin_CongDan();
            }
        }
    }
}
