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
    public partial class fKetHon : Form
    {
        KetHonDAO khDAO = new KetHonDAO();
        ThuongTruDAO ttDAO = new ThuongTruDAO();
        CanCuocCongDanDAO cccdDAO = new CanCuocCongDanDAO();
        CongDanDAO cdDAO = new CongDanDAO();
        KetHon kh;

        public fKetHon()
        {
            InitializeComponent();
        }

        public fKetHon(KetHon kh)
        {
            InitializeComponent();
            this.kh = kh;
        }

        void ChonTheoKetHon()
        {
            for (int i = 0; i < dtgvKetHon.Rows.Count; i++)
            {
                if (kh.MaKH == (int)dtgvKetHon.Rows[i].Cells[0].Value)
                    dtgvKetHon.Rows[i].Selected = true;
            }
            dtgvKetHon_CellClick(null, null);
        }

        void ResetThongTinChong()
        {
            tbMaCD.Text = "";
            tbHoTen.Text = "";
            dtpkNgaySinh.Value = DateTime.Today;
            tbNoiSinh.Text = "";
            rbNam.Checked = true;
            rbConSong.Checked = true;
            rbDocThan.Checked = true;
            tbThuongTru.Text = "";
            tbTinhThanh.Text = "";
            tbQuanHuyen.Text = "";
            tbPhuongXa.Text = "";
        }

        void LoadThongTinChong(CanCuocCongDan cccd)
        {
            tbMaCD.Text = cccd.CongDan.MaCD.ToString();
            tbHoTen.Text = cccd.CongDan.HoTen;
            dtpkNgaySinh.Value = cccd.CongDan.NgaySinh;
            tbNoiSinh.Text = cccd.CongDan.NoiSinh;

            if (cccd.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                rbNam.Checked = true;
            else
                rbNu.Checked = true;

            if (cccd.CongDan.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSong.Checked = true;
            else
                rbQuaDoi.Checked = true;

            if (cccd.CongDan.HonNhan == (int)CongDan.enCD.DaKetHon)
                rbDaKetHon.Checked = true;
            else
                rbDocThan.Checked = true;

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(cccd.CongDan.MaCD);
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

        void ResetThongTinVo()
        {
            tbMaCD1.Text = "";
            tbHoTen1.Text = "";
            dtpkNgaySinh1.Value = DateTime.Today;
            tbNoiSinh1.Text = "";
            rbNam1.Checked = true;
            rbConSong1.Checked = true;
            rbDocThan1.Checked = true;
            tbThuongTru1.Text = "";
            tbTinhThanh1.Text = "";
            tbQuanHuyen1.Text = "";
            tbPhuongXa1.Text = "";
        }

        void LoadThongTinVo(CanCuocCongDan cccd)
        {
            tbMaCD1.Text = cccd.CongDan.MaCD.ToString();
            tbHoTen1.Text = cccd.CongDan.HoTen;
            dtpkNgaySinh1.Value = cccd.CongDan.NgaySinh;
            tbNoiSinh1.Text = cccd.CongDan.NoiSinh;

            if (cccd.CongDan.GioiTinh == (int)CongDan.enCD.Nam)
                rbNam1.Checked = true;
            else
                rbNu1.Checked = true;

            if (cccd.CongDan.TinhTrang == (int)CongDan.enCD.ConSong)
                rbConSong1.Checked = true;
            else
                rbQuaDoi1.Checked = true;

            if (cccd.CongDan.HonNhan == (int)CongDan.enCD.DaKetHon)
                rbDaKetHon1.Checked = true;
            else
                rbDocThan1.Checked = true;

            ThuongTru tt = ttDAO.LayThongTinThuongTruBangMaCD(cccd.CongDan.MaCD);
            if (tt != null)
            {
                tbThuongTru1.Text = tt.MaHo.ToString();
                tbTinhThanh1.Text = tt.HoKhau.TinhThanh;
                tbQuanHuyen1.Text = tt.HoKhau.QuanHuyen;
                tbPhuongXa1.Text = tt.HoKhau.PhuongXa;
            }
            else
            {
                tbThuongTru1.Text = "";
                tbTinhThanh1.Text = "";
                tbQuanHuyen1.Text = "";
                tbPhuongXa1.Text = "";
            }
        }

        private void fKetHon_Load(object sender, EventArgs e)
        {
            cbCCCD.DataSource = khDAO.LayDanhSachCCCD((int)CongDan.enCD.Nam);
            cbCCCD.ValueMember = "CCCD";
            cbCCCD1.DataSource = khDAO.LayDanhSachCCCD((int)CongDan.enCD.Nu);
            cbCCCD1.ValueMember = "CCCD";
            cbCCCD.Text = "";
            cbCCCD1.Text = "";
            dtgvKetHon.DataSource = khDAO.LayDanhSach();

            if (kh != null)
                ChonTheoKetHon();
        }

        private void dtgvKetHon_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            tbMaKH.Text = dtgvKetHon.SelectedRows[0].Cells[0].Value.ToString();
            cbCCCD.Text = dtgvKetHon.SelectedRows[0].Cells[1].Value.ToString();
            cbCCCD1.Text = dtgvKetHon.SelectedRows[0].Cells[5].Value.ToString();
            dtpkNgayDKKH.Value = (DateTime)dtgvKetHon.SelectedRows[0].Cells[9].Value;
        }

        private void cbCCCD_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(cbCCCD.Text);

                if (cccd.CongDan.GioiTinh == (int)CongDan.enCD.Nam && cccd != null)
                    LoadThongTinChong(cccd);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTinChong();
            }
        }

        private void cbCCCD1_TextChanged(object sender, EventArgs e)
        {
            try
            {
                CanCuocCongDan cccd = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(cbCCCD1.Text);

                if (cccd.CongDan.GioiTinh == (int)CongDan.enCD.Nu && cccd != null)
                    LoadThongTinVo(cccd);
                else
                    throw new Exception();
            }
            catch
            {
                ResetThongTinVo();
            }
        }

        void ResetThongTinRong()
        {
            cbCCCD.Text = "";
            cbCCCD1.Text = "";
            tbMaKH.Text = "";
            dtpkNgayDKKH.Value = DateTime.Today;
        }

        private void btDatLai_Click(object sender, EventArgs e)
        {
            ResetThongTinRong();
        }

        bool KiemTraThongTinHopLe(KetHon kh)
        {
            CanCuocCongDan cccdChong = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(kh.CCCDChong);
            CanCuocCongDan cccdVo = cccdDAO.LayThongTinCanCuocCongDanBangCCCD(kh.CCCDVo);
            if (
                cccdChong.CongDan.GioiTinh == (int)CongDan.enCD.Nu ||
                cccdVo.CongDan.GioiTinh == (int)CongDan.enCD.Nam ||
                DateTime.Today.Year - cccdChong.CongDan.NgaySinh.Year < 22 ||
                DateTime.Today.Year - cccdVo.CongDan.NgaySinh.Year < 18 ||
                cccdChong.CongDan.TinhTrang == (int)CongDan.enCD.QuaDoi ||
                cccdVo.CongDan.TinhTrang == (int)CongDan.enCD.QuaDoi ||
                cccdChong.CongDan.HonNhan == (int)CongDan.enCD.DaKetHon ||
                cccdVo.CongDan.HonNhan == (int)CongDan.enCD.DaKetHon
            )
                return false;
            return true;
        }

        private void btXoa_Click(object sender, EventArgs e)
        {
            try
            {
                KetHon kh = new KetHon(Convert.ToInt32(tbMaKH.Text), cbCCCD.Text, cbCCCD1.Text, dtpkNgayDKKH.Value);

                DialogResult dialogResult = MessageBox.Show("Bạn có thật sự muốn xóa không?", "Thông báo", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (dialogResult == DialogResult.Yes)
                {
                    khDAO.Xoa(kh);

                    kh.CanCuocCongDan.CongDan.HonNhan = (int)CongDan.enCD.DocThan;
                    cdDAO.Sua(kh.CanCuocCongDan.CongDan);
                    kh.CanCuocCongDan1.CongDan.HonNhan = (int)CongDan.enCD.DocThan;
                    cdDAO.Sua(kh.CanCuocCongDan1.CongDan);

                    dtgvKetHon.DataSource = khDAO.LayDanhSach();
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
                KetHon kh = new KetHon(0, cbCCCD.Text, cbCCCD1.Text, DateTime.Today);
                if (KiemTraThongTinHopLe(kh))
                {
                    khDAO.Them(kh);

                    kh.CanCuocCongDan.CongDan.HonNhan = (int)CongDan.enCD.DaKetHon;
                    cdDAO.Sua(kh.CanCuocCongDan.CongDan);
                    kh.CanCuocCongDan1.CongDan.HonNhan = (int)CongDan.enCD.DaKetHon;
                    cdDAO.Sua(kh.CanCuocCongDan1.CongDan);

                    dtgvKetHon.DataSource = khDAO.LayDanhSach();
                    ResetThongTinRong();
                }
                else
                    MessageBox.Show("Thông tin không hợp lệ!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
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
                KetHon kh = khDAO.LayThongTinKetHonBangMaKH(Convert.ToInt32(tbMaKH.Text));

                fGiayKetHon form = new fGiayKetHon(kh);
                form.ShowDialog();
            }
            catch (Exception ex)
            {
                MessageBox.Show("In thất bại\n" + ex.Message, "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void tbTimKiem_TextChanged(object sender, EventArgs e)
        {
            dtgvKetHon.DataSource = khDAO.TimKiem(tbTimKiem.Text);
        }
    }
}
