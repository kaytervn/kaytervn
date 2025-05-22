using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QuanLyCongDanThanhPho
{
    public partial class fHoKhau : Form
    {
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        HoKhauDAO hkDAO = new HoKhauDAO();
        ThuongTruDAO ttDAO = new ThuongTruDAO();
        CongDanDAO cdDAO = new CongDanDAO();
        HoKhau hk;
        ThuongTru tt;

        public fHoKhau()
        {
            InitializeComponent();
        }

        public fHoKhau(HoKhau hk, ThuongTru tt)
        {
            InitializeComponent();
            this.hk = hk;
            this.tt = tt;
        }

        void ChonTheoThuongTru()
        {
            for (int i = 0; i < dtgvHoKhau.Rows.Count; i++)
            {
                if (hk.MaHo == (int)dtgvHoKhau.Rows[i].Cells[0].Value)
                {
                    dtgvHoKhau.Rows[i].Selected = true;
                    dtgvHoKhau_CellClick(null, null);

                    for (int j = 0; j < dtgvThuongTru.Rows.Count; j++)
                    {
                        if (tt.MaCD == (int)dtgvThuongTru.Rows[j].Cells[1].Value)
                        {
                            dtgvThuongTru.Rows[j].Selected = true;
                            dtgvThuongTru_CellClick(null, null);
                        }
                    }
                }
            }
        }

        void CapNhatCellError_HoKhau()
        {
            for (int i = 0; i < dtgvHoKhau.Rows.Count; i++)
            {
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(dtgvHoKhau.Rows[i].Cells[1].Value.ToString());
                if (cccd.CongDan.TinhTrang == (int)CongDan.enCD.QuaDoi)
                    dtgvHoKhau.Rows[i].Cells[1].ErrorText = "Công dân đã qua đời!";
            }
        }

        void CapNhatCellError_ThuongTru()
        {
            for (int i = 0; i < dtgvThuongTru.Rows.Count; i++)
            {
                CongDan cd = cdDAO.LayThongTinCongDanBangMaCD((int)dtgvThuongTru.Rows[i].Cells[1].Value);
                if (cd.TinhTrang == (int)CongDan.enCD.QuaDoi)
                    dtgvThuongTru.Rows[i].Cells[1].ErrorText = "Công dân đã qua đời!";
            }
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

            tbQHVCH.Text = "";
            dtpkNgayDangKyTT.Value = DateTime.Today;
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

        void ResetThongTinThuongTru()
        {
            cbMaCD.Text = "";
            tbQHVCH.Text = "";
            dtpkNgayDangKyTT.Value = DateTime.Today;
        }

        void ResetThongTin()
        {
            ResetThongTinHoKhau();
            ResetThongTinThuongTru();
            dtgvThuongTru.DataSource = null;
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

        void ResetThongTinHoKhau()
        {
            cbCCCDCH.Text = "";
            tbMaHo.Text = "";
            tbTinhThanh.Text = "";
            tbQuanHuyen.Text = "";
            tbPhuongXa.Text = "";
            dtpkNgayDangKy.Value = DateTime.Today;
        }

        private void fHoKhau_Load(object sender, EventArgs e)
        {
            dtgvHoKhau.DataSource = hkDAO.LayDanhSach();
            CapNhatCellError_HoKhau();

            cbCCCDCH.DataSource = cccdDAO.LayDanhSach();
            cbCCCDCH.ValueMember = "CCCD";
            cbCCCDCH.Text = "";

            cbMaCD.DataSource = cdDAO.LayDanhSach();
            cbMaCD.ValueMember = "MaCD";
            cbMaCD.Text = "";

            tbTinhThanh.AutoCompleteCustomSource = cdDAO.tinhThanh;

            if (hk != null && tt != null)
                ChonTheoThuongTru();
        }

        private void cbCCCDCH_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(cbCCCDCH.Text);
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

        private void btDatLai_Click(object sender, EventArgs e)
        {
            ResetThongTin();
        }

        bool KiemTraThongTinHopLe(HoKhau hk)
        {
            if (hk.TinhThanh == "" || hk.QuanHuyen == "" || hk.PhuongXa == "" || hk.CanCuocCongDan.CongDan.TinhTrang == (int)CongDan.enCD.ConSong)
                return false;
            return true;
        }

        private void btThem_Click(object sender, EventArgs e)
        {
            try
            {
                HoKhau hk = new HoKhau(0, cbCCCDCH.Text, tbTinhThanh.Text, tbQuanHuyen.Text, tbPhuongXa.Text, DateTime.Today);
                if (KiemTraThongTinHopLe(hk) || hkDAO.KiemTraCongDanCoThuocHoNaoChua(hk) == true)
                    MessageBox.Show("Thông tin không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    hkDAO.Them(hk);
                    dtgvHoKhau.DataSource = hkDAO.LayDanhSach();
                    CapNhatCellError_HoKhau();
                    ResetThongTin();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Thêm thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btSua_Click(object sender, EventArgs e)
        {
            try
            {
                HoKhau hk = new HoKhau(Convert.ToInt32(tbMaHo.Text), cbCCCDCH.Text, tbTinhThanh.Text, tbQuanHuyen.Text, tbPhuongXa.Text, dtpkNgayDangKy.Value);
                if (KiemTraThongTinHopLe(hk) || hkDAO.KiemTraCongDanCoThuocHo(hk) == false)
                    MessageBox.Show("Thông tin không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(hk.CanCuocCongDan.MaCD);
                    tt.QuanHeVoiChuHo = "Là chủ hộ";
                    ttDAO.Sua(tt);

                    hkDAO.Sua(hk);
                    dtgvHoKhau.DataSource = hkDAO.LayDanhSach();
                    CapNhatCellError_HoKhau();
                    ResetThongTin();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Sửa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            try
            {
                HoKhau hk = hkDAO.LayThongTinHoKhauBangMaHo(Convert.ToInt32(tbMaHo.Text));
                DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (dialogResult == DialogResult.Yes)
                {
                    if (hkDAO.DemSoLuongCongDanCoThuocHo(hk) == 1)
                    {
                        ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(hk.CanCuocCongDan.MaCD);
                        ttDAO.Xoa(tt);
                        hkDAO.Xoa(hk);
                        dtgvHoKhau.DataSource = hkDAO.LayDanhSach();
                        CapNhatCellError_HoKhau();
                        ResetThongTin();
                    }
                    else
                        MessageBox.Show("Xóa thất bại\nVui lòng xóa hết thành viên trước khi xóa hộ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Xóa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            dtgvHoKhau.DataSource = hkDAO.TimKiem(tbTimKiem.Text);
            CapNhatCellError_HoKhau();
        }

        private void dtgvHoKhau_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            tbMaHo.Text = dtgvHoKhau.SelectedRows[0].Cells[0].Value.ToString();
            cbCCCDCH.Text = dtgvHoKhau.SelectedRows[0].Cells[1].Value.ToString();
            tbTinhThanh.Text = dtgvHoKhau.SelectedRows[0].Cells[3].Value.ToString();
            tbQuanHuyen.Text = dtgvHoKhau.SelectedRows[0].Cells[4].Value.ToString();
            tbPhuongXa.Text = dtgvHoKhau.SelectedRows[0].Cells[5].Value.ToString();
            dtpkNgayDangKy.Value = (DateTime)dtgvHoKhau.SelectedRows[0].Cells[6].Value;

            dtgvThuongTru.DataSource = ttDAO.LayDanhSach(Convert.ToInt32(tbMaHo.Text));
            CapNhatCellError_ThuongTru();
            ResetThongTinThuongTru();
        }


        private void btThemTT_Click(object sender, EventArgs e)
        {
            try
            {
                ThuongTru tt = new ThuongTru(Convert.ToInt32(tbMaHo.Text), Convert.ToInt32(cbMaCD.Text), tbQHVCH.Text, DateTime.Today);
                if (tbQHVCH.Text == "")
                    MessageBox.Show("Vui lòng nhập quan hệ với chủ hộ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    ttDAO.Them(tt);
                    dtgvThuongTru.DataSource = ttDAO.LayDanhSach(tt.MaHo);
                    CapNhatCellError_ThuongTru();
                    ResetThongTinThuongTru();
                }
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
                    LoadThongTin_CongDan(cd);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTin_CongDan();
            }
        }

        private void btDatLaiTT_Click(object sender, EventArgs e)
        {
            ResetThongTinThuongTru();
        }

        private void dtgvThuongTru_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            cbMaCD.Text = dtgvThuongTru.SelectedRows[0].Cells[1].Value.ToString();
            tbMaHo.Text = dtgvThuongTru.SelectedRows[0].Cells[0].Value.ToString();
            tbQHVCH.Text = dtgvThuongTru.SelectedRows[0].Cells[6].Value.ToString();
            dtpkNgayDangKyTT.Value = (DateTime)dtgvThuongTru.SelectedRows[0].Cells[7].Value;

            HoKhau hk = hkDAO.LayThongTinHoKhauBangMaHo(Convert.ToInt32(tbMaHo.Text));
            cbCCCDCH.Text = hk.ChuHo;
            tbTinhThanh.Text = hk.TinhThanh;
            tbQuanHuyen.Text = hk.QuanHuyen;
            tbPhuongXa.Text = hk.PhuongXa;
            dtpkNgayDangKy.Value = hk.NgayDangKy;
        }

        private void tbTimKiemTT_TextChanged(object sender, EventArgs e)
        {
            if (tbMaHo.Text != "")
            {
                dtgvThuongTru.DataSource = ttDAO.TimKiem(Convert.ToInt32(tbMaHo.Text), tbTimKiemTT.Text);
                CapNhatCellError_ThuongTru();
            }    
            else
                dtgvThuongTru.DataSource = null;
        }

        private void btXoaTT_Click(object sender, EventArgs e)
        {
            try
            {
                ThuongTru tt = new ThuongTru(Convert.ToInt32(tbMaHo.Text), Convert.ToInt32(cbMaCD.Text), tbQHVCH.Text, DateTime.Today);
                DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (dialogResult == DialogResult.Yes)
                {
                    HoKhau hk = hkDAO.LayThongTinHoKhauBangMaHo(tt.MaHo);
                    if (hk.CanCuocCongDan.MaCD != tt.MaCD)
                    {
                        ttDAO.Xoa(tt);
                        dtgvThuongTru.DataSource = ttDAO.LayDanhSach(tt.MaHo);
                        CapNhatCellError_ThuongTru();
                        ResetThongTinThuongTru();
                    }
                    else
                        MessageBox.Show("Không thể xóa chủ hộ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Xóa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btSuaTT_Click(object sender, EventArgs e)
        {
            try
            {
                ThuongTru tt = new ThuongTru(Convert.ToInt32(tbMaHo.Text), Convert.ToInt32(cbMaCD.Text), tbQHVCH.Text, DateTime.Today);
                if (tbQHVCH.Text == "")
                    MessageBox.Show("Vui lòng nhập quan hệ với chủ hộ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                else
                {
                    ttDAO.Sua(tt);
                    dtgvThuongTru.DataSource = ttDAO.LayDanhSach(tt.MaHo);
                    CapNhatCellError_ThuongTru();
                    ResetThongTinThuongTru();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Sửa thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
